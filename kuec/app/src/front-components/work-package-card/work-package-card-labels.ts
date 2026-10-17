import { type TagColor } from 'twenty-ui/primitives/data-display';

import { toDubaiDateString } from 'src/automation/dates/business-days';
import {
  WORK_PACKAGE_STATUS,
  type WorkPackageStatus,
} from 'src/objects/work-package.object';

export const STATUS_BADGE_COLOR: Record<WorkPackageStatus, TagColor> = {
  [WORK_PACKAGE_STATUS.PLANNED]: 'gray',
  [WORK_PACKAGE_STATUS.OFFERED]: 'sky',
  [WORK_PACKAGE_STATUS.ACCEPTED]: 'blue',
  [WORK_PACKAGE_STATUS.SUBMITTED]: 'purple',
  [WORK_PACKAGE_STATUS.BLOCKED]: 'red',
  [WORK_PACKAGE_STATUS.DONE]: 'green',
  [WORK_PACKAGE_STATUS.DECLINED]: 'orange',
  [WORK_PACKAGE_STATUS.CANCELLED]: 'gray',
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
