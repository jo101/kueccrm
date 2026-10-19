import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';
import { fieldDescription } from '../i18n/field-guidance';

export const PLAYBOOK_TYPE_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER = 'a20b8831-fa86-4478-9410-e6b145787cc6';

export const OPPORTUNITY_TYPE = {
  TECHNOLOGY_LICENSING: 'TECHNOLOGY_LICENSING',
  SPINOUT_OR_STARTUP: 'SPINOUT_OR_STARTUP',
  RFQ_TECHNICAL_SERVICE: 'RFQ_TECHNICAL_SERVICE',
  LAB_TESTING: 'LAB_TESTING',
  EQUIPMENT_OR_FACILITY_ACCESS: 'EQUIPMENT_OR_FACILITY_ACCESS',
  LEASING: 'LEASING',
  RESEARCH_COLLABORATION: 'RESEARCH_COLLABORATION',
  INDUSTRY_PILOT: 'INDUSTRY_PILOT',
  CONSULTING_OR_ADVISORY: 'CONSULTING_OR_ADVISORY',
  TRAINING_OR_BOOTCAMP: 'TRAINING_OR_BOOTCAMP',
  SPONSORED_CHAIR: 'SPONSORED_CHAIR',
  PROGRAMME_SPONSORSHIP: 'PROGRAMME_SPONSORSHIP',
  GOVERNMENT_PROPOSAL_OR_GRANT: 'GOVERNMENT_PROPOSAL_OR_GRANT',
  OFFSET_OR_ICV_PROJECT: 'OFFSET_OR_ICV_PROJECT',
  PLATFORM_OR_PRODUCT_DELIVERY: 'PLATFORM_OR_PRODUCT_DELIVERY',
  PARTNERSHIP_OR_MOU: 'PARTNERSHIP_OR_MOU',
  INVESTMENT: 'INVESTMENT',
  OTHER: 'OTHER',
} as const;

// The types that start a playbook; values are the playbook keys in playbooks/templates.json.
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
  description: fieldDescription('opportunity.playbookType'),
  icon: 'IconCategory',
  options: [
    {
      id: 'ee68de31-6841-4697-8771-7554f914c3eb',
      value: OPPORTUNITY_TYPE.TECHNOLOGY_LICENSING,
      label: 'Licence',
      position: 0,
      color: 'purple',
    },
    {
      id: '30af4820-8497-4ca2-9dca-d2403ae831a7',
      value: OPPORTUNITY_TYPE.RFQ_TECHNICAL_SERVICE,
      label: 'Technical service (research as a service)',
      position: 1,
      color: 'blue',
    },
    {
      id: '04951334-2313-44be-90d6-d267698ae951',
      value: OPPORTUNITY_TYPE.LAB_TESTING,
      label: 'Lab testing',
      position: 2,
      color: 'orange',
    },
    {
      id: '3be66613-991e-4f68-bce4-12ddbf79a092',
      value: OPPORTUNITY_TYPE.EQUIPMENT_OR_FACILITY_ACCESS,
      label: 'Equipment or facility access',
      position: 3,
      color: 'turquoise',
    },
    {
      id: '68ac40c6-5190-47b2-af5d-df099199329e',
      value: OPPORTUNITY_TYPE.RESEARCH_COLLABORATION,
      label: 'Research collaboration or joint development',
      position: 4,
      color: 'sky',
    },
    {
      id: 'c3acb45f-efc8-4adc-971a-5114c8ced0ef',
      value: OPPORTUNITY_TYPE.CONSULTING_OR_ADVISORY,
      label: 'Consulting or advisory',
      position: 5,
      color: 'red',
    },
    {
      id: 'bd9078fe-b611-443b-82ea-2ad7661c785a',
      value: OPPORTUNITY_TYPE.INDUSTRY_PILOT,
      label: 'Industry pilot',
      position: 6,
      color: 'amber',
    },
    {
      id: 'd90ce4df-daa8-4750-bba4-0edff972377e',
      value: OPPORTUNITY_TYPE.TRAINING_OR_BOOTCAMP,
      label: 'Training or bootcamp',
      position: 7,
      color: 'violet',
    },
    {
      id: 'd50b6b98-aef8-43d6-a3af-f1be790b93d6',
      value: OPPORTUNITY_TYPE.SPINOUT_OR_STARTUP,
      label: 'Spinout or startup',
      position: 8,
      color: 'green',
    },
    {
      id: 'e950614a-dcd4-41c6-bac2-2439df96c5be',
      value: OPPORTUNITY_TYPE.LEASING,
      label: 'Leasing (space)',
      position: 9,
      color: 'pink',
    },
    {
      id: 'e986a18f-4351-4b4e-867d-39ca93f68eee',
      value: OPPORTUNITY_TYPE.SPONSORED_CHAIR,
      label: 'Sponsored chair',
      position: 10,
      color: 'jade',
    },
    {
      id: '75704b7c-45bf-40da-b5a0-8b118c28d938',
      value: OPPORTUNITY_TYPE.PROGRAMME_SPONSORSHIP,
      label: 'Programme sponsorship (workshop / sprint / fellowship)',
      position: 11,
      color: 'gold',
    },
    {
      id: 'eba8b0a9-dd7f-4351-af20-268db2963029',
      value: OPPORTUNITY_TYPE.GOVERNMENT_PROPOSAL_OR_GRANT,
      label: 'Government proposal or grant',
      position: 12,
      color: 'iris',
    },
    {
      id: 'aad351cd-2183-489b-9429-e21eed9ce68b',
      value: OPPORTUNITY_TYPE.OFFSET_OR_ICV_PROJECT,
      label: 'Offset or in-country value project',
      position: 13,
      color: 'tomato',
    },
    {
      id: '9abddbb1-343f-4397-a32f-eb0b2da8a1ca',
      value: OPPORTUNITY_TYPE.PLATFORM_OR_PRODUCT_DELIVERY,
      label: 'Platform or product delivery',
      position: 14,
      color: 'mint',
    },
    {
      id: 'ce092f4b-2fa7-4443-8f4f-99621f61859f',
      value: OPPORTUNITY_TYPE.PARTNERSHIP_OR_MOU,
      label: 'Partnership or memorandum of understanding',
      position: 15,
      color: 'plum',
    },
    {
      id: 'f748adba-fb75-4906-ba27-b1cf0f1819ea',
      value: OPPORTUNITY_TYPE.INVESTMENT,
      label: 'Investment (portfolio)',
      position: 16,
      color: 'cyan',
    },
    {
      id: '2d3e5838-688e-49e6-ac23-206c0d97e550',
      value: OPPORTUNITY_TYPE.OTHER,
      label: 'Other',
      position: 17,
      color: 'gray',
    },
  ],
});
