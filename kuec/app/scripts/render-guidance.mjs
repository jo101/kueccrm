import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

// Renders the generated sections of kuec/runbooks/20-guidance.md from src/i18n, the single source.
// node scripts/render-guidance.mjs          rewrite the sections
// node scripts/render-guidance.mjs --check  exit 1 if the runbook is stale
const appDirectory = dirname(dirname(fileURLToPath(import.meta.url)));
const RUNBOOK_PATH = join(appDirectory, '..', 'runbooks', '20-guidance.md');
const MARKER =
  '<!-- Generated from kuec/app/src/i18n by kuec/app/scripts/render-guidance.mjs. Edit the JSON and re-run the script; do not edit below this line. -->';

const readJson = (relativePath) =>
  JSON.parse(readFileSync(join(appDirectory, relativePath), 'utf8'));

const guidance = readJson('src/i18n/guidance.json');
const options = readJson('src/i18n/options.json');
const fields = readJson('src/i18n/fields.json');

const cell = (text) => text.replaceAll('|', '\\|');

const renderPage = (page, number) => {
  const title = guidance.titles[page.kind];
  const lines = [
    `### 10.${number} ${page.screen.en} (${page.screen.ar})`,
    '',
    `Widget **${title.en}** (${title.ar}), key \`${page.key}\`.`,
    '',
    '| | English | العربية |',
    '| --- | --- | --- |',
  ];

  page.lines.en.forEach((english, index) => {
    lines.push(
      `| ${index + 1} | **${guidance.lineLabels.en[index]}:** ${cell(english)} | **${guidance.lineLabels.ar[index]}:** ${cell(page.lines.ar[index])} |`,
    );
  });

  lines.push('');

  return lines;
};

const renderList = (list, number) => {
  const lines = [`### 11.${number} ${list.name.en} (${list.name.ar})`, ''];

  lines.push(
    list.inManifest
      ? `Field \`${list.field}\`.`
      : `Field \`${list.field}\`. ${list.note}`,
    '',
    '| Value | Label | التسمية | What it means, when to pick it | المعنى ومتى تختاره |',
    '| --- | --- | --- | --- | --- |',
  );

  for (const option of list.options) {
    lines.push(
      `| \`${option.value}\` | ${cell(option.label.en)} | ${cell(option.label.ar)} | ${cell(option.description.en)} | ${cell(option.description.ar)} |`,
    );
  }

  lines.push('');

  return lines;
};

const renderFields = () => {
  const byObject = new Map();

  for (const [key, field] of Object.entries(fields.fields)) {
    const [objectName] = key.split('.');
    const rows = byObject.get(objectName) ?? [];

    rows.push([key, field]);
    byObject.set(objectName, rows);
  }

  const lines = [];
  let number = 0;

  for (const [objectName, rows] of [...byObject.entries()].sort(([left], [right]) =>
    left.localeCompare(right),
  )) {
    number += 1;
    lines.push(
      `### 12.${number} \`${objectName}\``,
      '',
      '| Field | Label | التسمية | What to put, when | ماذا تكتب ومتى |',
      '| --- | --- | --- | --- | --- |',
    );

    for (const [key, field] of rows) {
      lines.push(
        `| \`${key.split('.')[1]}\` | ${cell(field.label.en)} | ${cell(field.label.ar)} | ${cell(field.description.en)} | ${cell(field.description.ar)} |`,
      );
    }

    lines.push('');
  }

  return lines;
};

const recordPages = guidance.pages.filter((page) => page.kind === 'recordPage');
const dashboardTabs = guidance.pages.filter((page) => page.kind === 'dashboardTab');
const optionCount = options.lists.reduce((total, list) => total + list.options.length, 0);

const rendered = [
  MARKER,
  '',
  '## 10. Every widget text',
  '',
  `${recordPages.length} record pages and ${dashboardTabs.length} dashboard tabs, from \`kuec/app/src/i18n/guidance.json\`. The widget shows the five English lines, then the five Arabic lines.`,
  '',
  ...guidance.pages.flatMap((page, index) => renderPage(page, index + 1)),
  '## 11. Every option of the Twenty-only lists',
  '',
  `${options.lists.length} lists and ${optionCount} options, from \`kuec/app/src/i18n/options.json\`. The KUEC-wide lists are in \`18-taxonomy.md\` section 8.`,
  '',
  ...options.lists.flatMap((list, index) => renderList(list, index + 1)),
  '## 12. Every field',
  '',
  `${Object.keys(fields.fields).length} fields the app adds, from \`kuec/app/src/i18n/fields.json\`. Twenty shows the description as the tooltip of the field, in the member's language.`,
  '',
  ...renderFields(),
]
  .join('\n')
  .replace(/\n+$/, '\n');

const current = readFileSync(RUNBOOK_PATH, 'utf8');
const markerIndex = current.indexOf(MARKER);

if (markerIndex === -1) {
  console.error(`${RUNBOOK_PATH} has no generated section marker`);
  process.exit(1);
}

const next = current.slice(0, markerIndex) + rendered;

if (process.argv.includes('--check')) {
  if (next !== current) {
    console.error('Out of sync with src/i18n: kuec/runbooks/20-guidance.md (run yarn guidance:render)');
    process.exit(1);
  }
} else {
  writeFileSync(RUNBOOK_PATH, next);
  console.log('rendered kuec/runbooks/20-guidance.md');
}
