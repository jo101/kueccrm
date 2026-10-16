import { normaliseText } from './normalise.ts';

export const SOURCE_KINDS = [
  'register',
  'contacts',
  'workshops',
  'opportunities',
  'projects',
  'milestones',
  'contracts',
] as const;

export type SourceKind = (typeof SOURCE_KINDS)[number];

const COMPANY_COLUMNS = {
  website: ['website', 'web site', 'web page', 'domain', 'url', 'company website', 'company domain'],
  sector: ['sector', 'industry', 'cluster', 'industry cluster', 'sector cluster'],
  sizeClass: ['size class', 'sizeclass', 'size', 'company size', 'size category', 'establishment size'],
  offsetObligor: ['offset obligor', 'offsetobligor', 'is offset obligor', 'offset', 'obligor', 'offset obligation'],
};

const PERSON_COLUMNS = {
  firstName: ['first name', 'firstname', 'given name', 'forename'],
  lastName: ['last name', 'lastname', 'surname', 'family name'],
  email: ['email', 'e mail', 'email address', 'e mail address', 'work email', 'business email', 'e mail 1 value', 'email 1'],
  jobTitle: ['job title', 'jobtitle', 'title', 'position', 'designation', 'role'],
  phone: ['phone', 'mobile', 'mobile phone', 'business phone', 'telephone', 'tel', 'phone number', 'primary phone'],
};

const OWNER = ['owner', 'bd owner', 'responsible', 'assigned to', 'lead owner'];

// Aliases are compared after normaliseText, so "E-mail Address" and
// "e mail address" are the same header. The first alias list a header
// matches wins; column-map.csv names a header explicitly when that guesses wrong.
export const SOURCE_COLUMN_ALIASES = {
  register: {
    company: ['company', 'company name', 'name', 'establishment', 'establishment name', 'entity', 'entity name', 'organisation', 'organization'],
    ...COMPANY_COLUMNS,
    contactName: ['contact name', 'contact person', 'contact'],
    contactEmail: ['contact email', 'contact e mail'],
    contactTitle: ['contact title', 'contact position', 'contact designation'],
  },
  contacts: {
    fullName: ['name', 'full name', 'contact name', 'display name'],
    ...PERSON_COLUMNS,
    company: ['company', 'company name', 'organisation', 'organization', 'employer', 'account', 'account name'],
    website: COMPANY_COLUMNS.website,
    sector: COMPANY_COLUMNS.sector,
  },
  workshops: {
    fullName: ['name', 'full name', 'attendee', 'attendee name', 'participant', 'participant name'],
    ...PERSON_COLUMNS,
    company: ['company', 'organisation', 'organization', 'entity', 'employer', 'company name'],
  },
  opportunities: {
    reference: ['opportunity id', 'opp id', 'ref', 'reference', 'id', 'deal id'],
    name: ['opportunity', 'opportunity name', 'name', 'deal', 'deal name', 'title'],
    company: ['company', 'client', 'account', 'customer', 'organisation', 'organization'],
    website: ['company website', 'client website', 'company domain', 'website', 'domain'],
    sector: COMPANY_COLUMNS.sector,
    offsetObligor: COMPANY_COLUMNS.offsetObligor,
    type: ['type', 'opportunity type', 'deal type'],
    motion: ['motion', 'sales motion', 'bd motion'],
    stage: ['stage', 'pipeline stage', 'status'],
    owner: OWNER,
    nextAction: ['next action', 'nextaction', 'next step', 'next steps'],
    nextActionDate: ['next action date', 'nextactiondate', 'next step date', 'next action due', 'follow up date', 'action date'],
    amount: ['amount', 'value', 'estimated value', 'deal value', 'value aed', 'amount aed'],
    currency: ['currency'],
    closeDate: ['close date', 'expected close date', 'expected close', 'target close date'],
    probability: ['probability', 'likelihood'],
    source: ['source', 'lead source', 'origin'],
    clientDeadline: ['client deadline', 'deadline', 'submission deadline', 'rfq deadline'],
    contactName: ['contact', 'contact name', 'point of contact', 'poc'],
    contactEmail: ['contact email', 'point of contact email', 'poc email'],
  },
  projects: {
    reference: ['project id', 'ref', 'reference', 'id'],
    name: ['project', 'project name', 'name'],
    type: ['type', 'project type'],
    status: ['status'],
    owner: OWNER,
    opportunity: ['opportunity', 'opportunity id', 'opp id', 'opportunity ref', 'opportunity name'],
    eventDate: ['event date', 'workshop date', 'date'],
    endDate: ['end date', 'finish date', 'target end date'],
  },
  milestones: {
    reference: ['milestone id', 'ref', 'reference', 'id'],
    project: ['project', 'project id', 'project ref', 'project name'],
    name: ['milestone', 'milestone name', 'name'],
    dueDate: ['due', 'due date', 'target date', 'date'],
    status: ['status'],
    owner: OWNER,
  },
  contracts: {
    reference: ['contract id', 'ref', 'reference', 'id'],
    name: ['contract', 'contract name', 'name', 'title'],
    kind: ['kind', 'type', 'contract type', 'agreement type'],
    status: ['status'],
    counterparty: ['counterparty', 'company', 'client', 'party'],
    opportunity: ['opportunity', 'opportunity id', 'opp id', 'opportunity ref', 'opportunity name'],
    value: ['value', 'amount', 'contract value'],
    currency: ['currency'],
    owner: OWNER,
    documentsLink: ['documents link', 'documentslink', 'sharepoint', 'sharepoint link', 'sharepoint folder', 'documents', 'link'],
    signedOn: ['signed on', 'signed date', 'signature date'],
    expiresOn: ['expires on', 'expiry date', 'expiry', 'end date'],
  },
} satisfies Record<SourceKind, Record<string, string[]>>;

export type SourceColumn<TKind extends SourceKind> =
  keyof (typeof SOURCE_COLUMN_ALIASES)[TKind] & string;

export type ColumnOverride = { kind: string; column: string; header: string };

export type ResolvedColumns<TKind extends SourceKind> = {
  headerByColumn: Partial<Record<SourceColumn<TKind>, string>>;
  unusedHeaders: string[];
};

export const resolveColumns = <TKind extends SourceKind>(
  kind: TKind,
  headers: string[],
  overrides: ColumnOverride[],
): ResolvedColumns<TKind> => {
  const aliasesByColumn: Record<string, string[]> = SOURCE_COLUMN_ALIASES[kind];
  const headerByColumn: Record<string, string> = {};
  const usedHeaders = new Set<string>();

  for (const override of overrides) {
    if (
      override.kind === kind &&
      override.column in aliasesByColumn &&
      headers.includes(override.header)
    ) {
      headerByColumn[override.column] = override.header;
      usedHeaders.add(override.header);
    }
  }

  for (const [column, aliases] of Object.entries(aliasesByColumn)) {
    if (column in headerByColumn) {
      continue;
    }

    const header = aliases
      .map((alias) =>
        headers.find(
          (candidate) =>
            !usedHeaders.has(candidate) && normaliseText(candidate) === alias,
        ),
      )
      .find((candidate) => candidate !== undefined);

    if (header !== undefined) {
      headerByColumn[column] = header;
      usedHeaders.add(header);
    }
  }

  return {
    headerByColumn: headerByColumn as Partial<Record<SourceColumn<TKind>, string>>,
    unusedHeaders: headers.filter((header) => !usedHeaders.has(header)),
  };
};
