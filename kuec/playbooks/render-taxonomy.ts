// Renders the option tables of runbooks/18-taxonomy.md from lookups.json, the single source.
// node kuec/playbooks/render-taxonomy.ts          rewrite the tables
// node kuec/playbooks/render-taxonomy.ts --check  exit 1 if the runbook is stale
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

type LocalisedText = { en: string; ar: string };

type LookupOption = {
  value: string;
  status: 'active' | 'deprecated';
  label: LocalisedText;
  description: LocalisedText;
  requiresNote: boolean;
  deprecatedOn?: string;
  replacedBy?: string[];
};

type LookupList = {
  key: string;
  name: LocalisedText;
  appliesTo: string[];
  twentyFields: { object: string; field: string; type: string }[];
  note?: string;
  options: LookupOption[];
};

type Lookups = {
  version: string;
  lists: LookupList[];
};

const PLAYBOOKS_DIRECTORY = dirname(fileURLToPath(import.meta.url));
const RUNBOOK_PATH = join(PLAYBOOKS_DIRECTORY, '..', 'runbooks', '18-taxonomy.md');
const MARKER =
  '<!-- Generated from kuec/playbooks/lookups.json by kuec/playbooks/render-taxonomy.ts. Edit the JSON and re-run the script; do not edit below this line. -->';

const validate = (lookups: Lookups) => {
  const errors: string[] = [];

  for (const list of lookups.lists) {
    const values = list.options.map((option) => option.value);
    const activeValues = list.options
      .filter((option) => option.status === 'active')
      .map((option) => option.value);

    if (new Set(values).size !== values.length) errors.push(`${list.key}: duplicate value`);
    if (values.at(-1) !== 'OTHER') errors.push(`${list.key}: Other is not last`);

    for (const option of list.options) {
      if (option.requiresNote !== (option.value === 'OTHER')) {
        errors.push(`${list.key}.${option.value}: only Other requires a note`);
      }

      for (const replacement of option.replacedBy ?? []) {
        if (!activeValues.includes(replacement)) {
          errors.push(`${list.key}.${option.value}: replacement ${replacement} is not an active option`);
        }
      }
    }
  }

  if (errors.length > 0) {
    console.error(errors.join('\n'));
    process.exit(1);
  }
};

const cell = (text: string) => text.replaceAll('|', '\\|');

const describeTwentyFields = (list: LookupList) =>
  list.twentyFields.length === 0
    ? 'none'
    : list.twentyFields
        .map(({ object, field, type }) => `\`${object}.${field}\` (${type === 'MULTI_SELECT' ? 'multi-select' : 'select'})`)
        .join(', ');

const renderList = (list: LookupList, index: number) => {
  const lines = [
    `### 8.${index + 1} ${list.name.en} (${list.name.ar})`,
    '',
    `List key \`${list.key}\`. Applies to ${list.appliesTo.map((name) => `\`${name}\``).join(', ')}. In Twenty: ${describeTwentyFields(list)}.`,
    '',
  ];

  if (list.note !== undefined) {
    lines.push(list.note, '');
  }

  lines.push(
    '| Value | Label | التسمية | What it means, when to pick it | المعنى ومتى تختاره |',
    '| --- | --- | --- | --- | --- |',
  );

  for (const option of list.options) {
    const replacedBy =
      option.status === 'deprecated'
        ? ` Replaced by ${(option.replacedBy ?? []).map((value) => `\`${value}\``).join(', ')}.`
        : '';

    lines.push(
      `| \`${option.value}\` | ${cell(option.label.en)} | ${cell(option.label.ar)} | ${cell(option.description.en)}${replacedBy} | ${cell(option.description.ar)} |`,
    );
  }

  lines.push('');

  return lines;
};

const renderTables = (lookups: Lookups) => {
  const optionCount = lookups.lists.reduce((total, list) => total + list.options.length, 0);
  const deprecatedCount = lookups.lists.reduce(
    (total, list) => total + list.options.filter((option) => option.status === 'deprecated').length,
    0,
  );

  return [
    MARKER,
    '',
    `lookups.json version ${lookups.version}: ${lookups.lists.length} lists, ${optionCount} options, ${deprecatedCount} of them deprecated.`,
    '',
    ...lookups.lists.flatMap(renderList),
  ].join('\n');
};

const lookups = JSON.parse(readFileSync(join(PLAYBOOKS_DIRECTORY, 'lookups.json'), 'utf8')) as Lookups;
validate(lookups);

const current = readFileSync(RUNBOOK_PATH, 'utf8');
const markerIndex = current.indexOf(MARKER);

if (markerIndex === -1) {
  console.error(`${RUNBOOK_PATH} has no generated section marker`);
  process.exit(1);
}

const rendered = current.slice(0, markerIndex) + renderTables(lookups);

if (process.argv.includes('--check')) {
  if (rendered !== current) {
    console.error('Out of sync with lookups.json: runbooks/18-taxonomy.md');
    process.exit(1);
  }
} else {
  writeFileSync(RUNBOOK_PATH, rendered);
}
