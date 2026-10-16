import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { buildImport, type ImportInput, type SourceFile } from './build-import.ts';
import { type CsvTable } from './csv.ts';
import { recordIdFromKey } from './ids.ts';
import { buildPostImportCheckSql, importFiles, MAX_ROWS_PER_FILE } from './outputs.ts';
import { type SourceKind } from './source-columns.ts';

const TODAY = '2026-10-16';

const table = (headers: string[], ...rows: string[][]): CsvTable => ({
  headers,
  rows: rows.map((cells, index) => ({
    rowNumber: index + 2,
    values: Object.fromEntries(headers.map((header, column) => [header, cells[column] ?? ''])),
  })),
});

const file = (kind: SourceKind, csvTable: CsvTable): SourceFile => ({
  kind,
  fileName: `${kind}/test.csv`,
  table: csvTable,
});

const run = (files: SourceFile[], overrides: Partial<ImportInput> = {}) =>
  buildImport({
    files,
    owners: [
      { owner: 'Sara', email: 'sara@ku.example' },
      { owner: 'Omar K', email: 'omar@ku.example' },
    ],
    valueOverrides: [],
    columnOverrides: [],
    today: TODAY,
    ...overrides,
  });

const OPPORTUNITY_HEADERS = ['Ref', 'Opportunity', 'Company', 'Stage', 'Owner', 'Next Action', 'Next Action Date'];

const opportunities = (...rows: string[][]) => file('opportunities', table(OPPORTUNITY_HEADERS, ...rows));

describe('companies', () => {
  it('merges on domain first, then on the normalised name', () => {
    const result = run([
      file('register', table(['Company Name', 'Website'], ['Desert Pipes L.L.C.', 'https://www.desertpipes.example'])),
      file('contacts', table(['Name', 'Email', 'Company', 'Website'], ['Fatima Hassan', 'fatima@dp.example', 'DP Group', 'desertpipes.example'], ['Ali Noor', '', 'Desert Pipes', ''])),
    ]);

    assert.equal(result.companies.length, 1);
    assert.equal(result.companies[0].name, 'Desert Pipes L.L.C.');
    assert.equal(result.companies[0].domain, 'desertpipes.example');
    assert.equal(result.people.every(({ companyId }) => companyId === result.companies[0].id), true);
  });

  it('keeps two companies with the same name and different websites apart and reports them', () => {
    const result = run([
      file('register', table(['Company', 'Website'], ['Twin Name Co', 'twin-a.example'], ['Twin Name', 'twin-b.example'])),
      opportunities(['OPP-1', 'Deal', 'Twin Name', 'New', 'Sara', 'Call', '2026-11-01']),
    ]);

    assert.equal(result.companies.length, 2);
    assert.equal(result.report.some(({ outcome, object }) => outcome === 'ambiguous' && object === 'Company'), true);
    assert.equal(result.opportunities.length, 0);
    assert.match(result.rejectedOpportunities[0].reasons.join(), /ambiguous/);
  });

  it('merges a short form mailing from the company domain, not a differently named unit', () => {
    const result = run([
      file('register', table(['Company', 'Website'], ['Gulf Drilling Services LLC', 'gulfdrill.example'])),
      file('workshops', table(['Name', 'Email', 'Organisation'], ['Ahmed Ali', 'ahmed@gulfdrill.example', 'Gulf Drilling'], ['Peter Brown', 'peter@gulfdrill.example', 'Gulf Drilling Offshore'])),
    ]);

    assert.deepEqual(result.companies.map(({ name }) => name).sort(), ['Gulf Drilling Offshore', 'Gulf Drilling Services LLC']);
    assert.equal(result.companies.find(({ name }) => name === 'Gulf Drilling Offshore')?.domain, null);
  });

  it('takes the domain from email addresses when only one company uses it, never a public mail domain', () => {
    const result = run([
      file('contacts', table(['Name', 'Email', 'Company'], ['A One', 'a@acme.example', 'Acme'], ['B Two', 'b@gmail.com', 'Beta Labs'])),
    ]);

    assert.equal(result.companies.find(({ name }) => name === 'Acme')?.domain, 'acme.example');
    assert.equal(result.companies.find(({ name }) => name === 'Beta Labs')?.domain, null);
  });

  it('sets sector from the register file name, and offset obligor when any source says yes', () => {
    const result = run([
      { kind: 'register', fileName: 'register/Oil & Gas cluster.csv', table: table(['Company', 'Offset obligor'], ['Gulf Drilling', 'Yes']) },
      opportunities(['OPP-1', 'Deal', 'Gulf Drilling', 'New', 'Sara', 'Call', '2026-11-01']),
    ]);

    assert.equal(result.companies[0].sector, 'OIL_AND_GAS');
    assert.equal(result.companies[0].isOffsetObligor, true);
  });

  it('gives the same id on every run', () => {
    const files = [file('register', table(['Company', 'Website'], ['Acme', 'acme.example']))];

    assert.equal(run(files).companies[0].id, run(files).companies[0].id);
    assert.equal(run(files).companies[0].id, recordIdFromKey('company:acme.example'));
  });
});

describe('people', () => {
  it('merges on email, then on name and company', () => {
    const result = run([
      file('register', table(['Company', 'Website'], ['Acme', 'acme.example'])),
      file('contacts', table(['First Name', 'Last Name', 'Email', 'Company', 'Job Title'], ['Sara', 'Khan', 'SARA@acme.example', 'Acme', 'CFO'])),
      file('workshops', table(['Attendee', 'Email', 'Organisation'], ['Dr. Sara Khan', 'sara@acme.example', 'Acme'], ['Sara Khan', '', 'Acme LLC'])),
    ]);

    assert.equal(result.people.length, 1);
    assert.equal(result.people[0].email, 'sara@acme.example');
    assert.equal(result.people[0].decisionRole, 'BUDGET_HOLDER');
  });

  it('reports the same name at the same company with two emails instead of merging', () => {
    const result = run([
      file('contacts', table(['Name', 'Email', 'Company'], ['Omar Saleh', 'omar@acme.example', 'Acme'], ['Omar Saleh', 'o.saleh@acme.example', 'Acme'])),
    ]);

    assert.equal(result.people.length, 2);
    assert.equal(result.report.some(({ outcome, object }) => outcome === 'ambiguous' && object === 'Person'), true);
  });

  it('rejects a person with neither email nor company', () => {
    const result = run([file('workshops', table(['Name', 'Email', 'Organisation'], ['Khalid Omar', '', '']))]);

    assert.equal(result.people.length, 0);
    assert.equal(result.report[0].outcome, 'rejected');
  });
});

describe('opportunities', () => {
  it('imports a complete row with its owner as the member login email', () => {
    const result = run([opportunities(['OPP-1', 'Licence deal', 'Acme', 'Negotiate', 'Sara', 'Send terms', '20/10/2026'])]);

    assert.equal(result.opportunities.length, 1);
    assert.deepEqual(
      { stage: result.opportunities[0].stage, owner: result.opportunities[0].ownerEmail, date: result.opportunities[0].nextActionDate },
      { stage: 'PROPOSAL', owner: 'sara@ku.example', date: '2026-10-20' },
    );
  });

  it('rejects rows missing an owner, a next action or its date, and keeps them for the owner of the sheet', () => {
    const result = run([
      opportunities(
        ['OPP-1', 'No owner', 'Acme', 'New', '', 'Call', '2026-11-01'],
        ['OPP-2', 'Unknown owner', 'Acme', 'New', 'Bob', 'Call', '2026-11-01'],
        ['OPP-3', 'No action', 'Acme', 'New', 'Sara', '', '2026-11-01'],
        ['OPP-4', 'No date', 'Acme', 'New', 'Sara', 'Call', ''],
        ['OPP-5', 'Past date', 'Acme', 'New', 'Sara', 'Call', '2026-10-15'],
        ['OPP-6', 'Deprecated stage', 'Acme', 'Customer', 'Sara', 'Call', '2026-11-01'],
      ),
    ]);

    assert.equal(result.opportunities.length, 0);
    assert.deepEqual(
      result.rejectedOpportunities.map(({ reasons }) => reasons[0]),
      [
        'missing owner',
        'owner "Bob" is not in owners.csv',
        'missing next action',
        'missing next action date',
        'next action date 2026-10-15 is in the past (W4 would flag it on day one)',
        'stage "Customer" is not a KUEC stage (map it in value-map.csv)',
      ],
    );
    assert.equal(result.rejectedOpportunities[0].values.Opportunity, 'No owner');
  });

  it('does not require a next action on a closed opportunity, but still requires an owner', () => {
    const result = run([
      opportunities(['OPP-1', 'Won', 'Acme', 'Signed', 'Sara', '', ''], ['OPP-2', 'Lost', 'Acme', 'Lost', '', '', '']),
    ]);

    assert.deepEqual(result.opportunities.map(({ stage }) => stage), ['SIGNED']);
    assert.deepEqual(result.rejectedOpportunities[0].reasons, ['missing owner']);
  });

  it('accepts a stage mapped in value-map.csv', () => {
    const result = run([opportunities(['OPP-1', 'Deal', 'Acme', 'Hot', 'Sara', 'Call', '2026-11-01'])], {
      valueOverrides: [{ field: 'stage', sourceValue: 'Hot', targetValue: 'MEETING' }],
    });

    assert.equal(result.opportunities[0].stage, 'MEETING');
  });

  it('imports one row per opportunity and rejects repeats', () => {
    const result = run([
      opportunities(['OPP-1', 'Deal', 'Acme', 'New', 'Sara', 'Call', '2026-11-01'], ['opp-1', 'Deal again', 'Acme', 'New', 'Sara', 'Call', '2026-11-02']),
    ]);

    assert.equal(result.opportunities.length, 1);
    assert.match(result.rejectedOpportunities[0].reasons[0], /duplicate of row 2/);
  });
});

describe('projects, milestones and contracts', () => {
  it('links milestones to projects and projects to opportunities, and rejects orphan milestones', () => {
    const result = run([
      opportunities(['OPP-1', 'Deal', 'Acme', 'New', 'Sara', 'Call', '2026-11-01']),
      file('projects', table(['Project ID', 'Project', 'Type', 'Opportunity'], ['PRJ-1', 'Delivery one', 'Delivery', 'OPP-1'])),
      file('milestones', table(['Project', 'Milestone', 'Due Date', 'Status'], ['PRJ-1', 'Kick-off', '01/11/2026', 'Done'], ['PRJ-9', 'Orphan', '01/11/2026', ''])),
    ]);

    assert.equal(result.projects[0].opportunityId, result.opportunities[0].id);
    assert.deepEqual(
      result.milestones.map(({ projectId, dueAt, status }) => ({ projectId, dueAt, status })),
      [{ projectId: result.projects[0].id, dueAt: '2026-11-01T17:00:00+04:00', status: 'DONE' }],
    );
    assert.equal(result.report.some(({ object, outcome }) => object === 'Milestone' && outcome === 'rejected'), true);
  });

  it('imports only contracts under negotiation, with a SharePoint link and nothing else', () => {
    const result = run([
      file(
        'contracts',
        table(
          ['Contract', 'Type', 'Status', 'Counterparty', 'Documents Link'],
          ['GDS licence', 'Licence', '', 'Gulf Drilling', 'https://kuac.sharepoint.com/sites/BD/GDS'],
          ['DP NDA', 'NDA', 'In negotiation', 'Desert Pipes', 'https://drive.example/file.pdf'],
          ['Old', 'Licence', 'Signed', 'Falcon', ''],
        ),
      ),
    ]);

    assert.deepEqual(
      result.contracts.map(({ name, status, sharepointFolderUrl }) => ({ name, status, sharepointFolderUrl })),
      [
        { name: 'GDS licence', status: 'IN_NEGOTIATION', sharepointFolderUrl: 'https://kuac.sharepoint.com/sites/BD/GDS' },
        { name: 'DP NDA', status: 'IN_NEGOTIATION', sharepointFolderUrl: null },
      ],
    );
  });
});

describe('outputs', () => {
  it('uses the labels of Twenty\'s import dialog as headers, in import order', () => {
    const files = importFiles(run([opportunities(['OPP-1', 'Deal', 'Acme', 'New', 'Sara', 'Call', '2026-11-01'])]));

    assert.deepEqual(files.map(({ fileStem }) => fileStem), [
      '01-companies',
      '02-people',
      '03-opportunities',
      '04-projects',
      '05-milestones',
      '06-contracts',
    ]);
    assert.deepEqual(files[2].columns.map(({ header }) => header).slice(0, 7), [
      'ID',
      'Name',
      'Company / ID',
      'Point of Contact / ID',
      'Owner / User Email',
      'Type',
      'Stage',
    ]);
  });

  it('keeps batches under 2,000 rows', () => {
    assert.equal(MAX_ROWS_PER_FILE < 2_000, true);
  });

  it('checks every imported opportunity for a stage column and a next action date', () => {
    const result = run([opportunities(['OPP-1', 'Deal', 'Acme', 'New', 'Sara', 'Call', '2026-11-01'])]);
    const sql = buildPostImportCheckSql(result.opportunities);

    assert.match(sql, new RegExp(`'${result.opportunities[0].id}'::uuid, 'NEW'`));
    assert.match(sql, /AS in_no_next_action/);
    assert.match(sql, /AS not_in_a_kuec_stage/);
  });
});
