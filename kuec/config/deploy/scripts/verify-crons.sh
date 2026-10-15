#!/usr/bin/env bash
# Proves the worker's recurring jobs are registered and actually running.
# Usage: scripts/verify-crons.sh [path/to/.env]   (run from kuec/config/deploy)
# Exit 0 only if every required scheduler exists and has completed a run
# inside its window with no newer failure.
set -euo pipefail

ENV_FILE="${1:-.env}"
COMPOSE=(docker compose --env-file "$ENV_FILE")

"${COMPOSE[@]}" exec -T worker node - <<'NODE'
const { Queue } = require('bullmq');

const prefix = process.env.REDIS_QUEUE_PREFIX || 'bull';
const queue = new Queue('cron-queue', {
  connection: { url: process.env.REDIS_URL },
  prefix,
});

// [job name, registering command, max minutes since last completed run]
const REQUIRED = [
  ['MessagingMessageListFetchCronJob', 'cron:messaging:message-list-fetch', 10],
  ['MessagingMessagesImportCronJob', 'cron:messaging:messages-import', 5],
  ['MessagingOngoingStaleCronJob', 'cron:messaging:ongoing-stale', 75],
  ['CalendarEventListFetchCronJob', 'cron:calendar:calendar-event-list-fetch', 10],
  ['CalendarEventsImportCronJob', 'cron:calendar:calendar-events-import', 5],
  ['CalendarOngoingStaleCronJob', 'cron:calendar:ongoing-stale', 75],
  ['WorkflowCronTriggerCronJob', 'cron:workflow:automated-cron-trigger', 5],
  ['WorkflowRunEnqueueCronJob', 'cron:workflow:enqueue-awaiting-workflow-run', 5],
  ['CronTriggerCronJob', 'cron:trigger:start-cron-trigger', 5],
];

const main = async () => {
  const schedulers = await queue.getJobSchedulers(0, -1);
  const byName = new Map(schedulers.map((scheduler) => [scheduler.name, scheduler]));
  const jobs = await queue.getJobs(['completed', 'failed'], 0, 5000);
  const now = Date.now();
  let failures = 0;

  for (const [jobName, command, maxMinutes] of REQUIRED) {
    const scheduler = byName.get(jobName);
    const runs = jobs.filter((job) => job.name === jobName);
    const lastOk = runs
      .filter((job) => job.finishedOn && !job.failedReason)
      .sort((a, b) => b.finishedOn - a.finishedOn)[0];
    const lastFail = runs
      .filter((job) => job.failedReason)
      .sort((a, b) => b.finishedOn - a.finishedOn)[0];

    const problems = [];
    if (!scheduler) problems.push('not registered');
    if (!lastOk) problems.push('no completed run retained');
    else if (now - lastOk.finishedOn > maxMinutes * 60_000)
      problems.push(`last success ${Math.round((now - lastOk.finishedOn) / 60_000)} min ago`);
    if (lastFail && (!lastOk || lastFail.finishedOn > lastOk.finishedOn))
      problems.push(`latest run failed: ${lastFail.failedReason}`);

    const status = problems.length === 0 ? 'OK  ' : 'FAIL';
    if (problems.length > 0) failures++;
    console.log(
      `${status} ${command.padEnd(46)} pattern=${scheduler?.pattern ?? '-'} ` +
        `last_ok=${lastOk ? new Date(lastOk.finishedOn).toISOString() : '-'} ` +
        `next=${scheduler?.next ? new Date(scheduler.next).toISOString() : '-'}` +
        (problems.length ? `  <- ${problems.join('; ')}` : ''),
    );
  }

  console.log(`\n${schedulers.length} schedulers registered on ${prefix}:cron-queue`);

  // App crons end here: CronTriggerCronJob enqueues one LogicFunctionTriggerJob per due function.
  // Zero is expected until kuec-bd-ops is installed and one of its cron patterns has come due.
  const functionQueue = new Queue('logic-function-queue', {
    connection: { url: process.env.REDIS_URL },
    prefix,
  });
  const functionRuns = await functionQueue.getJobs(['completed', 'failed'], 0, 1000);
  const functionFailed = functionRuns.filter((job) => job.failedReason);
  console.log(
    `logic functions (retained window): ${functionRuns.length - functionFailed.length} ok, ${functionFailed.length} failed` +
      (functionFailed[0] ? `; latest failure: ${functionFailed[0].failedReason}` : ''),
  );
  await functionQueue.close();
  await queue.close();
  process.exit(failures === 0 ? 0 : 1);
};

main().catch(async (error) => {
  console.error(error);
  await queue.close();
  process.exit(2);
});
NODE
