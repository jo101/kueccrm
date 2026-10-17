// Lists what changed in lookups.json between two git revisions, for the
// quarterly taxonomy review and the note to the uVENTURE team
// (runbooks/18-taxonomy.md section 6, runbooks/21-uventure-readiness.md section 3).
// node kuec/playbooks/diff-lookups.ts <from-rev> [<to-rev>]   to-rev defaults to the working copy
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

type LocalisedText = { en: string; ar: string };

type LookupOption = {
  value: string;
  status: 'active' | 'deprecated';
  label: LocalisedText;
  description: LocalisedText;
};

type LookupList = { key: string; name: LocalisedText; options: LookupOption[] };

type Lookups = { version: string; lists: LookupList[] };

export type LookupChange = {
  list: string;
  value: string | null;
  change: 'list added' | 'option added' | 'relabelled' | 'description changed' | 'deprecated' | 'reactivated' | 'removed';
  before: string | null;
  after: string | null;
};

const PLAYBOOKS_DIRECTORY = dirname(fileURLToPath(import.meta.url));
const LOOKUPS_PATH = join(PLAYBOOKS_DIRECTORY, 'lookups.json');

// A removed list or option is reported, never expected: rule 2 deprecates instead.
export const diffLookups = (before: Lookups, after: Lookups): LookupChange[] => {
  const changes: LookupChange[] = [];
  const beforeLists = new Map(before.lists.map((list) => [list.key, list]));
  const afterKeys = new Set(after.lists.map((list) => list.key));

  for (const list of after.lists) {
    const previous = beforeLists.get(list.key);

    if (previous === undefined) {
      changes.push({ list: list.key, value: null, change: 'list added', before: null, after: list.name.en });
      continue;
    }

    const previousOptions = new Map(previous.options.map((option) => [option.value, option]));
    const currentValues = new Set(list.options.map((option) => option.value));

    for (const option of list.options) {
      const old = previousOptions.get(option.value);

      if (old === undefined) {
        changes.push({ list: list.key, value: option.value, change: 'option added', before: null, after: option.label.en });
        continue;
      }

      if (old.status !== option.status) {
        changes.push({
          list: list.key,
          value: option.value,
          change: option.status === 'deprecated' ? 'deprecated' : 'reactivated',
          before: old.label.en,
          after: option.label.en,
        });
      } else if (old.label.en !== option.label.en || old.label.ar !== option.label.ar) {
        changes.push({ list: list.key, value: option.value, change: 'relabelled', before: old.label.en, after: option.label.en });
      } else if (old.description.en !== option.description.en || old.description.ar !== option.description.ar) {
        changes.push({
          list: list.key,
          value: option.value,
          change: 'description changed',
          before: old.description.en,
          after: option.description.en,
        });
      }
    }

    for (const option of previous.options.filter(({ value }) => !currentValues.has(value))) {
      changes.push({ list: list.key, value: option.value, change: 'removed', before: option.label.en, after: null });
    }
  }

  for (const list of before.lists.filter(({ key }) => !afterKeys.has(key))) {
    changes.push({ list: list.key, value: null, change: 'removed', before: list.name.en, after: null });
  }

  return changes;
};

const readAt = (revision: string | undefined): Lookups => {
  if (revision === undefined) {
    return JSON.parse(readFileSync(LOOKUPS_PATH, 'utf8')) as Lookups;
  }

  const repositoryRoot = execFileSync('git', ['rev-parse', '--show-toplevel'], { encoding: 'utf8' }).trim();
  const path = relative(repositoryRoot, LOOKUPS_PATH);

  return JSON.parse(execFileSync('git', ['show', `${revision}:${path}`], { encoding: 'utf8' })) as Lookups;
};

const cell = (text: string | null) => (text ?? '').replace(/\|/g, '\\|');

const main = () => {
  const [fromRevision, toRevision] = process.argv.slice(2);

  if (fromRevision === undefined) {
    console.error('usage: node kuec/playbooks/diff-lookups.ts <from-rev> [<to-rev>]');
    process.exit(2);
  }

  const before = readAt(fromRevision);
  const after = readAt(toRevision);
  const changes = diffLookups(before, after);

  console.log(`lookups.json ${before.version} (${fromRevision}) to ${after.version} (${toRevision ?? 'working copy'}): ${changes.length} changes`);
  console.log('');
  console.log('| List | Value | Change | Before | After |');
  console.log('| --- | --- | --- | --- | --- |');

  for (const change of changes) {
    console.log(`| ${change.list} | ${cell(change.value)} | ${change.change} | ${cell(change.before)} | ${cell(change.after)} |`);
  }

  if (changes.some(({ change }) => change === 'removed')) {
    console.error('A list or option was removed: deprecate it instead (runbooks/18-taxonomy.md rule 2).');
    process.exit(1);
  }
};

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main();
}
