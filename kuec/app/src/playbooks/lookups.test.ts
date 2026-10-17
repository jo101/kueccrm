import { join } from 'node:path';

import {
  type defineField,
  type defineObject,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';
import { beforeAll, describe, expect, it } from 'vitest';

import { loadDefaultExports } from 'src/__tests__/utils/load-default-exports';
import {
  OPPORTUNITY_PLAYBOOK_TYPE,
  OPPORTUNITY_TYPE,
} from 'src/fields/playbook-type-on-opportunity.field';
import { PROJECT_TEMPLATE_TYPE, PROJECT_TYPE } from 'src/objects/project.object';
import lookupsJson from 'src/playbooks/lookups.json';

type ObjectDefinition = ReturnType<typeof defineObject>;
type FieldDefinition = ReturnType<typeof defineField>;

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
  options: LookupOption[];
};

type ManifestField = {
  name: string;
  type: string;
  options: { value: string; label: string; position: number }[];
};

const LISTS = lookupsJson.lists as LookupList[];
const DEPRECATED_SUFFIX = ' (deprecated)';
const OTHER = 'OTHER';


const standardObjectNameByUniversalIdentifier = new Map<string, string>(
  Object.entries(STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS).map(([name, object]) => [
    object.universalIdentifier,
    name,
  ]),
);

const isSentence = (text: string) =>
  text.trim() === text && text.length > 0 && !/[.!?؟]\s/.test(text.slice(0, -1));

describe('lookups.json', () => {
  const fieldsByKey = new Map<string, ManifestField>();

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
      for (const field of object.config.fields ?? []) {
        fieldsByKey.set(`${object.config.nameSingular}.${field.name}`, field as ManifestField);
      }
    }

    for (const field of fields) {
      const objectName = standardObjectNameByUniversalIdentifier.get(
        field.config.objectUniversalIdentifier,
      );

      if (objectName !== undefined) {
        fieldsByKey.set(`${objectName}.${field.config.name}`, field.config as ManifestField);
      }
    }
  });

  it('holds every list once, each value once', () => {
    const keys = LISTS.map((list) => list.key);

    expect(new Set(keys).size).toBe(keys.length);

    for (const list of LISTS) {
      const values = list.options.map((option) => option.value);

      expect(new Set(values).size, list.key).toBe(values.length);
    }
  });

  it('ends every list with Other, the only option that requires a note', () => {
    for (const list of LISTS) {
      const last = list.options[list.options.length - 1];

      expect(last?.value, list.key).toBe(OTHER);
      expect(
        list.options.filter((option) => option.requiresNote).map((option) => option.value),
        list.key,
      ).toEqual([OTHER]);
    }
  });

  it('gives every option a label and a one-sentence description in English and Arabic', () => {
    for (const list of LISTS) {
      for (const option of list.options) {
        const where = `${list.key}.${option.value}`;

        for (const text of [option.label.en, option.label.ar]) {
          expect(text.trim().length, where).toBeGreaterThan(0);
        }

        for (const text of [option.description.en, option.description.ar]) {
          expect(isSentence(text), `${where}: ${text}`).toBe(true);
          expect(text.endsWith('.'), `${where}: ${text}`).toBe(true);
        }
      }
    }
  });

  it('deprecates by relabelling and points every deprecated option at live ones', () => {
    for (const list of LISTS) {
      const activeValues = list.options
        .filter((option) => option.status === 'active')
        .map((option) => option.value);

      for (const option of list.options.filter((candidate) => candidate.status === 'deprecated')) {
        const where = `${list.key}.${option.value}`;

        expect(option.label.en.endsWith(DEPRECATED_SUFFIX), where).toBe(true);
        expect(option.deprecatedOn, where).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        expect(option.replacedBy?.length, where).toBeGreaterThan(0);

        for (const replacement of option.replacedBy ?? []) {
          expect(activeValues, where).toContain(replacement);
        }
      }
    }
  });

  it('matches the select options of the manifest, value, label and order', () => {
    for (const list of LISTS) {
      for (const twentyField of list.twentyFields) {
        const key = `${twentyField.object}.${twentyField.field}`;
        const field = fieldsByKey.get(key);

        expect(field, key).toBeDefined();
        expect(field?.type, key).toBe(twentyField.type);
        expect(
          [...(field?.options ?? [])]
            .sort((left, right) => left.position - right.position)
            .map(({ value, label }) => ({ value, label })),
          key,
        ).toEqual(list.options.map(({ value, label }) => ({ value, label: label.en })));
      }
    }
  });

  it('gives every object with an Other option an Other details text field', () => {
    for (const list of LISTS) {
      for (const twentyField of list.twentyFields) {
        const key = `${twentyField.object}.otherDetails`;

        expect(fieldsByKey.get(key)?.type, key).toBe(FieldType.TEXT);
      }
    }
  });

  it('keeps the playbook and template types inside their lists', () => {
    expect(Object.values(OPPORTUNITY_TYPE)).toEqual(
      expect.arrayContaining(Object.values(OPPORTUNITY_PLAYBOOK_TYPE)),
    );
    expect(Object.values(PROJECT_TYPE)).toEqual(
      expect.arrayContaining(Object.values(PROJECT_TEMPLATE_TYPE)),
    );
  });
});
