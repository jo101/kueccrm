import { execFileSync } from 'node:child_process';
import { join } from 'node:path';

import {
  type defineField,
  type defineObject,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';
import { beforeAll, describe, expect, it } from 'vitest';

import { loadDefaultExports } from 'src/__tests__/utils/load-default-exports';
import fieldsJson from 'src/i18n/fields.json';
import optionsJson from 'src/i18n/options.json';
import lookupsJson from 'src/playbooks/lookups.json';

type ObjectDefinition = ReturnType<typeof defineObject>;
type FieldDefinition = ReturnType<typeof defineField>;

type ManifestOption = { value: string; label: string; position: number };

type ManifestField = {
  name: string;
  type: string;
  label: string;
  description?: string;
  options?: ManifestOption[];
};

type LocalisedText = { en: string; ar: string };

const APP_DIRECTORY = join(__dirname, '..', '..');
const SELECT_TYPES: string[] = [FieldType.SELECT, FieldType.MULTI_SELECT];
const OTHER = 'OTHER';
const DEPRECATED_SUFFIX = ' (deprecated)';

// Proper names and units a new employee meets everywhere; anything else in
// capitals is an abbreviation to spell out.
const ALLOWED_CAPITALS = ['KUEC', 'QR', 'AED', 'UAE'];

const FIELD_GUIDANCE: Record<string, { label: LocalisedText; description: LocalisedText }> =
  fieldsJson.fields;
const OBJECT_GUIDANCE: Record<
  string,
  { labelSingular: LocalisedText; labelPlural?: LocalisedText; description: LocalisedText }
> = fieldsJson.objects;

const isOneSentence = (text: string) =>
  text.trim() === text && text.endsWith('.') && !/[.!?؟]\s/.test(text.slice(0, -1));

const abbreviationsIn = (text: string) =>
  (text.match(/\b[A-Z]{2,}\b|\bMoU\b/g) ?? []).filter(
    (word) => !ALLOWED_CAPITALS.includes(word),
  );


const objectNameByUniversalIdentifier = new Map<string, string>(
  Object.entries(STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS).map(([name, object]) => [
    object.universalIdentifier,
    name,
  ]),
);

describe('field and option guidance (src/i18n)', () => {
  const fieldsByKey = new Map<string, ManifestField>();
  const objectsByName = new Map<string, ObjectDefinition['config']>();

  beforeAll(async () => {
    const objects = await loadDefaultExports<ObjectDefinition>(
      join(__dirname, '..', 'objects'),
      '.object.ts',
    );
    const fields = await loadDefaultExports<FieldDefinition>(
      join(__dirname, '..', 'fields'),
      '.field.ts',
    );

    for (const object of objects) {
      objectNameByUniversalIdentifier.set(
        object.config.universalIdentifier,
        object.config.nameSingular,
      );
      objectsByName.set(object.config.nameSingular, object.config);

      for (const field of object.config.fields ?? []) {
        fieldsByKey.set(`${object.config.nameSingular}.${field.name}`, field as ManifestField);
      }
    }

    for (const field of fields) {
      const objectName = objectNameByUniversalIdentifier.get(
        field.config.objectUniversalIdentifier,
      );

      fieldsByKey.set(`${objectName}.${field.config.name}`, field.config as ManifestField);
    }
  });

  it('describes every field the app adds, and nothing else', () => {
    expect(Object.keys(FIELD_GUIDANCE).sort()).toEqual([...fieldsByKey.keys()].sort());
  });

  it('gives the manifest the English label and description of src/i18n/fields.json', () => {
    for (const [key, field] of fieldsByKey) {
      expect(field.label, key).toBe(FIELD_GUIDANCE[key].label.en);
      expect(field.description, key).toBe(FIELD_GUIDANCE[key].description.en);
    }
  });

  it('describes every object as the manifest names it', () => {
    expect(Object.keys(OBJECT_GUIDANCE).sort()).toEqual([...objectsByName.keys()].sort());

    for (const [name, object] of objectsByName) {
      expect(object.labelSingular, name).toBe(OBJECT_GUIDANCE[name].labelSingular.en);
      expect(object.labelPlural, name).toBe(OBJECT_GUIDANCE[name].labelPlural?.en);
      expect(object.description, name).toBe(OBJECT_GUIDANCE[name].description.en);
    }
  });

  it('writes every description as one sentence, in English and in Arabic', () => {
    const descriptions = [
      ...Object.entries(FIELD_GUIDANCE).map(([key, field]) => [key, field.description] as const),
      ...Object.entries(OBJECT_GUIDANCE).map(([key, object]) => [key, object.description] as const),
      ...optionsJson.lists.flatMap((list) =>
        list.options.map((option) => [`${list.field}.${option.value}`, option.description] as const),
      ),
    ];

    for (const [where, description] of descriptions) {
      expect(isOneSentence(description.en), `${where}: ${description.en}`).toBe(true);
      expect(isOneSentence(description.ar), `${where}: ${description.ar}`).toBe(true);
    }
  });

  it('takes the options of every select list from exactly one source: lookups.json or options.json', () => {
    const taxonomyKeys = lookupsJson.lists.flatMap((list) =>
      list.twentyFields.map(({ object, field }) => `${object}.${field}`),
    );
    const twentyOnlyKeys = optionsJson.lists
      .filter((list) => list.inManifest)
      .map((list) => list.field);

    for (const [key, field] of fieldsByKey) {
      if (SELECT_TYPES.includes(field.type)) {
        expect(
          [...taxonomyKeys, ...twentyOnlyKeys].filter((sourceKey) => sourceKey === key),
          key,
        ).toHaveLength(1);
      }
    }
  });

  it('matches the Twenty-only lists of options.json to the manifest, value, label and order', () => {
    for (const list of optionsJson.lists.filter((candidate) => candidate.inManifest)) {
      const field = fieldsByKey.get(list.field);

      expect(field, list.field).toBeDefined();
      expect(
        [...(field?.options ?? [])]
          .sort((left, right) => left.position - right.position)
          .map(({ value, label }) => ({ value, label })),
        list.field,
      ).toEqual(list.options.map(({ value, label }) => ({ value, label: label.en })));
    }
  });

  it('labels every option in plain words, with Other last', () => {
    for (const [key, field] of fieldsByKey) {
      const options = [...(field.options ?? [])].sort(
        (left, right) => left.position - right.position,
      );

      for (const option of options) {
        expect(abbreviationsIn(option.label), `${key}.${option.value}: ${option.label}`).toEqual([]);
        // Twenty 2.48 rejects the whole install on a comma in any option label.
        expect(option.label, `${key}.${option.value}`).not.toContain(',');
      }

      const live = options.filter((option) => !option.label.endsWith(DEPRECATED_SUFFIX));

      if (live.some((option) => option.value === OTHER)) {
        expect(options[options.length - 1].value, key).toBe(OTHER);
      }
    }
  });

  it('ships the Arabic of every field, object and card string through locales/ar-SA.json', () => {
    expect(() =>
      execFileSync('node', ['scripts/sync-locales.mjs', '--check'], {
        cwd: APP_DIRECTORY,
        stdio: 'pipe',
      }),
    ).not.toThrow();
  });
});
