import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import {
  assignPlaybookRoles,
  createTracker,
  listMemberIds,
  secondsBetween,
  tasksTitledSince,
  type WorkPackage,
} from 'src/__tests__/acceptance/acceptance-helpers';
import {
  buildShortenedTimersCopy,
  builtFunctionsContainShortenedTimers,
  syncApp,
  TEST_BUSINESS_DAY_MS,
} from 'src/__tests__/acceptance/shortened-timers';
import {
  create,
  executeFunction,
  getOne,
  settle,
  update,
  waitFor,
} from 'src/__tests__/utils/test-api';
import {
  ACCEPT_REASSIGN_AFTER_BUSINESS_DAYS,
  ACCEPT_REMINDER_AFTER_BUSINESS_DAYS,
  OVERDUE_ED_AFTER_BUSINESS_DAYS,
} from 'src/automation/timers/work-package-timers';

// T2 and T3 with one business day shortened to TEST_BUSINESS_DAY_MS. The
// shortened build is synced over the installed app, and the shipped build is
// synced back afterwards and checked.

const RUN_TAG = `t2t3-${Date.now()}`;
const RUN_STARTED_AT = new Date().toISOString();
const APP_PATH = process.cwd();
const DAY_SECONDS = TEST_BUSINESS_DAY_MS / 1000;
// A delayed job runs within a few seconds of its time on an idle worker.
const LATE_TOLERANCE_SECONDS = 30;
const tracker = createTracker();

let restoreRoles: () => Promise<void>;
let removeCopy: () => void;
let edId: string;
let opsCoordinatorId: string;
let ownerId: string;
let shortenedPlan = '';
let restored = false;

beforeAll(async () => {
  const members = await listMemberIds();

  [edId, opsCoordinatorId, ownerId] = [members[0]!, members[1]!, members[2]!];
  restoreRoles = await assignPlaybookRoles(RUN_TAG, {
    ED: edId,
    OPS_COORDINATOR: opsCoordinatorId,
  });

  const copy = buildShortenedTimersCopy(APP_PATH);

  removeCopy = copy.remove;
  shortenedPlan = await syncApp(copy.copyPath);
  console.log(`[t2t3] shortened sync plan:\n${shortenedPlan}`);
}, 600_000);

afterAll(async () => {
  if (!restored) {
    await syncApp(APP_PATH);
  }

  await tracker.removeAll();
  await restoreRoles?.();
  removeCopy?.();
}, 600_000);

const createPlannedWorkPackage = async (title: string) =>
  tracker.track(
    'workPackages',
    await create<WorkPackage>('workPackages', 'workPackage', {
      name: `${RUN_TAG} ${title}`,
      status: 'PLANNED',
      ownerId,
      dueAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      doneCriteria: 'Acceptance test criteria',
    }),
  );

const assigneesOf = async (title: string) =>
  (await tasksTitledSince(title, RUN_STARTED_AT)).map(({ assigneeId }) => assigneeId).sort();

describe('T2 W2 acceptance timers (1 business day = 20 s)', () => {
  let workPackageId: string;
  let name: string;
  let offeredAt: string;

  it('the shortened build only changes code, nothing is destroyed', () => {
    expect(shortenedPlan).toMatch(/0 to destroy/);
  });

  it('stamps offeredAt and asks the owner to accept', async () => {
    const workPackage = await createPlannedWorkPackage('Unanswered offer');

    workPackageId = workPackage.id;
    name = workPackage.name;
    await update('workPackages', workPackageId, { status: 'OFFERED' });

    const offered = await waitFor(
      'offeredAt',
      () => getOne<WorkPackage>('workPackages', workPackageId),
      (record) => record.offeredAt !== null,
    );

    offeredAt = offered.offeredAt!;
    await waitFor(
      'offer task',
      () => assigneesOf(`Accept or decline: ${name}`),
      (assignees) => assignees.length > 0,
    );
    expect(await assigneesOf(`Accept or decline: ${name}`)).toEqual([ownerId]);
  });

  it(`at ${ACCEPT_REMINDER_AFTER_BUSINESS_DAYS} days notifies the owner and the ED, owner unchanged`, async () => {
    const reminded = await waitFor(
      'acceptReminderSentAt',
      () => getOne<WorkPackage>('workPackages', workPackageId),
      (record) => record.acceptReminderSentAt !== null,
      ACCEPT_REMINDER_AFTER_BUSINESS_DAYS * DAY_SECONDS * 1000 + 90_000,
    );
    const elapsed = secondsBetween(offeredAt, reminded.acceptReminderSentAt);

    console.log(`[t2] reminder ${elapsed}s after offeredAt (expected ${ACCEPT_REMINDER_AFTER_BUSINESS_DAYS * DAY_SECONDS}s)`);
    expect(elapsed).toBeGreaterThanOrEqual(ACCEPT_REMINDER_AFTER_BUSINESS_DAYS * DAY_SECONDS - 1);
    expect(elapsed).toBeLessThan(ACCEPT_REMINDER_AFTER_BUSINESS_DAYS * DAY_SECONDS + LATE_TOLERANCE_SECONDS);
    expect(reminded.ownerId).toBe(ownerId);
    expect(reminded.reassignedAt).toBeNull();
    expect(await assigneesOf(`Not accepted: ${name}`)).toEqual([ownerId, edId].sort());
  }, 300_000);

  it(`at ${ACCEPT_REASSIGN_AFTER_BUSINESS_DAYS} days reassigns to the ops coordinator and notifies old owner, new owner and ED`, async () => {
    const reassigned = await waitFor(
      'reassignedAt',
      () => getOne<WorkPackage>('workPackages', workPackageId),
      (record) => record.reassignedAt !== null,
      ACCEPT_REASSIGN_AFTER_BUSINESS_DAYS * DAY_SECONDS * 1000 + 90_000,
    );
    const elapsed = secondsBetween(offeredAt, reassigned.reassignedAt);

    console.log(`[t2] reassigned ${elapsed}s after offeredAt (expected ${ACCEPT_REASSIGN_AFTER_BUSINESS_DAYS * DAY_SECONDS}s)`);
    expect(elapsed).toBeGreaterThanOrEqual(ACCEPT_REASSIGN_AFTER_BUSINESS_DAYS * DAY_SECONDS - 1);
    expect(elapsed).toBeLessThan(ACCEPT_REASSIGN_AFTER_BUSINESS_DAYS * DAY_SECONDS + LATE_TOLERANCE_SECONDS);
    expect(reassigned.ownerId).toBe(opsCoordinatorId);
    expect(reassigned.status).toBe('OFFERED');
    expect(await assigneesOf(`Reassigned: ${name}`)).toEqual(
      [ownerId, opsCoordinatorId, edId].sort(),
    );
  }, 300_000);

  it('fires each level once', async () => {
    await settle();

    expect(await assigneesOf(`Not accepted: ${name}`)).toHaveLength(2);
    expect(await assigneesOf(`Reassigned: ${name}`)).toHaveLength(3);
    expect(await assigneesOf(`Accept or decline: ${name}`)).toHaveLength(1);
  });
});

describe('T3 W3 overdue timers (1 business day = 20 s)', () => {
  let workPackageId: string;
  let name: string;
  let dueAt: string;

  it('notifies the owner at the due time', async () => {
    const workPackage = await createPlannedWorkPackage('Late deliverable');

    workPackageId = workPackage.id;
    name = workPackage.name;
    dueAt = new Date(Date.now() + 30_000).toISOString();
    await update('workPackages', workPackageId, { status: 'ACCEPTED', dueAt });

    const notified = await waitFor(
      'overdueOwnerNotifiedAt',
      () => getOne<WorkPackage>('workPackages', workPackageId),
      (record) => record.overdueOwnerNotifiedAt !== null,
      120_000,
    );
    const elapsed = secondsBetween(dueAt, notified.overdueOwnerNotifiedAt);

    console.log(`[t3] owner notified ${elapsed}s after dueAt`);
    expect(elapsed).toBeGreaterThanOrEqual(-1);
    expect(elapsed).toBeLessThan(LATE_TOLERANCE_SECONDS);
    expect(notified.overdueEdNotifiedAt).toBeNull();
    expect(await assigneesOf(`Overdue: ${name}`)).toEqual([ownerId]);
  }, 200_000);

  it(`notifies the ED ${OVERDUE_ED_AFTER_BUSINESS_DAYS} days later`, async () => {
    const escalated = await waitFor(
      'overdueEdNotifiedAt',
      () => getOne<WorkPackage>('workPackages', workPackageId),
      (record) => record.overdueEdNotifiedAt !== null,
      OVERDUE_ED_AFTER_BUSINESS_DAYS * DAY_SECONDS * 1000 + 90_000,
    );
    const elapsed = secondsBetween(dueAt, escalated.overdueEdNotifiedAt);

    console.log(`[t3] ED notified ${elapsed}s after dueAt (expected ${OVERDUE_ED_AFTER_BUSINESS_DAYS * DAY_SECONDS}s)`);
    expect(elapsed).toBeGreaterThanOrEqual(OVERDUE_ED_AFTER_BUSINESS_DAYS * DAY_SECONDS - 1);
    expect(elapsed).toBeLessThan(OVERDUE_ED_AFTER_BUSINESS_DAYS * DAY_SECONDS + LATE_TOLERANCE_SECONDS);
    await settle();
    expect(await assigneesOf(`Overdue: ${name}`)).toEqual([ownerId, edId].sort());
  }, 300_000);
});

describe('Restoring the shipped timers', () => {
  it('syncs the shipped build back and its timers wait real business days again', async () => {
    const plan = await syncApp(APP_PATH);

    restored = true;

    expect(plan).toMatch(/0 to destroy/);
    expect(builtFunctionsContainShortenedTimers(APP_PATH)).toBe(false);

    const workPackage = await createPlannedWorkPackage('After restore');

    await update('workPackages', workPackage.id, { status: 'OFFERED' });

    const offered = await waitFor(
      'offeredAt after restore',
      () => getOne<WorkPackage>('workPackages', workPackage.id),
      (record) => record.offeredAt !== null,
    );

    // Past the shortened reminder time: the shipped timer must still be waiting.
    await new Promise((resolve) =>
      setTimeout(resolve, ACCEPT_REMINDER_AFTER_BUSINESS_DAYS * TEST_BUSINESS_DAY_MS + 15_000),
    );

    const run = await executeFunction('w02-acceptance-timer', {
      workPackageId: workPackage.id,
      kind: 'ACCEPT',
      level: 1,
      anchorAt: offered.offeredAt,
    });

    console.log(`[restore] manual level-1 run after ${ACCEPT_REMINDER_AFTER_BUSINESS_DAYS * DAY_SECONDS + 15}s: ${JSON.stringify(run)}`);
    expect(run.outcome).toBe('WAIT');
    expect(
      (await getOne<WorkPackage>('workPackages', workPackage.id)).acceptReminderSentAt,
    ).toBeNull();
  }, 600_000);
});
