import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';

import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import {
  assignPlaybookRoles,
  createTracker,
  listMemberIds,
  tasksTitledSince,
  type Opportunity,
} from 'src/__tests__/acceptance/acceptance-helpers';
import { create, getOne } from 'src/__tests__/utils/test-api';
import w04NextActionGuard from 'src/logic-functions/w04-next-action-guard';

// T4: an open opportunity with an empty next-action date is flagged by the
// real cron path at the next 08:00 Asia/Dubai run, and only once. The worker
// (which owns cron dispatch) is restarted with its clock moved to 90 seconds
// before that run; the function itself runs in a child process on the real
// clock. Needs TWENTY_SERVER_DIR and WORKER_LOG for worker-clock.sh.

const RUN_TAG = `t4-${Date.now()}`;
const RUN_STARTED_AT = new Date().toISOString();
const OPPORTUNITY_NAME = `${RUN_TAG} Empty next-action date`;
const WORKER_CLOCK_SCRIPT = resolve(process.cwd(), '..', 'tests', 'acceptance', 'worker-clock.sh');
const LEAD_IN_MS = 90_000;
const WATCH_AFTER_RUN_MS = 180_000;
const tracker = createTracker();

const sleep = (milliseconds: number) =>
  new Promise((resolveSleep) => setTimeout(resolveSleep, milliseconds));

const nextUtcFourOClock = (now: Date) => {
  const candidate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 4));

  return candidate.getTime() > now.getTime() + LEAD_IN_MS
    ? candidate
    : new Date(candidate.getTime() + 24 * 60 * 60 * 1000);
};

const restartWorker = (...args: string[]) =>
  console.log(execFileSync(WORKER_CLOCK_SCRIPT, args, { encoding: 'utf8' }).trim());

let restoreRoles: () => Promise<void>;
let ownerId: string;
let opportunityId: string;
let workerOnFakeClock = false;

beforeAll(async () => {
  const members = await listMemberIds();

  ownerId = members[2]!;
  restoreRoles = await assignPlaybookRoles(RUN_TAG, {
    ED: members[0]!,
    OPS_COORDINATOR: members[1]!,
  });
});

afterAll(async () => {
  if (workerOnFakeClock) {
    restartWorker('real');
  }

  await tracker.removeAll();
  await restoreRoles?.();
}, 120_000);

const flagTasks = () => tasksTitledSince(`Set next action: ${OPPORTUNITY_NAME}`, RUN_STARTED_AT);

describe('T4 W4 next-action guard at 08:00 Asia/Dubai', () => {
  it('is scheduled at 04:00 UTC', () => {
    expect(w04NextActionGuard.config.cronTriggerSettings?.pattern).toBe('0 4 * * *');
  });

  it('does not flag the opportunity outside the 08:00 run', async () => {
    const opportunity = tracker.track(
      'opportunities',
      await create<Opportunity>('opportunities', 'opportunity', {
        name: OPPORTUNITY_NAME,
        ownerId,
        nextAction: 'Send the capability deck',
        nextActionDate: null,
      }),
    );

    opportunityId = opportunity.id;
    // Two cron ticks on the real clock.
    await sleep(130_000);

    expect(await flagTasks()).toHaveLength(0);
    expect((await getOne<Opportunity>('opportunities', opportunityId)).nextActionFlaggedOn).toBeNull();
  }, 200_000);

  it('flags it at the next 08:00 run, once', async () => {
    const nextRun = nextUtcFourOClock(new Date());
    const offsetMs = nextRun.getTime() - LEAD_IN_MS - Date.now();

    console.log(`[t4] next run ${nextRun.toISOString()} (08:00 Asia/Dubai), worker clock offset ${offsetMs} ms`);
    restartWorker('offset', String(offsetMs));
    workerOnFakeClock = true;

    const workerNow = () => new Date(Date.now() + offsetMs);
    const observations: { workerTime: string; tasks: number }[] = [];
    let firstSeenAt: Date | null = null;

    while (workerNow().getTime() < nextRun.getTime() + WATCH_AFTER_RUN_MS) {
      const count = (await flagTasks()).length;
      const observedAt = workerNow();

      if (count > 0 && firstSeenAt === null) {
        firstSeenAt = observedAt;
      }

      observations.push({ workerTime: observedAt.toISOString(), tasks: count });
      await sleep(5_000);
    }

    console.log(`[t4] observations:\n${observations.map(({ workerTime, tasks }) => `  ${workerTime} tasks=${tasks}`).join('\n')}`);
    console.log(`[t4] first seen at worker time ${firstSeenAt?.toISOString()}`);

    const beforeRun = observations.filter(
      ({ workerTime }) => Date.parse(workerTime) < nextRun.getTime(),
    );

    expect(beforeRun.length).toBeGreaterThan(5);
    expect(beforeRun.every(({ tasks }) => tasks === 0)).toBe(true);
    expect(firstSeenAt).not.toBeNull();
    expect(firstSeenAt!.getTime()).toBeGreaterThanOrEqual(nextRun.getTime());
    expect(firstSeenAt!.getTime()).toBeLessThan(nextRun.getTime() + 120_000);

    const tasks = await flagTasks();

    expect(tasks).toHaveLength(1);
    expect(tasks[0]!.assigneeId).toBe(ownerId);
    expect((await getOne<Opportunity>('opportunities', opportunityId)).nextActionFlaggedOn).not.toBeNull();
  }, 600_000);
});
