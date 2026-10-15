import {
  defineField,
  FieldType,
  MetadataWritability,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

export const PLAYBOOK_APPLIED_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER = '060d46de-608f-4155-92c6-281bea94d263';

export default defineField({
  universalIdentifier: PLAYBOOK_APPLIED_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.opportunity.universalIdentifier,
  type: FieldType.BOOLEAN,
  name: 'playbookApplied',
  label: 'Playbook applied',
  icon: 'IconRoute',
  isNullable: false,
  defaultValue: false,
  writability: MetadataWritability.APPLICATION,
});
