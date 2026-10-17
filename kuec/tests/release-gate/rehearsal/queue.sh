#!/usr/bin/env bash
# Usage: queue.sh list <substring> | queue.sh remove <substring>
docker exec -i -e MODE="$1" -e MATCH="$2" twenty-rehearsal-worker-1 node - <<'NODE'
const { Queue } = require('bullmq');
const queue = new Queue('logic-function-queue', { connection: { url: process.env.REDIS_URL }, prefix: process.env.REDIS_QUEUE_PREFIX || 'bull' });
(async () => {
  for (const state of ['delayed', 'waiting', 'active', 'completed', 'failed']) {
    for (const job of await queue.getJobs([state], 0, 3000)) {
      if (!job.id.includes(process.env.MATCH)) continue;
      if (process.env.MODE === 'remove' && state === 'delayed') { await job.remove(); console.log('removed', job.id.replace(/^[0-9a-f-]{36}\./, '')); continue; }
      console.log(state, job.id.replace(/^[0-9a-f-]{36}\./, ''), 'due', new Date(job.timestamp + (job.delay || 0)).toISOString());
    }
  }
  await queue.close();
})();
NODE
