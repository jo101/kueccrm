import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import {
  create,
  ensureOpportunityStageOptions,
  executeFunction,
  getOne,
  list,
  remove,
  settle,
  update,
  waitFor,
} from 'src/__tests__/utils/test-api';
import {
  computeEngagementLapsesAt,
  computeStaleFrom,
} from 'src/automation/rules/age-thresholds.rule';
import { buildBaseJobId } from 'src/automation/timers/work-package-timers';

// Runs against a disposable instance with the app installed by global-setup.
// Each test checks an effect appears, then waits a quiet period and checks it
// is still there exactly once.

type IdRecord = { id: string };
type WorkPackage = IdRecord & {
  name: string;
  status: string;
  ownerId: string | null;
  dueAt: string | null;
  offeredAt: string | null;
  acceptedAt: string | null;
  blockedAt: string | null;
  completedAt: string | null;
  playbookStep: string | null;
  dependsOnId: string | null;
  overdueOwnerNotifiedAt: string | null;
};
type Opportunity = IdRecord & {
  playbookApplied: boolean;
  nextAction: string | null;
  nextActionDate: string | null;
  stageEnteredAt: string | null;
  staleFrom: string | null;
  nextActionFlaggedOn: string | null;
};
type Task = IdRecord & { title: string; assigneeId: string | null };

const RUN_TAG = `it-${Date.now()}`;
const RUN_STARTED_AT = new Date().toISOString();
const createdRecords: { namePlural: string; id: string }[] = [];

const track = <TRecord extends IdRecord>(namePlural: string, record: TRecord) => {
  createdRecords.push({ namePlural, id: record.id });

  return record;
};

const workPackagesOf = (opportunityId: string) =>
  list<WorkPackage>('workPackages', `opportunityId[eq]:"${opportunityId}"`);

const tasksTitled = async (title: string) =>
  (
    await list<Task>(
      'tasks',
      `and(title[eq]:"${title}",createdAt[gte]:"${RUN_STARTED_AT}")`,
    )
  ).filter(
    ({ title: taskTitle }) => taskTitle === title,
  );

let edMemberId: string;
let opsCoordinatorMemberId: string;

beforeAll(async () => {
  await ensureOpportunityStageOptions();

  const members = await list<IdRecord>('workspaceMembers', 'id[is]:NOT_NULL');

  if (members.length < 2) {
    throw new Error('The test workspace needs at least two members');
  }

  edMemberId = members[0]!.id;
  opsCoordinatorMemberId = members[1]!.id;

  for (const playbookRole of [
    'ED',
    'BD_OFFICER',
    'DATA_ANALYST',
    'DEVELOPER',
    'LEGAL',
    'FINANCE',
  ]) {
    track(
      'playbookRoleAssignments',
      await create<IdRecord>('playbookRoleAssignments', 'playbookRoleAssignment', {
        name: `${RUN_TAG} ${playbookRole}`,
        playbookRole,
        memberId: edMemberId,
        isActive: true,
      }),
    );
  }

  track(
    'playbookRoleAssignments',
    await create<IdRecord>('playbookRoleAssignments', 'playbookRoleAssignment', {
      name: `${RUN_TAG} OPS_COORDINATOR`,
      playbookRole: 'OPS_COORDINATOR',
      memberId: opsCoordinatorMemberId,
      isActive: true,
    }),
  );
});

afterAll(async () => {
  for (const { namePlural, id } of createdRecords.reverse()) {
    await remove(namePlural, id);
  }
});

describe('W1 instantiate and its guard', () => {
  let opportunityId: string;

  it('does nothing for a record created with its type already filled', async () => {
    const opportunity = track(
      'opportunities',
      await create<Opportunity>('opportunities', 'opportunity', {
        name: `${RUN_TAG} RFQ for thermal testing`,
        playbookType: 'RFQ_TECHNICAL_SERVICE',
        ownerId: edMemberId,
      }),
    );

    opportunityId = opportunity.id;
    await settle();

    expect(await workPackagesOf(opportunityId)).toHaveLength(0);
    expect((await getOne<Opportunity>('opportunities', opportunityId)).playbookApplied).toBe(false);
  });

  it('ignores updates to other fields', async () => {
    await update('opportunities', opportunityId, { name: `${RUN_TAG} RFQ for thermal tests` });
    await settle();

    expect(await workPackagesOf(opportunityId)).toHaveLength(0);
  });

  it('instantiates once when the type is set by an update', async () => {
    await update('opportunities', opportunityId, { playbookType: null });
    await update('opportunities', opportunityId, {
      playbookType: 'RFQ_TECHNICAL_SERVICE',
    });

    const opportunity = await waitFor(
      'playbookApplied',
      () => getOne<Opportunity>('opportunities', opportunityId),
      ({ playbookApplied }) => playbookApplied,
    );
    const workPackages = await workPackagesOf(opportunityId);

    expect(workPackages).toHaveLength(7);
    expect(workPackages.filter(({ status }) => status === 'OFFERED')).toHaveLength(1);
    expect(workPackages.every(({ playbookStep }) => playbookStep?.startsWith('RFQ_TECHNICAL_SERVICE.'))).toBe(true);
    expect(opportunity.nextAction).toBe('Bid or no-bid');
    expect(opportunity.nextActionDate).not.toBeNull();
  });

  it('holds the guard when the type changes again or the function re-runs', async () => {
    await update('opportunities', opportunityId, {
      playbookType: 'TECHNOLOGY_LICENSING',
    });
    await settle();

    const result = await executeFunction('w01-instantiate-opportunity-playbook', {
      recordId: opportunityId,
      properties: { before: {}, after: {}, updatedFields: ['playbookType'] },
    });

    expect(result.skipped).toBeDefined();
    expect(await workPackagesOf(opportunityId)).toHaveLength(7);
    expect(await tasksTitled('Accept or decline: Bid or no-bid')).toHaveLength(1);
  });

  describe('work-package lifecycle on that case', () => {
    const byStep = async (step: string) => {
      const workPackage = (await workPackagesOf(opportunityId)).find(
        ({ playbookStep }) => playbookStep === `RFQ_TECHNICAL_SERVICE.${step}`,
      );

      if (workPackage === undefined) throw new Error(`no ${step}`);

      return workPackage;
    };

    it('stamps acceptance once (transition log)', async () => {
      const bid = await byStep('BID_NO_BID');

      await update('workPackages', bid.id, { status: 'ACCEPTED' });

      const accepted = await waitFor(
        'acceptedAt',
        () => getOne<WorkPackage>('workPackages', bid.id),
        ({ acceptedAt }) => acceptedAt !== null,
      );

      await settle();
      expect((await getOne<WorkPackage>('workPackages', bid.id)).acceptedAt).toBe(accepted.acceptedAt);
    });

    it('W6 releases the dependent step exactly once when a step is done', async () => {
      const bid = await byStep('BID_NO_BID');

      await update('workPackages', bid.id, { status: 'DONE' });

      const scoping = await waitFor(
        'scoping offered',
        () => byStep('SCOPING'),
        ({ status, offeredAt }) => status === 'OFFERED' && offeredAt !== null,
      );

      expect((await getOne<WorkPackage>('workPackages', bid.id)).completedAt).not.toBeNull();
      expect(scoping.dependsOnId).toBe(bid.id);
      await settle();
      expect(await tasksTitled('Accept or decline: Scoping')).toHaveLength(1);
      expect((await byStep('QUOTE_OR_PROPOSAL')).status).toBe('PLANNED');
    });

    it('W3 notifies the owner of overdue work once, and a retried job does not write again', async () => {
      const scoping = await byStep('SCOPING');
      const dueAt = new Date(Date.now() - 60 * 60 * 1000).toISOString();

      await update('workPackages', scoping.id, { status: 'ACCEPTED', dueAt });

      const notified = await waitFor(
        'overdue owner notification',
        () => getOne<WorkPackage>('workPackages', scoping.id),
        ({ overdueOwnerNotifiedAt }) => overdueOwnerNotifiedAt !== null,
      );

      const payload = {
        workPackageId: scoping.id,
        kind: 'DUE',
        level: 1,
        anchorAt: notified.dueAt,
      };
      const firstRetry = await executeFunction('w03-overdue-timer', payload);
      const secondRetry = await executeFunction('w03-overdue-timer', payload);

      expect(firstRetry.outcome).toBe('STALE');
      expect(secondRetry.outcome).toBe('STALE');
      await settle();
      expect(await tasksTitled('Overdue: Scoping')).toHaveLength(1);
      expect(
        (await getOne<WorkPackage>('workPackages', scoping.id)).overdueOwnerNotifiedAt,
      ).toBe(notified.overdueOwnerNotifiedAt);
    });

    it('W5 asks the ED for a decision once per block', async () => {
      const scoping = await byStep('SCOPING');

      await update('workPackages', scoping.id, {
        status: 'BLOCKED',
        blockedReason: 'Client has not sent the sample spec',
      });

      const tasks = await waitFor(
        'decision task',
        () => tasksTitled('Decision needed: Scoping'),
        (found) => found.length > 0,
      );

      expect(tasks[0]?.assigneeId).toBe(edMemberId);
      await settle();
      expect(await tasksTitled('Decision needed: Scoping')).toHaveLength(1);
      expect((await getOne<WorkPackage>('workPackages', scoping.id)).blockedAt).not.toBeNull();
    });
  });

  describe('W7 and W8 on stage changes', () => {
    it('stamps the stage and asks once for a lost reason', async () => {
      await update('opportunities', opportunityId, { stage: 'LOST' });

      const stamped = await waitFor(
        'stageEnteredAt',
        () => getOne<Opportunity>('opportunities', opportunityId),
        ({ stageEnteredAt }) => stageEnteredAt !== null,
      );

      expect(Date.parse(stamped.staleFrom ?? '')).toBe(
        Date.parse(computeStaleFrom(stamped.stageEnteredAt) ?? ''),
      );
      await waitFor(
        'lost reason task',
        () => tasksTitled(`Record lost reason: ${RUN_TAG} RFQ for thermal tests`),
        (found) => found.length > 0,
      );
      await settle();
      expect(
        await tasksTitled(`Record lost reason: ${RUN_TAG} RFQ for thermal tests`),
      ).toHaveLength(1);
    });
  });
});

describe('W7 licence contract', () => {
  it('creates one licence contract when a licence opportunity is signed, even if signed twice', async () => {
    const opportunity = track(
      'opportunities',
      await create<Opportunity>('opportunities', 'opportunity', {
        name: `${RUN_TAG} Licence thermal storage`,
        ownerId: edMemberId,
      }),
    );

    await update('opportunities', opportunity.id, { playbookType: 'TECHNOLOGY_LICENSING' });
    await waitFor(
      'licence playbook applied',
      () => getOne<Opportunity>('opportunities', opportunity.id),
      ({ playbookApplied }) => playbookApplied,
    );
    expect(await tasksTitled(`Confirm plan: ${RUN_TAG} Licence thermal storage`)).toHaveLength(1);

    await update('opportunities', opportunity.id, { stage: 'SIGNED' });

    const contractsOf = () =>
      list<IdRecord>('contracts', `opportunityId[eq]:"${opportunity.id}"`);

    await waitFor('licence contract', contractsOf, (found) => found.length > 0);
    await update('opportunities', opportunity.id, { stage: 'MEETING' });
    await update('opportunities', opportunity.id, { stage: 'SIGNED' });
    await settle();

    const contracts = await contractsOf();

    expect(contracts).toHaveLength(1);
    contracts.forEach((contract) => track('contracts', contract));
  });
});

describe('Sweep', () => {
  it('re-enqueues a timer whose event was lost, and only once', async () => {
    const opportunity = track(
      'opportunities',
      await create<Opportunity>('opportunities', 'opportunity', {
        name: `${RUN_TAG} Sweep case`,
      }),
    );
    const dueAt = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString();
    // Created already accepted with a due date: no .updated event fires, which
    // is what a lost event (or a deleted job) leaves behind.
    const workPackage = track(
      'workPackages',
      await create<WorkPackage>('workPackages', 'workPackage', {
        name: `${RUN_TAG} Orphan step`,
        status: 'ACCEPTED',
        dueAt,
        opportunityId: opportunity.id,
        ownerId: edMemberId,
      }),
    );
    const expectedJobId = buildBaseJobId({
      kind: 'DUE',
      workPackageId: workPackage.id,
      anchorAt: dueAt,
      level: 1,
    });

    const firstSweep = await executeFunction('timer-sweep');
    const secondSweep = await executeFunction('timer-sweep');
    const repairedIds = (sweep: Record<string, unknown>) =>
      (sweep.repaired as { jobId: string }[]).map(({ jobId }) => jobId);

    expect(repairedIds(firstSweep)).toContain(expectedJobId);
    expect(repairedIds(secondSweep)).not.toContain(expectedJobId);
  });
});

describe('W9 and W10 on projects', () => {
  it('builds the workshop once and tracks milestone health', async () => {
    const project = track(
      'projects',
      await create<IdRecord>('projects', 'project', {
        name: `${RUN_TAG} Cooling workshop`,
        ownerId: edMemberId,
        eventDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
          .toISOString()
          .slice(0, 10),
      }),
    );

    await update('projects', project.id, { playbookType: 'WORKSHOP' });

    const milestonesOf = () =>
      list<IdRecord & { status: string }>('milestones', `projectId[eq]:"${project.id}"`);

    await waitFor('milestones', milestonesOf, (found) => found.length === 5);
    await update('projects', project.id, { playbookType: 'PROPOSAL' });
    await settle();

    const milestones = await milestonesOf();

    expect(milestones).toHaveLength(5);
    expect(
      await list<IdRecord>('workPackages', `projectId[eq]:"${project.id}"`),
    ).toHaveLength(6);

    await update('milestones', milestones[0]!.id, { status: 'DONE' });
    await waitFor(
      'percent complete',
      () => getOne<{ percentComplete: number | null }>('projects', project.id),
      ({ percentComplete }) => percentComplete === 20,
    );

    await update('milestones', milestones[1]!.id, { status: 'MISSED' });
    await waitFor(
      'red health',
      () => getOne<{ health: string }>('projects', project.id),
      ({ health }) => health === 'RED',
    );
  });
});

describe('W11 engagement stamp', () => {
  it('stamps the company and copies the next step', async () => {
    const company = track(
      'companies',
      await create<IdRecord>('companies', 'company', { name: `${RUN_TAG} Gulf Cooling` }),
    );
    const opportunity = track(
      'opportunities',
      await create<IdRecord>('opportunities', 'opportunity', {
        name: `${RUN_TAG} Engagement case`,
        companyId: company.id,
      }),
    );
    const engagement = track(
      'engagements',
      await create<IdRecord>('engagements', 'engagement', {
        name: `${RUN_TAG} Intro call`,
        companyId: company.id,
        opportunityId: opportunity.id,
      }),
    );
    const date = '2026-10-14T08:00:00.000Z';

    await update('engagements', engagement.id, {
      date,
      nextStep: 'Send the capability deck',
    });

    const stamped = await waitFor(
      'company stamp and next action',
      async () => ({
        company: await getOne<{
          lastEngagementAt: string | null;
          engagementLapsesAt: string | null;
        }>('companies', company.id),
        opportunity: await getOne<Opportunity>('opportunities', opportunity.id),
      }),
      (state) =>
        state.company.lastEngagementAt !== null &&
        state.opportunity.nextAction === 'Send the capability deck',
    );

    expect(Date.parse(stamped.company.engagementLapsesAt ?? '')).toBe(
      Date.parse(computeEngagementLapsesAt(date) ?? ''),
    );
  });
});

describe('Daily crons', () => {
  it('W4 flags an opportunity without a next action once per day', async () => {
    const opportunity = track(
      'opportunities',
      await create<IdRecord>('opportunities', 'opportunity', {
        name: `${RUN_TAG} No next action`,
        ownerId: edMemberId,
      }),
    );

    const first = await executeFunction('w04-next-action-guard');
    const second = await executeFunction('w04-next-action-guard');

    expect(first.flagged).toContain(opportunity.id);
    expect(second.flagged).not.toContain(opportunity.id);
    expect(
      await tasksTitled(`Set next action: ${RUN_TAG} No next action`),
    ).toHaveLength(1);
  });

  it('W10 daily run is idempotent', async () => {
    await executeFunction('w10-project-health-daily');

    const second = await executeFunction('w10-project-health-daily');

    expect(second.healthChanged).toEqual([]);
    expect(second.closeTasks).toEqual([]);
  });
});
