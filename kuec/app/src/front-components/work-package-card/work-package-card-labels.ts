import { msg, type MessageDescriptor } from 'twenty-sdk/front-component';
import { type TagColor } from 'twenty-ui/primitives/data-display';

import { toDubaiDateString } from 'src/automation/dates/business-days';
import {
  WORK_PACKAGE_STATUS,
  type WorkPackageStatus,
} from 'src/objects/work-package.object';

// Plain words for each status; a first-week employee never meets an API value.
export const STATUS_BADGE: Record<
  WorkPackageStatus,
  { label: MessageDescriptor; color: TagColor }
> = {
  [WORK_PACKAGE_STATUS.PLANNED]: { label: msg('Not started'), color: 'gray' },
  [WORK_PACKAGE_STATUS.OFFERED]: { label: msg('Waiting to be accepted'), color: 'sky' },
  [WORK_PACKAGE_STATUS.ACCEPTED]: { label: msg('In progress'), color: 'blue' },
  [WORK_PACKAGE_STATUS.SUBMITTED]: { label: msg('Waiting for review'), color: 'purple' },
  [WORK_PACKAGE_STATUS.BLOCKED]: { label: msg('Blocked'), color: 'red' },
  [WORK_PACKAGE_STATUS.DONE]: { label: msg('Done'), color: 'green' },
  [WORK_PACKAGE_STATUS.DECLINED]: { label: msg('Declined'), color: 'orange' },
  [WORK_PACKAGE_STATUS.CANCELLED]: { label: msg('Stopped'), color: 'gray' },
};

// Shown in place of buttons when the viewer has nothing to do on this status.
export const STATUS_INFO: Record<WorkPackageStatus, MessageDescriptor> = {
  [WORK_PACKAGE_STATUS.PLANNED]: msg('This starts when the step before it is done.'),
  [WORK_PACKAGE_STATUS.OFFERED]: msg('Waiting for {firstName} to accept.'),
  [WORK_PACKAGE_STATUS.ACCEPTED]: msg('In progress with {firstName}.'),
  [WORK_PACKAGE_STATUS.SUBMITTED]: msg('Waiting for review.'),
  [WORK_PACKAGE_STATUS.BLOCKED]: msg('Blocked. The ED has been told.'),
  [WORK_PACKAGE_STATUS.DONE]: msg('Done.'),
  [WORK_PACKAGE_STATUS.DECLINED]: msg('Declined. The ED will give it to someone else.'),
  [WORK_PACKAGE_STATUS.CANCELLED]: msg('This work was stopped.'),
};

export type DueLabel = {
  isLate: boolean;
  date: string;
};

// Day boundaries are Asia/Dubai; Arabic keeps Western digits (UAE convention).
export const getDueLabel = ({
  dueAt,
  now,
  locale,
}: {
  dueAt: string | null;
  now: Date;
  locale: string;
}): DueLabel | null => {
  if (dueAt === null) {
    return null;
  }

  const due = new Date(dueAt);

  return {
    isLate: toDubaiDateString(due) < toDubaiDateString(now),
    date: new Intl.DateTimeFormat(locale, {
      timeZone: 'Asia/Dubai',
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      numberingSystem: 'latn',
    }).format(due),
  };
};
