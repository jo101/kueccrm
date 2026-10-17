import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import {
  assignPlaybookRoles,
  createTracker,
  listMemberIds,
  tasksTitledSince,
  type WorkPackage,
} from 'src/__tests__/acceptance/acceptance-helpers';
import {
  create,
  getOne,
  settle,
  update,
  waitFor,
} from 'src/__tests__/utils/test-api';

// T5: setting Blocked with a reason notifies the ED with that reason and
// creates the Decision needed task.

const RUN_TAG = `t5-${Date.now()}`;
const RUN_STARTED_AT = new Date().toISOString();
const REASON = 'Client has not sent the sample spec';
const tracker = createTracker();

let restoreRoles: () => Promise<void>;
let edId: string;
let ownerId: string;

beforeAll(async () => {
  const members = await listMemberIds();

  [edId, ownerId] = [members[0]!, members[2]!];
  restoreRoles = await assignPlaybookRoles(RUN_TAG, {
    ED: edId,
    OPS_COORDINATOR: members[1]!,
  });
});

afterAll(async () => {
  await tracker.removeAll();
  await restoreRoles?.();
});

const createAcceptedWorkPackage = async (title: string) => {
  const workPackage = tracker.track(
    'workPackages',
    await create<WorkPackage>('workPackages', 'workPackage', {
      name: `${RUN_TAG} ${title}`,
      status: 'PLANNED',
      ownerId,
      dueAt: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
      doneCriteria: 'Acceptance test criteria',
    }),
  );

  await update('workPackages', workPackage.id, { status: 'ACCEPTED' });
  await waitFor(
    'acceptedAt',
    () => getOne<WorkPackage>('workPackages', workPackage.id),
    ({ acceptedAt }) => acceptedAt !== null,
  );

  return workPackage;
};

describe('T5 W5 blocked work package', () => {
  it('notifies the ED with the reason in a Decision needed task, once', async () => {
    const workPackage = await createAcceptedWorkPackage('Sample analysis');
    const title = `Decision needed: ${workPackage.name}`;

    await update('workPackages', workPackage.id, {
      status: 'BLOCKED',
      blockedReason: REASON,
    });

    const tasks = await waitFor(
      'decision task',
      () => tasksTitledSince(title, RUN_STARTED_AT),
      (found) => found.length > 0,
    );

    await settle();

    const settled = await tasksTitledSince(title, RUN_STARTED_AT);
    const blocked = await getOne<WorkPackage>('workPackages', workPackage.id);

    console.log(`[t5] task ${JSON.stringify({ assigneeId: tasks[0]?.assigneeId, body: tasks[0]?.bodyV2?.markdown })}; blockedAt ${blocked.blockedAt}`);
    expect(settled).toHaveLength(1);
    expect(settled[0]!.assigneeId).toBe(edId);
    expect(settled[0]!.bodyV2?.markdown).toContain(`Reason: ${REASON}`);
    expect(blocked.blockedAt).not.toBeNull();
  });

  it('notifies the ED again on a second block', async () => {
    const workPackage = await createAcceptedWorkPackage('Second block');
    const title = `Decision needed: ${workPackage.name}`;

    await update('workPackages', workPackage.id, { status: 'BLOCKED', blockedReason: REASON });
    await waitFor('first decision task', () => tasksTitledSince(title, RUN_STARTED_AT), (found) => found.length === 1);
    await update('workPackages', workPackage.id, { status: 'ACCEPTED' });
    await update('workPackages', workPackage.id, {
      status: 'BLOCKED',
      blockedReason: 'Waiting for legal sign-off',
    });
    await waitFor('second decision task', () => tasksTitledSince(title, RUN_STARTED_AT), (found) => found.length === 2);
    await settle();

    expect(await tasksTitledSince(title, RUN_STARTED_AT)).toHaveLength(2);
  });

  // CLAUDE.md section 7: "Blocking requires a reason". This records what the
  // configuration does when no reason is given.
  it('refuses a block without a reason', async () => {
    const workPackage = await createAcceptedWorkPackage('No reason given');
    const title = `Decision needed: ${workPackage.name}`;
    const outcome = await update('workPackages', workPackage.id, { status: 'BLOCKED' }).then(
      () => 'accepted by the API',
      (error: unknown) => `rejected: ${String(error)}`,
    );

    await settle();

    const tasks = await tasksTitledSince(title, RUN_STARTED_AT);
    const record = await getOne<WorkPackage>('workPackages', workPackage.id);

    console.log(`[t5] block without reason: ${outcome}; status ${record.status}; tasks ${JSON.stringify(tasks.map(({ bodyV2 }) => bodyV2?.markdown))}`);
    expect(record.status).not.toBe('BLOCKED');
  });
});
