import { type Money, type Phone } from './normalise.ts';

export type SourceReference = { fileName: string; rowNumber: number };

export const formatSources = (sources: SourceReference[]): string =>
  sources.map(({ fileName, rowNumber }) => `${fileName}:${rowNumber}`).join('; ');

export type ReportOutcome = 'merged' | 'ambiguous' | 'rejected' | 'warning';

export type ReportObject =
  | 'Company'
  | 'Person'
  | 'Opportunity'
  | 'Project'
  | 'Milestone'
  | 'Contract';

export type ReportEntry = {
  outcome: ReportOutcome;
  object: ReportObject;
  record: string;
  detail: string;
  sources: SourceReference[];
};

export type Report = {
  entries: ReportEntry[];
  add: (entry: ReportEntry) => void;
};

export const createReport = (): Report => {
  const entries: ReportEntry[] = [];

  return { entries, add: (entry) => entries.push(entry) };
};

// Lower rank wins when sources disagree: the register is the authority on a
// company, the pipeline sheet on the deals, exports and attendee lists last.
export const SOURCE_RANK = {
  register: 0,
  opportunities: 1,
  projects: 1,
  milestones: 1,
  contracts: 1,
  contacts: 2,
  workshops: 3,
} as const;

export type CompanyRecord = {
  id: string;
  name: string;
  domain: string | null;
  sector: string | null;
  sizeClass: string | null;
  isOffsetObligor: boolean | null;
  sources: SourceReference[];
};

export type PersonRecord = {
  id: string;
  firstName: string;
  lastName: string;
  email: string | null;
  jobTitle: string;
  phone: Phone | null;
  companyId: string | null;
  decisionRole: string | null;
  sources: SourceReference[];
};

export type OpportunityRecord = {
  id: string;
  name: string;
  companyId: string | null;
  pointOfContactId: string | null;
  ownerEmail: string;
  type: string | null;
  motion: string | null;
  stage: string;
  nextAction: string;
  nextActionDate: string | null;
  amount: Money | null;
  closeDate: string | null;
  probability: string | null;
  source: string | null;
  clientDeadline: string | null;
  sources: SourceReference[];
};

export type ProjectRecord = {
  id: string;
  name: string;
  type: string | null;
  status: string;
  ownerEmail: string | null;
  opportunityId: string | null;
  eventDate: string | null;
  endDate: string | null;
  sources: SourceReference[];
};

export type MilestoneRecord = {
  id: string;
  name: string;
  status: string;
  dueAt: string | null;
  ownerEmail: string | null;
  projectId: string;
  sources: SourceReference[];
};

export type ContractRecord = {
  id: string;
  name: string;
  kind: string | null;
  status: string;
  counterpartyId: string | null;
  opportunityId: string | null;
  ownerEmail: string | null;
  value: Money | null;
  signedOn: string | null;
  expiresOn: string | null;
  sharepointFolderUrl: string | null;
  sources: SourceReference[];
};

export type RejectedOpportunityRow = {
  fileName: string;
  rowNumber: number;
  headers: string[];
  values: Record<string, string>;
  reasons: string[];
};
