**NO-GO.** W1 does not finish on Twenty 2.48.0 (T1 fails), the app at `main` cannot be synced or published with SDK 2.48.0, and the role model T6 assumes does not exist. T9 could not be run because no release after 2.48 exists.

# Acceptance test report: kuec-bd-ops on Twenty 2.48.0

Run on 2026-10-16 against `main` at `1307a7f2` (kuec-bd-ops 0.4.0). Specs and scripts: `kuec/app/src/__tests__/acceptance/` and `kuec/tests/acceptance/`. Evidence (logs, snapshots, screenshots): `kuec/tests/acceptance/evidence/`.

## Results, failing first

| # | Result | One line |
| --- | --- | --- |
| T1 | **FAIL** | Work packages, owners, dates and `playbookStep` are right and created once. W1 then throws, so `playbookApplied` stays false, there is no next action, no Confirm-plan task for the ED, and no "Accept or decline" for the first owner. |
| T6 | **FAIL** (the control you want does not exist) | No Automation, ED, BD staff, Engineer or Ops coordinator role ships in the app. Every user is a Member and can set anyone's work package to Done. Making Status read-only on a role blocks every status change, including the user's own, and does not stop taking someone else's work package over. |
| T9 | **NOT RUN (blocked)** | 2.48.0 itself is unreleased, and nothing newer exists: Docker Hub tops out at `v2.47.0`, `v2.48.0` and `v2.49.0` return 404, npm `latest` is 2.47.0, and there is no `2-49` upgrade directory. |
| T5 | **PASS**, with one rule broken | The ED gets "Decision needed" with the reason, once per block. A block with no reason is also accepted, though CLAUDE.md §7 says blocking requires one. |
| T2 | **PASS** | With 1 business day = 20 s: the reminder went to the owner and the ED at 40.6 s; at 100.7 s the work package was reassigned to the ops coordinator, notifying the old owner, the new owner and the ED. Each fired once. The real timers were restored and proven. |
| T3 | **PASS** | The owner was notified 0.6 s after `dueAt` and the ED 40.7 s after (2 shortened days), once each. |
| T4 | **PASS** | The cron fired on the 08:00 Asia/Dubai tick (first seen 04:00:30 UTC on the worker clock), never before it, and exactly once. |
| T7 | **PASS** | Restored into a fresh `postgres:16` container: 124/124 table counts identical, plus one work package's full history (20 timeline rows, 1 task). Reads through the API on both instances match. |
| T8 | **PASS** | v1 → v2 plan "65 to add, 17 to change, 0 to destroy", with v1 data intact. In staging, removing `declinedReason` needed explicit confirmation, dropped the column and its data, and the T7 restore brought both back. |

Unit tests: 104/104 pass against the in-repo SDK 2.48.0 (the first run on 2.48.0; `tests/04-automation.md` recorded 68 on 2.47.0).

## Blockers found on the way (not in T1–T9, but they stop a deploy)

1. **The app cannot be synced, built or published with SDK 2.48.0.** The SDK runs `tsc -p tsconfig.json` before `dev`, `build` and `publish`. `kuec/app/tsconfig.json` has no `include`, so it picks up `scripts/import/*.ts` (added in `56065fca`), which use `.ts` import paths and ES2021 APIs. Result: 41 errors, sync aborted. Every run below used a local, uncommitted one-line workaround (`"scripts"` added to `exclude`). Proposed fix: exactly that line, or `"include": ["src"]`.
2. **W1 fails on every run, by event or by hand.** It creates and stamps all work packages, then `publishWorkPackageTransition` fails on the opportunity (case) row inside the SDK's `createTimelineActivity`: `Bad Request: Expected non-nullable type "UUID!" not to be null.` Nothing after that line runs. The job is reported as processed, with no error in the worker log and no retry. The same call fails for every transition: in T7, the 6 transitions of a work package reached its own timeline but **none reached the opportunity's timeline**, which `runbooks/04-automation.md` describes as the case audit trail. The same request succeeds when sent outside the function runtime, so the cause sits between the app's call and the SDK client in the function runtime. Not resolved here.
3. **The roles the runbooks rely on are not in the manifest.** `src/roles/` only has `default-function.role.ts`. `config/dashboards/members-and-roles.md`, `automation-api-key.md` and `runbooks/01-deploy.md` §8–9 all assume the app ships ED, BD staff, Engineer, Ops coordinator and Automation (G9 in `01-deploy.md` already flags this).
4. **The integration harness could not run manual function executions on 2.48.** `executeOneLogicFunction` needs a signed-in user, but `global-setup.ts` handed the API key to the CLI, so every `executeFunction` call failed with "Authentication failed". Fixed in this change: `global-setup.ts` now uses `TWENTY_CLI_ACCESS_TOKEN` when set.

5. **`yarn typecheck` fails on `main`** (minor): `src/import/import-target-values.test.ts` imports `scripts/import/target-values.ts`, which is outside `tsconfig.spec.json` (TS6307). This has the same root as blocker 1: `scripts/` sits outside both tsconfigs' intended scope.

## How it was run

- **Instance.** No 2.48.0 image or SDK is published, so Twenty was built and run from this checkout (`TWENTY_CURRENT_VERSION = 2.48.0`): server plus worker, `LOGIC_FUNCTION_TYPE=LOCAL`, local Postgres 16 and Redis 7, crons registered, seeded dev workspace "Apple". The app's `twenty-sdk`, `twenty-client-sdk` and `twenty-ui` were linked to `packages/*` at 2.48.0. This is a disposable test instance, not the deploy path; `01-deploy.md` G1 still forbids a local build in production.
- **Credentials.** REST calls used an admin API key of the disposable workspace. Manual function runs used Tim Apple's session; role changes used Jane Austen (Admin). Tim is on the seeded "Object-restricted" role, which cannot manage roles. No key or token is in the repo or the evidence.
- **Not exercised.** SMTP and Teams (variables empty, so those channels log `skipped`); the rclone/S3 legs of `backup.sh` and `restore-test.sh`.
- **Environment incidents.** The container restarted once, the Twenty server's esbuild service had to be restarted (I killed it by mistake), and two overlapping app installs damaged the staging schema. That last one was repaired by restoring the T7 backup, which counts as a second successful use of it.

## T1: Licence opportunity, W1 (FAIL)

Spec `acceptance/t1-licence-playbook.integration-test.ts`. Roles: ED = Tim, Ops coordinator = Jony, BD officer, Developer, Data analyst and Legal each a different member; case owner a seventh member. The opportunity was created, then Type set to Technology licensing (Friday 2026-10-16, no holidays).

| Check | Result |
| --- | --- |
| 6 work packages, one per template step, `playbookStep` `TECHNOLOGY_LICENSING.<KEY>`, no duplicates after 20 s quiet | pass |
| Step 1 Offered, rest Planned, each depending on the previous | pass |
| Owners: Technical assessment → Developer, route scoping, outreach and term sheet → case owner, partner shortlist → Data analyst, licence signed → Legal; reviewers by role | pass |
| Due 17:00 Dubai after cumulative business days: 30 Oct, 6 Nov, 13 Nov, 4 Dec, 18 Dec 2026, 15 Jan 2027 | pass |
| `playbookApplied` true, next action "Technical assessment" with step 1's date | **fail**: false, empty, null |
| One "Confirm plan" task for the ED | **fail**: 0 |
| One "Accept or decline: Technical assessment" for the Developer | **fail**: 0 |
| Type change, re-set and re-run create nothing more | **fail**: the re-run does not skip, it throws the same error. No extra work packages were created, because the retry path finds them by step. |

Error from the re-run: `w01-instantiate-opportunity-playbook threw: Bad Request: {"errors":[{"message":"Expected non-nullable type \"UUID!\" not to be null." ...}]}`, stack `createTimelineActivity → publishOnce → publishWorkPackageTransition → instantiateCase`. Evidence: `evidence/logs/t1.txt`.

The original suite fails its W1 cases for the same reason (see "Existing integration suite" below).

## T6: changing someone else's work package status (FAIL as a control)

The user without the Automation role is Phil Schiler. Spec `acceptance/t6-field-permissions-api.integration-test.ts` (API) and script `t6-ui-kanban.mjs` (record page, table, kanban; screenshots in `evidence/t6/`).

**Today (Member role; the app ships no other role):** a REST PATCH setting Tim's work package to Done is **allowed** (200, stored DONE).

**With a role whose Work package > Status field is read-only** (the only field permission 2.48 accepts is a restriction; `canReadFieldValue: true` is rejected with `ONLY_FIELD_RESTRICTION_ALLOWED`):

| Attempt by Phil | Result |
| --- | --- |
| Record page: click Status, pick Done | Blocked: no picker opens, stored OFFERED |
| Table (Everything view): click the Status cell | Blocked: the cell focuses, no picker opens, stored OFFERED |
| Kanban By status: drag the card from Offered to Done | Blocked on the server, **not in the UI**: the card drops into Done, a toast says "User does not have permission.", stored OFFERED, and the card is back in Offered after reload |
| REST PATCH status, GraphQL `updateWorkPackage`, REST bulk PATCH by filter | Blocked: `PERMISSION_DENIED: no permission to write field "status" on "workPackage"` |
| Create a work package already Done | Blocked (same message) |
| **Status of Phil's own work package** | **Blocked too.** Field permissions are per field, not per record, so a BD user on this role cannot accept, submit, block or finish their own work. |
| Set Tim's work package owner to Phil | **Allowed**: anyone can take over someone else's work package, then still not change its status |
| Change Tim's due date, done criteria, blocked reason | **Allowed** |
| Delete Tim's work package | Member: allowed. Any role made with `createOneRole`: refused, with or without the field restriction (control run), so this is not the field permission's doing |

Conclusion: field permissions can make Status read-only for everyone on a role, but cannot say "only the owner, or the Automation role, changes the status". That needs row-level permissions (Organization plan, excluded in CLAUDE.md §3). The workable options are status edits for everyone (today) or status through automation only, which needs the app's own transitions (for example a front-component action) and an app role with write access.

Observed once, not reproduced: right after an app install, Phil's first Member PATCH was refused with `PERMISSION_DENIED`, and a retry minutes later succeeded.

## T9: upgrade rehearsal (NOT RUN)

Nothing to upgrade to. Checked on 2026-10-16: Docker Hub tags `latest`, `v2`, `v2.47`, `v2.47.0` (14 Oct); `v2.48.0` and `v2.49.0` return 404; npm `twenty-sdk` `latest` is 2.47.0; the repo has `upgrade-version-command/2-48` but no `2-49`. Rerun `runbooks/01-deploy.md` §12 once 2.49.0 is published. T7 and T8 already cover its backup, restore and app-plan steps.

## T5: Blocked with a reason (PASS, one rule broken)

Spec `acceptance/t5-blocked.integration-test.ts`.

- Block with reason "Client has not sent the sample spec": one "Decision needed: …" task for the ED, body `Blocked, decision needed: … Reason: Client has not sent the sample spec. /object/workPackage/<id>`, `blockedAt` set, still one task after 20 s. Pass.
- Block, unblock, block again: two tasks. Pass ("every time").
- Block with no reason: **accepted** by the API; the ED gets "Reason: none given." CLAUDE.md §7 says blocking requires a reason. Nothing enforces it (G8: server-side validation rules need the Organization plan). Record as a rule gap.

## T2 and T3: escalation timers (PASS)

Spec `acceptance/t2-t3-escalation-timers.integration-test.ts`. It syncs a temporary copy of the app in which the three `addBusinessDays` calls of `work-package-timers.ts` count 1 business day as 20 s. Job ids, handlers and every other rule are the shipped code. Sync plan: "0 to add, 17 to change, 0 to destroy".

| Level | Expected | Measured | Recipients (tasks) |
| --- | --- | --- | --- |
| W2 not accepted, 2 days | 40 s after `offeredAt` | 40.6 s | owner, ED; owner unchanged |
| W2 not accepted, 5 days | 100 s | 100.7 s | owner → ops coordinator; old owner, new owner, ED |
| W3 overdue, owner | at `dueAt` | +0.6 s | owner |
| W3 overdue, ED | `dueAt` + 2 days = 40 s | 40.7 s | ED |

After a 20 s quiet period, every level had fired once.

**Restore.** The shipped app was synced back (0 to destroy), and the built functions no longer contain the shortened-timer marker. A new Offered work package, run by hand after 55 s, returned `WAIT` (`chained wp-accept-…-l1`) with no reminder sent, so the real 2-business-day timer is back. Evidence: `evidence/logs/t2t3.txt`.

## T4: next 08:00 run (PASS)

Spec `acceptance/t4-next-action-cron.integration-test.ts`. Open opportunity, next action set, next-action date empty.

- `w04-next-action-guard` cron pattern is `0 4 * * *` (08:00 Asia/Dubai).
- On the real clock, two cron ticks after creation: no task, `nextActionFlaggedOn` null.
- The worker was restarted with `new Date()` moved to 90 s before the next 04:00 UTC (`fake-clock.cjs`, `worker-clock.sh`). That is the clock the cron dispatcher uses to decide what is due; BullMQ keeps the real one. Polled every 5 s until 04:03: 0 tasks up to 04:00:25, 1 "Set next action" task for the owner from 04:00:30, still 1 at 04:03. `nextActionFlaggedOn` set.
- Caveats: the function itself runs in a child process on the real clock, so the stamp carries the real date. The run also flagged the seeded opportunities, which is why it took about 25 s. 2026-10-17 is a Saturday, and W4 fires on weekends too (CLAUDE.md does not say it should not; worth deciding).

## T7: backup and restore (PASS)

Script `kuec/tests/acceptance/t7-backup-restore.sh` (the commands of `backup.sh` and `restore-test.sh` without compose and rclone).

1. A work package was walked Planned → Offered → Accepted → Blocked → Accepted → Submitted → Done on an opportunity.
2. With server and worker stopped: a row-count snapshot of every table in `core`, `metadata` and the workspace schema; then `pg_dump -Fc --no-owner` (5.0 MB, 165 TABLE DATA entries), sha256, and a copy of the files store (95 MB).
3. A fresh `postgres:16` container; sha256 checked; `pg_restore --no-owner --exit-on-error`; snapshot taken before anything touched it.
4. Twenty booted against the copy (no worker, logic functions disabled): healthy; `upgrade:status` "2 up to date, 0 behind, 0 failed".

Comparison: `t7-snapshot.diff` is empty. That covers 124 table counts, the work package row, its 20 timeline rows (recordCreated, recordUpdated, taskLinked and workPackage Offered, Accepted, Blocked, Accepted, Submitted, Done) and its "Accept or decline" task. The API read of the work package is byte-identical on both instances. Evidence: `evidence/t7/`.

## T8: manifest changes (PASS)

- **v1 → v2, additive** (`src/__tests__/upgrade.integration-test.ts`; v1 = 0.3.0 at `0ac8b13d`): 5/5. No v1 entity, option, field name or type is missing in v2; plan "65 to add, 17 to change, 0 to destroy"; v1 records unchanged; the v2 field `declinedReason` is writable on a v1 record; the v1 sidebar is kept.
- **Field removal, staging only** (`kuec/tests/acceptance/t8-field-removal-and-restore.sh`), run on the restored T7 state:
  - The copy of the app without `workPackage.declinedReason` plans "18 to change, 4 to destroy". The removal takes a generated view field and page-layout widget with it, while the SDK counts 1. Without confirmation the SDK aborts (`APPLY_ABORTED`, nothing changed).
  - Confirmed: the column is gone from `_workPackage`, the field metadata is gone, and the API no longer returns the field. The T7 record's value "Kept for T8: written before the T7 backup" is lost with it.
  - Restore from the T7 dump and files: column back, metadata back, value back, also through the API.

## Existing integration suite (`automation.integration-test.ts`)

Before the harness fix: 8 passed, 7 failed (2 on W1, 5 on manual-execution auth). After it: **12 passed, 3 failed**. All 3 wait on W1's `playbookApplied`: "instantiates once", "holds the guard", and the W7 licence-contract case, which first applies a licence playbook. The guard on created records, the transition log, W3, W5, W6, W8, W9/W10, W11, W4 once a day, the sweep repair and W10's idempotence all pass. Evidence: `evidence/logs/automation-suite.txt`.

## Files in this change

- `kuec/app/src/__tests__/acceptance/`: T1–T6 specs plus helpers (shortened-timer build, role assignment, task lookups).
- `kuec/tests/acceptance/`: T4 worker clock (`fake-clock.cjs`, `worker-clock.sh`), T6 UI script, T7 and T8 scripts, sync helper, evidence.
- `kuec/app/src/__tests__/global-setup.ts`: `TWENTY_CLI_ACCESS_TOKEN` for manual function runs.
- Not committed: the `tsconfig.json` workaround from blocker 1, which is a decision for the app owner.

How to rerun: `kuec/tests/acceptance/README.md`.

## Addendum 2026-10-17: T10 roles (PASS)

Run on `kuec-bd-ops` 0.6.0, same kind of instance (Twenty 2.48.0 built from this checkout, seeded workspace, `LOGIC_FUNCTION_TYPE=LOCAL`). Spec `acceptance/t10-roles.integration-test.ts`, roles in `runbooks/13-roles.md`. Evidence: `evidence/logs/t10.txt`.

| Check | Result |
| --- | --- |
| The app installs with all 11 roles, their object and field permissions | pass |
| BD officer: accepts and blocks own work package; refused on Due and Owner of a work package, on editing a project, on deleting an opportunity, on destroying a timeline row; allowed on opportunities, companies, tasks and task links | pass |
| IP office (department roles): edits opportunities; refused on companies and on work package status | pass |
| Engineer: reads people; refused on writing companies and notes and on creating an API key | pass |
| Leadership viewer: reads opportunities, projects, contracts, dashboards; refused on people, engagements, the timeline and any edit | pass |
| Ops coordinator moves a due date and deletes; the ED creates an Automation key; the key edits an opportunity and is refused on deletes | pass |
| A BD officer sets a licence Type, marks step 1 Done and signs: W1 creates the work packages, W6 offers step 2, W7 creates the licence contract, `stageEnteredAt` is stamped | pass |
| Same playbook check against the previous code, where W1, W2, W6 and W7 wrote as the person | **fail**: no work package created (`evidence/logs/t10-before-app-scoped-writes.txt`); fixed in 0.6.0 |
| Uninstalling the app leaves a member on an app role with no role at all (requests fail with "has no role assigned") | confirmed; `runbooks/13-roles.md` forbids uninstalling in production |

Blocker 3 above is resolved. T6's conclusion still holds: a BD officer can change the status of a work package someone else owns, because 2.48 cannot limit edits to the owner without row-level permissions.
