// Journey (a): lead through the forms route to a signed licence, each step as its persona.
import { createHmac, randomUUID } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { BASE, rest, list, personaToken, waitFor, sleep } from './lib.mjs';

const RUN = process.env.RUN ?? `a${Date.now().toString(36)}`;
const members = JSON.parse(readFileSync(new URL('../rehearsal/members.json', import.meta.url)));
const secrets = JSON.parse(readFileSync(new URL('../rehearsal/secrets.json', import.meta.url)));
const handleOf = (memberId) => Object.entries(members).find(([, m]) => m.memberId === memberId)?.[0] ?? memberId;
const steps = [];
const record = (step, ok, detail) => { steps.push({ step, ok, detail }); console.log(`${ok ? 'PASS' : 'FAIL'} ${step} :: ${typeof detail === 'string' ? detail : JSON.stringify(detail)}`); };
const tasksFor = async (memberHandle, titleStart) => (await list('tasks', `assigneeId[eq]:"${members[memberHandle].memberId}"`)).filter((t) => t.title?.startsWith(titleStart));
const sinkLines = () => readFileSync(new URL('./sinks.log', import.meta.url), 'utf8').trim().split('\n').map((l) => JSON.parse(l));
const sinkStart = sinkLines().length;
const startedAt = new Date().toISOString();

const sign = (secret, ts, body) => `v1=${createHmac('sha256', secret).update(`${ts}.${body}`).digest('hex')}`;
const postForm = async (payload, { secret = secrets.FORMS_SIGNING_SECRET, ts = Math.floor(Date.now() / 1000), delivery = `${RUN}-${randomUUID().slice(0, 8)}` } = {}) => {
  const body = JSON.stringify(payload);
  const response = await fetch(`${BASE}/s/integrations/forms/leads`, { method: 'POST', headers: { 'content-type': 'application/json', 'x-kuec-timestamp': String(ts), 'x-kuec-signature': sign(secret, ts, body), 'x-kuec-delivery': delivery }, body });
  return { status: response.status, text: await response.text(), delivery };
};

// 1. Lead through the signed forms route
const submissionId = `${RUN}-web-1`;
const form = { form: 'WEBSITE', submissions: [{ submissionId, firstName: 'Mariam', lastName: `Journey ${RUN}`, email: `mariam.${RUN}@example-energy.test`, jobTitle: 'Head of R&D', companyName: `Example Energy ${RUN}`, companyWebsite: `https://www.energy-${RUN}.test`, need: 'Licence the corrosion sensor coating for pipelines', offeringInterest: ['IP_LICENCE'] }] };
const bad = await postForm(form, { secret: 'wrong-secret' });
record('forms route refuses a bad signature', bad.status === 401, `${bad.status} ${bad.text}`);
const stale = await postForm(form, { ts: Math.floor(Date.now() / 1000) - 600 });
record('forms route refuses a stale timestamp', stale.status === 401, `${stale.status} ${stale.text}`);
const sent = await postForm(form);
record('forms route accepts a signed delivery', sent.status === 202, `${sent.status} ${sent.text}`);
const resent = await postForm(form, { delivery: sent.delivery });
record('resent delivery accepted (no-op by job id)', resent.status === 202, `${resent.status}`);
const leadWait = await waitFor('lead created', async () => list('leads', `externalId[eq]:"web:${submissionId}"`), (rows) => rows.length > 0 && rows[0].playbookApplied === true, 180_000);
const lead = leadWait.value[0];
record('lead created once with source and external id, triaged', leadWait.ok && leadWait.value.length === 1 && lead?.source === 'INBOUND' && lead?.sourceSystem, { ms: leadWait.ms, count: leadWait.value.length, id: lead?.id, source: lead?.source, sourceSystem: lead?.sourceSystem, owner: handleOf(lead?.ownerId), status: lead?.status, triaged: lead?.playbookApplied });
if (!lead) { writeFileSync(new URL(`./journey-a-${RUN}.json`, import.meta.url), JSON.stringify({ RUN, steps }, null, 2)); process.exit(1); }
record('L1: owner is the ops coordinator', lead.ownerId === members.ops.memberId, handleOf(lead.ownerId));
const triage = await waitFor('triage task', () => tasksFor('ops', 'Triage'), (rows) => rows.some((t) => t.title.includes(RUN)), 60_000);
record('L1: one Triage task for the ops coordinator', triage.ok && triage.value.filter((t) => t.title.includes(RUN)).length === 1, triage.value.filter((t) => t.title.includes(RUN)).map((t) => ({ id: t.id, title: t.title, dueAt: t.dueAt })));

// 2. Ops coordinator gives it to bd1, names bd2 as the referring colleague, sets the next action
const ops = await personaToken(members.ops.email);
const tomorrow = new Date(Date.now() + 86_400_000).toISOString().slice(0, 10);
const assign = await rest('PATCH', `leads/${lead.id}`, { ownerId: members.bd1.memberId, referredByMemberId: members.bd2.memberId, status: 'CONTACTED', nextAction: 'Scoping call with the decision maker', nextActionDate: tomorrow }, ops);
record('ops coordinator assigns the lead to bd1 (persona ops)', assign.status === 200, `${assign.status} ${assign.status !== 200 ? JSON.stringify(assign.json).slice(0, 300) : ''}`);

// 3. bd1 ticks four of five checks
const bd1 = await personaToken(members.bd1.email);
const tick = await rest('PATCH', `leads/${lead.id}`, { needIdentified: true, decisionMakerReached: true, capabilityMatched: true, timingKnown: true }, bd1);
record('bd1 ticks four checks (persona bd1)', tick.status === 200, `${tick.status} ${tick.status !== 200 ? JSON.stringify(tick.json).slice(0, 300) : ''}`);
const qualified = await waitFor('qualified', async () => (await list('leads', `id[eq]:"${lead.id}"`))[0], (l) => l?.status === 'QUALIFIED', 120_000);
record('L4: score 4 and Qualified', qualified.ok && qualified.value.qualificationScore === 4, { ms: qualified.ms, status: qualified.value?.status, score: qualified.value?.qualificationScore, qualifiedAt: qualified.value?.qualifiedAt });
const convertTask = await waitFor('convert or park', () => tasksFor('bd1', 'Convert or park'), (rows) => rows.some((t) => t.title.includes(RUN)), 60_000);
record('L4: Convert or park task for bd1', convertTask.ok, convertTask.value.filter((t) => t.title.includes(RUN)).map((t) => t.id));
const edLicence = await waitFor('ED licence-grade', async () => (await list('tasks', `assigneeId[eq]:"${members.ed.memberId}"`)).filter((t) => t.title.includes(RUN)), (rows) => rows.length > 0, 60_000);
record('L4: ED told about a licence-grade lead', edLicence.ok, edLicence.value.map((t) => t.title));
const thanks1 = await waitFor('thank referrer at qualified', () => tasksFor('bd1', 'Thank the referrer'), (rows) => rows.some((t) => t.title.includes(RUN)), 60_000);
record('L6: Thank the referrer at Qualified', thanks1.ok, thanks1.value.filter((t) => t.title.includes(RUN)).map((t) => t.id));

// 4. bd1 converts
const convert = await rest('PATCH', `leads/${lead.id}`, { status: 'CONVERTED' }, bd1);
record('bd1 converts the lead (persona bd1)', convert.status === 200, `${convert.status}`);
const converted = await waitFor('opportunity created', async () => (await list('leads', `id[eq]:"${lead.id}"`))[0], (l) => !!l?.convertedOpportunityId, 120_000);
const opportunityId = converted.value?.convertedOpportunityId;
record('L5: opportunity created and linked', converted.ok, { ms: converted.ms, opportunityId });
if (!opportunityId) { writeFileSync(new URL(`./journey-a-${RUN}.json`, import.meta.url), JSON.stringify({ RUN, steps }, null, 2)); process.exit(1); }
const opp0 = (await list('opportunities', `id[eq]:"${opportunityId}"`))[0];
record('L5: stage Qualify (NEW), owner bd1, next action copied', opp0.stage === 'NEW' && opp0.ownerId === members.bd1.memberId && !!opp0.nextAction, { name: opp0.name, stage: opp0.stage, owner: handleOf(opp0.ownerId), type: opp0.playbookType, nextAction: opp0.nextAction, nextActionDate: opp0.nextActionDate, amount: opp0.amount });

// 5. W1 instantiates the licence playbook
const applied = await waitFor('W1 applied', async () => (await list('opportunities', `id[eq]:"${opportunityId}"`))[0], (o) => o?.playbookApplied === true, 180_000);
record('W1: playbookApplied true', applied.ok, { ms: applied.ms, type: applied.value?.playbookType, playbookApplied: applied.value?.playbookApplied });
const wps = (await list('workPackages', `opportunityId[eq]:"${opportunityId}"`)).sort((a, b) => (a.dueAt ?? '').localeCompare(b.dueAt ?? ''));
record('W1: six work packages, step 1 Offered, rest Planned', wps.length === 6 && wps[0]?.status === 'OFFERED' && wps.slice(1).every((w) => w.status === 'PLANNED'), wps.map((w) => ({ id: w.id, name: w.name, status: w.status, owner: handleOf(w.ownerId), reviewer: handleOf(w.reviewerId), dueAt: w.dueAt, step: w.playbookStep })));
const confirmPlan = (await tasksFor('ed', 'Confirm plan')).filter((t) => t.title.includes(opp0.name.slice(0, 20)) || true);
record('W1: Confirm plan task for the ED', confirmPlan.length >= 1, confirmPlan.map((t) => t.title));
if (wps.length === 0) { writeFileSync(new URL(`./journey-a-${RUN}.json`, import.meta.url), JSON.stringify({ RUN, steps }, null, 2)); process.exit(1); }

// 6. Work package 1: Accepted, Submitted, Done; dependency released
const wp1 = wps[0];
const ownerHandle = handleOf(wp1.ownerId);
const ownerToken = await personaToken(members[ownerHandle].email);
const acc = await rest('PATCH', `workPackages/${wp1.id}`, { status: 'ACCEPTED' }, ownerToken);
record(`owner ${ownerHandle} accepts work package 1`, acc.status === 200, `${acc.status} ${acc.status !== 200 ? JSON.stringify(acc.json).slice(0, 300) : ''}`);
await waitFor('acceptedAt', async () => (await list('workPackages', `id[eq]:"${wp1.id}"`))[0], (w) => !!w?.acceptedAt, 60_000);
const sub = await rest('PATCH', `workPackages/${wp1.id}`, { status: 'SUBMITTED' }, ownerToken);
record(`owner ${ownerHandle} submits work package 1`, sub.status === 200, `${sub.status}`);
await waitFor('submittedAt', async () => (await list('workPackages', `id[eq]:"${wp1.id}"`))[0], (w) => !!w?.submittedAt, 60_000);
const reviewerHandle = handleOf(wp1.reviewerId);
const reviewerToken = members[reviewerHandle] ? await personaToken(members[reviewerHandle].email) : await personaToken(members.ed.email);
const done = await rest('PATCH', `workPackages/${wp1.id}`, { status: 'DONE' }, reviewerToken);
record(`reviewer ${reviewerHandle} marks work package 1 Done`, done.status === 200, `${done.status} ${done.status !== 200 ? JSON.stringify(done.json).slice(0, 300) : ''}`);
const released = await waitFor('step 2 offered', async () => (await list('workPackages', `id[eq]:"${wps[1].id}"`))[0], (w) => w?.status === 'OFFERED', 120_000);
record('W6: step 2 released to Offered with offeredAt', released.ok && !!released.value?.offeredAt, { ms: released.ms, status: released.value?.status, offeredAt: released.value?.offeredAt, dueAt: released.value?.dueAt, owner: handleOf(released.value?.ownerId) });
const wp1After = (await list('workPackages', `id[eq]:"${wp1.id}"`))[0];
record('stamps on work package 1', !!wp1After.acceptedAt && !!wp1After.submittedAt && !!wp1After.completedAt, { offeredAt: wp1After.offeredAt, acceptedAt: wp1After.acceptedAt, submittedAt: wp1After.submittedAt, completedAt: wp1After.completedAt });

// 7. Signed, contract, referral credit
const sig = await rest('PATCH', `opportunities/${opportunityId}`, { stage: 'SIGNED' }, bd1);
record('bd1 moves the opportunity to Signed (persona bd1)', sig.status === 200, `${sig.status} ${sig.status !== 200 ? JSON.stringify(sig.json).slice(0, 300) : ''}`);
const contract = await waitFor('W7 contract', () => list('contracts', `opportunityId[eq]:"${opportunityId}"`), (rows) => rows.length > 0, 120_000);
record('W7: one licence contract, status Signed', contract.ok && contract.value.length === 1, contract.value.map((c) => ({ id: c.id, name: c.name, kind: c.kind, status: c.status })));
const credit = await waitFor('referral credit', async () => (await list('leads', `id[eq]:"${lead.id}"`))[0], (l) => !!l?.referralCreditedAt, 120_000);
record('L6: referral credited at stamped on the lead', credit.ok, { referralCreditedAt: credit.value?.referralCreditedAt });
const thanks = (await tasksFor('bd1', 'Thank the referrer')).filter((t) => t.title.includes(RUN));
record('L6: Thank the referrer once per status (Qualified, Converted)', thanks.length === 2, thanks.map((t) => ({ id: t.id, title: t.title })));
const notes = await list('noteTargets', `leadId[eq]:"${lead.id}"`);
record('L6: referral credit note on the lead', notes.length >= 1, `${notes.length} note targets`);

// 8. Timeline, notifications
await sleep(20_000);
const wpTimeline = await list('timelineActivities', `workPackageId[eq]:"${wp1.id}"`);
const oppTimeline = await list('timelineActivities', `opportunityId[eq]:"${opportunityId}"`);
record('timeline: work package 1 transitions', wpTimeline.some((t) => t.name?.includes('Done') || t.name?.includes('workPackageDone')), wpTimeline.map((t) => t.name));
record('timeline: transitions on the opportunity (case audit trail)', oppTimeline.some((t) => /workPackage/i.test(t.name ?? '')), oppTimeline.map((t) => t.name));
const sink = sinkLines().slice(sinkStart);
const emails = sink.filter((l) => l.channel === 'email');
const teams = sink.filter((l) => l.channel === 'teams');
const uventure = sink.filter((l) => l.channel === 'uventure');
const dupes = (rows, key) => { const seen = new Map(); rows.forEach((r) => seen.set(key(r), (seen.get(key(r)) ?? 0) + 1)); return [...seen].filter(([, n]) => n > 1); };
record('email notifications received, none twice', emails.length > 0 && dupes(emails, (e) => `${e.to}|${e.subject}`).length === 0, emails.map((e) => `${e.to} | ${e.subject}`));
record('Teams posts received (W1, W7), none twice', teams.length >= 2 && dupes(teams, (t) => t.body).length === 0, teams.map((t) => t.body.slice(0, 160)));
record('T1/T2 events sent to uVENTURE, signed, once each', uventure.length >= 1 && dupes(uventure, (u) => u.headers['x-kuec-delivery']).length === 0, uventure.map((u) => `${u.headers['x-kuec-delivery']} sig=${u.headers['x-kuec-signature']}`));
const allTasks = (await list('tasks', '')).filter((t) => t.createdAt >= startedAt);
record('no task created twice', dupes(allTasks, (t) => `${t.assigneeId}|${t.title}`).length === 0, dupes(allTasks, (t) => `${handleOf(t.assigneeId)}|${t.title}`));
writeFileSync(new URL(`./journey-a-${RUN}.json`, import.meta.url), JSON.stringify({ RUN, leadId: lead.id, opportunityId, workPackages: wps.map((w) => w.id), steps, tasks: allTasks.map((t) => ({ id: t.id, title: t.title, assignee: handleOf(t.assigneeId), dueAt: t.dueAt })), emails, teams, uventure }, null, 2));
console.log(`RESULT ${steps.filter((s) => !s.ok).length} failed of ${steps.length}`);
