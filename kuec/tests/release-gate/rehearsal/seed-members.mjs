import { gql, ADMIN_KEY, PASSWORD } from './lib.mjs';
import { readFileSync, writeFileSync } from 'node:fs';
const adminToken = readFileSync(new URL('../rehearsal/admin.token', import.meta.url), 'utf8').trim();
const ws = await gql('metadata', '{ currentWorkspace { id inviteHash } }', {}, adminToken);
const { id: workspaceId, inviteHash } = ws.data.currentWorkspace;
const roles = Object.fromEntries((await gql('metadata', '{ getRoles { id label } }')).data.getRoles.map((r) => [r.label, r.id]));
const PEOPLE = [
  ['ed', 'Executive', 'Director', 'ED'],
  ['ops', 'Olivia', 'Ops', 'Ops coordinator'],
  ['bd1', 'Bader', 'One', 'BD officer'],
  ['bd2', 'Bushra', 'Two', 'BD officer'],
  ['dev', 'Dana', 'Developer', 'BD officer'],
  ['analyst', 'Adel', 'Analyst', 'BD officer'],
  ['legal', 'Layla', 'Legal', 'BD officer'],
  ['eng', 'Ehab', 'Engineer', 'Engineer'],
  ['viewer', 'Vera', 'Viewer', 'Leadership viewer'],
  ['ipo', 'Imran', 'Ipoffice', 'IP office'],
];
const out = {};
for (const [handle, first, last, role] of PEOPLE) {
  const email = `${handle}@kuec.test`;
  const signUp = await gql('metadata', `mutation($e: String!, $p: String!, $h: String!, $w: UUID) { signUpInWorkspace(email:$e, password:$p, workspaceInviteHash:$h, workspaceId:$w) { loginToken { token } } }`, { e: email, p: PASSWORD, h: inviteHash, w: workspaceId }, null);
  if (signUp.errors) { console.log(handle, 'signup error', JSON.stringify(signUp.errors).slice(0, 300)); }
  out[handle] = { email, role };
}
const members = await gql('graphql', '{ workspaceMembers(first: 100) { edges { node { id userEmail name { firstName lastName } } } } }');
const byEmail = Object.fromEntries(members.data.workspaceMembers.edges.map(({ node }) => [node.userEmail, node.id]));
for (const [handle, first, last, role] of PEOPLE) {
  const memberId = byEmail[out[handle].email];
  out[handle].memberId = memberId;
  await gql('graphql', `mutation($id: UUID!, $d: WorkspaceMemberUpdateInput!) { updateWorkspaceMember(id:$id, data:$d) { id } }`, { id: memberId, d: { name: { firstName: first, lastName: last } } });
  const assign = await gql('metadata', `mutation($m: UUID!, $r: UUID!) { updateWorkspaceMemberRole(workspaceMemberId:$m, roleId:$r) { id } }`, { m: memberId, r: roles[role] }, adminToken);
  console.log(handle, out[handle].email, role, memberId, assign.errors ? 'ROLE ERROR ' + JSON.stringify(assign.errors).slice(0, 200) : 'role ok');
}
out.admin = { email: 'deploy.engineer@kuec.test', memberId: byEmail['deploy.engineer@kuec.test'], role: 'Admin' };
writeFileSync(new URL('../rehearsal/members.json', import.meta.url), JSON.stringify(out, null, 2));
