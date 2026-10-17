// Section 5 load: 500 companies, 2,000 people, 200 opportunities, 1,000 work packages, then timings.
import { readFileSync, writeFileSync } from 'node:fs';
import { rest, list, ADMIN_KEY } from './lib.mjs';
const members = JSON.parse(readFileSync(new URL('../rehearsal/members.json', import.meta.url)));
const owners = ['bd1', 'bd2', 'dev', 'analyst', 'legal'].map((h) => members[h].memberId);
const SECTORS = ['OIL_AND_GAS', 'ENERGY_AND_UTILITIES', 'DEFENCE_AND_SECURITY', 'AEROSPACE', 'HEALTHCARE', 'MANUFACTURING', 'GOVERNMENT'];
const batch = async (plural, rows) => {
  const ids = [];
  for (let i = 0; i < rows.length; i += 100) {
    const r = await rest('POST', `batch/${plural}`, rows.slice(i, i + 100), ADMIN_KEY);
    const key = Object.keys(r.json?.data ?? {})[0];
    if (r.status >= 300 || !key) throw new Error(`${plural} ${r.status} ${JSON.stringify(r.json).slice(0, 300)}`);
    ids.push(...r.json.data[key].map((x) => x.id));
  }
  return ids;
};
const t0 = Date.now();
const listAll = async (plural, filter) => { let out = [], cursor; for (;;) { const r = await rest('GET', `${plural}?limit=200&filter=${encodeURIComponent(filter)}${cursor ? `&starting_after=${cursor}` : ''}`, undefined, ADMIN_KEY); const rows = r.json.data[plural]; out.push(...rows.map((x) => x.id)); if (!r.json.pageInfo?.hasNextPage) return out; cursor = r.json.pageInfo.endCursor; } };
const existing = await listAll('companies', 'name[like]:"Load Company %"');
const companies = existing.length >= 500 ? existing : await batch('companies', Array.from({ length: 500 }, (_, i) => ({ name: `Load Company ${i} LLC`, domainName: { primaryLinkUrl: `https://load-${i}.test` }, sector: SECTORS[i % SECTORS.length], accountTier: ['TIER_1', 'TIER_2', 'TIER_3'][i % 3], accountOwnerId: owners[i % owners.length] })));
const existingPeople = await listAll('people', 'jobTitle[eq]:"Engineer"');
const people = existingPeople.length >= 2000 ? existingPeople : await batch('people', Array.from({ length: 2000 }, (_, i) => ({ name: { firstName: `Load${i}`, lastName: `Person${i}` }, emails: { primaryEmail: `load${i}@load-${i % 500}.test` }, companyId: companies[i % 500], jobTitle: 'Engineer' })));
const due = (d) => new Date(Date.UTC(2026, 9, 19 + (d % 30), 13)).toISOString();
const existingOpps = await listAll('opportunities', 'name[like]:"Load Co %"');
const opportunities = existingOpps.length >= 200 ? existingOpps : await batch('opportunities', Array.from({ length: 200 }, (_, i) => ({ name: `Load Co ${i} – Licence – Topic ${i}`, companyId: companies[i % 500], ownerId: owners[i % owners.length], stage: ['NEW', 'SCREENING', 'MEETING', 'PROPOSAL'][i % 4], nextAction: 'Follow up', nextActionDate: due(i).slice(0, 10), amount: { amountMicros: (100000 + i * 1000) * 1e6, currencyCode: 'AED' }, closeDate: due(i + 40) })));
const workPackages = await batch('workPackages', Array.from({ length: 1000 }, (_, i) => ({ name: `Draft load item ${i}`, opportunityId: opportunities[i % 200], ownerId: owners[i % owners.length], reviewerId: members.ed.memberId, status: ['OFFERED', 'ACCEPTED', 'SUBMITTED', 'PLANNED'][i % 4], dueAt: due(i), doneCriteria: 'Reviewed and signed off' })));
const seedMs = Date.now() - t0;
const time = async (label, fn, n = 20) => { const ms = []; for (let i = 0; i < n; i++) { const s = performance.now(); await fn(i); ms.push(performance.now() - s); } ms.sort((a, b) => a - b); return { label, n, p50: Math.round(ms[Math.floor(n * 0.5)]), p95: Math.round(ms[Math.floor(n * 0.95)]), max: Math.round(ms[n - 1]) }; };
const timings = [
  await time('GET one company with depth 1', (i) => rest('GET', `companies/${companies[i * 7]}?depth=1`, undefined, ADMIN_KEY)),
  await time('GET one person with depth 1', (i) => rest('GET', `people/${people[i * 50]}?depth=1`, undefined, ADMIN_KEY)),
  await time('GET one opportunity with depth 1', (i) => rest('GET', `opportunities/${opportunities[i * 5]}?depth=1`, undefined, ADMIN_KEY)),
  await time('GET one work package with depth 1', (i) => rest('GET', `workPackages/${workPackages[i * 30]}?depth=1`, undefined, ADMIN_KEY)),
  await time('List 60 open work packages sorted by due (My work shape)', () => rest('GET', `workPackages?limit=60&filter=${encodeURIComponent('status[in]:[OFFERED,ACCEPTED,SUBMITTED,BLOCKED]')}&order_by=dueAt`, undefined, ADMIN_KEY), 10),
  await time('List 60 open opportunities (Pipeline shape)', () => rest('GET', `opportunities?limit=60&filter=${encodeURIComponent('stage[in]:[NEW,SCREENING,MEETING,PROPOSAL,CUSTOMER]')}&order_by=closeDate`, undefined, ADMIN_KEY), 10),
];
writeFileSync(new URL('./load-result.json', import.meta.url), JSON.stringify({ counts: { companies: companies.length, people: people.length, opportunities: opportunities.length, workPackages: workPackages.length }, seedMs, timings }, null, 2));
console.log(JSON.stringify({ counts: { companies: companies.length, people: people.length, opportunities: opportunities.length, workPackages: workPackages.length }, seedMs }));
for (const t of timings) console.log(JSON.stringify(t));
