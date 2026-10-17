// Section 3: the can/cannot matrix of runbooks/13-roles.md section 1, through the API, one token per role.
import { readFileSync, writeFileSync } from 'node:fs';
import { gql, rest, personaToken, ADMIN_KEY } from './lib.mjs';
const members = JSON.parse(readFileSync(new URL('../rehearsal/members.json', import.meta.url)));
const adminUser = await personaToken('deploy.engineer@kuec.test');
const roles = (await gql('metadata', '{ getRoles { id label canUpdateAllSettings canReadAllObjectRecords canUpdateAllObjectRecords canSoftDeleteAllObjectRecords canDestroyAllObjectRecords permissionFlags { flag } } }', {}, adminUser)).data.getRoles;
const roleId = (label) => roles.find((r) => r.label === label).id;
const makeKey = async (label) => {
  const created = await gql('metadata', `mutation($r: UUID!) { createApiKey(input:{name:"rehearsal-${label.replace(/\W+/g, '-').toLowerCase()}", expiresAt:"2026-11-30T00:00:00Z", roleId:$r}) { id } }`, { r: roleId(label) }, adminUser);
  return (await gql('metadata', `mutation($id: UUID!) { generateApiKeyToken(apiKeyId:$id, expiresAt:"2026-11-30T00:00:00Z") { token } }`, { id: created.data.createApiKey.id }, adminUser)).data.generateApiKeyToken.token;
};
const PRINCIPALS = {
  'ED': await personaToken(members.ed.email),
  'Ops coordinator': await personaToken(members.ops.email),
  'BD officer': await personaToken(members.bd1.email),
  'Engineer': await personaToken(members.eng.email),
  'Leadership viewer': await personaToken(members.viewer.email),
  'IP office (department)': await personaToken(members.ipo.email),
  'Automation (API key)': await makeKey('Automation'),
  'uVENTURE reader (API key)': await makeKey('uVENTURE reader'),
};
const OBJECTS = {
  opportunities: { singular: 'opportunity', body: { name: 'perm-test opportunity' } },
  companies: { singular: 'company', body: { name: 'perm-test company' } },
  people: { singular: 'person', body: { name: { firstName: 'Perm', lastName: 'Test' } } },
  leads: { singular: 'lead', body: { name: 'perm-test lead' } },
  engagements: { singular: 'engagement', body: { name: 'perm-test engagement' } },
  documents: { singular: 'document', body: { name: 'perm-test document' } },
  campaignTargets: { singular: 'campaignTarget', body: { name: 'perm-test target' } },
  tasks: { singular: 'task', body: { title: 'perm-test task' } },
  notes: { singular: 'note', body: { title: 'perm-test note' } },
  workPackages: { singular: 'workPackage', body: { name: 'perm-test work package' } },
  projects: { singular: 'project', body: { name: 'perm-test project' } },
  milestones: { singular: 'milestone', body: { name: 'perm-test milestone' } },
  contracts: { singular: 'contract', body: { name: 'perm-test contract' } },
  capabilities: { singular: 'capability', body: { name: 'perm-test capability' } },
};
// Expected from runbooks/13-roles.md section 1 (R read, W write, D delete).
const ALL = Object.keys(OBJECTS);
const BD_W = ['leads', 'opportunities', 'companies', 'people', 'engagements', 'documents', 'campaignTargets', 'tasks', 'notes'];
const DEPT_W = ['leads', 'opportunities', 'engagements', 'documents', 'campaignTargets', 'tasks', 'notes'];
const AUTO_RW = ['opportunities', 'companies', 'people', 'tasks', 'notes', 'projects', 'milestones', 'workPackages', 'contracts', 'engagements', 'leads', 'documents'];
const UV_R = ['opportunities', 'leads', 'engagements', 'contracts', 'capabilities', 'companies', 'people'];
const VIEW_R = ['opportunities', 'projects', 'milestones', 'contracts', 'companies'];
const EXPECT = {
  'ED': { R: ALL, W: ALL.filter((o) => o !== 'capabilities'), D: ALL.filter((o) => o !== 'capabilities') },
  'Ops coordinator': { R: ALL, W: ALL.filter((o) => o !== 'capabilities'), D: ALL.filter((o) => o !== 'capabilities') },
  'BD officer': { R: ALL, W: BD_W, D: [] },
  'Engineer': { R: ALL, W: [], D: [] },
  'Leadership viewer': { R: VIEW_R, W: [], D: [] },
  'IP office (department)': { R: ALL, W: DEPT_W, D: [] },
  'Automation (API key)': { R: AUTO_RW, W: AUTO_RW, D: [] },
  'uVENTURE reader (API key)': { R: UV_R, W: [], D: [] },
};
const results = [];
for (const [principal, token] of Object.entries(PRINCIPALS)) {
  for (const [plural, { singular, body }] of Object.entries(OBJECTS)) {
    const read = await rest('GET', `${plural}?limit=1`, undefined, token);
    const create = await rest('POST', plural, body, token);
    const createdId = create.json?.data?.[`create${singular[0].toUpperCase()}${singular.slice(1)}`]?.id;
    if (createdId) await rest('DELETE', `${plural}/${createdId}`, undefined, ADMIN_KEY);
    const victim = await rest('POST', plural, body, ADMIN_KEY);
    const victimId = victim.json?.data?.[`create${singular[0].toUpperCase()}${singular.slice(1)}`]?.id;
    const del = victimId ? await rest('DELETE', `${plural}/${victimId}`, undefined, token) : { status: 'n/a' };
    if (victimId) await rest('DELETE', `${plural}/${victimId}`, undefined, ADMIN_KEY);
    const got = { R: read.status === 200, W: create.status === 201, D: del.status === 200 };
    const want = { R: EXPECT[principal].R.includes(plural), W: EXPECT[principal].W.includes(plural), D: EXPECT[principal].D.includes(plural) };
    const ok = got.R === want.R && got.W === want.W && got.D === want.D;
    results.push({ principal, object: plural, read: read.status, create: create.status, delete: del.status, want, ok });
    if (!ok) console.log('MISMATCH', principal, plural, JSON.stringify({ got, want, read: read.status, create: create.status, del: del.status, msg: JSON.stringify(create.json).slice(0, 160) }));
  }
}
// System and locked fields
const wp = (await rest('POST', 'workPackages', { name: 'perm-test locked fields' }, ADMIN_KEY)).json.data.createWorkPackage.id;
const lead = (await rest('POST', 'leads', { name: 'perm-test locked lead' }, ADMIN_KEY)).json.data.createLead.id;
const locked = [];
for (const [principal, token] of Object.entries(PRINCIPALS)) {
  const stamp = await rest('PATCH', `workPackages/${wp}`, { offeredAt: new Date().toISOString() }, token);
  const ext = await rest('PATCH', `leads/${lead}`, { externalId: `perm:${principal.replace(/\W+/g, '')}` }, token);
  locked.push({ principal, appStampOfferedAt: stamp.status, openLockedExternalId: ext.status });
}
await rest('DELETE', `workPackages/${wp}`, undefined, ADMIN_KEY); await rest('DELETE', `leads/${lead}`, undefined, ADMIN_KEY);
const flags = roles.map((r) => ({ role: r.label, settings: r.canUpdateAllSettings, flags: r.permissionFlags.map((f) => f.flag).sort() }));
writeFileSync(new URL('./permissions-result.json', import.meta.url), JSON.stringify({ results, locked, flags }, null, 2));
console.log(`matrix: ${results.filter((r) => r.ok).length}/${results.length} cells as runbook 13 says`);
console.log('locked fields:', JSON.stringify(locked));
for (const f of flags) console.log('flags', f.role, f.settings ? '(all settings)' : '', f.flags.join(' '));
