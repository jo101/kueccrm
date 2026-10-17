import { join } from 'node:path';

import { isObject } from '@sniptt/guards';
import {
  type defineField,
  type definePageLayoutWidget,
  FieldType,
  RelationType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';
import { beforeAll, describe, expect, it } from 'vitest';

import { loadDefaultExports } from 'src/__tests__/utils/load-default-exports';
import { DOCUMENT_UNIVERSAL_IDENTIFIER } from 'src/objects/document.object';

type FieldDefinition = ReturnType<typeof defineField>;
type WidgetDefinition = ReturnType<typeof definePageLayoutWidget>;

// A member's owned documents have no record page to sit on.
const WORKSPACE_MEMBER_UNIVERSAL_IDENTIFIER =
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.workspaceMember.universalIdentifier;


describe('Documents record-page widgets', () => {
  let documentRelations: FieldDefinition['config'][] = [];
  let widgets: WidgetDefinition[] = [];

  beforeAll(async () => {
    const fields = await loadDefaultExports<FieldDefinition>(join(__dirname, '..', 'fields'), '.field.ts');

    documentRelations = fields
      .map((field) => field.config)
      .filter(
        (field) =>
          field.type === FieldType.RELATION &&
          field.relationTargetObjectMetadataUniversalIdentifier === DOCUMENT_UNIVERSAL_IDENTIFIER &&
          isObject(field.universalSettings) &&
          'relationType' in field.universalSettings &&
          field.universalSettings.relationType === RelationType.ONE_TO_MANY &&
          field.objectUniversalIdentifier !== WORKSPACE_MEMBER_UNIVERSAL_IDENTIFIER,
      );
    widgets = await loadDefaultExports<WidgetDefinition>(__dirname, '.page-layout-widget.ts');
  });

  it('give every record a document can be linked to one Documents card', () => {
    expect(documentRelations.map((field) => field.name)).toEqual(
      Array(6).fill('documents'),
    );

    for (const relation of documentRelations) {
      const cards = widgets.filter(
        ({ config }) =>
          config.configuration.configurationType === 'FIELD' &&
          config.configuration.fieldMetadataId === relation.universalIdentifier,
      );

      expect(cards, relation.objectUniversalIdentifier).toHaveLength(1);
      expect(cards[0].errors).toEqual([]);
      expect(cards[0].config).toMatchObject({
        title: 'Documents',
        objectUniversalIdentifier: relation.objectUniversalIdentifier,
        configuration: { fieldDisplayMode: 'CARD' },
      });
    }
  });
});
