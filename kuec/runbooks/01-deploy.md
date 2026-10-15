# 01: Deploy Twenty 2.48.0 on the KUEC container host

Who runs it: the deploy engineer, with the ED for the steps that need the server-admin account.
Files: `kuec/config/deploy/` (compose, env template, scripts) and `kuec/config/dashboards/` (click-runbooks).
Written against: Twenty 2.48.0, stock image, no core changes.

## 0. Gates and facts that change the plan

Check these before starting. Each one is something the request assumed differently from what the 2.48 code does.

| # | Fact | Consequence |
| --- | --- | --- |
| G1 | On 2026-10-15 Docker Hub has no `twentycrm/twenty:v2.48.0`. The newest tag is `v2.47.0`. This repo's `main` is 2.48.0 in development (`TWENTY_CURRENT_VERSION = '2.48.0'`). | **Do not start until `docker manifest inspect twentycrm/twenty:v2.48.0` succeeds.** Do not substitute `latest`, `v2`, or a local build of `main`. Once the tag is published, record its digest in section 2. |
| G2 | `cron:workflow:automated-cron-trigger` fires **scheduled workflows** only. App cron triggers (our logic functions) are fired by a different job, `cron:trigger:start-cron-trigger` (`CronTriggerCronJob`). | Both are registered and both are checked in section 6. |
| G3 | A second workspace does not need a paid plan: 2.48 allows 5 workspaces without an Organization key. With `IS_MULTIWORKSPACE_ENABLED=false`, though, the instance serves one workspace. | Staging is a **separate instance** (section 10). That also isolates crons, `LOCAL` code and test mail from prod, and it is where upgrades get rehearsed. |
| G4 | Twenty signs in with Microsoft through the `/common` endpoint. | The Azure registration has to be multitenant, restricted with "Assignment required" (it-request item 1). |
| G5 | Twenty's SMTP sender only supports username and password. Microsoft disables basic SMTP AUTH by default for existing tenants at the end of December 2026. | IT has to keep SMTP AUTH enabled for bd-ops or provide a relay connector (it-request item 2). Mail sync and app sends through the connected account use OAuth and are not affected. |
| G6 | MinIO's community edition is no longer maintained: no images after September 2025, repository archived April 2026. | Use the host's S3-compatible object store. If IT can only offer MinIO, they pin the final image and own the risk. |
| G7 | Per-API-key rate limits need the Organization plan's usage-limit entitlement. | We raise `API_RATE_LIMITING_LONG_LIMIT` for the whole instance (section 5). |
| G8 | Field validation rules ("required" enforced by the server) need the Organization plan. | "Required next action / date / owner" is enforced by the app's sweep, as `CLAUDE.md` section 7 already says. |
| G9 | "Roles per Prompt 13" is not in this repo. | Section 8 uses the role set from `kuec/CLAUDE.md` (ED, BD staff, Engineer, Ops coordinator, Automation). Reconcile with Prompt 13 when the app's `src/roles/` is written. |

Out of scope because they need the Organization plan: SSO (SAML/OIDC), custom domains, row-level permissions, record sharing, audit logs, per-key usage limits, validation rules, and more than 5 workspaces.

## 1. Prerequisites

- `kuec/config/deploy/it-request.md` approved, with every box ticked.
- Container host: Linux, Docker Engine with Compose v2, at least 4 vCPU, 8 GB RAM and 60 GB disk for prod plus staging. This is our sizing estimate, not a Twenty requirement. Host time is NTP-synced.
- A TLS reverse proxy for both hostnames (example: `Caddyfile.example`).
- The ED is available for sections 4, 5, 8 and 9.
- `logic-function-type.md`: decided, and signed by the ED if the answer is LOCAL.

## 2. Secrets

Generate on a trusted workstation, write straight into the secrets manager, and never echo them to a shared terminal or ticket:

```bash
openssl rand -hex 32     # -> twenty/prod/PG_DATABASE_PASSWORD (hex: it goes into a URL)
openssl rand -base64 32  # -> twenty/prod/ENCRYPTION_KEY
```

`ENCRYPTION_KEY` encrypts every OAuth token, the Azure and SMTP secrets stored by the Admin Panel, and app variables. A backup restored without it is useless, so it lives in the secrets manager and nowhere else. Rotation follows Twenty's key-rotation guide (`FALLBACK_ENCRYPTION_KEY`).

Also in the secrets manager, from IT: `STORAGE_S3_ACCESS_KEY_ID`, `STORAGE_S3_SECRET_ACCESS_KEY`, `BACKUP_S3_*`, `AUTH_MICROSOFT_CLIENT_SECRET`, `EMAIL_SMTP_PASSWORD`. Staging gets its own set under `twenty/staging/`, with its own `ENCRYPTION_KEY`.

Image pin: once G1 is cleared, record the digest here and use it in `.env` as `TAG=v2.48.0@sha256:<digest>`.

| Image | Digest | Recorded by / date |
| --- | --- | --- |
| `twentycrm/twenty:v2.48.0` | | |

## 3. Install and first boot

```bash
sudo mkdir -p /srv/twenty/prod /srv/twenty/backups/prod
sudo git clone https://github.com/jo101/kueccrm /srv/twenty/kuec-repo
cd /srv/twenty/kuec-repo/kuec/config/deploy
sudo cp .env.example /srv/twenty/prod/.env && sudo chmod 600 /srv/twenty/prod/.env
# Fill /srv/twenty/prod/.env: SERVER_URL=https://crm.kuec.example, the bucket/endpoint names,
# and every SECRET line from the secrets manager (or render it with your secrets-manager CLI).
docker compose --env-file /srv/twenty/prod/.env pull
docker compose --env-file /srv/twenty/prod/.env up -d
docker compose --env-file /srv/twenty/prod/.env logs -f server   # wait for "Successfully registered all background sync jobs!"
```

On first boot the server initialises the database, runs upgrade commands, and runs `cron:register:all`. The worker has `DISABLE_CRON_JOBS_REGISTRATION=true`, so registration happens exactly once per server start.

Point the reverse proxy at `127.0.0.1:3000`, then:

```bash
scripts/verify-config.sh /srv/twenty/prod/.env     # guard rails, https SERVER_URL, /healthz reachable
```

`SERVER_URL` has to be the public HTTPS name. OAuth redirects, file and AI attachment links, and app server routes are all built from it.

## 4. Workspace creation (the ED signs up first)

The first account created on the instance becomes server admin (Admin Panel) and the workspace's **Admin**. That has to be the ED.

1. The ED opens `https://crm.kuec.example` and signs up with their KUEC email and a password. Microsoft is not configured yet.
2. Workspace name: `KUEC BD Ops`. KUEC logo only (`.github/TRADEMARK.md`: no Twenty marks altered, no "official Twenty" wording).
3. Skip the onboarding steps for connecting mail and inviting people. They come later.

After this, `IS_WORKSPACE_CREATION_LIMITED_TO_SERVER_ADMINS` (default `true`) refuses any sign-up without an invitation, so no one else can create a workspace.

## 5. Admin Panel configuration

Follow `config/dashboards/admin-panel-config-variables.md`: Microsoft login and sync on, Google off, SMTP through Office 365 as bd-ops, `API_RATE_LIMITING_LONG_LIMIT=600`.

Rate limits: `API_RATE_LIMITING_LONG_LIMIT` (default 100 per 60 s) applies to API-key traffic across the instance. Our own app's logic functions do not use the API key; they call the API with an application token limited by `APPLICATION_API_RATE_LIMITING_LIMIT` (500 per 60 s). Raise that one only if the sweep logs show 429s.

Then the ED signs out and back in with **Continue with Microsoft** using the same email. This proves Microsoft login and the redirect URI. Keep password sign-in on until every member has signed in with Microsoft once. Setting `AUTH_PASSWORD_ENABLED=false` afterwards is optional. If you do it and Microsoft login breaks, recovery means deleting that `core."keyValuePair"` row in Postgres.

Re-run `scripts/verify-config.sh`. It must still print OK.

## 6. Recurring jobs: register and prove

`cron:register:all` runs on every server start (section 3). Among the jobs it registers on `cron-queue`:

| Command | Job | Pattern (UTC) | What breaks without it |
| --- | --- | --- | --- |
| `cron:messaging:message-list-fetch` | `MessagingMessageListFetchCronJob` | `2-59/5 * * * *` | No new mail discovered |
| `cron:messaging:messages-import` | `MessagingMessagesImportCronJob` | `*/1 * * * *` | Discovered mail never imported |
| `cron:messaging:ongoing-stale` | `MessagingOngoingStaleCronJob` | `0 * * * *` | A crashed sync stays stuck forever |
| `cron:calendar:calendar-event-list-fetch` | `CalendarEventListFetchCronJob` | `*/5 * * * *` | No calendar discovery |
| `cron:calendar:calendar-events-import` | `CalendarEventsImportCronJob` | `*/1 * * * *` | Events never imported |
| `cron:calendar:ongoing-stale` | `CalendarOngoingStaleCronJob` | `0 * * * *` | Stuck calendar syncs |
| `cron:workflow:automated-cron-trigger` | `WorkflowCronTriggerCronJob` | `* * * * *` | No scheduled workflow fires |
| `cron:workflow:enqueue-awaiting-workflow-run` | `WorkflowRunEnqueueCronJob` | `* * * * *` | Workflow runs wait forever |
| `cron:trigger:start-cron-trigger` | `CronTriggerCronJob` | `* * * * *` | **No app (logic-function) cron fires**: our sweeps and escalations |

If anything is missing (for example Redis was flushed), re-register without a restart. Any single job can be registered the same way by name:

```bash
docker compose --env-file /srv/twenty/prod/.env exec server yarn command:prod cron:register:all
```

Proof that each one runs, not only that it is registered:

```bash
scripts/verify-crons.sh /srv/twenty/prod/.env
```

The script reads BullMQ inside the worker. It fails unless every job above has a scheduler, a completed run inside its window (5 minutes for per-minute jobs, 10 for 5-minute jobs, 75 for hourly), and no failure newer than its last success. Run it 70 minutes after first boot so the hourly stale jobs have run once. Completed jobs are kept for 4 hours or 1,000 entries, so on a busy queue the hourly jobs can age out. If an hourly job shows "no completed run retained", re-run the script just after the top of the hour. The same queues are visible in **Settings > Admin Panel > Health > Worker**.

The last line counts `LogicFunctionTriggerJob` runs on `logic-function-queue`. It stays at 0 until the app is installed and one of its cron patterns has come due. After section 8, a non-zero "ok" count with 0 failed proves app crons fire end to end, which also proves `LOGIC_FUNCTION_TYPE` is not `DISABLED`.

Run both verify scripts after every deploy, restart and upgrade (`CLAUDE.md` section 8).

## 7. Logic functions: LOCAL or LAMBDA

Set in `.env` (not the Admin Panel) per `config/deploy/logic-function-type.md`. Default here: `LOCAL`, because no AWS account is confirmed. `LOCAL` runs our app code unsandboxed inside the server and worker containers. It is acceptable only because the sole code is our own app and no BD role holds the Workflows or Applications permission; the full risk statement and the ED's sign-off are in that file. `CODE_INTERPRETER_TYPE=DISABLED`.

## 8. Install the app, roles, members

0. `config/dashboards/opportunity-stages.md` first. The app's views filter on the Signed, Lost and Parked stages, and the install fails while those options are missing.
1. Connect the CLI as the ED (interactive login; never the Automation key, which has no Applications permission):
   ```bash
   cd kuec/app
   npx twenty remote:add --as prod --url https://crm.kuec.example
   npx twenty remote:use prod
   npx twenty plan          # read it: any removal or recreation blocks the deploy (CLAUDE.md section 2)
   npx twenty app:publish --private -r prod
   npx twenty app:install -r prod
   ```
   The app ships the roles: ED, BD staff, Engineer, Ops coordinator (per Prompt 13), and Automation (below).
2. `config/dashboards/members-and-roles.md`: invite members, keep the ED on the built-in **Admin** role and on no other admin, assign everyone else exactly one role.
3. `config/dashboards/connect-bd-ops-mailbox.md`: bd-ops signs in with Microsoft and connects its mailbox and calendar. That mailbox is the sender the automation uses.
4. Re-run `scripts/verify-crons.sh`. Messaging and calendar jobs now have real work, and the logic-function line shows runs.

## 9. Automation role and API key

The role is defined in the app (`kuec/app/src/roles/automation.role.ts`, UUID generated once with `uuidgen`):

```ts
import {
  defineRole,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';
import { CAPABILITY_UNIVERSAL_IDENTIFIER } from '../objects/capability.object';
import { CONTRACT_UNIVERSAL_IDENTIFIER } from '../objects/contract.object';
import { ENGAGEMENT_UNIVERSAL_IDENTIFIER } from '../objects/engagement.object';
import { MILESTONE_UNIVERSAL_IDENTIFIER } from '../objects/milestone.object';
import { PROJECT_UNIVERSAL_IDENTIFIER } from '../objects/project.object';
import { WORK_PACKAGE_UNIVERSAL_IDENTIFIER } from '../objects/work-package.object';

export const AUTOMATION_ROLE_UNIVERSAL_IDENTIFIER = '<uuidgen once>';

const READ_WRITE_NO_DELETE = {
  canReadObjectRecords: true,
  canUpdateObjectRecords: true,
  canSoftDeleteObjectRecords: false,
  canDestroyObjectRecords: false,
} as const;

const READ_ONLY = {
  canReadObjectRecords: true,
  canUpdateObjectRecords: false,
  canSoftDeleteObjectRecords: false,
  canDestroyObjectRecords: false,
} as const;

const { opportunity, company, person, task, note, taskTarget, noteTarget, workspaceMember } =
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS;

export default defineRole({
  universalIdentifier: AUTOMATION_ROLE_UNIVERSAL_IDENTIFIER,
  label: 'Automation',
  description: 'Behind the automation API key. Read and write on BD objects, no delete, no settings.',
  canReadAllObjectRecords: false,
  canUpdateAllObjectRecords: false,
  canSoftDeleteAllObjectRecords: false,
  canDestroyAllObjectRecords: false,
  canUpdateAllSettings: false,
  canAccessAllTools: false,
  canBeAssignedToUsers: false,
  canBeAssignedToAgents: false,
  canBeAssignedToApiKeys: true,
  permissionFlagUniversalIdentifiers: [],
  objectPermissions: [
    ...[
      opportunity, company, person, task, note,
      // join objects: without them a created task or note cannot be linked to its record
      taskTarget, noteTarget,
    ].map(({ universalIdentifier }) => ({
      objectUniversalIdentifier: universalIdentifier,
      ...READ_WRITE_NO_DELETE,
    })),
    ...[
      PROJECT_UNIVERSAL_IDENTIFIER,
      MILESTONE_UNIVERSAL_IDENTIFIER,
      WORK_PACKAGE_UNIVERSAL_IDENTIFIER,
      CONTRACT_UNIVERSAL_IDENTIFIER,
      ENGAGEMENT_UNIVERSAL_IDENTIFIER,
      CAPABILITY_UNIVERSAL_IDENTIFIER,
    ].map((objectUniversalIdentifier) => ({
      objectUniversalIdentifier,
      ...READ_WRITE_NO_DELETE,
    })),
    // owners are workspace members; reading them is needed to assign and notify
    { objectUniversalIdentifier: workspaceMember.universalIdentifier, ...READ_ONLY },
  ],
});
```

`taskTarget`, `noteTarget` (write) and `workspaceMember` (read) go beyond the list in the request. Without them the key cannot link a task or note to its record or resolve an owner. Drop them if Prompt 13 says otherwise.

Then the key: `config/dashboards/automation-api-key.md`. Expiry is 1 year, role Automation, and the key goes straight into the secrets manager. Its verify step proves read and update work while delete and metadata changes are refused.

## 10. Backups and the restore test

Nightly, from the host's crontab (Asia/Dubai 02:30 = 22:30 UTC):

```cron
30 22 * * * cd /srv/twenty/kuec-repo/kuec/config/deploy && scripts/backup.sh /srv/twenty/prod/.env >> /var/log/twenty-backup.log 2>&1
```

`backup.sh` takes a `pg_dump -Fc` of the Twenty database (all schemas: core, metadata and the workspace schema), checks the dump lists table data, writes a sha256, and copies both off-host. It then mirrors the files bucket to `<backup-bucket>/<project>/files/current`, keeping deleted or overwritten objects under `files/deleted/<stamp>`. Retention is 14 dumps on the host and 35 days off-host. Redis is not backed up: queues and cron schedulers are rebuilt by `cron:register:all` on start.

Restore test, monthly and before every upgrade:

```bash
scripts/restore-test.sh /srv/twenty/prod/.env
```

It downloads the newest off-host dump, checks its sha256, restores it into a throwaway Postgres, boots the same Twenty image against it with the prod `ENCRYPTION_KEY`, waits for `/healthz`, compares workspace, user and API-key counts with prod, prints `upgrade:status`, and compares object counts in the backup bucket with the live one. The throwaway instance has **no worker and no cron registration**, so it never syncs mail, sends email, or fires automation. It is removed on exit.

Record each run:

| Date | Dump | Restored counts | Prod counts | Files backup / live | By |
| --- | --- | --- | --- | --- | --- |
| | | | | | |

Full disaster restore onto a new host: sections 3 (same `ENCRYPTION_KEY`, new empty DB), then `pg_restore --no-owner -d <db>` of the dump before the first `up`, `rclone sync` of `files/current` into the new bucket, `up -d`, and both verify scripts. Mail and calendar resume from their stored cursors.

## 11. Staging instance

Same compose file, separate everything else. A second workspace on the prod instance is not used (G3).

```bash
sudo mkdir -p /srv/twenty/staging /srv/twenty/backups/staging
sudo cp .env.example /srv/twenty/staging/.env && sudo chmod 600 /srv/twenty/staging/.env
# in /srv/twenty/staging/.env:
#   COMPOSE_PROJECT_NAME=twenty-staging   HOST_PORT=3100
#   SERVER_URL=https://crm-staging.kuec.example
#   STORAGE_S3_NAME=kuec-twenty-staging (its own key)
#   own PG_DATABASE_PASSWORD and ENCRYPTION_KEY from twenty/staging/*
docker compose --env-file /srv/twenty/staging/.env up -d
```

Then sections 4 to 9 against staging, with these differences:

- The first sign-up is the deploy engineer. The ED does not need an account on staging.
- Same Azure app (the staging redirect URIs are in the IT request).
- SMTP: use the same bd-ops app password only if needed. Otherwise leave `EMAIL_DRIVER` at `LOGGER` so staging never emails real people.
- Connect test mailboxes only, never bd-ops.
- Its own Automation key, with a 90-day expiry.
- No production data: never restore a prod dump into staging. Tests seed their own records.
- `restore-test.sh` covers the backup path, so staging needs no backup of its own.

`kuec/tests` end-to-end runs target staging only.

## 12. Upgrade procedure: 2.48 to 2.49 with the app installed

Upgrades are deliberate (`CLAUDE.md` section 3). Server image, `twenty-sdk` and `twenty-client-sdk` move together.

**Prepare**

1. Read the 2.49 release notes and Twenty's upgrade guide for anything about apps, the SDK, logic functions, roles, or env vars. Check the `2-49` directory under `packages/twenty-server/src/database/commands/upgrade-version-command/` in the upstream sync for slow (backfill) commands, which lengthen the window.
2. Sync this fork with upstream at the `v2.49.0` tag. Upstream files only; nothing under `kuec/` is touched by the sync.
3. `docker manifest inspect twentycrm/twenty:v2.49.0` succeeds; record its digest in section 2.
4. In `kuec/app`: bump `twenty-sdk` and `twenty-client-sdk` to exactly `2.49.0`, then typecheck, lint, and run the app and `kuec/tests` unit tests. Fix anything there. No core changes.

**Rehearse on staging**

5. `scripts/backup.sh /srv/twenty/staging/.env`.
6. In `/srv/twenty/staging/.env`, set `TAG=v2.49.0@sha256:<digest>`, then:
   ```bash
   docker compose --env-file /srv/twenty/staging/.env pull
   docker compose --env-file /srv/twenty/staging/.env down
   docker compose --env-file /srv/twenty/staging/.env up -d
   docker compose --env-file /srv/twenty/staging/.env exec server yarn command:prod upgrade:status --failed-only
   ```
   The server runs the upgrade commands on start. If a workspace fails, `up -d` again retries from the failed step. Do not go on with a failure.
7. App: `npx twenty remote:use staging && npx twenty plan`. Read it: any removal or recreation blocks the upgrade. Then publish and install the 2.49 build.
8. `verify-config.sh`, `verify-crons.sh` (wait for the logic-function line to show runs), and the end-to-end tests in `kuec/tests`. Check that the Automation key still reads and writes and still cannot delete.

**Production** (announce a 30-minute window; BD users sign out)

9. `scripts/backup.sh /srv/twenty/prod/.env`, then `scripts/restore-test.sh /srv/twenty/prod/.env`. A fresh, proven backup is the rollback.
10. Pause the app's record-triggered automation only if the release notes say the upgrade rewrites records (as in the import runbook). Otherwise leave it running. Stopping the stack stops the worker anyway.
11. Same as step 6 with `/srv/twenty/prod/.env`.
12. Same as step 7 against `prod`.
13. Both verify scripts. Sign in as the ED and as a BD user. Check that bd-ops mail still syncs (Settings > Accounts shows "Synced"). Run the app's sweep once and check it produced no duplicate notifications.
14. Record the version, digest, date and result in the change log. Update `config/deploy/VERSION` and every click-runbook's "written against" line that you rechecked.

**Rollback**

Upgrade commands are not reliably reversible, so never just put the old tag back on an upgraded database:

```bash
docker compose --env-file /srv/twenty/prod/.env down
docker volume rm twenty-prod_db-data            # after confirming the step-9 dump is good
# set TAG back to the 2.48.0 digest
docker compose --env-file /srv/twenty/prod/.env up -d db
docker compose --env-file /srv/twenty/prod/.env exec -T db pg_restore -U twenty -d twenty --no-owner < /srv/twenty/backups/prod/<step-9 dump>
docker compose --env-file /srv/twenty/prod/.env up -d
```

Then reinstall the 2.48 build of the app and run both verify scripts. Files need no rollback: the bucket only gains objects during an upgrade.

## 13. After every deploy, restart or upgrade

- [ ] `scripts/verify-config.sh` OK
- [ ] `scripts/verify-crons.sh` OK, and logic functions show runs with 0 failed
- [ ] Settings > Accounts: bd-ops shows "Synced"
- [ ] Settings > Apps: only `kuec-bd-ops` is installed
- [ ] Automation key: more than 30 days to expiry
