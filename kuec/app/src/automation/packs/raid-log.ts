import { type TwentyApi } from 'src/automation/api/twenty-api';
import { createNoteOnce } from 'src/automation/notifications/notify';
import { OBJECT_NAMES } from 'src/automation/records/object-names';
import {
  RAID_LOG_NOTE_BODY,
  RAID_LOG_NOTE_TITLE,
} from 'src/packs/raid-log-template';

// P1: one RAID log note per project, ever; the key-value store remembers it,
// so the event and the daily sweep never add a second.
export const ensureRaidLog = (api: TwentyApi, projectId: string): Promise<void> =>
  createNoteOnce({
    api,
    title: RAID_LOG_NOTE_TITLE,
    body: RAID_LOG_NOTE_BODY,
    targets: [{ objectNameSingular: OBJECT_NAMES.project.singular, recordId: projectId }],
    dedupeKey: `raid-log:${projectId}`,
  });
