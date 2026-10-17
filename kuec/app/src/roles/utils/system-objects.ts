import { STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS } from 'twenty-sdk/define';

const {
  taskTarget,
  noteTarget,
  timelineActivity,
  attachment,
  message,
  messageThread,
  messageParticipant,
  messageThreadTarget,
  calendarEvent,
  calendarEventParticipant,
  calendarEventTarget,
  callRecording,
} = STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS;

// System objects ignore the role-wide flags: without an explicit permission
// every role can read, change and destroy them (Twenty 2.48).

// Join rows behind "linked to" on tasks and notes. Removing a link deletes one,
// so roles that write tasks and notes keep delete here.
export const RECORD_LINK_OBJECT_UNIVERSAL_IDENTIFIERS = [
  taskTarget,
  noteTarget,
].map(({ universalIdentifier }) => universalIdentifier);

// History, files and synced mail and calendar. Twenty and the sync jobs write
// them; people only read them.
export const HISTORY_OBJECT_UNIVERSAL_IDENTIFIERS = [
  timelineActivity,
  attachment,
  message,
  messageThread,
  messageParticipant,
  messageThreadTarget,
  calendarEvent,
  calendarEventParticipant,
  calendarEventTarget,
  callRecording,
].map(({ universalIdentifier }) => universalIdentifier);
