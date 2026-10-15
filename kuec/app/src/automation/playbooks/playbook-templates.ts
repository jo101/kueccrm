import { isDefined } from 'twenty-sdk/utils';

import { type PlaybookRole } from 'src/objects/playbook-role-assignment.object';
import projectTemplatesJson from 'src/playbooks/project-templates.json';
import templatesJson from 'src/playbooks/templates.json';

export type DueAnchorKey = 'CLIENT_DEADLINE' | 'EVENT_DATE';

export type WorkPackageTemplate = {
  key: string;
  title: string;
  objective: string;
  expectedOutput: string;
  doneCriteria: string;
  ownerRole: PlaybookRole;
  reviewerRole: PlaybookRole | null;
  dueOffsetDays: number | null;
  dueCap?: { anchor: DueAnchorKey; businessDaysBefore: number };
  dueAnchor?: { anchor: DueAnchorKey; businessDaysAfter: number };
};

export type MilestoneTemplate = {
  key: string;
  title: string;
  closedByWorkPackage: string;
};

export type CaseTemplate = {
  key: string;
  caseOwnerRole: PlaybookRole;
  workPackages: WorkPackageTemplate[];
  milestones: MilestoneTemplate[];
};

type PlaybooksFile = {
  playbooks: {
    key: string;
    caseOwnerRole: string;
    workPackages: WorkPackageTemplate[];
  }[];
};

type ProjectTemplatesFile = {
  templates: {
    key: string;
    caseOwnerRole: string;
    workPackagesFrom: string | null;
    workPackages: WorkPackageTemplate[];
    milestones: MilestoneTemplate[];
  }[];
};

// The JSON is validated by render-playbooks.ts and by playbook-templates.test.ts;
// here it is only narrowed to the shape the planner reads.
const PLAYBOOKS = (templatesJson as unknown as PlaybooksFile).playbooks;
const PROJECT_TEMPLATES = (projectTemplatesJson as unknown as ProjectTemplatesFile)
  .templates;

export const findOpportunityPlaybook = (key: string): CaseTemplate | null => {
  const playbook = PLAYBOOKS.find((candidate) => candidate.key === key);

  if (!isDefined(playbook)) {
    return null;
  }

  return {
    key: playbook.key,
    caseOwnerRole: playbook.caseOwnerRole as PlaybookRole,
    workPackages: playbook.workPackages,
    milestones: [],
  };
};

export const findProjectTemplate = (key: string): CaseTemplate | null => {
  const template = PROJECT_TEMPLATES.find((candidate) => candidate.key === key);

  if (!isDefined(template)) {
    return null;
  }

  const workPackages = isDefined(template.workPackagesFrom)
    ? (findOpportunityPlaybook(template.workPackagesFrom)?.workPackages ?? [])
    : template.workPackages;

  return {
    key: template.key,
    caseOwnerRole: template.caseOwnerRole as PlaybookRole,
    workPackages,
    milestones: template.milestones,
  };
};

export const parsePlaybookStep = (
  playbookStep: string,
): { caseTemplateKey: string; workPackageKey: string } | null => {
  const [caseTemplateKey, workPackageKey] = playbookStep.split('.');

  return isDefined(caseTemplateKey) && isDefined(workPackageKey)
    ? { caseTemplateKey, workPackageKey }
    : null;
};

export const findWorkPackageTemplate = (
  playbookStep: string,
): WorkPackageTemplate | null => {
  const parsed = parsePlaybookStep(playbookStep);

  if (!isDefined(parsed)) {
    return null;
  }

  const caseTemplate =
    findOpportunityPlaybook(parsed.caseTemplateKey) ??
    findProjectTemplate(parsed.caseTemplateKey);

  return (
    caseTemplate?.workPackages.find(
      (workPackage) => workPackage.key === parsed.workPackageKey,
    ) ?? null
  );
};

export const listCaseTemplateKeys = (): string[] => [
  ...PLAYBOOKS.map(({ key }) => key),
  ...PROJECT_TEMPLATES.map(({ key }) => key),
];
