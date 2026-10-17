import { defineLogicFunction } from 'twenty-sdk/define';
import { isDefined } from 'twenty-sdk/utils';

import { createTwentyApi, listRecords } from 'src/automation/api/twenty-api';
import {
  type CampaignToSync,
  syncCampaignTargets,
} from 'src/automation/packs/campaign-targets';
import { ensureRaidLog } from 'src/automation/packs/raid-log';
import { OBJECT_NAMES } from 'src/automation/records/object-names';
import { type ProjectRecord } from 'src/automation/records/record-types';
import { PROJECT_STATUS, PROJECT_TYPE } from 'src/objects/project.object';
import { isPackEnabled, PACK } from 'src/packs/pack-switch';

export const PACKS_SWEEP_UNIVERSAL_IDENTIFIER = '4e1e3464-6caa-41a9-ac75-ae14ce2fa956';

// The guarantee behind P1 and G1, from record state alone: every active project
// with an owner has its RAID log, and every active campaign's target list and
// Lead created statuses are current. Each pack stands down when switched off.
const handler = async () => {
  const api = createTwentyApi();
  const now = new Date();
  const activeProjects = await listRecords<ProjectRecord & CampaignToSync>(
    api.asApplication,
    OBJECT_NAMES.project,
    `status[eq]:${PROJECT_STATUS.ACTIVE}`,
  );
  let raidLogs = 0;
  let campaigns = 0;

  if (isPackEnabled(PACK.PM)) {
    for (const project of activeProjects.filter(({ ownerId }) => isDefined(ownerId))) {
      await ensureRaidLog(api, project.id);
      raidLogs++;
    }
  }

  if (isPackEnabled(PACK.GTM)) {
    for (const campaign of activeProjects.filter(
      ({ playbookType }) => playbookType === PROJECT_TYPE.GTM_CAMPAIGN,
    )) {
      await syncCampaignTargets({ api, campaign, now });
      campaigns++;
    }
  }

  console.log(`packs sweep: ${raidLogs} projects checked for a RAID log, ${campaigns} campaigns synced`);

  return { raidLogs, campaigns };
};

export default defineLogicFunction({
  universalIdentifier: PACKS_SWEEP_UNIVERSAL_IDENTIFIER,
  name: 'packs-sweep',
  description:
    'Daily: repairs the PM pack RAID log notes and the GTM pack campaign target lists from record state; each pack stands down when its variable is off',
  timeoutSeconds: 600,
  handler,
  cronTriggerSettings: {
    // 05:30 Asia/Dubai, before the working day
    pattern: '30 1 * * *',
  },
});
