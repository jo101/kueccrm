import { join } from 'node:path';

import { type ColumnResolution, type ImportResult } from './build-import.ts';
import { writeCsv } from './csv.ts';
import {
  type CompanyRecord,
  type ContractRecord,
  formatSources,
  type MilestoneRecord,
  type OpportunityRecord,
  type PersonRecord,
  type ProjectRecord,
  type ReportOutcome,
} from './model.ts';
import { type Money } from './normalise.ts';
import { CLOSED_STAGES, TARGET_SELECT_VALUES } from './target-values.ts';

// Twenty's importer takes up to 10,000 rows; the import runbook keeps every
// file under 2,000 so a failed batch is small to find and redo.
export const MAX_ROWS_PER_FILE = 1_999;

type TargetColumn<TRecord> = {
  // Twenty's import dialog matches a CSV header to a field by its label, so the
  // headers are the labels it shows: "Owner / User Email" connects the owner
  // relation through the workspace member's login email.
  header: string;
  field: string;
  fieldType: string;
  sourceColumns: string[];
  rule: string;
  value: (record: TRecord) => string;
};

type ImportFile = {
  fileStem: string;
  columns: Omit<TargetColumn<never>, 'value'>[];
  rows: string[][];
};

const materialise = <TRecord>(
  fileStem: string,
  records: TRecord[],
  columns: TargetColumn<TRecord>[],
): ImportFile => ({
  fileStem,
  columns,
  rows: records.map((record) => columns.map((column) => column.value(record))),
});

const text = (value: string | null): string => value ?? '';

const amountOf = (money: Money | null): string => (money === null ? '' : String(money.amount));

const currencyOf = (money: Money | null): string => (money === null ? '' : (money.currencyCode ?? ''));

const ID_RULE =
  'Derived from the natural key (see the runbook), so rerunning on the same sources gives the same id and a later import updates the record instead of adding one.';

const COMPANY_COLUMNS: TargetColumn<CompanyRecord>[] = [
  { header: 'ID', field: 'id', fieldType: 'UUID', sourceColumns: [], rule: `${ID_RULE} Key: website domain, else normalised name.`, value: ({ id }) => id },
  {
    header: 'Name',
    field: 'name',
    fieldType: 'TEXT',
    sourceColumns: ['register.company', 'opportunities.company', 'contracts.counterparty', 'contacts.company', 'workshops.company'],
    rule: 'Spelling from the highest-ranked source (register, pipeline sheet, contact exports, attendee lists), most frequent first. Dedupe: domain, then name with legal suffixes (LLC, PJSC, FZE...) removed.',
    value: ({ name }) => name,
  },
  {
    header: 'Domain Name / Link URL',
    field: 'domainName.primaryLinkUrl',
    fieldType: 'LINKS',
    sourceColumns: ['register.website', 'contacts.website', 'opportunities.website', 'contacts.email', 'workshops.email', 'register.contactEmail'],
    rule: 'Website column. Else the email domain of its people when no other company uses that domain. Public and ISP mail domains (gmail.com, emirates.net.ae...) never count.',
    value: ({ domain }) => (domain === null ? '' : `https://${domain}`),
  },
  {
    header: 'Sector',
    field: 'sector',
    fieldType: 'SELECT',
    sourceColumns: ['register.sector', 'contacts.sector', 'opportunities.sector'],
    rule: 'Mapped to a KUEC sector (value-mapping.csv). A register file without a sector column uses its file name (cluster). Highest-ranked source wins.',
    value: ({ sector }) => text(sector),
  },
  {
    header: 'Offset obligor',
    field: 'isOffsetObligor',
    fieldType: 'BOOLEAN',
    sourceColumns: ['register.offsetObligor', 'opportunities.offsetObligor'],
    rule: 'Yes/No/1/0/x. Yes if any source says yes; empty keeps the default (No).',
    value: ({ isOffsetObligor }) => (isOffsetObligor === null ? '' : String(isOffsetObligor)),
  },
];

const PERSON_COLUMNS: TargetColumn<PersonRecord>[] = [
  { header: 'ID', field: 'id', fieldType: 'UUID', sourceColumns: [], rule: `${ID_RULE} Key: email, else name and company.`, value: ({ id }) => id },
  {
    header: 'Name / First Name',
    field: 'name.firstName',
    fieldType: 'FULL_NAME',
    sourceColumns: ['contacts.firstName', 'contacts.fullName', 'workshops.firstName', 'workshops.fullName', 'register.contactName', 'opportunities.contactName'],
    rule: 'First name column, else the first word of the full name after a title (Dr, Eng, Mr, H.E....).',
    value: ({ firstName }) => firstName,
  },
  {
    header: 'Name / Last Name',
    field: 'name.lastName',
    fieldType: 'FULL_NAME',
    sourceColumns: ['contacts.lastName', 'contacts.fullName', 'workshops.lastName', 'workshops.fullName', 'register.contactName', 'opportunities.contactName'],
    rule: 'Last name column, else the rest of the full name, kept whole ("bin Rashid Al Maktoum").',
    value: ({ lastName }) => lastName,
  },
  {
    header: 'Emails / Primary Email',
    field: 'emails.primaryEmail',
    fieldType: 'EMAILS',
    sourceColumns: ['contacts.email', 'workshops.email', 'register.contactEmail', 'opportunities.contactEmail'],
    rule: 'Lower-cased. Dedupe key 1. Invalid addresses are dropped and reported.',
    value: ({ email }) => text(email),
  },
  {
    header: 'Job Title',
    field: 'jobTitle',
    fieldType: 'TEXT',
    sourceColumns: ['contacts.jobTitle', 'workshops.jobTitle', 'register.contactTitle'],
    rule: 'Highest-ranked non-empty title.',
    value: ({ jobTitle }) => jobTitle,
  },
  {
    header: 'Phones / Primary Phone Number',
    field: 'phones.primaryPhoneNumber',
    fieldType: 'PHONES',
    sourceColumns: ['contacts.phone', 'workshops.phone'],
    rule: 'UAE numbers (0..., 971..., +971..., 00971...) split into +971 and the national number; others kept with their + prefix.',
    value: ({ phone }) => (phone === null ? '' : phone.number),
  },
  {
    header: 'Phones / Primary Phone Calling Code',
    field: 'phones.primaryPhoneCallingCode',
    fieldType: 'PHONES',
    sourceColumns: ['contacts.phone', 'workshops.phone'],
    rule: '+971 for UAE numbers, else empty.',
    value: ({ phone }) => (phone === null ? '' : phone.callingCode),
  },
  {
    header: 'Company / ID',
    field: 'company',
    fieldType: 'RELATION',
    sourceColumns: ['contacts.company', 'workshops.company', 'contacts.email', 'workshops.email'],
    rule: 'Id of the deduplicated company (01-companies). Dedupe key 2 is name plus this company.',
    value: ({ companyId }) => text(companyId),
  },
  {
    header: 'Decision role',
    field: 'decisionRole',
    fieldType: 'SELECT',
    sourceColumns: ['contacts.jobTitle', 'workshops.jobTitle', 'register.contactTitle'],
    rule: 'Read from the job title by keyword (CFO: budget holder; CTO, engineer, research: technical evaluator; CEO, director, head, VP: decision maker; manager, advisor: influencer; officer, analyst: end user; assistant, buyer: gatekeeper). Empty when the title says nothing.',
    value: ({ decisionRole }) => text(decisionRole),
  },
];

const OWNER_RULE = 'owners.csv maps the name in the sheet to the member\'s KUEC login email. The member must already exist in the workspace.';

const OPPORTUNITY_COLUMNS: TargetColumn<OpportunityRecord>[] = [
  { header: 'ID', field: 'id', fieldType: 'UUID', sourceColumns: ['opportunities.reference'], rule: `${ID_RULE} Key: the sheet's reference column, else name and company.`, value: ({ id }) => id },
  { header: 'Name', field: 'name', fieldType: 'TEXT', sourceColumns: ['opportunities.name'], rule: 'Required.', value: ({ name }) => name },
  { header: 'Company / ID', field: 'company', fieldType: 'RELATION', sourceColumns: ['opportunities.company', 'opportunities.website'], rule: 'Deduplicated company. An ambiguous company rejects the row.', value: ({ companyId }) => text(companyId) },
  { header: 'Point of Contact / ID', field: 'pointOfContact', fieldType: 'RELATION', sourceColumns: ['opportunities.contactEmail', 'opportunities.contactName'], rule: 'Deduplicated person.', value: ({ pointOfContactId }) => text(pointOfContactId) },
  { header: 'Owner / User Email', field: 'owner', fieldType: 'RELATION', sourceColumns: ['opportunities.owner'], rule: `Required. ${OWNER_RULE}`, value: ({ ownerEmail }) => ownerEmail },
  { header: 'Type', field: 'playbookType', fieldType: 'SELECT', sourceColumns: ['opportunities.type'], rule: 'One Opportunity type value (runbooks/18-taxonomy.md); only Licence and Technical service start a playbook. The API name is playbookType because "type" is reserved.', value: ({ type }) => text(type) },
  { header: 'Stage', field: 'stage', fieldType: 'SELECT', sourceColumns: ['opportunities.stage'], rule: 'Required; one of NEW, SCREENING, MEETING, PROPOSAL, SIGNED, LOST, PARKED. Never CUSTOMER (deprecated).', value: ({ stage }) => stage },
  { header: 'Next action', field: 'nextAction', fieldType: 'TEXT', sourceColumns: ['opportunities.nextAction'], rule: 'Required unless Signed, Lost or Parked.', value: ({ nextAction }) => nextAction },
  { header: 'Next action date', field: 'nextActionDate', fieldType: 'DATE', sourceColumns: ['opportunities.nextActionDate'], rule: 'Required unless Signed, Lost or Parked; today or later. Day-first dates (UAE).', value: ({ nextActionDate }) => text(nextActionDate) },
  { header: 'Amount / Amount', field: 'amount.amountMicros', fieldType: 'CURRENCY', sourceColumns: ['opportunities.amount'], rule: 'Plain number; 250k and 1.2m are expanded. Twenty converts to micros.', value: ({ amount }) => amountOf(amount) },
  { header: 'Amount / Currency', field: 'amount.currencyCode', fieldType: 'CURRENCY', sourceColumns: ['opportunities.currency', 'opportunities.amount'], rule: 'Currency column, else the code in the amount, else AED.', value: ({ amount }) => currencyOf(amount) },
  { header: 'Close date', field: 'closeDate', fieldType: 'DATE', sourceColumns: ['opportunities.closeDate'], rule: 'Day-first dates.', value: ({ closeDate }) => text(closeDate) },
  { header: 'Probability', field: 'probability', fieldType: 'SELECT', sourceColumns: ['opportunities.probability'], rule: '10, 25, 50, 75 or 90 per cent.', value: ({ probability }) => text(probability) },
  { header: 'Source', field: 'source', fieldType: 'SELECT', sourceColumns: ['opportunities.source'], rule: 'value-mapping.csv.', value: ({ source }) => text(source) },
  { header: 'Client deadline', field: 'clientDeadline', fieldType: 'DATE', sourceColumns: ['opportunities.clientDeadline'], rule: 'RFQ submission deadline.', value: ({ clientDeadline }) => text(clientDeadline) },
];

const PROJECT_COLUMNS: TargetColumn<ProjectRecord>[] = [
  { header: 'ID', field: 'id', fieldType: 'UUID', sourceColumns: ['projects.reference'], rule: `${ID_RULE} Key: reference, else name.`, value: ({ id }) => id },
  { header: 'Name', field: 'name', fieldType: 'TEXT', sourceColumns: ['projects.name'], rule: 'Required; a repeated name is rejected as a duplicate.', value: ({ name }) => name },
  { header: 'Type', field: 'playbookType', fieldType: 'SELECT', sourceColumns: ['projects.type'], rule: 'One Project type value (runbooks/18-taxonomy.md); only Workshop, Proposal and Delivery start a template.', value: ({ type }) => text(type) },
  { header: 'Status', field: 'status', fieldType: 'SELECT', sourceColumns: ['projects.status'], rule: 'Empty means Active.', value: ({ status }) => status },
  { header: 'Event date', field: 'eventDate', fieldType: 'DATE', sourceColumns: ['projects.eventDate'], rule: 'Day-first dates.', value: ({ eventDate }) => text(eventDate) },
  { header: 'End date', field: 'endDate', fieldType: 'DATE', sourceColumns: ['projects.endDate'], rule: 'Day-first dates.', value: ({ endDate }) => text(endDate) },
  { header: 'Owner / User Email', field: 'owner', fieldType: 'RELATION', sourceColumns: ['projects.owner'], rule: OWNER_RULE, value: ({ ownerEmail }) => text(ownerEmail) },
  { header: 'Opportunity / ID', field: 'opportunity', fieldType: 'RELATION', sourceColumns: ['projects.opportunity'], rule: 'Matched on the opportunity reference, else its name. Not linked when that opportunity was rejected.', value: ({ opportunityId }) => text(opportunityId) },
];

const MILESTONE_COLUMNS: TargetColumn<MilestoneRecord>[] = [
  { header: 'ID', field: 'id', fieldType: 'UUID', sourceColumns: ['milestones.reference'], rule: `${ID_RULE} Key: project plus reference, else name.`, value: ({ id }) => id },
  { header: 'Name', field: 'name', fieldType: 'TEXT', sourceColumns: ['milestones.name'], rule: 'Required.', value: ({ name }) => name },
  { header: 'Status', field: 'status', fieldType: 'SELECT', sourceColumns: ['milestones.status'], rule: 'Empty means Open.', value: ({ status }) => status },
  { header: 'Due', field: 'dueAt', fieldType: 'DATE_TIME', sourceColumns: ['milestones.dueDate'], rule: '17:00 Asia/Dubai on the due date.', value: ({ dueAt }) => text(dueAt) },
  { header: 'Owner / User Email', field: 'owner', fieldType: 'RELATION', sourceColumns: ['milestones.owner'], rule: OWNER_RULE, value: ({ ownerEmail }) => text(ownerEmail) },
  { header: 'Project / ID', field: 'project', fieldType: 'RELATION', sourceColumns: ['milestones.project'], rule: 'Required: matched on the project reference, else its name. No project, no import.', value: ({ projectId }) => projectId },
];

const CONTRACT_COLUMNS: TargetColumn<ContractRecord>[] = [
  { header: 'ID', field: 'id', fieldType: 'UUID', sourceColumns: ['contracts.reference'], rule: `${ID_RULE} Key: reference, else name.`, value: ({ id }) => id },
  { header: 'Name', field: 'name', fieldType: 'TEXT', sourceColumns: ['contracts.name'], rule: 'Else "<kind> - <counterparty>".', value: ({ name }) => name },
  { header: 'Kind', field: 'kind', fieldType: 'SELECT', sourceColumns: ['contracts.kind'], rule: 'One Contract type value (runbooks/18-taxonomy.md); never Option or Service (deprecated).', value: ({ kind }) => text(kind) },
  { header: 'Status', field: 'status', fieldType: 'SELECT', sourceColumns: ['contracts.status'], rule: 'Only In negotiation is imported; empty means In negotiation.', value: ({ status }) => status },
  { header: 'Counterparty / ID', field: 'counterparty', fieldType: 'RELATION', sourceColumns: ['contracts.counterparty'], rule: 'Deduplicated company. An ambiguous company rejects the row.', value: ({ counterpartyId }) => text(counterpartyId) },
  { header: 'Opportunity / ID', field: 'opportunity', fieldType: 'RELATION', sourceColumns: ['contracts.opportunity'], rule: 'Matched on the opportunity reference, else its name.', value: ({ opportunityId }) => text(opportunityId) },
  { header: 'Owner / User Email', field: 'owner', fieldType: 'RELATION', sourceColumns: ['contracts.owner'], rule: OWNER_RULE, value: ({ ownerEmail }) => text(ownerEmail) },
  { header: 'Value / Amount', field: 'value.amountMicros', fieldType: 'CURRENCY', sourceColumns: ['contracts.value'], rule: 'Plain number.', value: ({ value }) => amountOf(value) },
  { header: 'Value / Currency', field: 'value.currencyCode', fieldType: 'CURRENCY', sourceColumns: ['contracts.currency', 'contracts.value'], rule: 'Else AED.', value: ({ value }) => currencyOf(value) },
  { header: 'Signed on', field: 'signedOn', fieldType: 'DATE', sourceColumns: ['contracts.signedOn'], rule: 'Day-first dates.', value: ({ signedOn }) => text(signedOn) },
  { header: 'Expires on', field: 'expiresOn', fieldType: 'DATE', sourceColumns: ['contracts.expiresOn'], rule: 'Day-first dates.', value: ({ expiresOn }) => text(expiresOn) },
  {
    header: 'SharePoint folder / Link URL',
    field: 'sharepointFolder.primaryLinkUrl',
    fieldType: 'LINKS',
    sourceColumns: ['contracts.documentsLink'],
    rule: 'The documentsLink column. Only https://*.sharepoint.com links; anything else is left empty and reported. Metadata only: no document is uploaded.',
    value: ({ sharepointFolderUrl }) => text(sharepointFolderUrl),
  },
];

// Source columns read but with no field in kuec-bd-ops to hold them.
const HELD_COLUMNS = [
  { object: 'Company', column: 'sizeClass', sourceColumns: ['register.sizeClass'] },
  { object: 'Opportunity', column: 'motion', sourceColumns: ['opportunities.motion'] },
];

// Numbered in import order: each file's relations point at records the
// earlier files created.
export const importFiles = (result: ImportResult): ImportFile[] => [
  materialise('01-companies', result.companies, COMPANY_COLUMNS),
  materialise('02-people', result.people, PERSON_COLUMNS),
  materialise('03-opportunities', result.opportunities, OPPORTUNITY_COLUMNS),
  materialise('04-projects', result.projects, PROJECT_COLUMNS),
  materialise('05-milestones', result.milestones, MILESTONE_COLUMNS),
  materialise('06-contracts', result.contracts, CONTRACT_COLUMNS),
];

const chunk = <TItem>(items: TItem[], size: number): TItem[][] =>
  items.length === 0
    ? [[]]
    : Array.from({ length: Math.ceil(items.length / size) }, (_, index) =>
        items.slice(index * size, (index + 1) * size),
      );

const foundSourceHeaders = (sourceColumns: string[], columnResolutions: ColumnResolution[]): string =>
  sourceColumns
    .flatMap((sourceColumn) => {
      const [kind, column] = sourceColumn.split('.');

      return columnResolutions
        .filter((resolution) => resolution.kind === kind && column in resolution.headerByColumn)
        .map((resolution) => `${resolution.fileName}: "${resolution.headerByColumn[column]}"`);
    })
    .filter((value, index, values) => values.indexOf(value) === index)
    .join('; ');

const OUTCOME_ORDER: ReportOutcome[] = ['merged', 'ambiguous', 'rejected', 'warning'];

export const writeOutputs = (result: ImportResult, outputDirectory: string): string[] => {
  const written: string[] = [];
  const write = (fileName: string, rows: string[][], forExcel: boolean) => {
    writeCsv(join(outputDirectory, fileName), rows, { forExcel });
    written.push(fileName);
  };

  for (const file of importFiles(result)) {
    const batches = chunk(file.rows, MAX_ROWS_PER_FILE);

    batches.forEach((batch, index) => {
      const suffix = batches.length === 1 ? '' : `-part-${index + 1}-of-${batches.length}`;

      write(`${file.fileStem}${suffix}.csv`, [file.columns.map(({ header }) => header), ...batch], false);
    });
  }

  write(
    'field-mapping.csv',
    [
      ['Import file', 'CSV column (Twenty import label)', 'Twenty field (API name)', 'Field type', 'Read from (file: header)', 'Rule'],
      ...importFiles(result).flatMap((file) =>
        file.columns.map((column) => [
          file.fileStem,
          column.header,
          column.field,
          column.fieldType,
          foundSourceHeaders(column.sourceColumns, result.columnResolutions) || (column.sourceColumns.length === 0 ? '(generated)' : '(not in any source file)'),
          column.rule,
        ]),
      ),
      ...HELD_COLUMNS.map(({ object, column, sourceColumns }) => [
        '(not imported)',
        '',
        `${object}.${column}`,
        '',
        foundSourceHeaders(sourceColumns, result.columnResolutions) || '(not in any source file)',
        `No such field in kuec-bd-ops; values are listed in held-values.csv until a field is added.`,
      ]),
      ...result.columnResolutions.flatMap((resolution) =>
        resolution.unusedHeaders.map((header) => [
          '(not imported)',
          '',
          '',
          '',
          `${resolution.fileName}: "${header}"`,
          'No target. If it should map, name it in column-map.csv.',
        ]),
      ),
    ],
    true,
  );

  write(
    'dedupe-report.csv',
    [
      ['Outcome', 'Object', 'Record', 'Detail', 'Source rows (file:row)'],
      ...[...result.report]
        .sort((left, right) => OUTCOME_ORDER.indexOf(left.outcome) - OUTCOME_ORDER.indexOf(right.outcome))
        .map((entry) => [entry.outcome, entry.object, entry.record, entry.detail, formatSources(entry.sources)]),
    ],
    true,
  );

  const rejectedHeaders = [
    ...new Set(result.rejectedOpportunities.flatMap(({ headers }) => headers)),
  ];

  write(
    'rejected-opportunities.csv',
    [
      ['Rejection reason', 'Source file', 'Source row', ...rejectedHeaders],
      ...result.rejectedOpportunities.map((rejected) => [
        rejected.reasons.join('; '),
        rejected.fileName,
        String(rejected.rowNumber),
        ...rejectedHeaders.map((header) => rejected.values[header] ?? ''),
      ]),
    ],
    true,
  );

  write(
    'value-mapping.csv',
    [
      ['Field', 'Source value', 'Imported as', 'How', 'Rows'],
      ...[...result.valueMappings]
        .sort((left, right) => left.field.localeCompare(right.field) || right.rows - left.rows)
        .map((usage) => [usage.field, usage.sourceValue, usage.targetValue ?? '(empty)', usage.method, String(usage.rows)]),
    ],
    true,
  );

  write(
    'held-values.csv',
    [
      ['Column', 'Value', 'Rows'],
      ...result.heldValues.map(({ column, value, rows }) => [column, value, String(rows)]),
    ],
    true,
  );

  return written;
};

const sqlString = (value: string) => `'${value.replaceAll("'", "''")}'`;

// Read-only. Every imported opportunity must sit in exactly one stage column
// (a valid, non-empty stage, the one in the file) and none may match the
// No next action view: open stage and no next action date.
export const buildPostImportCheckSql = (opportunities: OpportunityRecord[]): string => {
  const stageList = TARGET_SELECT_VALUES.stage.map(sqlString).join(', ');
  const closedList = CLOSED_STAGES.map(sqlString).join(', ');
  const values =
    opportunities.length === 0
      ? `(NULL::uuid, NULL::text)`
      : opportunities.map(({ id, stage }) => `(${sqlString(id)}::uuid, ${sqlString(stage)})`).join(',\n    ');

  return `-- Post-import check for 03-opportunities: run read-only against the workspace schema.
-- Every column must be 0, except imported, which must be ${opportunities.length}.
WITH imported(id, expected_stage) AS (
  VALUES
    ${values}
),
found AS (
  SELECT imported.expected_stage, opportunity.id AS found_id, opportunity.stage::text AS stage, opportunity."nextActionDate"
  FROM imported
  LEFT JOIN opportunity ON opportunity.id = imported.id AND opportunity."deletedAt" IS NULL
  WHERE imported.id IS NOT NULL
)
SELECT
  count(found_id) AS imported,
  count(*) FILTER (WHERE found_id IS NULL) AS missing,
  count(*) FILTER (WHERE found_id IS NOT NULL AND (stage IS NULL OR stage NOT IN (${stageList}))) AS not_in_a_kuec_stage,
  count(*) FILTER (WHERE found_id IS NOT NULL AND stage IS DISTINCT FROM expected_stage) AS stage_differs_from_file,
  count(*) FILTER (WHERE found_id IS NOT NULL AND stage NOT IN (${closedList}) AND "nextActionDate" IS NULL) AS in_no_next_action
FROM found;
`;
};

export const buildSummary = (result: ImportResult, written: string[], today: string): string => {
  const countByOutcome = (outcome: ReportOutcome) =>
    result.report.filter((entry) => entry.outcome === outcome).length;
  const stageCounts = TARGET_SELECT_VALUES.stage
    .map((stage) => `${stage} ${result.opportunities.filter((opportunity) => opportunity.stage === stage).length}`)
    .join(', ');
  const unmappedValues = result.valueMappings.filter(({ method, field }) => method === 'unmapped' && field !== 'decisionRole');

  return [
    `KUEC import preparation, ${today} (Asia/Dubai)`,
    '',
    `Companies      ${result.companies.length}`,
    `People         ${result.people.length}`,
    `Opportunities  ${result.opportunities.length} (${stageCounts})`,
    `  rejected     ${result.rejectedOpportunities.length} -> rejected-opportunities.csv`,
    `Projects       ${result.projects.length}`,
    `Milestones     ${result.milestones.length}`,
    `Contracts      ${result.contracts.length}`,
    '',
    `Dedupe report: ${countByOutcome('merged')} merged, ${countByOutcome('ambiguous')} ambiguous, ${countByOutcome('rejected')} rejected, ${countByOutcome('warning')} warnings`,
    `Unmapped select values: ${unmappedValues.length}${unmappedValues.length > 0 ? ' (value-mapping.csv, "unmapped"; fix in value-map.csv and rerun)' : ''}`,
    '',
    'Files:',
    ...written.map((fileName) => `  ${fileName}`),
    '  post-import-check.sql',
    '',
  ].join('\n');
};
