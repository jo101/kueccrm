// Test records for the UX audit: one company, person, lead, opportunity, project, and one work package per status for Bader.
import { readFileSync, writeFileSync } from 'node:fs';

const REHEARSAL = new URL('../release-gate/rehearsal/', import.meta.url).pathname;
const KEY = readFileSync(`${REHEARSAL}admin.apikey`, 'utf8').trim();
const members = JSON.parse(readFileSync(`${REHEARSAL}members.json`, 'utf8'));

const rest = async (method, path, body) => {
  const response = await fetch(`http://localhost:3000/rest/${path}`, {
    method,
    headers: { 'content-type': 'application/json', authorization: `Bearer ${KEY}` },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const json = await response.json();
  if (response.status >= 300) throw new Error(`${method} ${path} ${response.status} ${JSON.stringify(json).slice(0, 400)}`);
  return json.data;
};
const created = (data) => Object.values(data)[0];
const inDays = (days) => new Date(Date.now() + days * 86_400_000).toISOString();

const company = created(await rest('POST', 'companies', { name: 'Test Gulf Coatings LLC', domainName: { primaryLinkUrl: 'https://gulfcoatings.test' }, sector: 'OIL_AND_GAS', accountOwnerId: members.bd1.memberId }));
const person = created(await rest('POST', 'people', { name: { firstName: 'Test', lastName: 'Contact' }, emails: { primaryEmail: 'test.contact@gulfcoatings.test' }, companyId: company.id, jobTitle: 'R&D manager' }));
const opportunity = created(await rest('POST', 'opportunities', { name: 'Test Gulf Coatings: salt-spray testing', companyId: company.id, ownerId: members.bd1.memberId, source: 'INBOUND', nextAction: 'Send the scope', nextActionDate: inDays(3) }));
const lead = created(await rest('POST', 'leads', { name: 'Test lead from a business card', companyId: company.id, personId: person.id, source: 'EXHIBITION', need: 'Corrosion testing of pipeline coatings', ownerId: members.bd1.memberId }));

const STATUSES = ['PLANNED', 'OFFERED', 'ACCEPTED', 'SUBMITTED', 'BLOCKED', 'DONE', 'DECLINED', 'CANCELLED'];
const workPackages = {};
for (const [index, status] of STATUSES.entries()) {
  const workPackage = created(await rest('POST', 'workPackages', {
    name: `Test ${status.toLowerCase()} scoping`,
    ownerId: members.bd1.memberId,
    reviewerId: members.ed.memberId,
    opportunityId: opportunity.id,
    dueAt: inDays(index % 3 === 0 ? -2 : 4),
    objective: 'Define the technical work the client needs.',
    expectedOutput: 'Scope: tasks, method, equipment, staff time, assumptions, exclusions.',
    doneCriteria: 'Scope covers every requirement, effort is estimated in person-days, and the reviewer has signed off.',
  }));
  if (status !== 'PLANNED') {
    await rest('PATCH', `workPackages/${workPackage.id}`, status === 'BLOCKED'
      ? { status, blockedReason: 'Waiting for the client to send the coating spec sheet.' }
      : status === 'DECLINED' ? { status, declinedReason: 'On leave from 20 Oct.' } : { status });
  }
  workPackages[status] = workPackage.id;
}
const ids = { company: company.id, person: person.id, opportunity: opportunity.id, lead: lead.id, workPackages };
writeFileSync(new URL('./evidence/ux-ids.json', import.meta.url), JSON.stringify(ids, null, 1));
console.log(JSON.stringify(ids, null, 1));
