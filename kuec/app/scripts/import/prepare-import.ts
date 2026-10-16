import { existsSync, mkdirSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';

import { buildImport, type SourceFile } from './build-import.ts';
import { readCsvTable } from './csv.ts';
import { buildPostImportCheckSql, buildSummary, writeOutputs } from './outputs.ts';
import { type ColumnOverride, SOURCE_KINDS } from './source-columns.ts';

const USAGE = `Usage: node scripts/import/prepare-import.ts --in <source folder> --out <output folder> [--today YYYY-MM-DD]

<source folder> holds one folder per source, each with .csv files (UTF-8):
  register/ contacts/ workshops/ opportunities/ projects/ milestones/ contracts/
plus owners.csv (Owner, Email) and optional value-map.csv and column-map.csv.
See kuec/runbooks/09-import.md.`;

const todayInDubai = (): string =>
  new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString().slice(0, 10);

// The sources and outputs hold personal data, which never goes into the repo.
const findGitRoot = (directory: string): string | null => {
  let current = resolve(directory);

  while (true) {
    if (existsSync(join(current, '.git'))) {
      return current;
    }

    const parent = dirname(current);

    if (parent === current) {
      return null;
    }

    current = parent;
  }
};

const readOptionalTable = (filePath: string) =>
  existsSync(filePath) ? readCsvTable(filePath) : null;

const valueOf = (values: Record<string, string>, ...headers: string[]): string => {
  const key = Object.keys(values).find((header) => headers.includes(header.trim().toLowerCase()));

  return key === undefined ? '' : values[key];
};

const main = () => {
  const { values } = parseArgs({
    options: {
      in: { type: 'string' },
      out: { type: 'string' },
      today: { type: 'string' },
      help: { type: 'boolean' },
    },
  });

  if (values.help === true || values.in === undefined || values.out === undefined) {
    console.log(USAGE);
    process.exit(values.help === true ? 0 : 1);
  }

  const inputDirectory = resolve(values.in);
  const outputDirectory = resolve(values.out);
  const today = values.today ?? todayInDubai();

  if (!/^\d{4}-\d{2}-\d{2}$/.test(today)) {
    throw new Error(`--today must be YYYY-MM-DD, got ${today}`);
  }

  const repositoryRoot = findGitRoot(dirname(fileURLToPath(import.meta.url)));

  for (const directory of [inputDirectory, outputDirectory]) {
    if (repositoryRoot !== null && findGitRoot(directory) === repositoryRoot) {
      throw new Error(`${directory} is inside the repository. Source files and outputs hold personal data; keep them outside it.`);
    }
  }

  const owners = readOptionalTable(join(inputDirectory, 'owners.csv'));

  if (owners === null) {
    throw new Error(`${join(inputDirectory, 'owners.csv')} is missing: list each owner as written in the sheets (Owner) and their KUEC login (Email).`);
  }

  const files: SourceFile[] = SOURCE_KINDS.flatMap((kind) => {
    const folder = join(inputDirectory, kind);

    return existsSync(folder)
      ? readdirSync(folder)
          .filter((fileName) => fileName.toLowerCase().endsWith('.csv'))
          .sort()
          .map((fileName) => ({ kind, fileName: `${kind}/${fileName}`, table: readCsvTable(join(folder, fileName)) }))
      : [];
  });

  if (files.length === 0) {
    throw new Error(`No .csv files under ${inputDirectory}/{${SOURCE_KINDS.join(',')}}/`);
  }

  const valueMap = readOptionalTable(join(inputDirectory, 'value-map.csv'));
  const columnMap = readOptionalTable(join(inputDirectory, 'column-map.csv'));
  const result = buildImport({
    files,
    today,
    owners: owners.rows.map(({ values: row }) => ({
      owner: valueOf(row, 'owner', 'name'),
      email: valueOf(row, 'email', 'user email'),
    })),
    valueOverrides: (valueMap?.rows ?? []).map(({ values: row }) => ({
      field: valueOf(row, 'field'),
      sourceValue: valueOf(row, 'source value'),
      targetValue: valueOf(row, 'target value'),
    })),
    columnOverrides: (columnMap?.rows ?? []).map(
      ({ values: row }): ColumnOverride => ({
        kind: valueOf(row, 'kind'),
        column: valueOf(row, 'column'),
        header: valueOf(row, 'header'),
      }),
    ),
  });

  mkdirSync(outputDirectory, { recursive: true });

  const written = writeOutputs(result, outputDirectory);
  const summary = buildSummary(result, written, today);

  writeFileSync(join(outputDirectory, 'post-import-check.sql'), buildPostImportCheckSql(result.opportunities), 'utf8');
  writeFileSync(join(outputDirectory, 'summary.txt'), summary, 'utf8');
  console.log(summary);
};

main();
