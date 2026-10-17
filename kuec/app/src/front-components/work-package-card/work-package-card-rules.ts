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

export const OPEN_WORK_PACKAGE_STATUSES: readonly WorkPackageStatus[] = [
  WORK_PACKAGE_STATUS.PLANNED,
  WORK_PACKAGE_STATUS.OFFERED,
  WORK_PACKAGE_STATUS.ACCEPTED,
  WORK_PACKAGE_STATUS.SUBMITTED,
  WORK_PACKAGE_STATUS.BLOCKED,
];

// The statuses each action is offered for; a write is refused when the record
// has moved on since the card was rendered. Request help is the way out of
// "I don't know what to do", so the owner has it until the work is finished.
export const STATUSES_BY_ACTION: Record<CardAction, readonly WorkPackageStatus[]> = {
  [CARD_ACTION.ACCEPT]: [WORK_PACKAGE_STATUS.OFFERED],
  [CARD_ACTION.DECLINE]: [WORK_PACKAGE_STATUS.OFFERED],
  [CARD_ACTION.REQUEST_HELP]: OPEN_WORK_PACKAGE_STATUSES,
  [CARD_ACTION.SUBMIT]: [WORK_PACKAGE_STATUS.ACCEPTED],
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

  return (Object.keys(STATUSES_BY_ACTION) as CardAction[]).filter((action) =>
    STATUSES_BY_ACTION[action].includes(workPackage.status),
  );
};

export const CARD_NEXT_STEP = {
  DECLINE_FORM: 'DECLINE_FORM',
  HELP_FORM: 'HELP_FORM',
  OWNER: 'OWNER',
  FINISHED: 'FINISHED',
  NO_OWNER: 'NO_OWNER',
  REVIEWER: 'REVIEWER',
  SOMEONE_ELSE: 'SOMEONE_ELSE',
} as const;

export type CardNextStep = (typeof CARD_NEXT_STEP)[keyof typeof CARD_NEXT_STEP];

// Which "What do I do now?" line ends the card for this viewer.
export const getCardNextStep = ({
  workPackage,
  viewerMemberId,
  openForm,
}: {
  workPackage: Pick<CardWorkPackage, 'status' | 'owner' | 'reviewer'>;
  viewerMemberId: string | null;
  openForm: typeof CARD_ACTION.DECLINE | typeof CARD_ACTION.REQUEST_HELP | null;
}): CardNextStep => {
  if (openForm === CARD_ACTION.DECLINE) {
    return CARD_NEXT_STEP.DECLINE_FORM;
  }

  if (openForm === CARD_ACTION.REQUEST_HELP) {
    return CARD_NEXT_STEP.HELP_FORM;
  }

  if (!OPEN_WORK_PACKAGE_STATUSES.includes(workPackage.status)) {
    return CARD_NEXT_STEP.FINISHED;
  }

  if (workPackage.owner === null) {
    return CARD_NEXT_STEP.NO_OWNER;
  }

  if (workPackage.owner.id === viewerMemberId) {
    return CARD_NEXT_STEP.OWNER;
  }

  return workPackage.status === WORK_PACKAGE_STATUS.SUBMITTED &&
    workPackage.reviewer?.id === viewerMemberId
    ? CARD_NEXT_STEP.REVIEWER
    : CARD_NEXT_STEP.SOMEONE_ELSE;
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
