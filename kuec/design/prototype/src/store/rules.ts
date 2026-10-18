import { CLOSED_STAGES, OPPORTUNITY_STAGE_PATH, type Opportunity, type OpportunityStage, type Persona, type Task, type TaskStatus } from '@/data/model';
import { daysBetweenInGulf, workingDaysBetweenInGulf } from '@/i18n/format';
import { KUEC_STATUS_TONE, type KuecStatusTone } from '@/theme/kuec-tokens';

export const TASK_ACTION = {
  ACCEPT: 'ACCEPT',
  DECLINE: 'DECLINE',
  REQUEST_HELP: 'REQUEST_HELP',
  SUBMIT_FOR_REVIEW: 'SUBMIT_FOR_REVIEW',
  MARK_COMPLETE: 'MARK_COMPLETE',
  APPROVE: 'APPROVE',
  SEND_BACK: 'SEND_BACK',
  REPORT_BLOCKER: 'REPORT_BLOCKER',
  RESUME_WORK: 'RESUME_WORK',
  REASSIGN: 'REASSIGN',
} as const;

export type TaskAction = (typeof TASK_ACTION)[keyof typeof TASK_ACTION];

const OPEN_STATUSES: TaskStatus[] = ['PLANNED', 'OFFERED', 'ACCEPTED', 'SUBMITTED', 'BLOCKED'];

export const isOpenStatus = (status: TaskStatus): boolean => OPEN_STATUSES.includes(status);

export const canReassign = (viewer: Persona): boolean => viewer.role === 'ED' || viewer.role === 'OPS_COORDINATOR';

// Only the actions the role and the status allow (brief part 5). The first
// action returned is the primary one, the one thing to do now.
export const getTaskActions = (task: Task, viewer: Persona): TaskAction[] => {
  const actions: TaskAction[] = [];
  const isOwner = task.ownerId === viewer.id;
  const isReviewer = task.reviewerId === viewer.id;

  if (isOwner && task.status === 'OFFERED') {
    actions.push(TASK_ACTION.ACCEPT, TASK_ACTION.DECLINE);
  }
  if (isOwner && task.status === 'ACCEPTED') {
    actions.push(task.reviewerId === null ? TASK_ACTION.MARK_COMPLETE : TASK_ACTION.SUBMIT_FOR_REVIEW, TASK_ACTION.REPORT_BLOCKER);
  }
  if (isReviewer && task.status === 'SUBMITTED') {
    actions.push(TASK_ACTION.APPROVE, TASK_ACTION.SEND_BACK);
  }
  if (isOwner && task.status === 'BLOCKED') {
    actions.push(TASK_ACTION.RESUME_WORK);
  }
  if (isOwner && isOpenStatus(task.status)) {
    actions.push(TASK_ACTION.REQUEST_HELP);
  }
  if (canReassign(viewer) && isOpenStatus(task.status)) {
    actions.push(TASK_ACTION.REASSIGN);
  }

  return actions;
};

// Actions that need one line of text (or a person) before they write.
export const TASK_FORM_ACTIONS: TaskAction[] = [
  TASK_ACTION.DECLINE,
  TASK_ACTION.REQUEST_HELP,
  TASK_ACTION.SUBMIT_FOR_REVIEW,
  TASK_ACTION.MARK_COMPLETE,
  TASK_ACTION.SEND_BACK,
  TASK_ACTION.REPORT_BLOCKER,
  TASK_ACTION.REASSIGN,
];

export const isLate = (dueIso: string, nowIso: string): boolean => daysBetweenInGulf(dueIso, nowIso) > 0;

// The single status map (design/theme.md section 2): every state on every
// screen resolves to one of four tones.
export const getTaskTone = (task: Pick<Task, 'status' | 'dueAt'>, nowIso: string): KuecStatusTone => {
  if (task.status === 'BLOCKED') {
    return KUEC_STATUS_TONE.blocked;
  }
  if (task.status === 'DONE' || task.status === 'CANCELLED' || task.status === 'DECLINED' || task.status === 'PLANNED') {
    return KUEC_STATUS_TONE.neutral;
  }
  if (isLate(task.dueAt, nowIso)) {
    return KUEC_STATUS_TONE.blocked;
  }
  if (task.status === 'OFFERED' || task.status === 'SUBMITTED' || daysBetweenInGulf(nowIso, task.dueAt) === 0) {
    return KUEC_STATUS_TONE.attention;
  }

  return KUEC_STATUS_TONE.ok;
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

export const getWaitingWorkingDays = (task: Task, nowIso: string): number =>
  task.status === 'OFFERED' && task.offeredAt !== null ? workingDaysBetweenInGulf(task.offeredAt, nowIso) : 0;

export type ExceptionKind = 'blocked' | 'late' | 'notAccepted';

// What the ED and the operations coordinator see under Escalations.
export const getExceptionKind = (task: Task, nowIso: string): ExceptionKind | null => {
  if (task.status === 'BLOCKED') {
    return 'blocked';
  }
  if (isOpenStatus(task.status) && task.status !== 'PLANNED' && isLate(task.dueAt, nowIso)) {
    return 'late';
  }
  if (getWaitingWorkingDays(task, nowIso) >= ACCEPTANCE_REMINDER_WORKING_DAYS) {
    return 'notAccepted';
  }

  return null;
};

export type NextStepState = 'missing' | 'late' | 'today' | 'tomorrow' | 'soon' | 'later' | 'closed';

export const NEXT_STEP_HORIZON_DAYS = 7;

export const getNextStepState = (opportunity: Pick<Opportunity, 'stage' | 'nextStep' | 'nextStepDate'>, nowIso: string): NextStepState => {
  if (isClosedStage(opportunity.stage)) {
    return 'closed';
  }
  if (opportunity.nextStep === null || opportunity.nextStepDate === null) {
    return 'missing';
  }
  const days = daysBetweenInGulf(nowIso, opportunity.nextStepDate);
  if (days < 0) {
    return 'late';
  }
  if (days === 0) {
    return 'today';
  }
  if (days === 1) {
    return 'tomorrow';
  }

  return days <= NEXT_STEP_HORIZON_DAYS ? 'soon' : 'later';
};

export const getNextStepTone = (state: NextStepState): KuecStatusTone => {
  switch (state) {
    case 'missing':
    case 'late':
      return KUEC_STATUS_TONE.blocked;
    case 'today':
    case 'tomorrow':
      return KUEC_STATUS_TONE.attention;
    case 'closed':
      return KUEC_STATUS_TONE.neutral;
    default:
      return KUEC_STATUS_TONE.ok;
  }
};

export const getStageTone = (stage: OpportunityStage): KuecStatusTone => {
  if (stage === 'SIGNED') {
    return KUEC_STATUS_TONE.ok;
  }
  if (stage === 'LOST' || stage === 'PARKED') {
    return KUEC_STATUS_TONE.neutral;
  }

  return KUEC_STATUS_TONE.ok;
};

export const isClosedStage = (stage: OpportunityStage): boolean => CLOSED_STAGES.includes(stage);

export const isOpenOpportunity = (opportunity: Pick<Opportunity, 'stage'>): boolean => !isClosedStage(opportunity.stage) && opportunity.stage !== 'PARKED';

export const getNextStage = (stage: OpportunityStage): OpportunityStage | null => {
  const index = OPPORTUNITY_STAGE_PATH.indexOf(stage);
  if (index === -1 || index === OPPORTUNITY_STAGE_PATH.length - 1) {
    return null;
  }

  return OPPORTUNITY_STAGE_PATH[index + 1];
};

export const REASON_MIN_WORDS = 3;

export const isReasonValid = (text: string): boolean => text.trim().split(/\s+/).filter(Boolean).length >= REASON_MIN_WORDS;

export const isOutputLinkValid = (text: string): boolean => /^https:\/\/\S+\.(sharepoint|uventure)\.\S+/i.test(text.trim());

export const isNextStepValid = (text: string, dateIso: string | null, nowIso: string): boolean =>
  text.trim().length >= 3 && dateIso !== null && daysBetweenInGulf(nowIso, dateIso) >= 0;

// Current quarter in Gulf time, for the performance strip.
export const quarterBoundsInGulf = (nowIso: string): { start: string; end: string } => {
  const now = new Date(nowIso);
  const gulfNow = new Date(now.getTime() + 4 * 3_600_000);
  const quarterStartMonth = Math.floor(gulfNow.getUTCMonth() / 3) * 3;
  const start = new Date(Date.UTC(gulfNow.getUTCFullYear(), quarterStartMonth, 1) - 4 * 3_600_000);
  const end = new Date(Date.UTC(gulfNow.getUTCFullYear(), quarterStartMonth + 3, 1) - 4 * 3_600_000);

  return { start: start.toISOString(), end: end.toISOString() };
};
