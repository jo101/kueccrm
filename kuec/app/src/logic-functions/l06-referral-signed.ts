import { defineLogicFunction } from 'twenty-sdk/define';
import {
  type DatabaseEventPayload,
  type ObjectRecordUpdateEvent,
} from 'twenty-sdk/logic-function';
import { isDefined } from 'twenty-sdk/utils';

import { createTwentyApi, getRecord } from 'src/automation/api/twenty-api';
import { creditReferral } from 'src/automation/leads/credit-referral';
import { OBJECT_NAMES } from 'src/automation/records/object-names';
import {
  type LeadRecord,
  type OpportunityRecord,
} from 'src/automation/records/record-types';
import { OPPORTUNITY_STAGE } from 'src/constants/opportunity-stage';
import { isPackEnabled, PACK, packStandDown } from 'src/packs/pack-switch';

export const L06_REFERRAL_SIGNED_UNIVERSAL_IDENTIFIER = '0c4c6cb4-9feb-49ec-9e18-58d83f0e38d8';

const handler = async (
  event: DatabaseEventPayload<ObjectRecordUpdateEvent<OpportunityRecord>>,
) => {
  if (!isPackEnabled(PACK.CRM)) {
    return packStandDown(PACK.CRM);
  }

  const { before, after } = event.properties;

  if (after.stage !== OPPORTUNITY_STAGE.SIGNED || before.stage === OPPORTUNITY_STAGE.SIGNED) {
    return { skipped: 'not a transition to Signed' };
  }

  if (!isDefined(after.leadId)) {
    return { skipped: 'not converted from a lead' };
  }

  const api = createTwentyApi();
  const lead = await getRecord<LeadRecord>(api.asApplication, OBJECT_NAMES.lead, after.leadId);

  if (!isDefined(lead)) {
    return { skipped: 'lead gone' };
  }

  const credited = await creditReferral({
    api,
    lead,
    opportunity: after,
    now: new Date(),
  });

  return { credited };
};

export default defineLogicFunction({
  universalIdentifier: L06_REFERRAL_SIGNED_UNIVERSAL_IDENTIFIER,
  name: 'l06-referral-signed',
  description:
    "L6: an opportunity converted from a referred lead reaching Signed stamps the lead's referral credit (Team dashboard, Leads by referrer) and notes it on the referrer's record",
  timeoutSeconds: 60,
  handler,
  databaseEventTriggerSettings: {
    eventName: 'opportunity.updated',
    updatedFields: ['stage'],
  },
});
