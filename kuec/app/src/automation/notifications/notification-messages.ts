import { composeNotificationMessage } from 'src/automation/notifications/compose-notification-message';

type MessageInput = { subject: string; link: string };

export const NOTIFICATION_MESSAGES = {
  workPackageOffered: ({ subject, link }: MessageInput) =>
    composeNotificationMessage({ lead: 'Offered to you, please accept or decline:', subject, link }),
  acceptanceReminder: ({ subject, link }: MessageInput) =>
    composeNotificationMessage({ lead: 'Not accepted after 2 business days:', subject, link }),
  reassignedToOpsCoordinator: ({ subject, link }: MessageInput) =>
    composeNotificationMessage({ lead: 'Unaccepted for 5 business days, reassigned to the ops coordinator:', subject, link }),
  overdueOwner: ({ subject, link }: MessageInput) =>
    composeNotificationMessage({ lead: 'Overdue today:', subject, link }),
  overdueEd: ({ subject, link }: MessageInput) =>
    composeNotificationMessage({ lead: 'Overdue 2 business days:', subject, link }),
  setNextAction: ({ subject, link }: MessageInput) =>
    composeNotificationMessage({ lead: 'Set a next action and date:', subject, link }),
  blocked: ({ subject, link, reason }: MessageInput & { reason: string | null }) =>
    composeNotificationMessage({
      lead: 'Blocked, decision needed:',
      subject,
      detail: `Reason: ${reason ?? 'none given'}.`,
      link,
    }),
  submittedForReview: ({ subject, link }: MessageInput) =>
    composeNotificationMessage({ lead: 'Submitted for your review:', subject, link }),
  opportunitySigned: ({ subject, link }: MessageInput) =>
    composeNotificationMessage({ lead: 'Signed:', subject, link }),
  playbookStarted: ({ subject, link }: MessageInput) =>
    composeNotificationMessage({ lead: 'Playbook started, work packages created:', subject, link }),
  closeProject: ({ subject, link }: MessageInput) =>
    composeNotificationMessage({ lead: 'All milestones done, please close the project:', subject, link }),
  leadTriage: ({ subject, link }: MessageInput) =>
    composeNotificationMessage({ lead: 'New lead, triage it by the next business day:', subject, link }),
  leadContactNudge: ({ subject, link }: MessageInput) =>
    composeNotificationMessage({ lead: 'Lead still New after 3 business days, contact them:', subject, link }),
  leadContactEd: ({ subject, link }: MessageInput) =>
    composeNotificationMessage({ lead: 'Lead still New after 7 business days:', subject, link }),
  leadAutoDead: ({ subject, link }: MessageInput) =>
    composeNotificationMessage({ lead: 'Closed after 30 quiet days, confirm or revive within 5 days:', subject, link }),
  leadQualified: ({ subject, link }: MessageInput) =>
    composeNotificationMessage({ lead: 'Lead qualified, convert or park it:', subject, link }),
  leadQualifiedForEd: ({ subject, link }: MessageInput) =>
    composeNotificationMessage({ lead: 'Licence-grade lead qualified:', subject, link }),
  thankReferrer: ({ subject, link }: MessageInput) =>
    composeNotificationMessage({ lead: 'Thank the referrer of:', subject, link }),
  recordDeadReason: ({ subject, link }: MessageInput) =>
    composeNotificationMessage({ lead: 'Record why this lead is dead:', subject, link }),
} as const;
