import type { Locale } from '@/i18n/messages';

export type Bilingual = Record<Locale, string>;

export const PERSONA_ROLE = {
  BD_OFFICER: 'BD_OFFICER',
  ED: 'ED',
  OPS_COORDINATOR: 'OPS_COORDINATOR',
  TECHNICAL_CONTRIBUTOR: 'TECHNICAL_CONTRIBUTOR',
  LEADERSHIP_VIEWER: 'LEADERSHIP_VIEWER',
} as const;

export type PersonaRole = (typeof PERSONA_ROLE)[keyof typeof PERSONA_ROLE];

export type Persona = {
  id: string;
  name: Bilingual;
  firstName: Bilingual;
  role: PersonaRole;
  roleLabel: Bilingual;
};

export type Account = {
  id: string;
  name: Bilingual;
  sector: Bilingual;
  city: Bilingual;
};

export const DECISION_ROLE = {
  DECISION_MAKER: 'DECISION_MAKER',
  CHAMPION: 'CHAMPION',
  INFLUENCER: 'INFLUENCER',
  USER: 'USER',
  GATEKEEPER: 'GATEKEEPER',
} as const;

export type DecisionRole = (typeof DECISION_ROLE)[keyof typeof DECISION_ROLE];

export type Contact = {
  id: string;
  name: Bilingual;
  title: Bilingual;
  accountId: string;
  decisionRole: DecisionRole;
  email: string;
  phone: string;
};

// The Twenty object is workPackage; employees see it as a Task. API values are
// unchanged; the labels live in messages.ts (status.*).
export const TASK_STATUS = {
  PLANNED: 'PLANNED',
  OFFERED: 'OFFERED',
  ACCEPTED: 'ACCEPTED',
  SUBMITTED: 'SUBMITTED',
  BLOCKED: 'BLOCKED',
  DONE: 'DONE',
  DECLINED: 'DECLINED',
  CANCELLED: 'CANCELLED',
} as const;

export type TaskStatus = (typeof TASK_STATUS)[keyof typeof TASK_STATUS];

export type Task = {
  id: string;
  title: Bilingual;
  opportunityId: string;
  ownerId: string;
  reviewerId: string | null;
  status: TaskStatus;
  dueAt: string;
  offeredAt: string | null;
  stepNumber: number;
  stepTotal: number;
  objective: Bilingual;
  context: Bilingual;
  expectedOutput: Bilingual;
  doneCriteria: Bilingual[];
  blockedReason: Bilingual | null;
  outputLink: string | null;
};

// Twenty's stage API values stay; the labels are the brief's (stage.* in
// messages.ts). CUSTOMER is hidden; SIGNED, LOST and PARKED come from
// config/dashboards/opportunity-stages.md.
export const OPPORTUNITY_STAGE = {
  NEW: 'NEW',
  SCREENING: 'SCREENING',
  MEETING: 'MEETING',
  PROPOSAL: 'PROPOSAL',
  SIGNED: 'SIGNED',
  LOST: 'LOST',
  PARKED: 'PARKED',
} as const;

export type OpportunityStage = (typeof OPPORTUNITY_STAGE)[keyof typeof OPPORTUNITY_STAGE];

// The chevron path: Qualification, Discovery, Proposal, Negotiation, Closed Won.
export const OPPORTUNITY_STAGE_PATH: OpportunityStage[] = ['NEW', 'SCREENING', 'MEETING', 'PROPOSAL', 'SIGNED'];

export const CLOSED_STAGES: OpportunityStage[] = ['SIGNED', 'LOST'];

export const STAGE_PROBABILITY: Record<OpportunityStage, number> = {
  NEW: 0.1,
  SCREENING: 0.25,
  MEETING: 0.5,
  PROPOSAL: 0.75,
  SIGNED: 1,
  LOST: 0,
  PARKED: 0,
};

export const FORECAST_CATEGORY = {
  PIPELINE: 'PIPELINE',
  BEST_CASE: 'BEST_CASE',
  COMMIT: 'COMMIT',
  CLOSED: 'CLOSED',
  OMITTED: 'OMITTED',
} as const;

export type ForecastCategory = (typeof FORECAST_CATEGORY)[keyof typeof FORECAST_CATEGORY];

export type Opportunity = {
  id: string;
  name: Bilingual;
  accountId: string;
  stage: OpportunityStage;
  stageEnteredAt: string;
  amountAed: number;
  closeDate: string;
  probability: number;
  ownerId: string;
  nextStep: Bilingual | null;
  nextStepDate: string | null;
  leadSource: Bilingual;
  type: Bilingual;
  forecastCategory: ForecastCategory;
  description: Bilingual;
  capability: Bilingual | null;
  keyContactIds: string[];
};

export const ACTIVITY_KIND = {
  CALL: 'CALL',
  MEETING: 'MEETING',
  SITE_VISIT: 'SITE_VISIT',
  EMAIL: 'EMAIL',
  EVENT: 'EVENT',
  SYSTEM: 'SYSTEM',
} as const;

export type ActivityKind = (typeof ACTIVITY_KIND)[keyof typeof ACTIVITY_KIND];

export type Activity = {
  id: string;
  kind: ActivityKind;
  opportunityId: string;
  at: string;
  byId: string | null;
  summary: Bilingual;
  contactIds: string[];
};

export const DOCUMENT_TYPE = {
  PROPOSAL: 'PROPOSAL',
  NDA: 'NDA',
  TERM_SHEET: 'TERM_SHEET',
  MEETING_NOTES: 'MEETING_NOTES',
} as const;

export type DocumentType = (typeof DOCUMENT_TYPE)[keyof typeof DOCUMENT_TYPE];

export type Document = {
  id: string;
  name: Bilingual;
  type: DocumentType;
  opportunityId: string;
  link: string;
  updatedAt: string;
};

export type DecisionOption = {
  id: string;
  label: Bilingual;
  consequence: Bilingual;
};

export type Decision = {
  id: string;
  kind: 'routine' | 'material';
  title: Bilingual;
  blocked: Bilingual;
  consequence: Bilingual;
  options: DecisionOption[];
  recommendedOptionId: string;
  decideBy: string;
  affectedPersonIds: string[];
  opportunityId: string;
  taskId: string | null;
};

export type PerformanceTargets = {
  quarterTargetAed: number;
};
