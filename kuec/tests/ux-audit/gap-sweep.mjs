// Records one of every engagement type, source, document type and opportunity type as a BD officer, with that person's token.
import { readFileSync, writeFileSync } from 'node:fs';
import { PASSWORD } from './browser.mjs';

const REHEARSAL = new URL('../release-gate/rehearsal/', import.meta.url).pathname;
const BASE = 'http://localhost:3000';
const ids = JSON.parse(readFileSync(new URL('./evidence/ux-ids.json', import.meta.url)));
const model = JSON.parse(readFileSync(new URL('./evidence/model.json', import.meta.url)));
const members = JSON.parse(readFileSync(`${REHEARSAL}members.json`, 'utf8'));

const gql = async (query, variables, token) => {
  const response = await fetch(`${BASE}/metadata`, { method: 'POST', headers: { 'content-type': 'application/json', ...(token ? { authorization: `Bearer ${token}` } : {}) }, body: JSON.stringify({ query, variables }) });
  return response.json();
};
const login = await gql('mutation($e: String!, $p: String!, $o: String!) { getLoginTokenFromCredentials(email:$e, password:$p, origin:$o) { loginToken { token } } }', { e: 'bd1@kuec.test', p: PASSWORD, o: 'http://server:3000' });
const tokens = await gql('mutation($t: String!, $o: String!) { getAuthTokensFromLoginToken(loginToken:$t, origin:$o) { tokens { accessOrWorkspaceAgnosticToken { token } } } }', { t: login.data.getLoginTokenFromCredentials.loginToken.token, o: 'http://server:3000' });
const TOKEN = tokens.data.getAuthTokensFromLoginToken.tokens.accessOrWorkspaceAgnosticToken.token;

const rest = async (method, path, body) => {
  const response = await fetch(`${BASE}/rest/${path}`, { method, headers: { 'content-type': 'application/json', authorization: `Bearer ${TOKEN}` }, body: JSON.stringify(body) });
  const json = await response.json();
  return { status: response.status, id: json.data ? Object.values(json.data)[0]?.id : undefined, error: json.messages?.join('; ') ?? json.error ?? json.errors?.[0]?.message };
};
const options = (object, field) => [...model.objects.find((candidate) => candidate.nameSingular === object).fieldsList.find((candidate) => candidate.name === field).options].sort((a, b) => a.position - b.position);

const results = { engagementKind: [], opportunitySource: [], leadSource: [], opportunityType: [], documentType: [] };
const today = new Date().toISOString().slice(0, 10);

for (const option of options('engagement', 'kind')) {
  const created = await rest('POST', 'engagements', { name: `Gap sweep: ${option.label}`, kind: option.value, date: today, companyId: ids.company, opportunityId: ids.opportunity, ownerId: members.bd1.memberId, ...(option.value === 'OTHER' ? { otherDetails: 'Gap sweep' } : {}) });
  results.engagementKind.push({ label: option.label, value: option.value, ...created });
}
for (const option of options('opportunity', 'source')) {
  const created = await rest('POST', 'opportunities', { name: `Gap sweep source: ${option.label}`, source: option.value, companyId: ids.company, ownerId: members.bd1.memberId, nextAction: 'Gap sweep', nextActionDate: today });
  results.opportunitySource.push({ label: option.label, value: option.value, ...created });
}
for (const option of options('lead', 'source')) {
  const created = await rest('POST', 'leads', { name: `Gap sweep lead: ${option.label}`, source: option.value, companyId: ids.company, need: 'Gap sweep' });
  results.leadSource.push({ label: option.label, value: option.value, ...created });
}
for (const option of options('opportunity', 'playbookType')) {
  const created = await rest('POST', 'opportunities', { name: `Gap sweep type: ${option.label}`, companyId: ids.company, ownerId: members.bd1.memberId, nextAction: 'Gap sweep', nextActionDate: today });
  const typed = created.id ? await rest('PATCH', `opportunities/${created.id}`, { playbookType: option.value }) : created;
  results.opportunityType.push({ label: option.label, value: option.value, create: created.status, setType: typed.status, error: typed.error, id: created.id });
}
for (const option of options('document', 'kind')) {
  const created = await rest('POST', 'documents', { name: `Gap sweep doc: ${option.label}`, kind: option.value, companyId: ids.company, opportunityId: ids.opportunity, ownerId: members.bd1.memberId, documentLink: { primaryLinkUrl: 'https://kuec.sharepoint.com/sites/BD/test' } });
  results.documentType.push({ label: option.label, value: option.value, ...created });
}
await new Promise((resolve) => setTimeout(resolve, 45000));
// Which opportunity types produced work packages (a playbook) after 45 seconds?
for (const row of results.opportunityType) {
  if (!row.id) continue;
  const response = await fetch(`${BASE}/rest/workPackages?filter=opportunityId[eq]:${row.id}&limit=20`, { headers: { authorization: `Bearer ${TOKEN}` } });
  row.workPackages = (await response.json()).data?.workPackages?.length ?? 'n/a';
}
writeFileSync(new URL('./evidence/gap-sweep.json', import.meta.url), JSON.stringify(results, null, 1));
for (const [list, rows] of Object.entries(results)) {
  if (!rows.length) continue;
  const failed = rows.filter((row) => (row.status ?? row.setType ?? row.create) >= 300);
  console.log(`${list}: ${rows.length} tried, ${rows.length - failed.length} recorded${failed.length ? `; failed: ${failed.map((row) => `${row.label} (${row.status ?? row.setType} ${row.error ?? ''})`).join(', ')}` : ''}`);
}
console.log('types with work packages:', results.opportunityType.filter((row) => row.workPackages > 0).map((row) => `${row.label}=${row.workPackages}`).join(', ') || 'none');
