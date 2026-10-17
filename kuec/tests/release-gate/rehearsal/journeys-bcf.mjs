// Journeys (b) RFQ playbook, (c) workshop project and milestones, (f) uVENTURE inbound signature.
import { createHmac, randomUUID } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { BASE, rest, list, personaToken, waitFor } from './lib.mjs';
const RUN = process.env.RUN ?? `j${Date.now().toString(36)}`;
const members = JSON.parse(readFileSync(new URL('../rehearsal/members.json', import.meta.url)));
const secrets = JSON.parse(readFileSync(new URL('../rehearsal/secrets.json', import.meta.url)));
const handleOf = (id) => Object.entries(members).find(([, m]) => m.memberId === id)?.[0] ?? id;
const steps = [];
const record = (journey, step, ok, detail) => { steps.push({ journey, step, ok, detail }); console.log(`${ok ? 'PASS' : 'FAIL'} (${journey}) ${step} :: ${typeof detail === 'string' ? detail : JSON.stringify(detail)}`.slice(0, 900)); };
const bd1 = await personaToken(members.bd1.email);
const ops = await personaToken(members.ops.email);

// (b) inbound RFQ: opportunity by bd1, type Technical service, client deadline
const rfq = await rest('POST', 'opportunities', { name: `RFQCo – Technical service – Membrane tests ${RUN}`, ownerId: members.bd1.memberId, nextAction: 'Bid or no-bid call', nextActionDate: '2026-10-20', clientDeadline: '2026-11-20' }, bd1);
const rfqId = rfq.json?.data?.createOpportunity?.id;
record('b', 'bd1 creates the RFQ opportunity', rfq.status === 201, `${rfq.status} ${rfqId ?? JSON.stringify(rfq.json).slice(0, 200)}`);
const setType = await rest('PATCH', `opportunities/${rfqId}`, { playbookType: 'RFQ_TECHNICAL_SERVICE' }, bd1);
record('b', 'bd1 sets Type Technical service', setType.status === 200, `${setType.status}`);
const rfqWps = await waitFor('rfq wps', () => list('workPackages', `opportunityId[eq]:"${rfqId}"`), (rows) => rows.length >= 7, 120_000);
record('b', 'W1: seven RFQ work packages, capped before the client deadline', rfqWps.ok && rfqWps.value.every((w) => !w.dueAt || w.dueAt <= '2026-11-20T23:59:59Z'), rfqWps.value.sort((a, b) => (a.dueAt ?? '').localeCompare(b.dueAt ?? '')).map((w) => `${w.name}|${w.status}|${handleOf(w.ownerId)}|${w.dueAt?.slice(0, 10)}`));
const rfqOpp = await waitFor('rfq applied', async () => (await list('opportunities', `id[eq]:"${rfqId}"`))[0], (o) => o?.playbookApplied === true, 60_000);
record('b', 'W1: playbookApplied true (guard set last)', rfqOpp.ok, { playbookApplied: rfqOpp.value?.playbookApplied });

// (c) workshop project with an event date, as ops
const proj = await rest('POST', 'projects', { name: `Workshop – Water reuse – 2026 ${RUN}`, ownerId: members.bd2.memberId, eventDate: '2026-12-15', status: 'ACTIVE' }, ops);
const projectId = proj.json?.data?.createProject?.id;
record('c', 'ops creates the workshop project', proj.status === 201, `${proj.status} ${projectId ?? JSON.stringify(proj.json).slice(0, 300)}`);
const ptype = await rest('PATCH', `projects/${projectId}`, { playbookType: 'WORKSHOP' }, ops);
record('c', 'ops sets Type Workshop', ptype.status === 200, `${ptype.status} ${ptype.status !== 200 ? JSON.stringify(ptype.json).slice(0, 200) : ''}`);
const ms = await waitFor('milestones', () => list('milestones', `projectId[eq]:"${projectId}"`), (rows) => rows.length > 0, 120_000);
record('c', 'W9: milestones created', ms.ok, ms.value.map((m) => `${m.name}|${m.status}|${m.dueAt?.slice(0, 10)}`));
const pwps = await list('workPackages', `projectId[eq]:"${projectId}"`);
record('c', 'W9: work packages created, planned back from the event date', pwps.length > 0 && pwps.every((w) => !w.dueAt || w.dueAt <= '2026-12-31'), pwps.map((w) => `${w.name}|${w.status}|${handleOf(w.ownerId)}|${w.dueAt?.slice(0, 10)}`));
const pApplied = await waitFor('project applied', async () => (await list('projects', `id[eq]:"${projectId}"`))[0], (p) => p?.playbookApplied === true, 60_000);
record('c', 'W9: playbookApplied true', pApplied.ok, { playbookApplied: pApplied.value?.playbookApplied });
if (ms.value.length > 0) {
  const missed = await rest('PATCH', `milestones/${ms.value[0].id}`, { status: 'MISSED' }, ops);
  record('c', 'ops marks a milestone Missed', missed.status === 200, `${missed.status}`);
  const red = await waitFor('health red', async () => (await list('projects', `id[eq]:"${projectId}"`))[0], (p) => p?.health === 'RED', 90_000);
  record('c', 'W10: project health Red and percent complete updated', red.ok, { health: red.value?.health, percentComplete: red.value?.percentComplete });
}

// (f) uVENTURE inbound: invalid signature refused and logged, valid accepted
const fixture = JSON.parse(readFileSync(new URL('../../uventure/fixtures/u1-technology-created.json', import.meta.url), 'utf8').replaceAll('{{now}}', new Date().toISOString()));
const send = async (secret, delivery) => {
  const body = JSON.stringify(fixture.delivery); const ts = String(Math.floor(Date.now() / 1000));
  const r = await fetch(`${BASE}/s/integrations/uventure/events`, { method: 'POST', headers: { 'content-type': 'application/json', 'x-kuec-timestamp': ts, 'x-kuec-signature': `v1=${createHmac('sha256', secret).update(`${ts}.${body}`).digest('hex')}`, 'x-kuec-delivery': delivery }, body });
  return { status: r.status, text: await r.text() };
};
const badDelivery = `${RUN}-uv-bad`;
const bad = await send('not-the-secret', badDelivery);
record('f', 'invalid signature rejected', bad.status === 401, `${bad.status} ${bad.text}`);
const good = await send(secrets.UVENTURE_SIGNING_SECRET, `${RUN}-uv-good`);
record('f', 'valid signature accepted', good.status === 202, `${good.status} ${good.text}`);
const extId = `uventure:${fixture.delivery.events[0].data.id}`;
const cap = await waitFor('capability', () => list('capabilities', `externalId[eq]:"${extId}"`), (rows) => rows.length > 0, 120_000);
record('f', 'U1: one Capability pointer created from the valid delivery', cap.ok && cap.value.length === 1, cap.value.map((c) => ({ id: c.id, name: c.name, kind: c.kind, status: c.status, sourceSystem: c.sourceSystem })));
writeFileSync(new URL(`./journeys-bcf-${RUN}.json`, import.meta.url), JSON.stringify({ RUN, rfqId, projectId, badDelivery, steps }, null, 2));
console.log(`RESULT ${steps.filter((s) => !s.ok).length} failed of ${steps.length}`);
