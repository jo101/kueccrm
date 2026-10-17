// Record page layouts per business object: tabs in order, widgets on each tab in order.
import { readFileSync } from 'node:fs';

const model = JSON.parse(readFileSync(new URL('./evidence/model.json', import.meta.url)));
const BUSINESS = ['company', 'person', 'opportunity', 'note', 'task', 'lead', 'engagement', 'project', 'milestone', 'workPackage', 'contract', 'document', 'playbookRoleAssignment', 'publicHoliday', 'capability', 'campaignTarget'];
const objectById = Object.fromEntries(model.objects.map((object) => [object.id, object]));

const widgetOrder = (widget) => widget.position?.index ?? (widget.position?.row ?? 0) * 100 + (widget.position?.column ?? 0);

for (const name of BUSINESS) {
  const object = model.objects.find((candidate) => candidate.nameSingular === name);
  const layouts = model.pageLayouts.filter((layout) => layout.objectMetadataId === object.id && layout.type === 'RECORD_PAGE');
  for (const layout of layouts) {
    const tabs = [...layout.tabs].filter((tab) => tab.isActive !== false).sort((a, b) => a.position - b.position);
    console.log(`\n## ${name} (${layouts.length} record layout) tabs: ${tabs.map((tab) => tab.title).join(' | ')}`);
    for (const tab of tabs) {
      const widgets = [...tab.widgets].filter((widget) => widget.isActive !== false).sort((a, b) => widgetOrder(a) - widgetOrder(b));
      console.log(`  [${tab.title}] ${tab.layoutMode}: ${widgets.map((widget) => `${widget.title || '-'}<${widget.type}@${widgetOrder(widget)}>`).join(', ')}`);
    }
  }
}
console.log('\n## standalone pages');
for (const layout of model.pageLayouts.filter((candidate) => candidate.type === 'STANDALONE_PAGE')) {
  const tabs = [...layout.tabs].sort((a, b) => a.position - b.position);
  console.log(`\n${layout.name}: ${tabs.map((tab) => tab.title).join(' | ')}`);
  for (const tab of tabs) {
    const widgets = [...tab.widgets].sort((a, b) => widgetOrder(a) - widgetOrder(b));
    console.log(`  [${tab.title}] ${widgets.map((widget) => `${widget.title}<${widget.type}@${JSON.stringify(widget.position).replace(/"layoutMode":"\w+",?/, '')}>`).join(', ')}`);
  }
}
