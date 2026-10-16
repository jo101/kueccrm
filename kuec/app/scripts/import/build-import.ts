import { type CompanyMention, resolveCompanies } from './companies.ts';
import { type CsvRow, type CsvTable } from './csv.ts';
import {
  type CompanyRecord,
  type ContractRecord,
  createReport,
  type MilestoneRecord,
  type OpportunityRecord,
  type PersonRecord,
  type ProjectRecord,
  type RejectedOpportunityRow,
  type ReportEntry,
  SOURCE_RANK,
  type SourceReference,
} from './model.ts';
import {
  companyDomainFromEmail,
  normaliseCompanyName,
  normaliseDomain,
  normaliseEmail,
  normalisePersonName,
  normaliseText,
  parseBoolean,
  parsePhone,
  splitFullName,
} from './normalise.ts';
import { type PersonMention, resolvePeople } from './people.ts';
import {
  buildContracts,
  buildOpportunities,
  buildProjectsAndMilestones,
  type OwnerDirectory,
  type PipelineRow,
} from './pipeline.ts';
import {
  type ColumnOverride,
  resolveColumns,
  type SourceColumn,
  type SourceKind,
} from './source-columns.ts';
import {
  createValueMapper,
  type ValueMapper,
  type ValueMappingUsage,
  type ValueOverride,
} from './value-mapper.ts';

export type SourceFile = { kind: SourceKind; fileName: string; table: CsvTable };

export type OwnerEntry = { owner: string; email: string };

export type ImportInput = {
  files: SourceFile[];
  owners: OwnerEntry[];
  valueOverrides: ValueOverride[];
  columnOverrides: ColumnOverride[];
  // Asia/Dubai calendar date, YYYY-MM-DD.
  today: string;
};

export type ColumnResolution = {
  kind: SourceKind;
  fileName: string;
  headerByColumn: Record<string, string>;
  unusedHeaders: string[];
};

export type HeldValue = { column: string; value: string; rows: number };

export type ImportResult = {
  companies: CompanyRecord[];
  people: PersonRecord[];
  opportunities: OpportunityRecord[];
  projects: ProjectRecord[];
  milestones: MilestoneRecord[];
  contracts: ContractRecord[];
  rejectedOpportunities: RejectedOpportunityRow[];
  report: ReportEntry[];
  valueMappings: ValueMappingUsage[];
  columnResolutions: ColumnResolution[];
  heldValues: HeldValue[];
};

type RowReader<TKind extends SourceKind> = (column: SourceColumn<TKind>) => string;

// Register files are often one per cluster ("Oil & Gas cluster.csv"), so the
// file name stands in for a missing sector column.
const SECTOR_NOISE_WORDS = new Set(['cluster', 'clusters', 'companies', 'list', 'register', 'sector', 'industry', 'industries']);

const sectorKey = (value: string): string =>
  normaliseText(value.replace(/\.csv$/i, ''))
    .split(' ')
    .filter((word) => !SECTOR_NOISE_WORDS.has(word) && !/^\d+$/.test(word))
    .join(' ');

const createOwnerDirectory = (owners: OwnerEntry[]): OwnerDirectory => {
  const emailByKey = new Map<string, string>();

  for (const { owner, email } of owners) {
    const normalisedEmail = normaliseEmail(email);

    if (normalisedEmail !== null) {
      emailByKey.set(normaliseText(owner), normalisedEmail);
      emailByKey.set(normaliseText(normalisedEmail), normalisedEmail);
    }
  }

  return {
    findEmail: (owner) => emailByKey.get(normaliseText(owner)) ?? null,
  };
};

export const buildImport = (input: ImportInput): ImportResult => {
  const report = createReport();
  const valueMapper: ValueMapper = createValueMapper(input.valueOverrides);
  const owners = createOwnerDirectory(input.owners);
  const companyMentions: CompanyMention[] = [];
  const personMentions: PersonMention[] = [];
  const columnResolutions: ColumnResolution[] = [];
  const heldValueCounts = new Map<string, number>();
  const pipelineRows: Record<'opportunities' | 'projects' | 'milestones' | 'contracts', PipelineRow[]> = {
    opportunities: [],
    projects: [],
    milestones: [],
    contracts: [],
  };

  const holdValue = (column: string, value: string) => {
    if (value !== '') {
      const key = `${column}\u0000${value}`;

      heldValueCounts.set(key, (heldValueCounts.get(key) ?? 0) + 1);
    }
  };

  const addCompanyMention = ({
    name,
    website,
    email,
    sector,
    sizeClass,
    offsetObligor,
    rank,
    source,
  }: {
    name: string;
    website: string;
    email: string | null;
    sector: string;
    sizeClass: string;
    offsetObligor: string;
    rank: number;
    source: SourceReference;
  }): number | null => {
    const normalisedName = name === '' ? null : normaliseCompanyName(name) || null;
    const explicitDomain = website === '' ? null : normaliseDomain(website);
    const emailDomain = email === null ? null : companyDomainFromEmail(email);

    if (normalisedName === null && explicitDomain === null && emailDomain === null) {
      return null;
    }

    const sectorSource = sectorKey(sector);

    companyMentions.push({
      name: normalisedName === null ? null : name,
      normalisedName,
      explicitDomain,
      emailDomain,
      sector: sectorSource === '' ? null : valueMapper.map('sector', sectorSource),
      sizeClass: sizeClass === '' ? null : sizeClass,
      isOffsetObligor: parseBoolean(offsetObligor),
      rank,
      source,
    });

    return companyMentions.length - 1;
  };

  const addPersonMention = ({
    fullName,
    firstName,
    lastName,
    email,
    jobTitle,
    phone,
    companyMentionIndex,
    rank,
    source,
  }: {
    fullName: string;
    firstName: string;
    lastName: string;
    email: string;
    jobTitle: string;
    phone: string;
    companyMentionIndex: number | null;
    rank: number;
    source: SourceReference;
  }): number | null => {
    const name =
      firstName !== '' || lastName !== '' ? { firstName, lastName } : splitFullName(fullName);
    const normalisedEmail = normaliseEmail(email);

    if (email !== '' && normalisedEmail === null) {
      report.add({
        outcome: 'warning',
        object: 'Person',
        record: `${name.firstName} ${name.lastName}`.trim() || email,
        detail: `"${email}" is not a valid email address; imported without it`,
        sources: [source],
      });
    }

    if (normalisedEmail === null && name.firstName === '' && name.lastName === '') {
      return null;
    }

    personMentions.push({
      ...name,
      normalisedName: normalisePersonName(name),
      email: normalisedEmail,
      jobTitle,
      phone: phone === '' ? null : parsePhone(phone),
      companyMentionIndex,
      rank,
      source,
    });

    return personMentions.length - 1;
  };

  for (const file of input.files) {
    const { headerByColumn, unusedHeaders } = resolveColumns(
      file.kind,
      file.table.headers,
      input.columnOverrides,
    );

    columnResolutions.push({ kind: file.kind, fileName: file.fileName, headerByColumn, unusedHeaders });

    const readerFor =
      <TKind extends SourceKind>(row: CsvRow): RowReader<TKind> =>
      (column) => {
        const header = (headerByColumn as Record<string, string | undefined>)[column];

        return header === undefined ? '' : (row.values[header] ?? '');
      };
    const rank = SOURCE_RANK[file.kind];

    for (const row of file.table.rows) {
      const source = { fileName: file.fileName, rowNumber: row.rowNumber };

      switch (file.kind) {
        case 'register': {
          const read = readerFor<'register'>(row);
          const contactEmail = normaliseEmail(read('contactEmail'));

          holdValue('sizeClass', read('sizeClass'));

          const companyMentionIndex = addCompanyMention({
            name: read('company'),
            website: read('website'),
            email: null,
            sector: read('sector') || file.fileName,
            sizeClass: read('sizeClass'),
            offsetObligor: read('offsetObligor'),
            rank,
            source,
          });

          if (read('contactName') !== '' || contactEmail !== null) {
            addPersonMention({
              fullName: read('contactName'),
              firstName: '',
              lastName: '',
              email: read('contactEmail'),
              jobTitle: read('contactTitle'),
              phone: '',
              companyMentionIndex,
              rank,
              source,
            });
          }
          break;
        }
        case 'contacts':
        case 'workshops': {
          const read = readerFor<'contacts'>(row);
          const email = normaliseEmail(read('email'));
          const companyMentionIndex = addCompanyMention({
            name: read('company'),
            website: file.kind === 'contacts' ? read('website') : '',
            email,
            sector: file.kind === 'contacts' ? read('sector') : '',
            sizeClass: '',
            offsetObligor: '',
            rank,
            source,
          });

          addPersonMention({
            fullName: read('fullName'),
            firstName: read('firstName'),
            lastName: read('lastName'),
            email: read('email'),
            jobTitle: read('jobTitle'),
            phone: read('phone'),
            companyMentionIndex,
            rank,
            source,
          });
          break;
        }
        case 'opportunities': {
          const read = readerFor<'opportunities'>(row);
          const companyMentionIndex = addCompanyMention({
            name: read('company'),
            website: read('website'),
            email: null,
            sector: read('sector'),
            sizeClass: '',
            offsetObligor: read('offsetObligor'),
            rank,
            source,
          });
          const personMentionIndex =
            read('contactName') !== '' || read('contactEmail') !== ''
              ? addPersonMention({
                  fullName: read('contactName'),
                  firstName: '',
                  lastName: '',
                  email: read('contactEmail'),
                  jobTitle: '',
                  phone: '',
                  companyMentionIndex,
                  rank,
                  source,
                })
              : null;

          holdValue('motion', read('motion'));
          pipelineRows.opportunities.push({
            file,
            row,
            read: read as (column: string) => string,
            companyMentionIndex,
            personMentionIndex,
          });
          break;
        }
        case 'contracts': {
          const read = readerFor<'contracts'>(row);
          const companyMentionIndex = addCompanyMention({
            name: read('counterparty'),
            website: '',
            email: null,
            sector: '',
            sizeClass: '',
            offsetObligor: '',
            rank,
            source,
          });

          pipelineRows.contracts.push({
            file,
            row,
            read: read as (column: string) => string,
            companyMentionIndex,
            personMentionIndex: null,
          });
          break;
        }
        case 'projects':
        case 'milestones': {
          pipelineRows[file.kind].push({
            file,
            row,
            read: readerFor(row) as (column: string) => string,
            companyMentionIndex: null,
            personMentionIndex: null,
          });
          break;
        }
      }
    }
  }

  const { companies, resolutions: companyResolutions } = resolveCompanies(companyMentions, report);
  const { people, resolutions: personResolutions } = resolvePeople(
    personMentions,
    companyResolutions,
    valueMapper,
    report,
  );
  const context = {
    today: input.today,
    owners,
    valueMapper,
    report,
    companyResolutions,
    personResolutions,
    companyNameById: new Map(companies.map((company) => [company.id, company.name])),
  };
  const { opportunities, rejectedOpportunities, opportunityLookup } = buildOpportunities(
    pipelineRows.opportunities,
    context,
  );
  const { projects, milestones } = buildProjectsAndMilestones(
    pipelineRows.projects,
    pipelineRows.milestones,
    opportunityLookup,
    context,
  );
  const contracts = buildContracts(pipelineRows.contracts, opportunityLookup, context);

  return {
    companies,
    people,
    opportunities,
    projects,
    milestones,
    contracts,
    rejectedOpportunities,
    report: report.entries,
    valueMappings: valueMapper.usage(),
    columnResolutions,
    heldValues: [...heldValueCounts].map(([key, rows]) => {
      const [column, value] = key.split('\u0000');

      return { column, value, rows };
    }),
  };
};
