// Reference data per config/dashboards/kuec-bd-ops-variables.md, entered as the ops coordinator.
import { rest, personaToken } from './lib.mjs';
import { readFileSync } from 'node:fs';
const members = JSON.parse(readFileSync(new URL('../rehearsal/members.json', import.meta.url)));
const ops = await personaToken(members.ops.email);
const ASSIGNMENTS = [
  ['ed', 'ED'], ['ops', 'OPS_COORDINATOR'], ['bd1', 'BD_OFFICER'], ['bd2', 'BD_OFFICER'],
  ['dev', 'DEVELOPER'], ['analyst', 'DATA_ANALYST'], ['legal', 'LEGAL'],
];
for (const [handle, role] of ASSIGNMENTS) {
  const r = await rest('POST', 'playbookRoleAssignments', { name: `${handle} ${role}`, playbookRole: role, memberId: members[handle].memberId, isActive: true }, ops);
  console.log('assignment', handle, role, r.status, r.status >= 300 ? JSON.stringify(r.json).slice(0, 300) : r.json.data?.createPlaybookRoleAssignment?.id);
}
const HOLIDAYS = [['Commemoration Day', '2026-12-01'], ['National Day', '2026-12-02'], ['National Day holiday', '2026-12-03'], ["New Year's Day", '2027-01-01']];
for (const [name, date] of HOLIDAYS) {
  const r = await rest('POST', 'publicHolidays', { name, date }, ops);
  console.log('holiday', date, r.status, r.status >= 300 ? JSON.stringify(r.json).slice(0, 300) : r.json.data?.createPublicHoliday?.id);
}
