import {
  defineView,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
  ViewType,
} from 'twenty-sdk/define';
import { DECISION_ROLE_ON_PERSON_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/decision-role-on-person.field';
import { IS_CHAMPION_ON_PERSON_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/is-champion-on-person.field';

export const PEOPLE_EVERYTHING_VIEW_UNIVERSAL_IDENTIFIER = '963e9dff-c030-4ba6-a5a3-4c0f8e937dc6';

const personFields = STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.fields;

// Expert view: every column. 2.48 has no per-role view access; see runbooks/05-views.md.
export default defineView({
  universalIdentifier: PEOPLE_EVERYTHING_VIEW_UNIVERSAL_IDENTIFIER,
  name: 'Everything (expert)',
  objectUniversalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.universalIdentifier,
  type: ViewType.TABLE,
  icon: 'IconTable',
  position: 20,
  fields: [
    { universalIdentifier: '326ca8af-40f9-46c6-adcf-e52a277f1e95', fieldMetadataUniversalIdentifier: personFields.name.universalIdentifier, position: 0, isVisible: true, size: 240 },
    { universalIdentifier: 'd783c3ef-515d-4fe2-b4dd-8d608fc74616', fieldMetadataUniversalIdentifier: personFields.company.universalIdentifier, position: 1, isVisible: true, size: 170 },
    { universalIdentifier: 'b9f7bf03-e7f3-432e-945e-7bd0c0da1aed', fieldMetadataUniversalIdentifier: personFields.jobTitle.universalIdentifier, position: 2, isVisible: true, size: 220 },
    { universalIdentifier: 'ca125b7f-43cc-488f-bbe6-a6f64bf94348', fieldMetadataUniversalIdentifier: DECISION_ROLE_ON_PERSON_FIELD_UNIVERSAL_IDENTIFIER, position: 3, isVisible: true, size: 140 },
    { universalIdentifier: '54d4c884-5927-458b-8811-c3998f4c202c', fieldMetadataUniversalIdentifier: IS_CHAMPION_ON_PERSON_FIELD_UNIVERSAL_IDENTIFIER, position: 4, isVisible: true, size: 130 },
    { universalIdentifier: 'e28e5531-c3c0-4a57-a8d4-4600df2b34fa', fieldMetadataUniversalIdentifier: personFields.emails.universalIdentifier, position: 5, isVisible: true, size: 220 },
    { universalIdentifier: '904af53c-4460-4263-80b2-8bf60281f000', fieldMetadataUniversalIdentifier: personFields.phones.universalIdentifier, position: 6, isVisible: true, size: 220 },
    { universalIdentifier: '3dd831c5-0a87-48aa-8cfb-0f8bf564e107', fieldMetadataUniversalIdentifier: personFields.linkedinLink.universalIdentifier, position: 7, isVisible: true, size: 220 },
    { universalIdentifier: '51faac9e-bc1f-4c45-ae49-24a0fd7d74d1', fieldMetadataUniversalIdentifier: personFields.pointOfContactForOpportunities.universalIdentifier, position: 8, isVisible: true, size: 170 },
  ],
});
