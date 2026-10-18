// Writes the check tables of tests/23-ux-audit.md section 1 and evidence/checks.csv (one row per screen per check).
// Computed rows come from evidence/model.json and evidence/fields.txt; observed rows cite the browser evidence they rest on.
// node build-tables.mjs   (after dump-model.mjs and fields.mjs)
import { readFileSync, writeFileSync } from 'node:fs';

const read = (path) => JSON.parse(readFileSync(new URL(path, import.meta.url)));
const model = read('./evidence/model.json');
const english = read('../../app/locales/en.json');
const arabic = read('../../app/locales/ar-SA.json');
const guidance = read('../../app/src/i18n/guidance.json');

const PASS = 'Pass';
const FAIL = 'Fail';
const NA = 'n/a';
const rows = [];
const add = (section, screen, check, result, evidence) => rows.push({ section, screen, check, result, evidence });
const hasArabic = (context, text) => Boolean(arabic[context]?.[text]) && arabic[context][text] !== text;

const KUEC_APP = model.objects.find((object) => object.nameSingular === 'lead').applicationId;
const objectByName = Object.fromEntries(model.objects.map((object) => [object.nameSingular, object]));
const fieldById = {};
for (const object of model.objects) for (const field of object.fieldsList) fieldById[field.id] = { ...field, objectName: object.nameSingular };
const viewById = Object.fromEntries(model.views.map((view) => [view.id, view]));
const widgetOrder = (widget) => widget.position?.index ?? (widget.position?.row ?? 0) * 100 + (widget.position?.column ?? 0);

// The column rule of runbooks/05-views.md section 3: name, owner (or the documented stand-in), the date that matters,
// at most three more, sorted on that date. People, Hygiene: Other without details and Documents by type have no date by agreement.
const DATE_TYPES = new Set(['DATE', 'DATE_TIME']);
const DOCUMENTED_NO_DATE = (object, name) => object === 'person' || name === 'Hygiene: Other without details' || (object === 'document' && name === 'Documents by type');
const SECOND_COLUMN = { person: ['company'], capability: ['kind'], campaignTarget: ['campaign'] };
const judgeView = (view) => {
  const object = model.objects.find((candidate) => candidate.id === view.objectMetadataId).nameSingular;
  const columns = view.viewFields.filter((viewField) => viewField.isVisible).sort((a, b) => a.position - b.position).map((viewField) => fieldById[viewField.fieldMetadataId]);
  const sort = view.viewSorts[0] && fieldById[view.viewSorts[0].fieldMetadataId];
  const noDate = DOCUMENTED_NO_DATE(object, view.name) && !(columns[2] && DATE_TYPES.has(columns[2].type));
  const secondOk = (SECOND_COLUMN[object] ?? ['owner', 'accountOwner', 'assignee', 'member']).includes(columns[1]?.name);
  const order = ['name', 'title'].includes(columns[0]?.name) && secondOk && (noDate || (Boolean(columns[2]) && DATE_TYPES.has(columns[2].type)));
  const sorted = view.type === 'CALENDAR' ? null : noDate ? true : Boolean(sort) && Boolean(columns[2]) && sort.id === columns[2].id;
  const reasons = [];
  if (columns.length > 6) reasons.push(`${columns.length} columns`);
  if (!order) reasons.push(`order ${columns.slice(0, 3).map((column) => column?.label).join(', ')}`);
  if (sorted === false) reasons.push(sort ? `sorted on ${sort.label}` : 'no sort');
  return { object, columns, noDate, six: columns.length <= 6, order, sorted, reasons };
};

// ---------- 1.1 Record pages ----------
const RECORD_PAGES = [
  ['company', 'Company'], ['person', 'Person'], ['opportunity', 'Opportunity'], ['note', 'Note'], ['task', 'Task'],
  ['lead', 'Lead'], ['engagement', 'Engagement'], ['project', 'Project'], ['milestone', 'Milestone'], ['workPackage', 'Work package'],
  ['contract', 'Contract'], ['document', 'Document'], ['playbookRoleAssignment', 'Playbook role assignment'], ['publicHoliday', 'UAE public holiday'],
  ['capability', 'Capability'], ['campaignTarget', 'Campaign target'],
];
const STANDARD = new Set(['company', 'person', 'opportunity', 'note', 'task']);
const ORDER_RANK = (widget) => {
  if (widget.title === 'How this record works') return 0;
  if (widget.type === 'FRONT_COMPONENT') return 1;
  if (widget.type === 'FIELDS') return 2;
  if (widget.title === 'Documents') return 4;
  return 3;
};
const STATUS_WORDS = {
  workPackage: [FAIL, 'The card badge says Not started, Waiting to be accepted, In progress, Waiting for review and Stopped; the Status field, the views and the timeline on the same page say Planned, Offered, Accepted, Submitted and Cancelled (ux-04).'],
  opportunity: [FAIL, 'Stage shows New, Screening, Meeting, Proposal and Customer; the views, Data quality and the guidance say Qualify ("Hygiene: in Qualify over 30 days"), and Customer is still an active column (P3 click-runbook not written).'],
};
const STATUS_COLOURS = {
  workPackage: [PASS, 'Card badge colours equal the Status option colours (gray, sky, blue, purple, red, green, orange, gray) on views, kanban and the BD Team chart (ux-09).'],
  opportunity: [FAIL, 'Stage New is red, the same red as Lost and as Blocked on work packages; it shows red on the Pipeline kanban and the BD charts.'],
  contract: [FAIL, 'Status Expired is gray on contracts and red on documents.'],
  document: [FAIL, 'Status Expired is red on documents and gray on contracts.'],
  project: [PASS, 'Health Green, Amber, Red and Status colours match on Portfolio, By health and the BD charts.'],
  milestone: [PASS, 'Open blue, Done green, Missed red, the same on every view.'],
  lead: [PASS, 'Status colours match on Lead inbox, My leads and the BD charts.'],
  capability: [PASS, 'Status colours match on every capability view.'],
  campaignTarget: [PASS, 'Status colours match on To work and the Campaign pack.'],
  task: [PASS, 'Twenty task status colours, the same everywhere.'],
};
const fieldsTxt = readFileSync(new URL('./evidence/fields.txt', import.meta.url), 'utf8');
for (const [name, label] of RECORD_PAGES) {
  const object = objectByName[name];
  const layout = model.pageLayouts.find((candidate) => candidate.objectMetadataId === object.id && candidate.type === 'RECORD_PAGE');
  const tabs = [...layout.tabs].filter((tab) => tab.isActive !== false).sort((a, b) => a.position - b.position);
  const home = tabs[0];
  const widgets = [...home.widgets].filter((widget) => widget.isActive !== false).sort((a, b) => widgetOrder(a) - widgetOrder(b));
  const titles = widgets.map((widget) => widget.title);
  add('Record pages', label, 'RP1 Tabs are Overview, Work, Communication, Details', FAIL, `Tabs: ${tabs.map((tab) => tab.title).join(', ')}.`);
  add('Record pages', label, 'RP2 Guidance widget first', titles[0] === 'How this record works' ? PASS : FAIL,
    titles[0] === 'How this record works' ? 'How this record works opens the Home tab.' : `Twenty's Fields widget renders first (both sit at index 0 after the B3 workaround); the guidance follows it (ux-08).`);
  const ranks = widgets.map(ORDER_RANK);
  const ordered = ranks.every((rank, index) => index === 0 || rank >= ranks[index - 1]);
  add('Record pages', label, 'RP3 Widget order matches the agreed order', ordered ? PASS : FAIL, `Home tab: ${titles.join(', ')}.${name === 'workPackage' ? ' The card comes after the 31-field list; wireframes 1.1 puts it first.' : ''}`);
  const twentyFields = object.fieldsList.filter((field) => field.isActive && !field.isSystem && field.applicationId !== KUEC_APP && !['createdBy', 'updatedBy', 'position', 'searchVector', 'id', 'createdAt', 'updatedAt', 'deletedAt'].includes(field.name) && field.type !== 'RELATION');
  if (STANDARD.has(name)) {
    const sample = twentyFields.find((field) => field.name === 'stage') ?? twentyFields[0];
    add('Record pages', label, 'RP4 Every field shows a KUEC description on hover', FAIL, `App fields show their description on hover (ux-20); ${twentyFields.length} of Twenty's own fields keep Twenty's one-liners, e.g. ${sample?.label}: "${sample?.description ?? 'none'}".`);
  } else {
    add('Record pages', label, 'RP4 Every field shows a KUEC description on hover', PASS, 'Every field has its description from fields.json; hover on the label shows it (checked on Lead and Opportunity, ux-20).');
  }
  const selects = object.fieldsList.filter((field) => field.isActive && ['SELECT', 'MULTI_SELECT'].includes(field.type));
  add('Record pages', label, 'RP5 Every option shows its description on hover', selects.length ? FAIL : NA,
    selects.length ? `${selects.length} select field(s); Twenty 2.48 has no option description, so none shows (20-guidance.md section 1).` : 'No select field.');
  const [wordsResult, wordsNote] = STATUS_WORDS[name] ?? [selects.some((field) => /status|stage/i.test(field.name)) ? PASS : NA, 'Status options read the same on the page, the views and the guidance.'];
  add('Record pages', label, 'RP6 Same status words everywhere', wordsResult, wordsNote);
  const [colourResult, colourNote] = STATUS_COLOURS[name] ?? [NA, 'No status or health field.'];
  add('Record pages', label, 'RP7 Status and health colours identical everywhere', colourResult, colourNote);
  const orphanLines = fieldsTxt.split('ORPHANS')[1].split('ON THE RECORD PAGE')[0].split('\n').filter((line) => line.startsWith(`${name}.`) && !/agentChatThreadTargets|calendarEventTargets|messageThreadTargets|listMemberships|\.name \(Name\)|company\.people|company\.opportunities|pointOfContactForOpportunities/.test(line));
  const expertOnly = fieldsTxt.split('ON THE RECORD PAGE AND IN EXPERT VIEWS ONLY')[1].split('\n').filter((line) => line.startsWith(`${name}.`)).length;
  add('Record pages', label, 'RP8 No orphan fields', orphanLines.length ? FAIL : PASS, `${orphanLines.length} orphan field(s); ${expertOnly} field(s) appear only on the record page and in Everything (expert).`);
  const untranslatedWidgets = titles.filter((title) => english['pageLayoutWidget.title']?.[title] !== undefined && !hasArabic('pageLayoutWidget.title', title));
  const arabicIssues = [...untranslatedWidgets.map((title) => `widget title "${title}" has no Arabic`), ...(name === 'workPackage' ? ['the card shows due dates in the Hijri calendar for ar-SA (ux-16)'] : [])];
  add('Record pages', label, 'RP9 Arabic present and right to left', arabicIssues.length ? FAIL : PASS,
    arabicIssues.length ? `${arabicIssues.join('; ').replace(/^./, (first) => first.toUpperCase())}. Labels, descriptions and the guidance are in Arabic and the page mirrors.` : 'Labels, descriptions and the guidance are in Arabic and the page mirrors; option labels stay English (2.48 limit).');
}

// ---------- 1.2 Dashboard tabs ----------
const TAB_KEYS = { 'Home/Home': 'home', 'Exceptions/Exceptions': 'exceptions', 'Data quality/Data quality': 'dataQuality', 'BD/Executive': 'bdExecutive', 'BD/Team': 'bdTeam', 'BD/Mine': 'bdMine', 'BD/Pipeline pack': 'packPipeline', 'BD/Project pack': 'packProjects', 'BD/Campaign pack': 'packCampaigns', 'uVENTURE/Technologies': 'uventureTechnologies', 'uVENTURE/Equipment and labs': 'uventureEquipment', 'uVENTURE/Challenges': 'uventureChallenges' };
const OBSERVED_TABS = {
  'Home/Home': { phone: [FAIL, 'At 390 px the guidance fills the first screen and clips its Arabic lines; each table shows Title and Owner only (ux-13).'], resolves: [PASS, 'Every widget rendered.'] },
  'BD/Team': { phone: [FAIL, 'At 390 px the guidance clips its Arabic lines; the tab bar scrolls sideways; charts and tables stack and stay usable (ux-15).'], resolves: [PASS, 'Every widget rendered.'] },
  'BD/Executive': { resolves: [FAIL, 'Guidance and Thursday update render (gate M5 not reproduced in this run), but the count "Signed licences this year" reads "0 / 2" (ux-10).'] },
  'uVENTURE/Technologies': { resolves: [FAIL, 'The iframe points at uventure.kuec.example, which does not resolve (gate M6).'] },
  'uVENTURE/Equipment and labs': { resolves: [FAIL, 'The iframe points at uventure.kuec.example, which does not resolve (gate M6).'] },
  'uVENTURE/Challenges': { resolves: [FAIL, 'The iframe points at uventure.kuec.example, which does not resolve (gate M6).'] },
};
for (const layout of model.pageLayouts.filter((candidate) => candidate.type === 'STANDALONE_PAGE')) {
  for (const tab of [...layout.tabs].sort((a, b) => a.position - b.position)) {
    const key = `${layout.name}/${tab.title}`;
    const screen = layout.name === tab.title ? layout.name : `${layout.name === 'BD' ? 'BD dashboard' : layout.name} > ${tab.title}`;
    const widgets = [...tab.widgets].sort((a, b) => widgetOrder(a) - widgetOrder(b));
    add('Dashboard tabs', screen, 'DT1 Guidance widget first', widgets[0]?.title === 'How this tab works' ? PASS : FAIL, 'How this tab works is the first widget and rendered its English and Arabic lines (tabs-desktop-bd1.json).');
    const tables = widgets.filter((widget) => widget.type === 'RECORD_TABLE').map((widget) => viewById[widget.configuration.viewId]).filter(Boolean);
    const failing = tables.map((view) => ({ name: view.name, ...judgeView(view) })).filter((verdict) => verdict.reasons.length);
    add('Dashboard tabs', screen, 'DT2 Tables: at most 6 columns, agreed order, agreed sort', tables.length ? (failing.length ? FAIL : PASS) : NA,
      tables.length ? (failing.length ? `${tables.length - failing.length} of ${tables.length} tables follow the rule; ${failing.map((verdict) => `${verdict.name}: ${verdict.reasons.join(', ')}`).join('; ')}.` : `All ${tables.length} tables follow the rule of 05-views.md (documented no-date lists included).`) : 'No table.');
    const stageShown = widgets.some((widget) => ['primaryAxisGroupByFieldMetadataId', 'secondaryAxisGroupByFieldMetadataId', 'groupByFieldMetadataId'].some((property) => fieldById[widget.configuration?.[property]]?.name === 'stage' && fieldById[widget.configuration?.[property]]?.objectName === 'opportunity'))
      || tables.some((view) => judgeView(view).columns.some((column) => column?.name === 'stage' && column.objectName === 'opportunity'));
    const statusShown = widgets.some((widget) => widget.type === 'GRAPH' && /status|health/i.test(fieldById[widget.configuration?.secondaryAxisGroupByFieldMetadataId ?? widget.configuration?.primaryAxisGroupByFieldMetadataId]?.name ?? '')) || tables.length > 0;
    add('Dashboard tabs', screen, 'DT3 Status and health colours identical to the records', stageShown ? FAIL : statusShown ? PASS : NA,
      stageShown ? 'Opportunity Stage appears (chart or column): New shows red like Lost.' : statusShown ? 'Status and health tags and stacked bars use the option colours (ux-09).' : 'No status shown.');
    const titleArabic = hasArabic('pageLayoutTab.title', tab.title);
    const widgetTitles = widgets.map((widget) => widget.title);
    const translated = widgetTitles.filter((title) => hasArabic('pageLayoutWidget.title', title)).length;
    add('Dashboard tabs', screen, 'DT4 Arabic present and right to left', titleArabic && translated === widgetTitles.length ? PASS : FAIL,
      `Tab title ${titleArabic ? 'has' : 'has no'} Arabic; ${translated} of ${widgetTitles.length} widget titles have Arabic; the guidance body carries its Arabic lines, right-aligned.`);
    const guidanceKey = TAB_KEYS[key];
    const page = guidance.pages.find((candidate) => candidate.key === guidanceKey);
    const shows = page?.showsWorkPackages;
    const line5 = page?.lines?.en?.[4] ?? '';
    add('Dashboard tabs', screen, 'DT5 Request help named where work packages are shown', shows ? (/Request help/.test(line5) ? PASS : FAIL) : NA, shows ? 'Line 5 names Request help.' : 'Shows no work package.');
    const observed = OBSERVED_TABS[key] ?? {};
    const [phoneResult, phoneNote] = observed.phone ?? [NA, 'Not required on a phone (journeys.md 12.4).'];
    add('Dashboard tabs', screen, 'DT6 Usable at phone width', phoneResult, phoneNote);
    const [resolveResult, resolveNote] = observed.resolves ?? [PASS, 'Every widget rendered, none empty or erroring (tabs-desktop-bd1.json).'];
    add('Dashboard tabs', screen, 'DT7 Every widget resolves', resolveResult, resolveNote);
  }
}

// ---------- 1.3 Views ----------
const BUSINESS = RECORD_PAGES.map(([name]) => name);
const viewRows = [];
for (const view of model.views) {
  const object = model.objects.find((candidate) => candidate.id === view.objectMetadataId).nameSingular;
  if (!BUSINESS.includes(object) || view.type === 'FIELDS_WIDGET') continue;
  const isApp = view.applicationId === KUEC_APP && view.key !== 'INDEX';
  const objectViews = model.views.filter((candidate) => candidate.objectMetadataId === view.objectMetadataId && !/WIDGET/.test(candidate.type) && candidate.key !== 'INDEX');
  const hidden = view.key === 'INDEX' && objectViews.length > 0;
  const { columns, noDate, order: orderOk, sorted: sortOk } = judgeView(view);
  const isWidget = /WIDGET/.test(view.type);
  const isExpert = view.name === 'Everything (expert)';
  const arabicName = isApp ? hasArabic('view.name', view.name) : null;
  const notes = [];
  if (!isApp) notes.push(view.key === 'INDEX' ? (hidden ? "Twenty's All view, hidden from the picker" : "Twenty's All view, the only view of this object") : "Twenty's own view, outside the agreed set");
  if (isExpert) notes.push('expert view: documented exception, needs the ED (gate m1)');
  if (noDate && isApp) notes.push('no date column and no sort, as agreed in 05-views.md');
  viewRows.push({
    object, name: view.name, type: view.type.replace('_WIDGET', ' widget').toLowerCase(), columns: columns.length, hidden,
    six: columns.length <= 6, order: orderOk, sort: sortOk, arabic: arabicName, notes: notes.join('; '), isWidget,
  });
}
viewRows.sort((a, b) => a.object.localeCompare(b.object) || a.isWidget - b.isWidget || a.name.localeCompare(b.name));
const mark = (value) => (value === null ? NA : value ? PASS : FAIL);
for (const row of viewRows) {
  if (row.hidden) continue;
  const screen = `${row.object} > ${row.name}${row.isWidget ? ' (dashboard widget)' : ''}`;
  add('Views', screen, 'V1 At most 6 columns', mark(row.six), `${row.columns} visible columns. ${row.notes}`.trim());
  add('Views', screen, 'V2 Agreed column order (name, owner, the date that matters)', mark(row.order), row.notes);
  add('Views', screen, 'V3 Agreed default sort', mark(row.sort), row.notes);
  if (!row.isWidget) add('Views', screen, 'V4 View name in Arabic', mark(row.arabic), row.arabic === null ? "Twenty's own view name." : '');
}

// ---------- 1.5 Lists and options ----------
const DEPRECATED_NEIGHBOURS = {
  'engagement.kind': 'Meeting (deprecated) and Event (deprecated) are selectable next to Intro meeting, Discovery meeting and Gala or event',
  'opportunity.source': 'Referral (deprecated), Outreach (deprecated) and Event or workshop (deprecated) are selectable next to the Referral: options, Registry outreach and Workshop',
  'lead.source': 'Referral (deprecated), Outreach (deprecated) and Event or workshop (deprecated) are selectable next to the Referral: options, Registry outreach and Workshop',
  'contract.kind': 'Option (deprecated) and Service (deprecated) are selectable next to Licence and Technical services agreement',
  'opportunity.stage': 'Customer is a stage column next to Signed (the design deprecates it; P3 not done)',
};
const ABBREVIATIONS = { 'engagement.kind': '"Intro meeting" (Intro)' };
for (const [name] of RECORD_PAGES) {
  for (const field of objectByName[name].fieldsList) {
    if (!['SELECT', 'MULTI_SELECT'].includes(field.type) || !field.isActive) continue;
    const key = `${name}.${field.name}`;
    const options = [...field.options].sort((a, b) => a.position - b.position);
    const screen = `${name}.${field.name} (${field.label}, ${options.length} options)`;
    add('Lists and options', screen, 'O1 No duplicate or near-duplicate options', DEPRECATED_NEIGHBOURS[key] ? FAIL : PASS, DEPRECATED_NEIGHBOURS[key] ?? '');
    add('Lists and options', screen, 'O2 No abbreviations', ABBREVIATIONS[key] ? FAIL : PASS, ABBREVIATIONS[key] ?? '');
    const otherIndex = options.findIndex((option) => /^Other\b/.test(option.label));
    add('Lists and options', screen, 'O3 Other last', otherIndex === -1 ? NA : otherIndex === options.length - 1 ? PASS : FAIL, otherIndex === -1 ? 'No Other option.' : '');
  }
}

// ---------- 1.4 Default view per object (observed: screens-desktop-bd1.json, ux-18, ux-19) ----------
const DEFAULT_VIEWS = [
  ['Lead', 'Sidebar Leads', 'Lead inbox: New leads I own, oldest first', PASS, 'A new lead given to me appears here; the ones I log myself are ownerless until triage, so they do not (U16).'],
  ['Opportunity', 'Sidebar Pipeline; Twenty\'s Opportunities entry', 'Pipeline: every open opportunity of the team, kanban by stage, sample deals included', FAIL, 'No "My opportunities" view exists in the picker; a BD officer needs their own cases with next action and date.'],
  ['Work package', 'Sidebar My work', 'My work: my open work packages, earliest due first', PASS, ''],
  ['Project', 'Sidebar Projects', 'Portfolio: active projects, nearest end date first', PASS, ''],
  ['Milestone', 'Sidebar Milestones', 'Open milestones, earliest due first', PASS, ''],
  ['Engagement', 'Sidebar Engagements', 'This month: the team\'s engagements this month', PASS, 'Team-wide, but it is where a logged contact appears.'],
  ['Company', 'Sidebar Companies (twice)', 'By tier, grouped by account tier', PASS, 'Searching (Ctrl+K) before creating works from any view.'],
  ['Person', 'Sidebar People (twice)', 'Decision makers: people with a decision role, 0 rows for a new workspace (ux-18)', FAIL, 'A new employee looking for the person they just met sees an empty list.'],
  ['Task', 'Twenty\'s Tasks entry', 'By Status: every task of the team on a kanban (ux-19)', FAIL, 'Tasks are where every reminder lands; the person needs their own open tasks, due first (Twenty\'s "Assigned to Me" has 7 columns and no sort).'],
  ['Note', 'Twenty\'s Notes entry', 'All Notes', PASS, 'Notes are read on their record; the list is rarely opened.'],
  ['Contract', 'Sidebar Contracts', 'Expiring: signed contracts by expiry', PASS, 'BD officers read contracts only.'],
  ['Document', 'Sidebar Documents', 'Documents by type', PASS, ''],
  ['Capability', 'Sidebar Capabilities', 'All capabilities, latest status change first', PASS, ''],
  ['Campaign target', 'The Campaign pack tab (no sidebar entry)', 'its campaign targets table; the object itself opens To work', PASS, 'Reached from the Campaign pack tab and the campaign project.'],
  ['Playbook role assignment', 'Search or the object page (no sidebar entry)', "Twenty's All view, 8 columns with Created by and Last update", FAIL, 'Configuration for the ED and the ops coordinator; no curated view.'],
  ['UAE public holiday', 'Search or the object page (no sidebar entry)', "Twenty's All view, no sort on Date", FAIL, 'The ops coordinator enters each year here; the list is not in date order.'],
];
for (const [object, entry, opens, result, note] of DEFAULT_VIEWS) add('Default views', object, 'D1 The default view is the one a new employee needs', result, `${entry} opens ${opens}. ${note}`.trim());

// ---------- 1.6 Front components (observed: card-*.json, contrast.json, phone.json, ux-04 to ux-07, ux-14, ux-16) ----------
const CARD = [
  ['F1 Skeleton while loading', PASS, 'Real headings with skeleton bars and "Wait a moment while the work package loads." (ux-05).'],
  ['F2 Empty and missing states', PASS, '"This work package isn\'t available..." with Open full record; empty Done criteria shows "No done criteria yet. Ask {reviewer}..."'],
  ['F3 Error state', PASS, '"We couldn\'t load this work package. Your data is safe." with Try again and Open full record (ux-06).'],
  ['F4 Toast on every action', PASS, '"Accepted. It\'s on your list." on Accept; Decline, Request help and Submit toasts in code; a double click gave one toast. A refused write says "That didn\'t save... Try again" even when it can never save (ux-07).'],
  ['F5 Fallback link', PASS, 'Open full record, top end corner, also on the error state. On the record page itself it links to the page you are on (wireframes 1.7 asks for "Show all fields").'],
  ['F6 Buttons disabled while a write is pending', PASS, 'On a 2.5 s network every action button reads disabled until the write returns (card-keys.json).'],
  ['F7 Focus order', FAIL, 'Each info icon is followed by four extra Tab stops on its svg and path elements; reading order otherwise holds (card-keys.json).'],
  ['F8 Keyboard operation', FAIL, 'Opening Decline or Request help leaves focus on the page body; Enter does not send and Escape does not close the form (wireframes 1.3).'],
  ['F9 Contrast of status colours', FAIL, 'Badges: Planned 5.45, Offered 4.72, Accepted 5.34, Submitted 5.38, Blocked 4.55, Done 4.44 (under 4.5:1). Secondary text and info icons 2.78:1 (contrast.json).'],
  ['F10 Usable at phone width', FAIL, 'At 390 x 844 the card starts below the 31-field list; Submit is 2,414 px down; buttons are 26 px high, not 44 (ux-14, phone.json).'],
  ['F11 Same verbs everywhere', PASS, 'Accept, Decline, Request help, Submit, as the cadence guide and the guidance widgets say.'],
  ['F12 Same status words everywhere', FAIL, 'Badge words differ from the Status field and the day-one checklist ("The status reads Accepted"; the badge reads In progress).'],
  ['F13 Arabic and right to left', FAIL, 'Mirrors and every card string is in Arabic, but the due date is in the Hijri calendar ("الخميس، 11 جمادى الأولى") because ar-SA defaults to it (ux-16).'],
  ['F14 Info icon tooltip and "What do I do now?" on every state', PASS, 'Tooltips open on hover and on focus; every state ends with its next step (card-desktop.json).'],
];
for (const [check, result, evidence] of CARD) add('Front components', 'Work package card', check, result, evidence);
for (const [component, section] of [['Home', 3], ['Intake', 4], ['Manager exceptions', 6]]) {
  add('Front components', `${component} (wireframes section ${section})`, 'F0 Built', FAIL, component === 'Intake'
    ? 'Not built (backlog B4); "+ Create" on Opportunities is the only way to open a case.'
    : `Not built (backlog ${component === 'Home' ? 'B2' : 'B3'}); a native page of three tables stands in, audited as a dashboard tab.`);
}

// ---------- 1.7 Sidebar, first sign-in and the workspace (observed) ----------
const GLOBAL = [
  ['First sign-in', 'G1 A new member reaches Home', FAIL, 'Until an admin completes Twenty\'s "Invite your team" step, every member lands on it and "Skip anyway" fails with "User does not have permission." (ux-01). After the ED skipped it once, BD officers landed on Home after "Create profile".'],
  ['Sidebar', 'G2 One entry per destination', FAIL, "Companies and People appear twice; Twenty's Opportunities, Tasks, Notes, Dashboards and Workflows stay under Help (config/dashboards/sidebar.md not applied)."],
  ['Sidebar', 'G3 Entry names say what opens', FAIL, '"BD Executive" opens the whole BD dashboard; Team, Mine and the three packs sit behind it. The guidance calls it "BD dashboard".'],
  ['Sidebar', 'G4 Help opens the Help page', FAIL, 'https://kuac.sharepoint.com/... does not exist (gate M6).'],
  ['Sidebar', 'G5 Names in Arabic', FAIL, '3 of 18 entries have Arabic (Leads, Documents, Help).'],
  ['Workspace', 'G6 No sample records', FAIL, "Twenty's sample companies (Airbnb, Anthropic, Figma, Notion, Stripe), 5 people, 6 opportunities and \"My First Dashboard\" exist from workspace creation; they show in Pipeline and Data quality (ux-11)."],
  ['Workspace', 'G7 Links to a dashboard tab open that tab', FAIL, '/page/<BD>?tabId=<Team> opens Executive.'],
];
for (const [screen, check, result, evidence] of GLOBAL) add('Sidebar and global', screen, check, result, evidence);

// ---------- Output ----------
const csvEscape = (value) => `"${String(value ?? '').replace(/"/g, '""')}"`;
writeFileSync(new URL('./evidence/checks.csv', import.meta.url), ['section,screen,check,result,evidence', ...rows.map((row) => [row.section, row.screen, row.check, row.result, row.evidence].map(csvEscape).join(','))].join('\n') + '\n');
const summary = {};
for (const row of rows) {
  summary[row.section] ??= { Pass: 0, Fail: 0, 'n/a': 0, screens: new Set() };
  summary[row.section][row.result] += 1;
  summary[row.section].screens.add(row.screen);
}
for (const [section, counts] of Object.entries(summary)) console.log(`${section}: ${counts.screens.size} screens, ${counts.Pass} pass, ${counts.Fail} fail, ${counts['n/a']} n/a`);

const table = (section, checks) => {
  const screens = [...new Set(rows.filter((row) => row.section === section).map((row) => row.screen))];
  const lines = [`| ${section === 'Views' ? 'View' : 'Screen'} | Check | Result | Evidence |`, '| --- | --- | --- | --- |'];
  for (const screen of screens) for (const check of checks) {
    const row = rows.find((candidate) => candidate.section === section && candidate.screen === screen && candidate.check === check);
    if (row) lines.push(`| ${screen} | ${check} | ${row.result === FAIL ? '**Fail**' : row.result} | ${row.evidence.replace(/\|/g, '/')} |`);
  }
  return lines.join('\n');
};
const viewMatrix = () => {
  const lines = ['| Object | View | Type | Columns | V1 ≤ 6 | V2 Order | V3 Sort | V4 Arabic | Notes |', '| --- | --- | --- | --- | --- | --- | --- | --- | --- |'];
  for (const row of viewRows.filter((candidate) => !candidate.hidden)) {
    lines.push(`| ${row.object} | ${row.name} | ${row.type} | ${row.columns} | ${mark(row.six)} | ${mark(row.order)} | ${mark(row.sort)} | ${row.isWidget ? NA : mark(row.arabic)} | ${row.notes} |`);
  }
  return lines.join('\n');
};
const checksOf = (section) => [...new Set(rows.filter((row) => row.section === section).map((row) => row.check))];
const sections = {
  recordPages: table('Record pages', checksOf('Record pages')),
  dashboardTabs: table('Dashboard tabs', checksOf('Dashboard tabs')),
  views: viewMatrix(),
  options: table('Lists and options', checksOf('Lists and options')),
  defaultViews: table('Default views', checksOf('Default views')),
  frontComponents: table('Front components', checksOf('Front components')),
  global: table('Sidebar and global', checksOf('Sidebar and global')),
};
// Each table goes between its markers in the report: <!-- generated:name --> ... <!-- /generated:name -->.
const reportUrl = new URL('../23-ux-audit.md', import.meta.url);
let report = readFileSync(reportUrl, 'utf8');
for (const [name, body] of Object.entries(sections)) {
  const pattern = new RegExp(`(<!-- generated:${name} -->)[\\s\\S]*?(<!-- /generated:${name} -->)`);
  if (!pattern.test(report)) throw new Error(`23-ux-audit.md has no markers for ${name}`);
  report = report.replace(pattern, (_, start, end) => `${start}\n${body}\n${end}`);
}
writeFileSync(reportUrl, report);
writeFileSync(new URL('./evidence/summary.json', import.meta.url), JSON.stringify(Object.fromEntries(Object.entries(summary).map(([section, counts]) => [section, { screens: counts.screens.size, pass: counts.Pass, fail: counts.Fail, notApplicable: counts['n/a'] }])), null, 1));
