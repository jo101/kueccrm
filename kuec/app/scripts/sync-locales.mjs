import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

// src/i18n is the source of the Arabic; this writes it into the catalog that
// `yarn twenty dev:translations-extract` keeps in step with the manifest.
// node scripts/sync-locales.mjs          fill locales/ar-SA.json
// node scripts/sync-locales.mjs --check  exit 1 if a string lacks its Arabic or the file is stale
const appDirectory = dirname(dirname(fileURLToPath(import.meta.url)));
const readJson = (relativePath) =>
  JSON.parse(readFileSync(join(appDirectory, relativePath), 'utf8'));

const TOP_LEVEL = '';
// Contexts whose every string must have its Arabic; the others fill in as src/i18n grows.
const REQUIRED_CONTEXTS = [
  TOP_LEVEL,
  'fieldMetadata.label',
  'fieldMetadata.description',
  'objectMetadata.labelSingular',
  'objectMetadata.labelPlural',
  'objectMetadata.description',
];

const fields = readJson('src/i18n/fields.json');
const interfaceStrings = readJson('src/i18n/interface.json');
const sourceCatalog = readJson('locales/en.json');
const arabicCatalogPath = join(appDirectory, 'locales', 'ar-SA.json');
const currentArabicCatalog = JSON.parse(readFileSync(arabicCatalogPath, 'utf8'));

const arabicByContext = new Map();
const errors = [];

const addArabic = (context, english, arabic) => {
  const byEnglish = arabicByContext.get(context) ?? new Map();
  const known = byEnglish.get(english);

  if (known !== undefined && known !== arabic) {
    errors.push(`${context || 'top level'}: "${english}" has two Arabic texts: "${known}" and "${arabic}"`);
  }

  byEnglish.set(english, arabic);
  arabicByContext.set(context, byEnglish);
};

for (const field of Object.values(fields.fields)) {
  addArabic('fieldMetadata.label', field.label.en, field.label.ar);
  addArabic('fieldMetadata.description', field.description.en, field.description.ar);
}

for (const object of Object.values(fields.objects)) {
  for (const property of ['labelSingular', 'labelPlural', 'description']) {
    if (object[property] !== undefined) {
      addArabic(`objectMetadata.${property}`, object[property].en, object[property].ar);
    }
  }
}

for (const [english, arabic] of Object.entries(interfaceStrings.frontComponents)) {
  addArabic(TOP_LEVEL, english, arabic);
}

for (const [context, strings] of Object.entries(interfaceStrings.contexts)) {
  for (const [english, arabic] of Object.entries(strings)) {
    addArabic(context, english, arabic);
  }
}

const translate = (context, english, current) => {
  const arabic = arabicByContext.get(context)?.get(english) ?? current ?? '';

  if (arabic === '' && REQUIRED_CONTEXTS.includes(context)) {
    errors.push(`${context || 'top level'}: no Arabic for "${english}"`);
  }

  return arabic;
};

// The key set and its order come from en.json, which the extract command writes.
const arabicCatalog = {};

for (const [key, value] of Object.entries(sourceCatalog)) {
  if (typeof value === 'string') {
    arabicCatalog[key] = translate(TOP_LEVEL, key, currentArabicCatalog[key]);
    continue;
  }

  arabicCatalog[key] = {};

  for (const english of Object.keys(value)) {
    arabicCatalog[key][english] = translate(key, english, currentArabicCatalog[key]?.[english]);
  }
}

const rendered = `${JSON.stringify(arabicCatalog, null, 2)}\n`;

if (errors.length > 0) {
  console.error(errors.join('\n'));
  process.exit(1);
}

if (process.argv.includes('--check')) {
  if (rendered !== readFileSync(arabicCatalogPath, 'utf8')) {
    console.error('locales/ar-SA.json is out of sync with src/i18n: run yarn i18n:sync');
    process.exit(1);
  }
} else {
  writeFileSync(arabicCatalogPath, rendered);
  console.log('synced locales/ar-SA.json');
}
