import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import {
  assignPlaybookRoles,
  createTracker,
  listMemberIds,
  tasksTitledSince,
  type Opportunity,
  type WorkPackage,
} from 'src/__tests__/acceptance/acceptance-helpers';
import {
  create,
  executeFunction,
  getOne,
  list,
  settle,
  update,
  waitFor,
} from 'src/__tests__/utils/test-api';
import {
  dueAtAfterBusinessDays,
  toDubaiDateString,
} from 'src/automation/dates/business-days';
import templates from 'src/playbooks/templates.json';

// T1: a Licence opportunity gets the playbook's work packages once, with the
// owner each role resolves to, cumulative business-day due dates at 17:00
// Asia/Dubai and the playbookStep key, plus the ED's Confirm-plan task.

const RUN_TAG = `t1-${Date.now()}`;
const RUN_STARTED_AT = new Date().toISOString();
const OPPORTUNITY_NAME = `${RUN_TAG} Licence thermal storage`;
const tracker = createTracker();

const licenceTemplate = templates.playbooks.find(
  ({ key }) => key === 'TECHNOLOGY_LICENSING',
);

let restoreRoles: () => Promise<void>;
let roleMembers: Record<string, string>;
let caseOwnerId: string;
let opportunityId: string;

beforeAll(async () => {
  const members = await listMemberIds();

  if (members.length < 6) {
    throw new Error('T1 needs six workspace members to tell the owners apart');
  }

  roleMembers = {
    ED: members[0]!,
    OPS_COORDINATOR: members[1]!,
    BD_OFFICER: members[2]!,
    DEVELOPER: members[3]!,
    DATA_ANALYST: members[4]!,
    LEGAL: members[5]!,
  };
  // The case owner is a different BD officer from the role's pool, so the
  // case-owner rule is visible.
  caseOwnerId = members[6] ?? members[2]!;
  restoreRoles = await assignPlaybookRoles(RUN_TAG, roleMembers);
});

afterAll(async () => {
  if (opportunityId !== undefined) {
    for (const workPackage of await list<WorkPackage>(
      'workPackages',
      `opportunityId[eq]:"${opportunityId}"`,
    )) {
      tracker.track('workPackages', workPackage);
    }
  }

  await tracker.removeAll();
  await restoreRoles?.();
});

describe('T1 W1 on a Licence opportunity', () => {
  it('creates every work package with owner, dates and playbookStep, once', async () => {
    expect(licenceTemplate).toBeDefined();

    const opportunity = tracker.track(
      'opportunities',
      await create<Opportunity>('opportunities', 'opportunity', {
        name: OPPORTUNITY_NAME,
        ownerId: caseOwnerId,
      }),
    );

    opportunityId = opportunity.id;
    await update('opportunities', opportunityId, {
      playbookType: 'TECHNOLOGY_LICENSING',
    });

    const templateSteps = licenceTemplate!.workPackages;
    const workPackages = await waitFor(
      'work packages',
      () => list<WorkPackage>('workPackages', `opportunityId[eq]:"${opportunityId}"`),
      (found) =>
        found.length >= templateSteps.length &&
        found.every(({ playbookStep }) => playbookStep !== null),
    );

    await settle();
    expect(
      await list<WorkPackage>('workPackages', `opportunityId[eq]:"${opportunityId}"`),
    ).toHaveLength(templateSteps.length);

    console.log(
      `[t1] ${workPackages.length} work packages:\n${templateSteps
        .map((step) => {
          const workPackage = workPackages.find(
            ({ playbookStep }) => playbookStep === `TECHNOLOGY_LICENSING.${step.key}`,
          );

          return `  ${workPackage?.playbookStep} | ${workPackage?.status} | owner ${workPackage?.ownerId} | reviewer ${workPackage?.reviewerId} | due ${workPackage?.dueAt}`;
        })
        .join('\n')}`,
    );

    expect(workPackages).toHaveLength(templateSteps.length);
    expect(new Set(workPackages.map(({ playbookStep }) => playbookStep)).size).toBe(
      templateSteps.length,
    );

    const first = workPackages.find(
      ({ playbookStep }) => playbookStep === `TECHNOLOGY_LICENSING.${templateSteps[0]!.key}`,
    );
    const openedAt = new Date(first?.offeredAt ?? '');
    const resolveOwner = (role: string | null) =>
      role === null
        ? null
        : role === licenceTemplate!.caseOwnerRole
          ? caseOwnerId
          : (roleMembers[role] ?? roleMembers.OPS_COORDINATOR);

    const holidays = new Set(
      (await list<{ date: string | null }>('publicHolidays', 'id[is]:NOT_NULL'))
        .map(({ date }) => date?.slice(0, 10))
        .filter((date): date is string => date !== undefined),
    );
    let cursor = openedAt;
    let previousId: string | null = null;

    templateSteps.forEach((step, index) => {
      const workPackage = workPackages.find(
        ({ playbookStep }) => playbookStep === `TECHNOLOGY_LICENSING.${step.key}`,
      );
      // Every licence step is dated by an offset; only the workshop has an anchored step.
      expect(step.dueOffsetDays, step.key).not.toBeNull();

      const expectedDueAt = dueAtAfterBusinessDays(cursor, step.dueOffsetDays ?? 0, holidays);

      cursor = expectedDueAt;

      expect(workPackage, step.key).toBeDefined();
      expect(workPackage).toMatchObject({
        name: step.title,
        status: index === 0 ? 'OFFERED' : 'PLANNED',
        ownerId: resolveOwner(step.ownerRole),
        reviewerId: resolveOwner(step.reviewerRole),
        dependsOnId: previousId,
      });
      expect(Date.parse(workPackage!.dueAt ?? '')).toBe(expectedDueAt.getTime());
      expect(workPackage!.dueAt?.slice(11, 16)).toBe('13:00');
      previousId = workPackage!.id;
    });

  });

  it('marks the playbook applied and fills the next action from step 1', async () => {
    const opportunity = await getOne<Opportunity>('opportunities', opportunityId);
    const workPackages = await list<WorkPackage>(
      'workPackages',
      `opportunityId[eq]:"${opportunityId}"`,
    );
    const first = workPackages.find(({ status }) => status === 'OFFERED');

    console.log(`[t1] opportunity after W1: ${JSON.stringify({ playbookApplied: opportunity.playbookApplied, nextAction: opportunity.nextAction, nextActionDate: opportunity.nextActionDate })}`);
    expect(opportunity.playbookApplied).toBe(true);
    expect(opportunity.nextAction).toBe(licenceTemplate!.workPackages[0]!.title);
    expect(opportunity.nextActionDate?.slice(0, 10)).toBe(
      toDubaiDateString(new Date(first?.dueAt ?? '')),
    );
  });

  it('creates one Confirm-plan task for the ED', async () => {
    const tasks = await tasksTitledSince(`Confirm plan: ${OPPORTUNITY_NAME}`, RUN_STARTED_AT);

    console.log(`[t1] Confirm plan tasks: ${JSON.stringify(tasks.map(({ id, assigneeId }) => ({ id, assigneeId })))}`);
    expect(tasks).toHaveLength(1);
    expect(tasks[0]!.assigneeId).toBe(roleMembers.ED);
  });

  it('notifies only the first owner to accept', async () => {
    const tasks = await tasksTitledSince(
      `Accept or decline: ${licenceTemplate!.workPackages[0]!.title}`,
      RUN_STARTED_AT,
    );

    expect(tasks.map(({ assigneeId }) => assigneeId)).toEqual([roleMembers.DEVELOPER]);
  });

  it('does not create anything more on a type change, a re-set type or a re-run', async () => {
    await update('opportunities', opportunityId, { playbookType: 'RFQ_TECHNICAL_SERVICE' });
    await update('opportunities', opportunityId, { playbookType: 'TECHNOLOGY_LICENSING' });

    const rerun = await executeFunction('w01-instantiate-opportunity-playbook', {
      recordId: opportunityId,
      properties: { before: {}, after: {}, updatedFields: ['playbookType'] },
    });

    await settle();

    expect(rerun.skipped).toBeDefined();
    expect(
      await list<WorkPackage>('workPackages', `opportunityId[eq]:"${opportunityId}"`),
    ).toHaveLength(licenceTemplate!.workPackages.length);
    expect(
      await tasksTitledSince(`Confirm plan: ${OPPORTUNITY_NAME}`, RUN_STARTED_AT),
    ).toHaveLength(1);
  });
});
