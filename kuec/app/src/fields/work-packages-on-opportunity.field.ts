import {
  defineField,
  FieldType,
  RelationType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { WORK_PACKAGE_UNIVERSAL_IDENTIFIER } from '../objects/work-package.object';
import { OPPORTUNITY_ON_WORK_PACKAGE_FIELD_UNIVERSAL_IDENTIFIER } from './opportunity-on-work-package.field';
import { fieldDescription } from '../i18n/field-guidance';

export const WORK_PACKAGES_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER = '2b76e27a-fbfc-4daa-aaa3-a1b8d7464ef2';

export default defineField({
  universalIdentifier: WORK_PACKAGES_ON_OPPORTUNITY_FIELD_UNIVERSAL_IDENTIFIER,
  objectUniversalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.opportunity.universalIdentifier,
  type: FieldType.RELATION,
  name: 'workPackages',
  label: 'Work packages',
  description: fieldDescription('opportunity.workPackages'),
  icon: 'IconChecklist',
  relationTargetObjectMetadataUniversalIdentifier:
    WORK_PACKAGE_UNIVERSAL_IDENTIFIER,
  relationTargetFieldMetadataUniversalIdentifier: OPPORTUNITY_ON_WORK_PACKAGE_FIELD_UNIVERSAL_IDENTIFIER,
  universalSettings: {
    relationType: RelationType.ONE_TO_MANY,
  },
});
