// Every view on the business objects: visible columns in order, sort, grouping; checks the 6-column and order rules.
import { readFileSync, writeFileSync } from 'node:fs';

const model = JSON.parse(readFileSync(new URL('./evidence/model.json', import.meta.url)));
const BUSINESS = ['company', 'person', 'opportunity', 'note', 'task', 'lead', 'engagement', 'project', 'milestone', 'workPackage', 'contract', 'document', 'playbookRoleAssignment', 'publicHoliday', 'capability', 'campaignTarget'];
const fieldById = {};
for (const object of model.objects) for (const field of object.fieldsList) fieldById[field.id] = { ...field, objectName: object.nameSingular };
const objectById = Object.fromEntries(model.objects.map((object) => [object.id, object]));
const DATE_TYPES = new Set(['DATE', 'DATE_TIME']);
const OWNER_LIKE = /owner|assignee|reviewer|^member$|accountOwner|kind|campaign|company/i;

const rows = [];
for (const view of model.views) {
  const object = objectById[view.objectMetadataId];
  if (!BUSINESS.includes(object.nameSingular)) continue;
  const columns = view.viewFields.filter((viewField) => viewField.isVisible).sort((a, b) => a.position - b.position).map((viewField) => fieldById[viewField.fieldMetadataId]);
  const sorts = view.viewSorts.map((sort) => `${fieldById[sort.fieldMetadataId]?.label} ${sort.direction}`);
  const group = view.mainGroupByFieldMetadataId ? fieldById[view.mainGroupByFieldMetadataId]?.label : '';
  const isWidget = /WIDGET/.test(view.type);
  const third = columns[2];
  const sortField = view.viewSorts[0] && fieldById[view.viewSorts[0].fieldMetadataId];
  rows.push({
    object: object.nameSingular,
    name: view.name,
    key: view.key ?? '',
    type: view.type,
    position: view.position,
    isApp: Boolean(view.applicationId) && view.key !== 'INDEX',
    isWidget,
    columnCount: columns.length,
    columns: columns.map((column) => column?.label ?? '?'),
    sorts,
    group,
    checks: {
      atMostSix: columns.length <= 6,
      nameFirst: columns[0]?.name === 'name' || columns[0]?.name === 'title' || columns[0]?.name === 'subject',
      ownerSecond: OWNER_LIKE.test(columns[1]?.name ?? ''),
      dateThird: Boolean(third) && DATE_TYPES.has(third.type),
      sortOnThird: Boolean(sortField) && Boolean(third) && sortField.id === third.id,
      hasSort: view.viewSorts.length > 0,
    },
  });
}
writeFileSync(new URL('./evidence/views.json', import.meta.url), JSON.stringify(rows, null, 1));
const picker = rows.filter((row) => !row.isWidget);
const widgets = rows.filter((row) => row.isWidget);
const summarize = (list) => Object.fromEntries(Object.keys(list[0].checks).map((check) => [check, `${list.filter((row) => row.checks[check]).length}/${list.length}`]));
console.log('picker views', picker.length, summarize(picker));
console.log('widget views', widgets.length, summarize(widgets));
for (const row of rows.sort((a, b) => a.object.localeCompare(b.object) || a.isWidget - b.isWidget || a.position - b.position)) {
  const failed = Object.entries(row.checks).filter(([, ok]) => !ok).map(([check]) => check);
  console.log(`${row.object} | ${row.isWidget ? 'W' : 'P'} | ${row.name}${row.key ? ` [${row.key}]` : ''} | ${row.type} | ${row.columnCount} | ${row.columns.join(', ')} | sort: ${row.sorts.join('; ') || '-'} | group: ${row.group || '-'} | fails: ${failed.join(',') || '-'}`);
}
