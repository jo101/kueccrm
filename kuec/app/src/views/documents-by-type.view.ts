import {
  AggregateOperations,
  defineView,
  ViewType,
} from 'twenty-sdk/define';
import { COMPANY_ON_DOCUMENT_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/company-on-document.field';
import { OWNER_ON_DOCUMENT_FIELD_UNIVERSAL_IDENTIFIER } from '../fields/owner-on-document.field';
import {
  DOCUMENT_CONFIDENTIALITY_FIELD_UNIVERSAL_IDENTIFIER,
  DOCUMENT_KIND_FIELD_UNIVERSAL_IDENTIFIER,
  DOCUMENT_LINK_FIELD_UNIVERSAL_IDENTIFIER,
  DOCUMENT_NAME_FIELD_UNIVERSAL_IDENTIFIER,
  DOCUMENT_STATUS_FIELD_UNIVERSAL_IDENTIFIER,
  DOCUMENT_TYPE,
  DOCUMENT_UNIVERSAL_IDENTIFIER,
} from '../objects/document.object';

export const DOCUMENTS_BY_TYPE_VIEW_UNIVERSAL_IDENTIFIER = '62150a93-1d43-48b1-a5a2-75253e3be8fd';

// The Documents entry opens here. A row is the link and its metadata; the file stays on SharePoint or in uVENTURE.
export default defineView({
  universalIdentifier: DOCUMENTS_BY_TYPE_VIEW_UNIVERSAL_IDENTIFIER,
  name: 'Documents by type',
  objectUniversalIdentifier: DOCUMENT_UNIVERSAL_IDENTIFIER,
  type: ViewType.TABLE,
  icon: 'IconCategory',
  position: 0,
  mainGroupByFieldMetadataUniversalIdentifier: DOCUMENT_KIND_FIELD_UNIVERSAL_IDENTIFIER,
  fields: [
    { universalIdentifier: '65efeb7b-c028-4be5-b37d-61de841efff1', fieldMetadataUniversalIdentifier: DOCUMENT_NAME_FIELD_UNIVERSAL_IDENTIFIER, position: 0, isVisible: true, size: 240, aggregateOperation: AggregateOperations.COUNT },
    { universalIdentifier: 'a61c452c-2af6-4de6-87a8-af2e4d1b12fd', fieldMetadataUniversalIdentifier: OWNER_ON_DOCUMENT_FIELD_UNIVERSAL_IDENTIFIER, position: 1, isVisible: true, size: 170 },
    { universalIdentifier: '9256b4d4-f5a9-4f26-bd55-d29291f4bc48', fieldMetadataUniversalIdentifier: DOCUMENT_STATUS_FIELD_UNIVERSAL_IDENTIFIER, position: 2, isVisible: true, size: 140 },
    { universalIdentifier: 'ec18aa04-24fe-41a5-be2a-5fec9d3a5067', fieldMetadataUniversalIdentifier: DOCUMENT_CONFIDENTIALITY_FIELD_UNIVERSAL_IDENTIFIER, position: 3, isVisible: true, size: 140 },
    { universalIdentifier: '78b1315b-f483-4c3c-a550-fa893d903f97', fieldMetadataUniversalIdentifier: DOCUMENT_LINK_FIELD_UNIVERSAL_IDENTIFIER, position: 4, isVisible: true, size: 240 },
    { universalIdentifier: 'd94df577-3049-4a05-9400-41395df0b373', fieldMetadataUniversalIdentifier: COMPANY_ON_DOCUMENT_FIELD_UNIVERSAL_IDENTIFIER, position: 5, isVisible: true, size: 170 },
  ],
  groups: [
    { universalIdentifier: '2f02f7fb-adf6-4cbd-bc4a-36b34b72ca07', fieldValue: DOCUMENT_TYPE.NDA, position: 0, isVisible: true },
    { universalIdentifier: '80053a6c-be95-4898-8f00-69b6941e352d', fieldValue: DOCUMENT_TYPE.MOU, position: 1, isVisible: true },
    { universalIdentifier: 'f8307002-9156-4751-a669-786bf1ab44d5', fieldValue: DOCUMENT_TYPE.MSA, position: 2, isVisible: true },
    { universalIdentifier: 'a24a6a4e-fa3e-4980-9fc8-4524e8d6dfaf', fieldValue: DOCUMENT_TYPE.PROPOSAL_OR_SOW, position: 3, isVisible: true },
    { universalIdentifier: 'cd7d3503-b40c-4853-8b25-c31be7faf85d', fieldValue: DOCUMENT_TYPE.QUOTE, position: 4, isVisible: true },
    { universalIdentifier: '00db35f6-b12c-46ac-b2ad-cc3b81c4a61f', fieldValue: DOCUMENT_TYPE.RFQ_OR_RFP_RECEIVED, position: 5, isVisible: true },
    { universalIdentifier: '035ad22d-9c43-4955-a892-195edcd4570a', fieldValue: DOCUMENT_TYPE.TECHNICAL_ASSESSMENT_REPORT, position: 6, isVisible: true },
    { universalIdentifier: '5bddcd13-eed0-47e9-a009-1bbfc99a440d', fieldValue: DOCUMENT_TYPE.TERM_SHEET, position: 7, isVisible: true },
    { universalIdentifier: '7f2d3bd3-4baa-4d5a-b87a-3574a148081f', fieldValue: DOCUMENT_TYPE.LICENCE_AGREEMENT, position: 8, isVisible: true },
    { universalIdentifier: 'dfb4e380-6355-4e9c-bd1d-e5bb7ba0e29f', fieldValue: DOCUMENT_TYPE.TSA, position: 9, isVisible: true },
    { universalIdentifier: 'd5ef2ea3-6564-4d77-9c34-893f2b99e907', fieldValue: DOCUMENT_TYPE.JDA, position: 10, isVisible: true },
    { universalIdentifier: '00f8e52d-536d-4008-8593-2e7481f24cc0', fieldValue: DOCUMENT_TYPE.SPONSORSHIP_AGREEMENT, position: 11, isVisible: true },
    { universalIdentifier: '4c19db36-42bf-4c69-881c-19db09867f35', fieldValue: DOCUMENT_TYPE.PITCH_DECK, position: 12, isVisible: true },
    { universalIdentifier: '91668842-ef58-4c82-b58a-89a65361c479', fieldValue: DOCUMENT_TYPE.ONE_PAGER, position: 13, isVisible: true },
    { universalIdentifier: '1f1f5747-d7b4-410a-a56d-47878904dd53', fieldValue: DOCUMENT_TYPE.WORKSHOP_REPORT, position: 14, isVisible: true },
    { universalIdentifier: '441b9b14-fc33-4c8d-bb7d-e1af18690a2b', fieldValue: DOCUMENT_TYPE.SITE_VISIT_REPORT, position: 15, isVisible: true },
    { universalIdentifier: 'f7934435-7c94-4cc0-a208-5b661de44a0a', fieldValue: DOCUMENT_TYPE.MEETING_MINUTES, position: 16, isVisible: true },
    { universalIdentifier: 'a50f03dd-1343-4216-a223-869aabcdc0a1', fieldValue: DOCUMENT_TYPE.PO_OR_INVOICE, position: 17, isVisible: true },
    { universalIdentifier: 'b3be0503-b4b8-4296-ab7b-1beb4d92240b', fieldValue: DOCUMENT_TYPE.OFFSET_DOCUMENTATION, position: 18, isVisible: true },
    { universalIdentifier: '2e65b8fe-25bc-484c-92a9-539ab2cf6f8c', fieldValue: DOCUMENT_TYPE.VENDOR_REGISTRATION_OR_KYC, position: 19, isVisible: true },
    { universalIdentifier: '576fafb3-2edd-4657-bc65-482c54e7711b', fieldValue: DOCUMENT_TYPE.FACULTY_PROFILE_OR_CV, position: 20, isVisible: true },
    { universalIdentifier: '5baa120e-2eb8-4482-94b7-aeeb547c9b5a', fieldValue: DOCUMENT_TYPE.OTHER, position: 21, isVisible: true },
  ],
});
