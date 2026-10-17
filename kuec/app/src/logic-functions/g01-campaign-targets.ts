import { defineLogicFunction } from 'twenty-sdk/define';
import {
  type DatabaseEventPayload,
  type ObjectRecordUpdateEvent,
} from 'twenty-sdk/logic-function';

import { createTwentyApi } from 'src/automation/api/twenty-api';
import {
  type CampaignToSync,
  syncCampaignTargets,
} from 'src/automation/packs/campaign-targets';
import { isTargetingCampaign } from 'src/automation/rules/campaign-targets.rule';
import { isPackEnabled, PACK, packStandDown } from 'src/packs/pack-switch';

export const G01_CAMPAIGN_TARGETS_UNIVERSAL_IDENTIFIER = 'dd04b6b7-4953-419c-9827-2fb979e02aa6';

// G1 (GTM pack), the fast path: setting a campaign's target sector or size
// class builds its target list; packs-sweep keeps it in step daily.
const handler = async (event: DatabaseEventPayload<ObjectRecordUpdateEvent<CampaignToSync>>) => {
  if (!isPackEnabled(PACK.GTM)) {
    return packStandDown(PACK.GTM);
  }

  const { after } = event.properties;

  if (!isTargetingCampaign(after)) {
    return { skipped: 'not an active go-to-market campaign with a target sector' };
  }

  return syncCampaignTargets({
    api: createTwentyApi(),
    campaign: { ...after, id: event.recordId },
    now: new Date(),
  });
};

export default defineLogicFunction({
  universalIdentifier: G01_CAMPAIGN_TARGETS_UNIVERSAL_IDENTIFIER,
  name: 'g01-campaign-targets',
  description:
    'G1, GTM pack: an active go-to-market campaign with a target sector gets a target list of the companies in that sector and size class, at most 500',
  timeoutSeconds: 300,
  handler,
  databaseEventTriggerSettings: {
    eventName: 'project.updated',
    updatedFields: ['targetSector', 'targetSizeClass', 'status', 'playbookType'],
  },
});
