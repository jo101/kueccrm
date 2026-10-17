import { type NotificationTarget } from 'src/automation/notifications/notify';
import { OBJECT_NAMES } from 'src/automation/records/object-names';

export const leadTarget = (leadId: string): NotificationTarget => ({
  objectNameSingular: OBJECT_NAMES.lead.singular,
  recordId: leadId,
});
