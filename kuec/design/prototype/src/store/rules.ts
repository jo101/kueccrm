import type { Persona, WorkPackage, WorkPackageStatus } from '@/data/model';
import { daysBetweenInGulf, workingDaysBetweenInGulf } from '@/i18n/format';
import type { KuecStatusTone } from '@/theme/kuec-theme';

export const CARD_ACTION = {
  ACCEPT: 'ACCEPT',
  DECLINE: 'DECLINE',
  REQUEST_HELP: 'REQUEST_HELP',
  SUBMIT: 'SUBMIT',
  APPROVE: 'APPROVE',
  SEND_BACK: 'SEND_BACK',
  RESOLVE_BLOCKER: 'RESOLVE_BLOCKER',
  REASSIGN: 'REASSIGN',
} as const;

export type CardAction = (typeof CARD_ACTION)[keyof typeof CARD_ACTION];

const OPEN_STATUSES: WorkPackageStatus[] = ['PLANNED', 'OFFERED', 'ACCEPTED', 'SUBMITTED', 'BLOCKED'];

export const isOpenStatus = (status: WorkPackageStatus): boolean => OPEN_STATUSES.includes(status);

// The brief's matrix (section 6 E): owner Accept, Decline, Request help, Submit,
// Resolve blocker; reviewer Approve, Send back; ops coordinator and ED Reassign.
// The first action returned is the primary one.
export const getAvailableActions = (workPackage: WorkPackage, viewer: Persona): CardAction[] => {
  const actions: CardAction[] = [];
  const isOwner = workPackage.ownerId === viewer.id;
  const isReviewer = workPackage.reviewerId === viewer.id;
  const canReassign = viewer.role === 'ED' || viewer.role === 'OPS_COORDINATOR';

  if (isOwner && workPackage.status === 'OFFERED') {
    actions.push(CARD_ACTION.ACCEPT, CARD_ACTION.DECLINE);
  }
  if (isOwner && workPackage.status === 'ACCEPTED') {
    actions.push(CARD_ACTION.SUBMIT);
  }
  if (isReviewer && workPackage.status === 'SUBMITTED') {
    actions.push(CARD_ACTION.APPROVE, CARD_ACTION.SEND_BACK);
  }
  if (isOwner && workPackage.status === 'BLOCKED') {
    actions.push(CARD_ACTION.RESOLVE_BLOCKER);
  }
  if (isOwner && isOpenStatus(workPackage.status)) {
    actions.push(CARD_ACTION.REQUEST_HELP);
  }
  if (canReassign && isOpenStatus(workPackage.status)) {
    actions.push(CARD_ACTION.REASSIGN);
  }

  return actions;
};

export const getStatusTone = (status: WorkPackageStatus, dueAt: string, nowIso: string): KuecStatusTone => {
  if (status === 'BLOCKED') {
    return 'blocked';
  }
  if (status === 'DONE' || status === 'CANCELLED' || status === 'DECLINED') {
    return 'done';
  }
  if (daysBetweenInGulf(dueAt, nowIso) > 0) {
    return 'late';
  }
  if (status === 'OFFERED' || status === 'SUBMITTED') {
    return 'waiting';
  }

  return 'onTrack';
};

export type DueLabel =
  | { kind: 'today' }
  | { kind: 'tomorrow' }
  | { kind: 'late'; days: number }
  | { kind: 'inDays'; days: number }
  | { kind: 'date' };

export const getDueLabel = (dueAt: string, nowIso: string): DueLabel => {
  const days = daysBetweenInGulf(nowIso, dueAt);
  if (days < 0) {
    return { kind: 'late', days: -days };
  }
  if (days === 0) {
    return { kind: 'today' };
  }
  if (days === 1) {
    return { kind: 'tomorrow' };
  }
  if (days <= 7) {
    return { kind: 'inDays', days };
  }

  return { kind: 'date' };
};

export const ACCEPTANCE_REMINDER_WORKING_DAYS = 2;

export const getWaitingWorkingDays = (workPackage: WorkPackage, nowIso: string): number =>
  workPackage.status === 'OFFERED' && workPackage.offeredAt !== null
    ? workingDaysBetweenInGulf(workPackage.offeredAt, nowIso)
    : 0;

export type ExceptionKind = 'blocked' | 'late' | 'notAccepted';

export const getExceptionKind = (workPackage: WorkPackage, nowIso: string): ExceptionKind | null => {
  if (workPackage.status === 'BLOCKED') {
    return 'blocked';
  }
  if (isOpenStatus(workPackage.status) && daysBetweenInGulf(workPackage.dueAt, nowIso) > 0) {
    return 'late';
  }
  if (getWaitingWorkingDays(workPackage, nowIso) >= ACCEPTANCE_REMINDER_WORKING_DAYS) {
    return 'notAccepted';
  }

  return null;
};

export const REASON_MIN_WORDS = 3;

export const isReasonValid = (text: string): boolean => text.trim().split(/\s+/).filter(Boolean).length >= REASON_MIN_WORDS;

export const isOutputLinkValid = (text: string): boolean => /^https:\/\/\S+\.(sharepoint|uventure)\.\S+/i.test(text.trim());
