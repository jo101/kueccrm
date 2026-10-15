# 04: Automation (kuec-bd-ops logic functions)

Written against Twenty 2.48.0 and `kuec-bd-ops` 0.1.0. Owner: engineering lead. Readers: engineers and the ops coordinator.

All automation is logic functions in `kuec/app/src/logic-functions`. There are no workflow-builder workflows. Business rules are pure functions in `kuec/app/src/automation` (unit-tested with a fixed clock); the functions load records, call the rule, and write the result.

## 1. Before anything runs

| Check | Where |
| --- | --- |
| `LOGIC_FUNCTION_TYPE=LOCAL` (not `DISABLED`) | `config/deploy/logic-function-type.md` |
| App crons fire (`CronTriggerCronJob` registered) | `01-deploy.md` section 6, `scripts/verify-crons.sh` |
| Stage options Signed, Lost, Parked exist on Opportunity > Stage | `config/dashboards/opportunity-stages.md` |
| App variables set: CRM base URL, SMTP, Teams webhook | `config/dashboards/kuec-bd-ops-variables.md` |
| Playbook role assignments: one active ED, one active ops coordinator, at least one member per role used by the playbooks | same runbook, "Reference data" |
| This year's UAE public holidays entered | same runbook, "Reference data" |

Without an ED assignment, escalations to the ED have no recipient and log `has no recipient`. Without an ops coordinator, the 5-business-day reassignment notifies but cannot reassign and logs `cannot reassign`.

## 2. What each function does

Times are Asia/Dubai. Business days are Monday to Friday minus the holiday list. Cron patterns are UTC.

| Function | Trigger | Does | Writes as |
| --- | --- | --- | --- |
| `w01-instantiate-opportunity-playbook` | `opportunity.updated` on `playbookType` | If `playbookApplied` is false and the type has a playbook: enqueues job `playbook-opportunity-<id>`. The queue keeps one job per id, so two type changes in quick succession give one run. | app |
| `w01-apply-opportunity-playbook` | job `playbook-opportunity-<id>` | Re-checks the guard, then creates the type's work packages (`templates.json`). Step 1 Offered with `offeredAt`, later steps Planned and depending on the previous one. Owner by role: the case-owner role goes to the opportunity owner, other roles to the least-loaded active member of the role, the ops coordinator if the role has nobody. Due at 17:00 after cumulative business-day offsets, capped before the client deadline (RFQ). Fills next action and date from step 1 if empty. Licence: Task "Confirm plan" for the ED. Teams post. Sets `playbookApplied` last. | person (inherited from the event); system fields as app |
| `w02-work-package-offered` | `workPackage.updated` on `status` | On a transition to Offered: stamps `offeredAt` (keeps one W6 just set), notifies the owner, enqueues the acceptance timer. | app |
| `w02-acceptance-timer` | job `wp-accept-<id>-<offeredAt ms>-l1` / `-l2` | Re-reads the work package. Still Offered 2 business days after `offeredAt`: notifies owner and ED, stamps `acceptReminderSentAt`, enqueues level 2. Still Offered after 5: reassigns to the ops coordinator, notifies previous owner, new owner and ED, Teams post, Reassigned on the timeline, stamps `reassignedAt`. | person (reassignment); stamps as app |
| `w03-work-package-due-changed` | `workPackage.updated` on `dueAt`, `status` | Enqueues the overdue timer for an open work package (Offered, Accepted, Submitted, Blocked) with a due date. | app |
| `w03-overdue-timer` | job `wp-due-<id>-<dueAt ms>-l1` / `-l2` | Not Done, Declined or Cancelled at `dueAt`: notifies the owner, stamps `overdueOwnerNotifiedAt`. 2 business days later: notifies the ED, stamps `overdueEdNotifiedAt`. | stamps as app |
| `w04-next-action-guard` | cron `0 4 * * *` (08:00) | Every opportunity not Signed, Lost or Parked with no next action, or a next-action date empty or past: Task "Set next action" due today for the owner (the ED if no owner), email; stamps `nextActionFlaggedOn` so it fires once per day. | app |
| `w05-work-package-blocked` | `workPackage.updated` on `status` | Every transition to Blocked: notifies the ED with the reason, Task "Decision needed", Teams post. | person |
| `w06-work-package-released` | `workPackage.updated` on `status` | Done: stamps `completedAt`; every Planned work package depending on it becomes Offered with `offeredAt` now and its due date recomputed from today (W2 then notifies its owner and starts its timer). Submitted: notifies the reviewer. | person; stamps as app |
| `w07-opportunity-signed` | `opportunity.updated` on `stage` | Transition to Signed: notifies the ED, Teams post. Licence type with no licence contract: creates one in status Signed. | person |
| `w08-opportunity-stage-tracking` | `opportunity.updated` on `stage` | Stamps `stageEnteredAt`. Lost with an empty lost reason: Task "Record lost reason" for the owner. | stamp as app; task as person |
| `w09-instantiate-project-template` | `project.updated` on `playbookType` | Same guard and single job as W1: `playbook-project-<id>`. | app |
| `w09-apply-project-template` | job `playbook-project-<id>` | Same as W1 for projects from `project-templates.json` (Workshop, Proposal, Delivery), with milestones. Workshop steps are planned back from the event date. Sets `playbookApplied` last. | person; system fields as app |
| `w10-milestone-status` | `milestone.updated` on `status` | Missed: project health Red. Every change: `percentComplete` = done / total. | app |
| `w10-project-health-daily` | cron `0 4 * * *` (08:00) | Active projects: an Open milestone due within 7 days turns health Amber unless Red. All milestones Done: Task to the owner to close the project, once (`closeTaskCreatedAt`). | app |
| `w11-engagement-stamp` | `engagement.updated` on `date`, `nextStep` | Company `lastEngagementAt` = the engagement date (never moved backwards). A next step is copied into the linked opportunity's next action. | stamp as app; next action as person |
| `work-package-transition-log` | `workPackage.updated` on `status` | Stamps `acceptedAt`, `submittedAt`, `blockedAt`. Writes the transition (Offered, Accepted, Declined, Submitted, Done, Blocked) to the work package's timeline and, linked to it, to the case's timeline. | app |
| `timer-sweep` | cron `0 * * * *` (hourly) | Re-derives every acceptance and overdue timer due within 7 days from work-package state, reads the queue (`getJobs`), and enqueues what is missing. Logs each repair. | app |

W12 (Teams channel) is not a function: W1, W2 (reassignment), W5 and W7 post one line with the record link to the incoming webhook.

A notification is a Task assigned to the recipient (linked to the record, due today) plus an email from the bd-ops mailbox. Messages are under 20 words and end with the record link.

### Why the design is safe to repeat

- **Created records are ignored.** Nothing listens on `*.created`: a record created in the UI is filled by later updates, and those fire the `.updated` handlers. A record created by API or import with its type already set is not instantiated; set the type again (clear it, then set it) to start the playbook.
- **Guards.** W1 and W9 skip when `playbookApplied` is true and set it last. Instantiation runs as one job per case id, so concurrent triggers cannot run it twice in parallel. A retried run finds what the earlier attempt created (by playbook step, or by title if the step was not stamped yet) and creates the rest.
- **Escalation stamps.** Each escalation level has a timestamp field. A level has fired for the current anchor (`offeredAt` or `dueAt`) when its stamp is later than the anchor. A re-offer or a later due date re-arms it; a retry or a sweep after it fired does nothing.
- **Job ids.** Timer jobs have deterministic ids that include the anchor and level, so enqueuing the same timer twice is a no-op, and a moved due date gets its own job while the old job finds itself stale. Jobs wait at most 7 days; a later timer is reached through hop jobs (`...-h2`, `...-h1`) landing exactly 7 days apart.
- **Channels.** Each notification channel (task, email, Teams post, timeline row) records that it went out in the app's key-value store under the escalation's key, so a retried run resumes where it stopped.
- **Retries.** Rate limits, 5xx, network and SMTP 4xx failures throw `RetryableLogicFunctionError` (3 retries with backoff). Validation and permission errors fail the run: they are bugs. A permanent SMTP or Teams rejection (5xx, 4xx) is logged and does not block the escalation.
- **Sweep.** A database event can be lost on a server restart or throttled under load. The sweep is the guarantee: it only needs record state.

Known limit: declined work packages are logged on the timeline but not reassigned automatically; the ops coordinator reassigns them.

## 3. Re-run by hand

The commands use the `twenty` CLI from `kuec/app` with a remote pointing at the instance (`yarn twenty remote:add`, signed in as the ED's Admin account: running a function by hand needs a member session with the Workflows permission, and an API key is refused). Every function is idempotent, so a manual run never double-notifies.

| To | Run |
| --- | --- |
| Repair all timers now (after a restart, a restore, or resuming automation after an import) | `yarn twenty dev:function:exec -n timer-sweep` |
| Re-run the next-action guard or project health today | `yarn twenty dev:function:exec -n w04-next-action-guard` / `-n w10-project-health-daily` |
| Re-run one timer (for example after fixing an owner) | `yarn twenty dev:function:exec -n w03-overdue-timer -p '{"workPackageId":"<id>","kind":"DUE","level":1,"anchorAt":"<dueAt ISO>"}'` (level 2 for the ED; `w02-acceptance-timer` with `"kind":"ACCEPT"` and the `offeredAt`) |
| Instantiate a playbook for an opportunity that was created with its type, or whose playbook job failed | `yarn twenty dev:function:exec -n w01-apply-opportunity-playbook -p '{"caseId":"<opportunity id>"}'`. Clearing and re-setting Type also works, except within 7 days of a failed job (the queue still holds its id). |
| Same for a project | `... -n w09-apply-project-template -p '{"caseId":"<project id>"}'` |
| Re-run a status handler for one work package | Set the status back and forward in the UI (each transition is logged), or run the function with `-p '{"recordId":"<id>","properties":{"before":{"status":"<old>"},"after":<record JSON with updatedAt>}}'` |

A timer run returns `{ "outcome": "STALE" | "WAIT" | "FIRED", "detail": ... }`. `STALE` means the record no longer needs it (accepted, done, re-dated, already fired) and is the expected answer to a repeat run.

After a CSV import (automation paused per the import runbook): resume, then run `timer-sweep` once. Imported opportunities with a type are not instantiated (see above).

## 4. Read execution logs

Logs are not stored by Twenty; they are streamed while someone is watching, and failures also go to the worker log.

1. **Live, per function.** From `kuec/app`: `yarn twenty dev:function:logs` (all), or `-n timer-sweep`. Leave it running while you reproduce. Each function logs one summary line, for example `sweep checked 42 open work packages, 9 timers due within 7 days, repaired 1` followed by `sweep repaired wp-due-...: no job found`, or `w01 applied RFQ_TECHNICAL_SERVICE to <id>: 7 work packages`, `stale timer for <id>: ...`, `email skipped: SMTP host or sender address not configured`.
2. **Failures.** On the host: `docker compose --env-file /srv/twenty/prod/.env logs worker --since 2h | grep -iE 'LogicFunction|RetryableLogicFunctionError|kuec'`. A transient failure shows up to 3 retries; a final failure shows the error message, which names the operation (`update workPackage <id> failed: ...`).
3. **Queue state of one work package's timers** (read-only):

   ```bash
   docker compose --env-file /srv/twenty/prod/.env exec -T worker node - <<'NODE'
   const { Queue } = require('bullmq');
   const queue = new Queue('logic-function-queue', { connection: { url: process.env.REDIS_URL }, prefix: process.env.REDIS_QUEUE_PREFIX || 'bull' });
   const workPackageId = '<id>';
   (async () => {
     for (const state of ['delayed', 'waiting', 'prioritized', 'active', 'completed', 'failed']) {
       for (const job of await queue.getJobs([state], 0, 1000)) {
         if (job.id.includes(workPackageId)) console.log(state, job.id, new Date(job.timestamp + (job.delay || 0)).toISOString(), job.failedReason || '');
       }
     }
     await queue.close();
   })();
   NODE
   ```

   Ids are `<workspaceId>.wp-accept-...` or `<workspaceId>.wp-due-...`. The time printed is when a delayed job becomes due. Completed jobs are kept 4 hours, failed ones 7 days.
4. **Overall health:** `scripts/verify-crons.sh` counts logic-function runs and failures in the retained window.
5. **On the record.** The stamps (`offeredAt`, `acceptReminderSentAt`, `reassignedAt`, `overdueOwnerNotifiedAt`, `overdueEdNotifiedAt`, `nextActionFlaggedOn`, `stageEnteredAt`) and the timeline show what fired and when, without any log access.

## 5. Incidents

| Symptom | Likely cause | Fix |
| --- | --- | --- |
| Nothing fires at all | `LOGIC_FUNCTION_TYPE=DISABLED`, or app crons not registered | `logic-function-type.md`; `01-deploy.md` section 6 |
| Events fire, crons do not | `CronTriggerCronJob` missing | `cron:register:all`, then `verify-crons.sh` |
| Escalations late or missing after a restart | lost events | Run `timer-sweep`; it logs every repair |
| Same failure every hour in the sweep log | a timer job keeps failing (bad owner, permission) | Read the failure in the worker log, fix the record, run the timer by hand |
| No emails | SMTP variables empty or wrong | Log says `email skipped` or `failed permanently`; fix the variables |
| No Teams posts | webhook empty, expired or removed | Log says `teams post skipped` or `failed permanently: 4xx`; replace the webhook URL |
| Work packages go to the ops coordinator at creation | the role has no active member | Add the playbook role assignment |
| Wrong due dates around a holiday | holiday missing from the list | Add it; future timers use it, existing due dates are not recomputed |

## 6. Fallback if LOGIC_FUNCTION_TYPE must stay DISABLED

Not built. If logic functions cannot be enabled, the same twelve rules can be rebuilt as workflow-builder workflows with Delay steps for W2 and W3, each documented as a click-runbook in `config/dashboards/`. Accept that nothing retries, a lost event is never repaired (there is no sweep), and BD users must not hold the Workflows permission. That would also need an explicit exception to `CLAUDE.md` section 6, which forbids UI workflows standing in for app logic.
