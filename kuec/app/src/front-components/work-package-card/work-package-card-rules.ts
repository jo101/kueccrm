import { isNonEmptyString } from '@sniptt/guards';

import {
  dueAtOnDate,
  toDubaiDateString,
} from 'src/automation/dates/business-days';
import {
  WORK_PACKAGE_STATUS,
  type WorkPackageStatus,
} from 'src/objects/work-package.object';

export type CardMember = {
  id: string;
  firstName: string;
};

export type CardWorkPackage = {
  id: string;
  name: string;
  status: WorkPackageStatus;
  dueAt: string | null;
  objective: string | null;
  expectedOutput: string | null;
  doneCriteria: string | null;
  owner: CardMember | null;
  reviewer: CardMember | null;
  caseName: string | null;
};

export const CARD_ACTION = {
  ACCEPT: 'ACCEPT',
  DECLINE: 'DECLINE',
  REQUEST_HELP: 'REQUEST_HELP',
  SUBMIT: 'SUBMIT',
} as const;

export type CardAction = (typeof CARD_ACTION)[keyof typeof CARD_ACTION];

// The status each action is offered for; a write is refused when the record
// has moved on since the card was rendered.
export const STATUS_REQUIRED_BY_ACTION: Record<CardAction, WorkPackageStatus> = {
  [CARD_ACTION.ACCEPT]: WORK_PACKAGE_STATUS.OFFERED,
  [CARD_ACTION.DECLINE]: WORK_PACKAGE_STATUS.OFFERED,
  [CARD_ACTION.REQUEST_HELP]: WORK_PACKAGE_STATUS.ACCEPTED,
  [CARD_ACTION.SUBMIT]: WORK_PACKAGE_STATUS.ACCEPTED,
};

export const REASON_MAX_LENGTH = 200;

export const getAvailableCardActions = ({
  workPackage,
  viewerMemberId,
}: {
  workPackage: Pick<CardWorkPackage, 'status' | 'owner'>;
  viewerMemberId: string | null;
}): CardAction[] => {
  if (workPackage.owner === null || workPackage.owner.id !== viewerMemberId) {
    return [];
  }

  return (Object.keys(STATUS_REQUIRED_BY_ACTION) as CardAction[]).filter(
    (action) => STATUS_REQUIRED_BY_ACTION[action] === workPackage.status,
  );
};

// One line, so it reads as a sentence in the ED's list and in notifications.
export const toOneLine = (text: string): string =>
  text.replace(/\s+/g, ' ').trim().slice(0, REASON_MAX_LENGTH);

export const isOneLineTextValid = (text: string): boolean =>
  isNonEmptyString(toOneLine(text));

export const buildAcceptUpdate = (now: Date) => ({
  status: WORK_PACKAGE_STATUS.ACCEPTED,
  acceptedAt: now.toISOString(),
});

export const buildDeclineUpdate = (reason: string) => ({
  status: WORK_PACKAGE_STATUS.DECLINED,
  declinedReason: toOneLine(reason),
});

export const buildSubmitUpdate = () => ({
  status: WORK_PACKAGE_STATUS.SUBMITTED,
});

export const buildHelpTask = ({
  workPackage,
  requester,
  helper,
  question,
  now,
}: {
  workPackage: Pick<CardWorkPackage, 'name' | 'caseName'>;
  requester: CardMember;
  helper: CardMember;
  question: string;
  now: Date;
}) => ({
  title: `Help needed: ${workPackage.name}`,
  assigneeId: helper.id,
  status: 'TODO' as const,
  dueAt: dueAtOnDate(toDubaiDateString(now)).toISOString(),
  bodyV2: {
    markdown: [
      `${requester.firstName} asked for help on ${workPackage.name}${
        isNonEmptyString(workPackage.caseName) ? ` (${workPackage.caseName})` : ''
      }.`,
      `Question: ${toOneLine(question)}`,
      `The owner stays ${requester.firstName}.`,
    ].join('\n\n'),
  },
});
