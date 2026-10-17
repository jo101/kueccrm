import {
  defineObject,
  FieldType,
  getFieldUniversalIdentifier,
} from 'twenty-sdk/define';
import { APPLICATION_UNIVERSAL_IDENTIFIER } from '../application.config';
import { fieldDescription, objectDescription } from '../i18n/field-guidance';

export const CAMPAIGN_TARGET_UNIVERSAL_IDENTIFIER = 'fc7bcf7a-8c97-4b99-acf7-828dd3d5ffa0';

export const CAMPAIGN_TARGET_STATUS = {
  TO_CONTACT: 'TO_CONTACT',
  CONTACTED: 'CONTACTED',
  RESPONDED: 'RESPONDED',
  LEAD_CREATED: 'LEAD_CREATED',
  NOT_INTERESTED: 'NOT_INTERESTED',
  DO_NOT_CONTACT: 'DO_NOT_CONTACT',
} as const;

export type CampaignTargetStatus =
  (typeof CAMPAIGN_TARGET_STATUS)[keyof typeof CAMPAIGN_TARGET_STATUS];

export const CAMPAIGN_TARGET_NAME_FIELD_UNIVERSAL_IDENTIFIER = '59cf5130-0231-4153-98f2-f210fb1db5be';
export const CAMPAIGN_TARGET_STATUS_FIELD_UNIVERSAL_IDENTIFIER = '922e8717-164e-480e-ba5c-fb50b1d9b304';

// Twenty adds these to every object; their identifiers are derived from the
// app, the object and the name, never declared.
const systemFieldUniversalIdentifier = (name: string): string =>
  getFieldUniversalIdentifier({
    applicationUniversalIdentifier: APPLICATION_UNIVERSAL_IDENTIFIER,
    objectUniversalIdentifier: CAMPAIGN_TARGET_UNIVERSAL_IDENTIFIER,
    name,
  });

export const CAMPAIGN_TARGET_CREATED_AT_FIELD_UNIVERSAL_IDENTIFIER = systemFieldUniversalIdentifier('createdAt');
export const CAMPAIGN_TARGET_UPDATED_AT_FIELD_UNIVERSAL_IDENTIFIER = systemFieldUniversalIdentifier('updatedAt');
export const CAMPAIGN_TARGET_CREATED_BY_FIELD_UNIVERSAL_IDENTIFIER = systemFieldUniversalIdentifier('createdBy');

// One company on a go-to-market campaign's target list. G1 builds the list
// from the companies whose sector and size class match the campaign; the
// campaign owner works it (runbooks/21-uventure-readiness.md section 5.3).
export default defineObject({
  universalIdentifier: CAMPAIGN_TARGET_UNIVERSAL_IDENTIFIER,
  nameSingular: 'campaignTarget',
  namePlural: 'campaignTargets',
  labelSingular: 'Campaign target',
  labelPlural: 'Campaign targets',
  description: objectDescription('campaignTarget'),
  icon: 'IconCrosshair',
  labelIdentifierFieldMetadataUniversalIdentifier:
    CAMPAIGN_TARGET_NAME_FIELD_UNIVERSAL_IDENTIFIER,
  fields: [
    {
      universalIdentifier: CAMPAIGN_TARGET_NAME_FIELD_UNIVERSAL_IDENTIFIER,
      type: FieldType.TEXT,
      name: 'name',
      label: 'Name',
      description: fieldDescription('campaignTarget.name'),
      icon: 'IconAbc',
    },
    {
      universalIdentifier: CAMPAIGN_TARGET_STATUS_FIELD_UNIVERSAL_IDENTIFIER,
      type: FieldType.SELECT,
      name: 'status',
      label: 'Status',
      description: fieldDescription('campaignTarget.status'),
      icon: 'IconProgressCheck',
      isNullable: false,
      defaultValue: `'${CAMPAIGN_TARGET_STATUS.TO_CONTACT}'`,
      options: [
        { id: 'b2d57431-8307-4c69-a3f3-bc9132362117', value: CAMPAIGN_TARGET_STATUS.TO_CONTACT, label: 'To contact', position: 0, color: 'sky' },
        { id: '5c9fe807-9caf-4b5e-9fd3-33d0d1cddb6c', value: CAMPAIGN_TARGET_STATUS.CONTACTED, label: 'Contacted', position: 1, color: 'blue' },
        { id: '927b000e-f36b-4091-aae4-565bbeb78344', value: CAMPAIGN_TARGET_STATUS.RESPONDED, label: 'Responded', position: 2, color: 'purple' },
        { id: 'c46d61b5-cfee-4392-a84f-492471ce66c8', value: CAMPAIGN_TARGET_STATUS.LEAD_CREATED, label: 'Lead created', position: 3, color: 'green' },
        { id: '3017a186-304e-41d7-8176-8a91e76a9786', value: CAMPAIGN_TARGET_STATUS.NOT_INTERESTED, label: 'Not interested', position: 4, color: 'gray' },
        { id: '292910d7-b99b-41dd-a8de-890de22c4b33', value: CAMPAIGN_TARGET_STATUS.DO_NOT_CONTACT, label: 'Do not contact', position: 5, color: 'red' },
      ],
    },
  ],
});
