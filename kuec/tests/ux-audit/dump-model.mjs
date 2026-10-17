// Dumps the live workspace model (objects, fields, views, page layouts, navigation) to model.json.
import { readFileSync, writeFileSync } from 'node:fs';

const KEY = readFileSync(new URL('../release-gate/rehearsal/admin.apikey', import.meta.url), 'utf8').trim();
const BASE = 'http://localhost:3000';
const OUT = new URL('./evidence/model.json', import.meta.url).pathname;

const meta = async (query, variables = {}) => {
  const response = await fetch(`${BASE}/metadata`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', authorization: `Bearer ${KEY}` },
    body: JSON.stringify({ query, variables }),
  });
  const json = await response.json();
  if (json.errors) throw new Error(JSON.stringify(json.errors).slice(0, 500));
  return json.data;
};

const objectsData = await meta(`{ objects(paging:{first:200}) { edges { node {
  id nameSingular namePlural labelSingular labelPlural description isActive isSystem applicationId
  fieldsList { id name label type description isActive isSystem isUIEditable options applicationId relation { type targetObjectMetadata { nameSingular } } }
} } } }`);
const objects = objectsData.objects.edges.map((edge) => edge.node);

const viewsData = await meta(`{ getViews { id name key type position icon objectMetadataId visibility mainGroupByFieldMetadataId calendarFieldMetadataId
  kanbanAggregateOperation kanbanAggregateOperationFieldMetadataId applicationId isActive
  viewFields { fieldMetadataId isVisible position size aggregateOperation }
  viewSorts { fieldMetadataId direction }
  viewGroups { fieldValue isVisible position }
  viewFilters { fieldMetadataId operand value }
} }`);

const layoutsData = await meta(`{ getPageLayouts { id name type objectMetadataId applicationId universalIdentifier
  tabs { id title position icon isActive layoutMode widgets { id title type isActive objectMetadataId
    position { ... on PageLayoutWidgetVerticalListPosition { layoutMode index } ... on PageLayoutWidgetGridPosition { layoutMode row column rowSpan columnSpan } }
    configuration {
      ... on StandaloneRichTextConfiguration { configurationType body { blocknote markdown } }
      ... on FrontComponentConfiguration { configurationType frontComponentId }
      ... on RecordTableConfiguration { configurationType viewId recordLimit }
      ... on FieldsConfiguration { configurationType viewId }
      ... on FieldConfiguration { configurationType fieldMetadataId fieldDisplayMode viewId }
      ... on AggregateChartConfiguration { configurationType aggregateFieldMetadataId aggregateOperation label filter }
      ... on BarChartConfiguration { configurationType aggregateOperation primaryAxisGroupByFieldMetadataId secondaryAxisGroupByFieldMetadataId color filter }
      ... on PieChartConfiguration { configurationType aggregateOperation groupByFieldMetadataId color filter }
      ... on LineChartConfiguration { configurationType aggregateOperation primaryAxisGroupByFieldMetadataId color filter }
      ... on IframeConfiguration { configurationType url }
      ... on TimelineConfiguration { configurationType }
      ... on TasksConfiguration { configurationType }
      ... on NotesConfiguration { configurationType }
      ... on FilesConfiguration { configurationType }
      ... on EmailsConfiguration { configurationType }
      ... on CalendarConfiguration { configurationType }
      ... on ViewConfiguration { configurationType }
    } } }
} }`);

const navData = await meta(`{ navigationMenuItems { id name type position viewId pageLayoutId link icon targetObjectMetadataId folderId applicationId } }`);
const frontData = await meta(`{ frontComponents { id name componentName universalIdentifier } }`);
const commandsData = await meta(`{ commandMenuItems { id label icon isPinned availabilityType frontComponentId availabilityObjectMetadataId applicationId } }`);

writeFileSync(OUT, JSON.stringify({
  objects,
  views: viewsData.getViews,
  pageLayouts: layoutsData.getPageLayouts,
  navigationMenuItems: navData.navigationMenuItems,
  frontComponents: frontData.frontComponents,
  commandMenuItems: commandsData.commandMenuItems,
}, null, 1));
console.log('objects', objects.length, 'views', viewsData.getViews.length, 'layouts', layoutsData.getPageLayouts.length, 'nav', navData.navigationMenuItems.length);
