import { defineLogicFunction } from 'twenty-sdk/define';
import {
  type DatabaseEventPayload,
  type ObjectRecordUpdateEvent,
} from 'twenty-sdk/logic-function';
import { isDefined } from 'twenty-sdk/utils';

import { createTwentyApi } from 'src/automation/api/twenty-api';
import { ensureRaidLog } from 'src/automation/packs/raid-log';
import { type ProjectRecord } from 'src/automation/records/record-types';
import { PROJECT_STATUS } from 'src/objects/project.object';
import { isPackEnabled, PACK, packStandDown } from 'src/packs/pack-switch';

export const P01_RAID_LOG_UNIVERSAL_IDENTIFIER = 'a4670a75-96c0-4db7-8bf2-7f2f9aaa3137';

// P1 (PM pack), the fast path: an active project with an owner gets its RAID
// log note. Gated on the owner, never on project.created, which fires before a
// person has filled the record; packs-sweep repairs a lost event.
const handler = async (event: DatabaseEventPayload<ObjectRecordUpdateEvent<ProjectRecord>>) => {
  if (!isPackEnabled(PACK.PM)) {
    return packStandDown(PACK.PM);
  }

  const { after } = event.properties;

  if (after.status !== PROJECT_STATUS.ACTIVE || !isDefined(after.ownerId)) {
    return { skipped: 'not an active project with an owner' };
  }

  await ensureRaidLog(createTwentyApi(), event.recordId);

  return { raidLog: event.recordId };
};

export default defineLogicFunction({
  universalIdentifier: P01_RAID_LOG_UNIVERSAL_IDENTIFIER,
  name: 'p01-raid-log',
  description:
    'P1, PM pack: an active project with an owner gets one RAID log note (risks, assumptions, issues, dependencies), kept current at the weekly review',
  timeoutSeconds: 30,
  handler,
  databaseEventTriggerSettings: {
    eventName: 'project.updated',
    updatedFields: ['ownerId', 'status'],
  },
});
