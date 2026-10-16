import { type CompanyResolution } from './companies.ts';
import { type CsvRow, type CsvTable } from './csv.ts';
import { recordIdFromKey } from './ids.ts';
import {
  type ContractRecord,
  type MilestoneRecord,
  type OpportunityRecord,
  type ProjectRecord,
  type RejectedOpportunityRow,
  type Report,
  type ReportObject,
  type SourceReference,
} from './model.ts';
import { normaliseCompanyName, normaliseText, parseDate, parseMoney } from './normalise.ts';
import { type PersonResolution } from './people.ts';
import { CLOSED_STAGES, type SelectField } from './target-values.ts';
import { type ValueMapper } from './value-mapper.ts';

export type PipelineRow = {
  file: { fileName: string; table: CsvTable };
  row: CsvRow;
  read: (column: string) => string;
  companyMentionIndex: number | null;
  personMentionIndex: number | null;
};

export type OwnerDirectory = { findEmail: (owner: string) => string | null };

type PipelineContext = {
  today: string;
  owners: OwnerDirectory;
  valueMapper: ValueMapper;
  report: Report;
  companyResolutions: CompanyResolution[];
  personResolutions: PersonResolution[];
  companyNameById: Map<string, string>;
};

export type LookupResult =
  | { status: 'found'; id: string }
  | { status: 'not imported' | 'ambiguous' | 'not found'; detail: string };

export type RecordLookup = { find: (value: string) => LookupResult };

// Milestones are due at the end of the Asia/Dubai working day, like the
// playbook work packages.
const END_OF_DAY_DUBAI = 'T17:00:00+04:00';

const DEFAULT_CURRENCY = 'AED';

const sourceOf = ({ file, row }: PipelineRow): SourceReference => ({
  fileName: file.fileName,
  rowNumber: row.rowNumber,
});

const createLookup = (
  objectLabel: string,
  entries: { reference: string; normalisedName: string; id: string | null }[],
): RecordLookup => ({
  find: (value) => {
    const key = normaliseText(value);
    const byReference = entries.filter((entry) => entry.reference !== '' && entry.reference === key);
    const matches = byReference.length > 0 ? byReference : entries.filter((entry) => entry.normalisedName === key);
    const ids = new Set(matches.map(({ id }) => id));

    if (matches.length === 0) {
      return { status: 'not found', detail: `no ${objectLabel} "${value}" in the pipeline sheet` };
    }

    if (ids.size > 1) {
      return { status: 'ambiguous', detail: `"${value}" matches ${matches.length} ${objectLabel} rows` };
    }

    const [id] = ids;

    return id === null
      ? { status: 'not imported', detail: `${objectLabel} "${value}" was rejected` }
      : { status: 'found', id };
  },
});

const createRowHelpers = (pipelineRow: PipelineRow, object: ReportObject, record: string, context: PipelineContext) => {
  const source = sourceOf(pipelineRow);
  const warn = (detail: string) =>
    context.report.add({ outcome: 'warning', object, record, detail, sources: [source] });

  return {
    source,
    warn,
    mapSelect: (field: SelectField, column: string): string | null => {
      const raw = pipelineRow.read(column);
      const value = raw === '' ? null : context.valueMapper.map(field, raw);

      if (raw !== '' && value === null) {
        warn(`${column} "${raw}" has no matching option; left empty (add it to value-map.csv)`);
      }

      return value;
    },
    date: (column: string): string | null => {
      const raw = pipelineRow.read(column);
      const value = parseDate(raw);

      if (raw !== '' && value === null) {
        warn(`${column} "${raw}" is not a date; left empty`);
      }

      return value;
    },
    money: (amountColumn: string) => {
      const raw = pipelineRow.read(amountColumn);
      const money = raw === '' ? null : parseMoney(raw);

      if (raw !== '' && money === null) {
        warn(`${amountColumn} "${raw}" is not an amount; left empty`);
      }

      return money === null
        ? null
        : {
            amount: money.amount,
            currencyCode: pipelineRow.read('currency').toUpperCase() || money.currencyCode || DEFAULT_CURRENCY,
          };
    },
    optionalOwner: (): string | null => {
      const raw = pipelineRow.read('owner');
      const ownerEmail = raw === '' ? null : context.owners.findEmail(raw);

      if (raw !== '' && ownerEmail === null) {
        warn(`owner "${raw}" is not in owners.csv; imported without an owner`);
      }

      return ownerEmail;
    },
  };
};

export const buildOpportunities = (rows: PipelineRow[], context: PipelineContext) => {
  const opportunities: OpportunityRecord[] = [];
  const rejectedOpportunities: RejectedOpportunityRow[] = [];
  const firstRowByKey = new Map<string, number>();
  const lookupEntries: { reference: string; normalisedName: string; id: string | null }[] = [];

  for (const pipelineRow of rows) {
    const { read } = pipelineRow;
    const name = read('name');
    const helpers = createRowHelpers(pipelineRow, 'Opportunity', name || '(blank)', context);
    const reasons: string[] = [];

    const stageRaw = read('stage');
    const stage = stageRaw === '' ? null : context.valueMapper.map('stage', stageRaw);
    const ownerRaw = read('owner');
    const ownerEmail = ownerRaw === '' ? null : context.owners.findEmail(ownerRaw);
    const isOpen = stage === null || !CLOSED_STAGES.includes(stage);
    const nextAction = read('nextAction');
    const nextActionDateRaw = read('nextActionDate');
    const nextActionDate = parseDate(nextActionDateRaw);
    const companyResolution =
      pipelineRow.companyMentionIndex === null
        ? null
        : context.companyResolutions[pipelineRow.companyMentionIndex];

    if (name === '') {
      reasons.push('missing opportunity name');
    }

    if (stageRaw === '') {
      reasons.push('missing stage');
    } else if (stage === null) {
      reasons.push(`stage "${stageRaw}" is not a KUEC stage (map it in value-map.csv)`);
    }

    if (ownerRaw === '') {
      reasons.push('missing owner');
    } else if (ownerEmail === null) {
      reasons.push(`owner "${ownerRaw}" is not in owners.csv`);
    }

    // Closed opportunities need no next step; open ones need all three, as
    // the next-action guard (W4) and the No next action view require.
    if (isOpen && nextAction === '') {
      reasons.push('missing next action');
    }

    if (isOpen && nextActionDateRaw === '') {
      reasons.push('missing next action date');
    } else if (isOpen && nextActionDate === null) {
      reasons.push(`next action date "${nextActionDateRaw}" is not a date`);
    } else if (isOpen && nextActionDate !== null && nextActionDate < context.today) {
      reasons.push(`next action date ${nextActionDate} is in the past (W4 would flag it on day one)`);
    }

    if (companyResolution !== null && companyResolution.status !== 'resolved') {
      reasons.push(`company "${read('company')}" is ${companyResolution.status}: ${companyResolution.detail}`);
    }

    const companyId = companyResolution?.status === 'resolved' ? companyResolution.companyId : null;
    const reference = normaliseText(read('reference'));
    const normalisedName = normaliseText(name);
    const key =
      reference !== ''
        ? `reference:${reference}`
        : `name:${normalisedName}|${companyId ?? normaliseCompanyName(read('company'))}`;
    const firstRow = firstRowByKey.get(key);

    if (reasons.length === 0 && firstRow !== undefined) {
      reasons.push(`duplicate of row ${firstRow} (same ${reference !== '' ? 'reference' : 'name and company'})`);
    }

    if (reasons.length > 0) {
      rejectedOpportunities.push({
        fileName: pipelineRow.file.fileName,
        rowNumber: pipelineRow.row.rowNumber,
        headers: pipelineRow.file.table.headers,
        values: pipelineRow.row.values,
        reasons,
      });
      context.report.add({
        outcome: 'rejected',
        object: 'Opportunity',
        record: name || '(blank)',
        detail: reasons.join('; '),
        sources: [helpers.source],
      });
      lookupEntries.push({ reference, normalisedName, id: firstRow === undefined ? null : recordIdFromKey(`opportunity:${key}`) });
      continue;
    }

    firstRowByKey.set(key, pipelineRow.row.rowNumber);

    const id = recordIdFromKey(`opportunity:${key}`);
    const personResolution =
      pipelineRow.personMentionIndex === null
        ? null
        : context.personResolutions[pipelineRow.personMentionIndex];

    if (companyId === null) {
      helpers.warn('no company; imported without one');
    }

    if (personResolution?.status === 'unresolved') {
      helpers.warn(`point of contact not linked: ${personResolution.detail}`);
    }

    lookupEntries.push({ reference, normalisedName, id });
    opportunities.push({
      id,
      name,
      companyId,
      pointOfContactId: personResolution?.status === 'resolved' ? personResolution.personId : null,
      ownerEmail: ownerEmail as string,
      type: helpers.mapSelect('opportunityType', 'type'),
      motion: read('motion') || null,
      stage: stage as string,
      nextAction,
      nextActionDate,
      amount: helpers.money('amount'),
      closeDate: helpers.date('closeDate'),
      probability: helpers.mapSelect('probability', 'probability'),
      source: helpers.mapSelect('opportunitySource', 'source'),
      clientDeadline: helpers.date('clientDeadline'),
      sources: [helpers.source],
    });
  }

  return {
    opportunities,
    rejectedOpportunities,
    opportunityLookup: createLookup('opportunity', lookupEntries),
  };
};

const linkOpportunity = (
  value: string,
  opportunityLookup: RecordLookup,
  warn: (detail: string) => void,
): string | null => {
  if (value === '') {
    return null;
  }

  const result = opportunityLookup.find(value);

  if (result.status === 'found') {
    return result.id;
  }

  warn(`opportunity not linked: ${result.detail}`);

  return null;
};

export const buildProjectsAndMilestones = (
  projectRows: PipelineRow[],
  milestoneRows: PipelineRow[],
  opportunityLookup: RecordLookup,
  context: PipelineContext,
) => {
  const projects: ProjectRecord[] = [];
  const milestones: MilestoneRecord[] = [];
  const projectLookupEntries: { reference: string; normalisedName: string; id: string | null }[] = [];
  const firstProjectRowById = new Map<string, number>();

  for (const pipelineRow of projectRows) {
    const { read } = pipelineRow;
    const name = read('name');
    const helpers = createRowHelpers(pipelineRow, 'Project', name || '(blank)', context);
    const reference = normaliseText(read('reference'));
    const normalisedName = normaliseText(name);
    const id = recordIdFromKey(`project:${reference !== '' ? `reference:${reference}` : `name:${normalisedName}`}`);
    const firstRow = firstProjectRowById.get(id);
    const rejection =
      name === '' ? 'missing project name' : firstRow !== undefined ? `duplicate of row ${firstRow}` : null;

    if (rejection !== null) {
      context.report.add({ outcome: 'rejected', object: 'Project', record: name || '(blank)', detail: rejection, sources: [helpers.source] });
      projectLookupEntries.push({ reference, normalisedName, id: firstRow === undefined ? null : id });
      continue;
    }

    firstProjectRowById.set(id, pipelineRow.row.rowNumber);
    projectLookupEntries.push({ reference, normalisedName, id });
    projects.push({
      id,
      name,
      type: helpers.mapSelect('projectType', 'type'),
      status: helpers.mapSelect('projectStatus', 'status') ?? 'ACTIVE',
      ownerEmail: helpers.optionalOwner(),
      opportunityId: linkOpportunity(read('opportunity'), opportunityLookup, helpers.warn),
      eventDate: helpers.date('eventDate'),
      endDate: helpers.date('endDate'),
      sources: [helpers.source],
    });
  }

  const projectLookup = createLookup('project', projectLookupEntries);
  const firstMilestoneRowById = new Map<string, number>();

  for (const pipelineRow of milestoneRows) {
    const { read } = pipelineRow;
    const name = read('name');
    const helpers = createRowHelpers(pipelineRow, 'Milestone', name || '(blank)', context);
    const project = read('project') === '' ? null : projectLookup.find(read('project'));
    const projectId = project?.status === 'found' ? project.id : null;
    const reference = normaliseText(read('reference'));
    const id = recordIdFromKey(`milestone:${projectId}:${reference !== '' ? `reference:${reference}` : `name:${normaliseText(name)}`}`);
    const firstRow = firstMilestoneRowById.get(id);
    const rejection =
      name === ''
        ? 'missing milestone name'
        : project === null
          ? 'missing project'
          : project.status !== 'found'
            ? `project not linked: ${project.detail}`
            : firstRow !== undefined
              ? `duplicate of row ${firstRow} in the same project`
              : null;

    if (rejection !== null || projectId === null) {
      context.report.add({ outcome: 'rejected', object: 'Milestone', record: name || '(blank)', detail: rejection ?? 'missing project', sources: [helpers.source] });
      continue;
    }

    firstMilestoneRowById.set(id, pipelineRow.row.rowNumber);

    const dueDate = helpers.date('dueDate');

    if (dueDate === null && read('dueDate') === '') {
      helpers.warn('no due date');
    }

    milestones.push({
      id,
      name,
      status: helpers.mapSelect('milestoneStatus', 'status') ?? 'OPEN',
      dueAt: dueDate === null ? null : `${dueDate}${END_OF_DAY_DUBAI}`,
      ownerEmail: helpers.optionalOwner(),
      projectId,
      sources: [helpers.source],
    });
  }

  return { projects, milestones };
};

const sharepointUrl = (value: string): string | null => {
  try {
    const url = new URL(/^https?:\/\//i.test(value) ? value : `https://${value}`);

    return url.protocol === 'https:' && url.hostname.toLowerCase().endsWith('.sharepoint.com')
      ? url.href
      : null;
  } catch {
    return null;
  }
};

export const buildContracts = (
  rows: PipelineRow[],
  opportunityLookup: RecordLookup,
  context: PipelineContext,
): ContractRecord[] => {
  const contracts: ContractRecord[] = [];
  const firstRowById = new Map<string, number>();

  for (const pipelineRow of rows) {
    const { read } = pipelineRow;
    const companyResolution =
      pipelineRow.companyMentionIndex === null
        ? null
        : context.companyResolutions[pipelineRow.companyMentionIndex];
    const counterpartyId = companyResolution?.status === 'resolved' ? companyResolution.companyId : null;
    const counterpartyName = counterpartyId === null ? read('counterparty') : (context.companyNameById.get(counterpartyId) ?? '');
    const name = read('name') || [read('kind'), counterpartyName].filter((part) => part !== '').join(' - ');
    const helpers = createRowHelpers(pipelineRow, 'Contract', name || '(blank)', context);
    const statusRaw = read('status');
    // The contracts tab lists what is under negotiation; a blank status means that.
    const status = statusRaw === '' ? 'IN_NEGOTIATION' : context.valueMapper.map('contractStatus', statusRaw);
    const reference = normaliseText(read('reference'));
    const id = recordIdFromKey(`contract:${reference !== '' ? `reference:${reference}` : `name:${normaliseText(name)}`}`);
    const firstRow = firstRowById.get(id);
    const rejection =
      name === ''
        ? 'missing contract name and counterparty'
        : status !== 'IN_NEGOTIATION'
          ? `status "${statusRaw}" is not under negotiation; only contracts under negotiation are imported`
          : companyResolution !== null && companyResolution.status !== 'resolved'
            ? `counterparty "${read('counterparty')}" is ${companyResolution.status}: ${companyResolution.detail}`
            : firstRow !== undefined
              ? `duplicate of row ${firstRow}`
              : null;

    if (rejection !== null) {
      context.report.add({ outcome: 'rejected', object: 'Contract', record: name || '(blank)', detail: rejection, sources: [helpers.source] });
      continue;
    }

    firstRowById.set(id, pipelineRow.row.rowNumber);

    const kind = helpers.mapSelect('contractKind', 'kind');
    const documentsLink = read('documentsLink');
    const sharepointFolderUrl = documentsLink === '' ? null : sharepointUrl(documentsLink);

    if (documentsLink === '') {
      helpers.warn('no SharePoint link');
    } else if (sharepointFolderUrl === null) {
      helpers.warn(`documents link "${documentsLink}" is not a SharePoint URL; left empty (documents stay in SharePoint, never in Twenty)`);
    }

    if (counterpartyId === null) {
      helpers.warn('no counterparty');
    }

    contracts.push({
      id,
      name,
      kind,
      status: 'IN_NEGOTIATION',
      counterpartyId,
      opportunityId: linkOpportunity(read('opportunity'), opportunityLookup, helpers.warn),
      ownerEmail: helpers.optionalOwner(),
      value: helpers.money('value'),
      signedOn: helpers.date('signedOn'),
      expiresOn: helpers.date('expiresOn'),
      sharepointFolderUrl,
      sources: [helpers.source],
    });
  }

  return contracts;
};
