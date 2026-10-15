# 04: Automation tests

Written against Twenty 2.48.0 and `kuec-bd-ops` 0.1.0. Code: `kuec/app/src/automation/**/*.test.ts` (unit) and `kuec/app/src/__tests__/automation.integration-test.ts` (integration). Runbook for the functions themselves: `runbooks/04-automation.md`.

## Unit tests: the rules, with a fixed clock

No server needed. From `kuec/app`: `yarn test:unit`.

| File | Proves |
| --- | --- |
| `dates/business-days.test.ts` | Saturday/Sunday weekend, holidays from the list, Asia/Dubai day boundary, time of day kept across a weekend, due dates at 17:00 local |
| `playbooks/plan-case-work-packages.test.ts` | Step 1 Offered and the rest Planned behind it; cumulative offsets; case-owner role to the case owner, other roles to the least-loaded member, ops coordinator when a role is empty; RFQ steps capped 2 business days before the client deadline; workshop run anchored on the event date, milestones and their work packages |
| `playbooks/playbook-templates.test.ts` | Bundled `src/playbooks/*.json` match `kuec/playbooks` byte for byte (run `yarn playbooks:sync` after editing a playbook); every opportunity and project type has a template; roles and milestone references are valid |
| `timers/work-package-timers.test.ts` | 2- and 5-business-day acceptance levels, overdue owner then ED +2 business days, re-arming on a re-offer or a later due date, nothing for Done/Declined/Cancelled/Planned; job ids; hop chaining past the 7-day job limit; a repeated or late job is stale |
| `rules/rules.test.ts` | Next-action guard (empty, past, today, once per day, closed stages); project health Amber window, Red never downgraded, percent complete |
| `notifications/notification-messages.test.ts` | Every message is under 20 words with the record link, long names and reasons are shortened |

## Integration tests: a disposable instance

These prove each function fires once and only once against a real server. They create and delete records and install and uninstall the app, so they never run against production or staging.

### Start an instance

Either the SDK's local server:

```bash
cd kuec/app
yarn install
yarn twenty docker:start          # Twenty 2.48.0 on http://localhost:2020, seeded dev workspace
```

or the CI action `twentyhq/twenty/.github/actions/spawn-twenty-app-dev-test` with `TWENTY_VERSION: 2.48.0`. The instance needs `LOGIC_FUNCTION_TYPE=LOCAL` and a running worker (both are the default for the local server), and at least two workspace members (the seeded workspace has them).

### Run

```bash
cd kuec/app
TWENTY_API_URL=http://localhost:2020 TWENTY_API_KEY=<admin API key of the disposable workspace> \
  TWENTY_TEST_USER_EMAIL=tim@apple.dev TWENTY_TEST_USER_PASSWORD=tim@apple.dev yarn test
```

Functions run by hand (`executeOneLogicFunction`) need a member session with the Workflows permission, so the suite signs in as the test user (the seeded admin by default); records are created with the API key. `global-setup.ts` checks the server, uninstalls any previous copy, builds and syncs the app; teardown uninstalls it. The suite adds the Signed, Lost and Parked stage options through the metadata API (the step `config/dashboards/opportunity-stages.md` does by hand in production), and creates playbook role assignments: the first member holds every role, the second is the ops coordinator. SMTP and Teams variables stay empty, so those channels log `skipped` and the tests assert on tasks and stamps. Expect 5 to 10 minutes: every "only once" check waits a 20-second quiet period after the effect appears.

### Cases

| Case | Steps | Pass when |
| --- | --- | --- |
| Guard on a manually created record | Create an opportunity with Type already set | After the quiet period: no work packages, `playbookApplied` false |
| W1 ignores other fields | Rename it | Still no work packages |
| W1 fires once | Clear Type, then set it to RFQ straight away (two events racing) | 7 work packages, one Offered, all with an `RFQ_TECHNICAL_SERVICE.*` step; next action "Bid or no-bid" with a date; `playbookApplied` true |
| W1 guard holds | Change Type to Licence; run the W1 event function and the W1 job by hand | Still 7 work packages; both runs return `skipped`; one "Accept or decline: Bid or no-bid" task |
| Transition log once | Accept step 1 | `acceptedAt` set and unchanged after the quiet period |
| W6 once | Mark step 1 Done | `completedAt` set; Scoping Offered with `offeredAt`, depending on step 1; one "Accept or decline: Scoping" task (W2 notifies, W6 does not, so there is no race); step 3 still Planned |
| W3 once, retried job does not double-write | Accept Scoping with a due date an hour ago; then run `w03-overdue-timer` twice by hand with the same payload | `overdueOwnerNotifiedAt` set by the queued job; both manual runs return `STALE`; one "Overdue: Scoping" task; the stamp is unchanged |
| W5 once per block | Block Scoping with a reason | One "Decision needed: Scoping" task for the ED; `blockedAt` set |
| W8 once | Set the opportunity to Lost with no reason | `stageEnteredAt` set; one "Record lost reason" task |
| W7 once | Licence opportunity: set Type, then Signed, Meeting, Signed again | One "Confirm plan" task for the ED; exactly one licence contract |
| Sweep repairs a lost job, once | Create a work package already Accepted with a due date in 2 days (no update event, so no job: what a lost event or a deleted job leaves); run `timer-sweep` twice | First run reports `wp-due-<id>-<dueAt ms>-l1` repaired; second run does not (the job is now pending) |
| W9 once, W10 | Create a project with an event date, set Type Workshop, then change it to Proposal | 5 milestones and 6 work packages, unchanged after the type change; one milestone Done gives 20 percent; one Missed turns health Red |
| W11 | Update an engagement's date and next step | Company `lastEngagementAt` set; opportunity next action is the next step |
| W4 once per day | Create an opportunity with no next action; run the guard twice | Flagged on the first run only; one "Set next action" task |
| W10 daily idempotent | Run the daily health twice | Second run changes nothing |

What the suite cannot do: remove a job from the queue (there is no API for it), so "deleted job" is simulated by a work package whose job was never enqueued; the sweep code path is the same (`getJobs` returns nothing for the id). Clock-dependent escalations (2 and 5 business days after an offer, ED +2 days) are proven by the unit tests; the integration test drives the overdue path through a due date in the past.

## Status (2026-10-15)

- Unit tests: 50 passing.
- Integration: 15 of 15 passing against Twenty 2.48.0 built from this repo (server and worker on local Postgres 16 and Redis, `LOGIC_FUNCTION_TYPE=LOCAL`, seeded dev workspace), with `twenty-sdk` and `twenty-client-sdk` 2.48.0 from the same build. 2.48.0 is not on npm yet, so `yarn install` in `kuec/app` works only once it is published, and `yarn.lock` is added then.
- Typecheck, lint and `appBuild` pass.

The first real-server run found two bugs the unit tests could not: `twenty-sdk/define` is replaced by a stub inside logic-function bundles (a standard-object id read from it was undefined, so case timeline rows failed), and two quick type changes raced W1 into creating duplicate work packages (now one serialized job per case).
