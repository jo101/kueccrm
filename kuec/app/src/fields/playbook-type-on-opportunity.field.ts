import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

export const PLAYBOOK_TYPE_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER = 'a20b8831-fa86-4478-9410-e6b145787cc6';

// Values are the playbook keys in playbooks/templates.json.
export const OPPORTUNITY_PLAYBOOK_TYPE = {
  TECHNOLOGY_LICENSING: 'TECHNOLOGY_LICENSING',
  RFQ_TECHNICAL_SERVICE: 'RFQ_TECHNICAL_SERVICE',
} as const;

export type OpportunityPlaybookType =
  (typeof OPPORTUNITY_PLAYBOOK_TYPE)[keyof typeof OPPORTUNITY_PLAYBOOK_TYPE];

// `type` is a reserved field name in Twenty, hence playbookType.
export default defineField({
  universalIdentifier: PLAYBOOK_TYPE_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.opportunity.universalIdentifier,
  type: FieldType.SELECT,
  name: 'playbookType',
  label: 'Type',
  icon: 'IconCategory',
  options: [
    {
      id: 'ee68de31-6841-4697-8771-7554f914c3eb',
      value: OPPORTUNITY_PLAYBOOK_TYPE.TECHNOLOGY_LICENSING,
      label: 'Licence',
      position: 0,
      color: 'purple',
    },
    {
      id: '30af4820-8497-4ca2-9dca-d2403ae831a7',
      value: OPPORTUNITY_PLAYBOOK_TYPE.RFQ_TECHNICAL_SERVICE,
      label: 'RFQ / technical service',
      position: 1,
      color: 'blue',
    },
  ],
});
