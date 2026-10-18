import type { Locale } from '@/i18n/messages';

export type Bilingual = Record<Locale, string>;

export const PERSONA_ROLE = {
  BD_OFFICER: 'BD_OFFICER',
  ED: 'ED',
  OPS_COORDINATOR: 'OPS_COORDINATOR',
  TECHNICAL_CONTRIBUTOR: 'TECHNICAL_CONTRIBUTOR',
} as const;

export type PersonaRole = (typeof PERSONA_ROLE)[keyof typeof PERSONA_ROLE];

export type Persona = {
  id: string;
  name: Bilingual;
  firstName: Bilingual;
  role: PersonaRole;
  roleLabel: Bilingual;
};

export const WORK_PACKAGE_STATUS = {
  PLANNED: 'PLANNED',
  OFFERED: 'OFFERED',
  ACCEPTED: 'ACCEPTED',
  SUBMITTED: 'SUBMITTED',
  BLOCKED: 'BLOCKED',
  DONE: 'DONE',
  DECLINED: 'DECLINED',
  CANCELLED: 'CANCELLED',
} as const;

export type WorkPackageStatus = (typeof WORK_PACKAGE_STATUS)[keyof typeof WORK_PACKAGE_STATUS];

export type WorkPackage = {
  id: string;
  title: Bilingual;
  caseId: string;
  ownerId: string;
  reviewerId: string | null;
  status: WorkPackageStatus;
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

export const OPPORTUNITY_STAGE = {
  QUALIFY: 'QUALIFY',
  SCOPE: 'SCOPE',
  PROPOSE: 'PROPOSE',
  NEGOTIATE: 'NEGOTIATE',
  SIGNED: 'SIGNED',
} as const;

export type OpportunityStage = (typeof OPPORTUNITY_STAGE)[keyof typeof OPPORTUNITY_STAGE];

export const OPPORTUNITY_STAGE_ORDER: OpportunityStage[] = ['QUALIFY', 'SCOPE', 'PROPOSE', 'NEGOTIATE', 'SIGNED'];

export type Opportunity = {
  id: string;
  name: Bilingual;
  company: Bilingual;
  stage: OpportunityStage;
  valueAed: number;
  ownerId: string;
  nextAction: Bilingual | null;
  nextActionDate: string | null;
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
  caseId: string;
  workPackageId: string | null;
};
