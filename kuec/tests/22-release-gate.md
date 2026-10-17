**NO-GO.** Neither staging nor production exists to run the gate on, and a rehearsal on the pinned `twentycrm/twenty:v2.48.0` image found 13 Blockers and 9 Majors. The app at `main` cannot be built, installed or published as committed, W1 fails silently on every opportunity playbook, and the production network plan would stop every logic function. Do not invite any user.

# 22: Release gate, kuec-bd-ops 0.11.0 on Twenty 2.48.0

Run on 2026-10-17 (Saturday) against `main` at `91aaf4fc` (kuec-bd-ops 0.11.0). Run by the engineering side only: the ops coordinator's run, which the exit criteria require, has not happened. Evidence: `kuec/tests/release-gate/evidence/` (logs, JSON results, screenshots). The scripts that produced it: `kuec/tests/release-gate/rehearsal/`.

## How to read this

**Where it ran.** The gate asks for staging, then production. Neither could be reached:

- `crm.uventure-staging.kuec.example` and `crm.uventure.kuec.example` do not resolve. They are the placeholder names in `config/deploy/.env.example`; no real host name, credential or secrets-manager path exists in the repository or this environment.
- The image digest table in `runbooks/01-deploy.md` section 2 is empty, `config/deploy/it-request.md` is unsigned, and `config/deploy/logic-function-type.md` has no ED signature. Nothing indicates that sections 3 to 9 of the deploy runbook have been run anywhere.

So every line below is **NOT RUN on staging and on production**. To find what would fail there, I ran the gate against a **rehearsal**: the repository's own `config/deploy/docker-compose.yml` with the published image `twentycrm/twenty:v2.48.0@sha256:43fab4bffacdcd63ff3c9257b7f8985a4424d81e9eb43982b9c16a841d555e52` (published 2026-10-16, which clears gate G1 of `01-deploy.md`), Postgres 16, Redis 7.4, `LOGIC_FUNCTION_TYPE=LOCAL`, crons registered by the server, a fresh workspace, 11 members on the app's roles, the playbook role assignments and four UAE holidays entered as in `config/dashboards/kuec-bd-ops-variables.md`.

Rehearsal deviations from production, all outside the app: local file storage instead of S3; `SERVER_URL=http://server:3000` instead of HTTPS; the containers trust this sandbox's egress proxy certificate; SMTP and Teams point at local sinks (`rehearsal/sinks.mjs`); `API_RATE_LIMITING_LONG_LIMIT=600` set in the Admin Panel as `config/dashboards/admin-panel-config-variables.md` says. **To install the app at all, three local changes were needed, none committed:** `"scripts"` excluded in `kuec/app/tsconfig.json` (B1), five option labels without commas (B2), and the guidance widget index set to 0 (B3). Everything after "install" below ran on that patched build.

**Results.** ✓ pass, ✗ fail, – not run (with the reason). A ✓ on the rehearsal is not a pass of the gate: each such line still has to pass on staging and on production.

**Severity** as defined for this gate: Blocker (data loss, wrong routing, security, silent failure), Major (a journey cannot complete without a workaround), Minor (cosmetic).

### Exit criteria

| Criterion | Status |
| --- | --- |
| Zero Blockers | ✗ 13 open |
| Zero open Majors | ✗ 9 open |
| Every journey passed twice, once by engineering and once by the ops coordinator following only the runbooks | ✗ 0 of 8 passed on staging or production (not run); on the rehearsal 2 of 8 passed once ((f), (g)) |

## Failing items, most severe first

### Blockers

| # | Gate line | Finding | Evidence | Fix (owner) |
| --- | --- | --- | --- | --- |
| B1 | 1, 5 (deploy path) | **The app at `main` cannot be built, planned or published with SDK 2.48.0.** The SDK type-checks with `kuec/app/tsconfig.json`, which has no `include`, so it compiles `scripts/import/*.ts` and fails with TS5097 (`.ts` import paths). `twenty plan` exits 1 before reaching the server. Open since the 2026-10-16 report (blocker 1). | `evidence/03-plan-committed-app.txt` | Add `"scripts"` to `exclude` (or `"include": ["src"]`) in `kuec/app/tsconfig.json` (engineering lead) |
| B2 | 1 | **A fresh install of 0.11.0 fails on 2.48.0: five select option labels contain a comma, which 2.48 rejects** ("Label must not contain a comma"). The install reports only an internal error, `Could not find flat entity with universal identifier 5306e386-…` (Company > Sector). Affected: Sector and Project Target sector `ICT` "Information technology, telecoms and digital"; Opportunity and Lead Source `INBOUND` "Inbound (web, email, phone)"; Opportunity Type `PROGRAMME_SPONSORSHIP` "Programme sponsorship (workshop, sprint, fellowship)". The labels came with the 0.8.0 and 0.10.0 relabels, so no 2.48 instance can have taken those releases either. `lookups.test.ts` passes because `lookups.json` carries the same labels. | `evidence/05-install-clean-workspace.txt`, `evidence/21-comma-label-probe.txt` | Relabel the five options without commas in `lookups.json` and the field files (values and ids unchanged), and add a "no comma in a label" rule to `i18n.test.ts` (engineering lead, ED approves the wording) |
| B3 | 1 | **The 16 record-page guidance widgets are rejected:** `index -1 must be a non-negative integer` (`GUIDANCE_WIDGET_INDEX = -1` in `page-layout-widgets/utils/guidance-record-page-widget.ts`). The install stops here once B2 is fixed. | `evidence/06-install-after-label-workaround.txt` | Use index 0 (or reorder another way) and check the order on a work package page (engineering lead) |
| B4 | 1, 5 | **`app:publish --private` cannot work, and trying it took the server down.** The build is 117 MB packed and 617 MB unpacked (43 function bundles of 4 to 5 MB, each with a 9 MB source map the SDK always writes). 2.48 refuses anything over 500 MB on extraction, and the refusal is an uncaught exception: the server process exits and restarts. During the rehearsal the server was down for about two minutes while it restarted. The deploy runbook's only path to production is this command. | `evidence/04-publish.txt`, `evidence/20-publish-server-crash.txt` | Shrink the bundles below 500 MB (shared code out of each function, fewer functions), or install another way that `01-deploy.md` documents; never publish to production until a staging publish succeeds (engineering lead) |
| B5 | 2(a), 2(b) | **W1 fails on every opportunity playbook, silently.** It creates the work packages, then `publishWorkPackageTransition` throws `Expected non-nullable type "UUID!" not to be null`. `playbookApplied` stays false; no Confirm plan task for the ED; no Teams post; **the step-1 owner is never told** (Dana, Developer, got no "Accept or decline: Technical assessment"). The queue records the run as completed with no failure, the worker log is empty, and the function log stream shows nothing. Licence (`6d5930e3-…`) and RFQ (`032ff62b-…`) both fail. W9 for projects completes. Open since the 2026-10-16 report (blocker 2). | `evidence/23-w01-manual-exec.txt`, `evidence/11-journey-a-run-a2.txt` | Find why the opportunity case write gets a null id inside the function runtime and fix it in the app; make W1 notify and stamp before the timeline write (engineering lead) |
| B6 | 2(h), 2(f) | **Background jobs give up after 3 retries within about 9 seconds, and nothing repairs what they dropped.** With Teams answering 503, W7 tried 4 times in 8.8 s and stopped before it creates the licence contract; opportunity `799cea51-…` is Signed with no contract, and no sweep creates one. A form delivery acknowledged with 202 (`a1-6d6ad58d`) was dropped the same way when the API was briefly unreachable. The ED task was not duplicated, so retries are idempotent, but the retry window is far shorter than any real outage. | `evidence/26-journey-h-retry.txt`, `evidence/22-egress-npm-and-server-url.txt` | Do the record writes before the notifications in every handler; add W7 (and intake) to a sweep, as the timers already are (engineering lead) |
| B7 | 2, 5 | **The production network plan blocks every logic function.** Under `LOCAL`, the first run of a function installs the app's dependency tree (346 packages) from the npm registry, and every function calls the API at `SERVER_URL`, that is, the worker calls its own public host name. `it-request.md` section 5 allows neither ("Everything else ... stays blocked"). The rehearsal showed both failure modes before I worked around them: the forms route answered 500, and jobs failed with `fetch failed`. | `evidence/22-egress-npm-and-server-url.txt` | Add the npm registry (or a mirror) and the CRM's own host on 443 to `it-request.md` section 5, then prove both on staging (deploy engineer, KUEC IT) |
| B8 | 5 | **No alerting and no monitoring.** Nothing posts failed jobs or disk usage to Teams; no external health check watches `/healthz`; `verify-crons.sh` only runs when someone runs it. B5 shows why it matters: a function can fail on every run with no trace. | repository search: no alerting in `kuec/` | A host cron that runs `verify-crons.sh` and a disk check and posts failures to the Teams webhook, plus an uptime check on `/healthz` (deploy engineer) |
| B9 | 3 | **Anyone holding the workspace's public invite link can join with any email.** 2.48 creates the workspace with the public invite link on. All 10 rehearsal members joined through it with invented addresses, landing on the default role. No runbook turns it off, and password sign-in stays on until everyone has used Microsoft (`01-deploy.md` section 5). | `evidence/28-security-headers-admin-invite.txt` | Settings > Members: switch off the invite link before anyone is invited; add the step to `config/dashboards/members-and-roles.md` and the quarterly review (ED) |
| B10 | 3 | **Server-level admin rights do not match the gate or runbook 13.** The first sign-up gets `canAccessFullAdminPanel` and `canImpersonate` on the user, outside roles. In production that is the ED, so the ED can impersonate any member, which runbook 13 section 3 says only the break-glass account may. Engineers get no Admin Panel at all, while the gate expects ED and Engineer. 2.48 can change both per user (Admin Panel, `updateServerAdminAccess`); no runbook does. | `evidence/28-security-headers-admin-invite.txt` | ED decides who holds Admin Panel and impersonation; write it into `01-deploy.md` section 4 and `13-roles.md` section 3 (ED, engineering lead) |
| B11 | 3 | **Backups are not encrypted by us.** `backup.sh` ships a plain `pg_dump` (personal data, the whole CRM) to the backup bucket with `rclone`, with no client-side encryption, and `it-request.md` does not ask for encryption at rest on that bucket. | `config/deploy/scripts/backup.sh` lines 34 to 37 | An `rclone crypt` remote with its key in the secrets manager, or a written guarantee of server-side encryption from IT; `restore-test.sh` updated to match (deploy engineer) |
| B12 | 3 | **The accepted risks are not accepted.** `logic-function-type.md` ends "Accepted by: ____ (ED)", unsigned, and runbook 01 section 1 makes that signature a prerequisite. Nothing records the ED accepting the absence of row-level permissions (`13-roles.md` section 5). I cannot supply the ED's initials. | `config/deploy/logic-function-type.md` | The ED initials both, with the date, in those files (ED) |
| B13 | 3 | **Client domains leave KUEC from every browser.** For each company on screen the browser requests `https://twenty-icons.com/<company domain>` (Twenty's logo service); the server does the same for the workspace. That tells a third party which companies KUEC deals with. "Telemetry off" does not cover it. | `evidence/28-security-headers-admin-invite.txt` | ED decides; if not acceptable, block `twenty-icons.com` at the KUEC web proxy and on the host, and record it (ED, KUEC IT) |

### Majors

| # | Gate line | Finding | Evidence | Fix (owner) |
| --- | --- | --- | --- | --- |
| M1 | 5 | **The first-install order in `01-deploy.md` section 8 cannot be followed.** `twenty plan` before the first publish fails: `No registration found for "aa97f60d-…". Create one first with createApplicationRegistration.` | `evidence/33-plan-before-first-publish.txt` | Publish first on a fresh instance, then plan before install; say so in the runbook (engineering lead) |
| M2 | 3, 5 | **`kuec/app` has no lockfile.** `yarn install` refuses to run in `kuec/app` as committed (the repository root claims it), and a publish ships whatever lockfile is on the publisher's machine. The server installs that whole tree, development packages included, at runtime (B7). `logic-function-type.md` relies on dependencies being "pinned and reviewed". | `yarn install` in `kuec/app` | Commit `kuec/app/yarn.lock` and keep development packages out of what the server installs (engineering lead) |
| M3 | 2(a) | **The case audit trail is missing.** No work package transition reached the opportunity's timeline, and on the work package itself only Done was logged (Offered, Accepted and Submitted are absent) for `2e5b6a39-…`. `04-automation.md` describes this trail as the case history. | `evidence/24-timeline-wp1-and-case.txt` | Same root as B5 for the case row; check why the transition log misses earlier states (engineering lead) |
| M4 | 1 | **Standard-object record pages show none of the app's widgets.** Opportunity and Company open with Twenty's own layout: no "How this record works", no SharePoint folder card, no Documents card. The app's own objects do show them (the work package page shows all ten guidance lines). App fields on Company and Opportunity sit under the "System" heading. | `evidence/ui-20-opportunity-record.png`, `ui-22-company-record.png`, `ui-21-work-package-record.png` | Target the standard objects' record page layout the way 2.48 builds it, and add a UI check (engineering lead) |
| M5 | 1, 5 | **BD dashboard widgets do not all resolve.** On BD Executive, "How this tab works" and "Thursday update" render empty (stored bodies hold only `markdown`), and "Signed licences this year" shows no number after 25 s; the tables beside them render. Executive took 7.3 s from navigation to its tab bar (target 5 s). Seen in headless Chromium; confirm on staging. | `evidence/ui-30-bd-executive.png`, `evidence/15-ui-dashboard-probe.json` | Investigate the rich-text body format and the count widget on the stock image (engineering lead) |
| M6 | 1 | **The Help and uVENTURE links lead nowhere.** Help points to `kuac.sharepoint.com`, which does not exist (`kuec.sharepoint.com` does). Open uVENTURE and the three uVENTURE tabs default to `uventure.kuec.example`, a placeholder that never resolves, unless `KUEC_UVENTURE_ORIGIN` is set when the production build is made. | `evidence/32-links.txt` | Confirm the Help address with IT (`20-guidance.md` section 5) and fix `HELP_PAGE_URL`; make the build fail without a real uVENTURE origin (engineering lead) |
| M7 | 5 | **The host is too small for the 30 percent headroom target.** One stack used about 3.1 GB at the gate's load (worker 1.6 GB, server 1.2 GB). `01-deploy.md` section 1 puts production and staging on one 8 GB host: about 6.2 GB before the operating system. | `evidence/29-resources.txt` | Size the host at 12 GB or more, or put staging elsewhere; re-measure on the real host (deploy engineer) |
| M8 | 2(f) | **Function logs are not kept.** The rejected uVENTURE signature was logged (`uventure delivery refused bcf1-uv-bad: BAD_SIGNATURE`), but only to someone streaming `dev:function:logs` at that moment; nothing is retained, and the stream showed no line at all for W1's failure. | `evidence/17-function-log-stream.txt` | Have the routes and handlers write refusals and failures somewhere durable that B8's alerting reads (engineering lead) |
| M9 | 5 | **No CI job protects the manifest or runs the Vitest suite.** Nothing under `.github/workflows` mentions `kuec`. Adding one means editing `.github`, which `kuec/CLAUDE.md` forbids ("Nothing outside `kuec/` is edited"). | repository search | ED decides on an exception for one workflow file; then a job that runs `yarn test:unit` and fails on any removed object, field, option or view against the base branch (`diff-lookups.ts` already does this for options) (ED, engineering lead) |

### Minors

| # | Gate line | Finding | Evidence |
| --- | --- | --- | --- |
| m1 | 1 | The 12 "Everything (expert)" views show 7 to 31 columns; the gate allows 6. `05-views.md` makes them a documented exception, which the ED has to accept against this gate. | `evidence/16-ui-views.json` |
| m2 | 1 | Arabic is complete for fields and objects but missing for 96 of 105 view names, 96 of 109 widget titles, all 12 tab titles, 15 of 18 sidebar names and all 7 timeline labels. 2.48 cannot translate option labels at all (`18-taxonomy.md` section 3). | `kuec/app/locales/ar-SA.json` |
| m3 | 4 | Dates show in the viewer's time zone, not Gulf time: in a browser set to UTC a work package due 17:00 Dubai shows "1:00 PM". No joiner step sets each member's time zone to Asia/Dubai. | `evidence/ui-21-work-package-record.png` (Due) |
| m4 | 5 | First boot: `docker compose up -d` exits "dependency failed to start: container … is unhealthy" because the server's health check (20 × 5 s) is shorter than first-boot migrations, and the worker stays Created until a second `up -d`. `01-deploy.md` section 3 does not say to run it again (`verify-crons.sh` would catch it). | rehearsal first boot, 19:12 UTC |
| m5 | 3 | Leadership viewer reads Capability: decision 13 of `13-roles.md` allows it, the role table in section 1 does not list it. Matrix cell 112 of 112. | `evidence/13-permissions.txt` |
| m6 | 3 | CORS cannot be "limited to uVENTURE" in 2.48: bearer requests get `Access-Control-Allow-Origin: *`; credentialed origins come from `AUTH_COOKIE_ALLOWED_ORIGINS`, which no runbook mentions (empty, which is right, since uVENTURE embeds the CRM same-site). | `evidence/28-security-headers-admin-invite.txt` |
| m7 | 2 | Every member's first sign-in goes through Twenty's onboarding ("Create profile", "Invite your team", whose Skip asks for confirmation); `10-onboarding.md` does not mention it. | rehearsal sign-ins |
| m8 | 2(a) | The two "Thank the referrer" tasks (Qualified, Converted) have identical titles. | `evidence/11-journey-a-run-a2.json` |
| m9 | 5 | `yarn typecheck` fails with TS6307 (`import-target-values.test.ts` imports from `scripts/`). Open since 2026-10-16. | `evidence/02-typecheck.txt` |

## 1. Wiring inventory

Staging and production columns are – for every row: neither instance exists (see "How to read this"). Counts are from the committed manifest and the rehearsal database.

| Item | Rehearsal | Staging | Production | Evidence and notes |
| --- | --- | --- | --- | --- |
| Objects present, nothing extra | ✓ 11 of 11 | – | – | `evidence/31-model-diff.txt` |
| Fields present, nothing extra | ✓ 234 of 234 | – | – | The 198 other live fields are Twenty's own system and link fields |
| Options present | ✗ | – | – | 396 options on 47 select fields; 5 labels refused by 2.48 (B2) |
| Relations present | ✓ | – | – | Included in the 234 fields |
| Translations present | ✗ | – | – | Fields and objects 100 percent; names of views, widgets, tabs and sidebar mostly English (m2) |
| Diff against Prompts 2, 18 and 19 | – | – | – | The prompts are not in the repository; diffed against their runbooks (`18-taxonomy.md` section 8, `19-leads.md`) and the manifest instead |
| Views of Prompts 5, 14, 19 exist | ✓ 130 of 130 | – | – | 81 picker views, 49 dashboard widget views |
| Views open | ✓ 81 of 81 | – | – | Every picker view opened as the ED (`evidence/16-ui-views.json`); widget views were seen on the dashboards |
| Views show at most 6 columns | ✗ 118 of 130 | – | – | 12 expert views (m1) |
| Dashboard widgets resolve, none empty or erroring | ✗ | – | – | M5 |
| Logic functions deployed | ✓ 42 of 42 | – | – | 10 cron, 3 route, the rest database events |
| Logic functions enabled and working | ✗ | – | – | W1 fails (B5); the others exercised in section 2 ran |
| Triggers registered | ✓ | – | – | Each function's cron, route or event settings stored |
| Worker cron jobs running, next tick proven | ✓ | – | – | `verify-crons.sh` 9 of 9 OK; app ticks fired at 20:20, 20:30, 20:45, 21:00 UTC (`evidence/09-verify-crons-after-journeys.txt`, `evidence/25-…`) |
| `LOGIC_FUNCTION_TYPE` | ✓ `LOCAL` | – | – | A server setting in `.env` by design, not an app variable; checked in the containers |
| SMTP as app variables | ✓ | – | – | Host, port, username, password, sender declared and set |
| Teams webhook as app variable | ✓ | – | – | Secret variable, set |
| HMAC secrets as app variables | ✓ | – | – | Forms, uVENTURE inbound and outbound; the routes answer 503 while empty |
| Roles match Prompt 13 | ✓ 13 of 13 | – | – | ED, Ops coordinator, BD officer, Engineer, Leadership viewer, five department roles, Automation, uVENTURE reader, function role |
| Field locks in place | ✓ | – | – | Section 3 |
| Every member's mailbox and calendar connected | – | – | – | Needs the Microsoft tenant; not available to the rehearsal |
| Navigation links resolve | ✗ 16 of 18 | – | – | The 16 internal entries point at views, pages and objects that exist; Help and Open uVENTURE do not resolve (M6, `evidence/32-links.txt`) |
| Help link resolves | ✗ | – | – | M6 |
| `lookups.json` identical to the manifest options | ✓ | – | – | `lookups.test.ts` 7 of 7 (it also passes the five labels 2.48 refuses) |
| Field descriptions, English and Arabic | ✓ 234 of 234 | – | – | `src/i18n/fields.json`; objects 11 of 11 |
| Option descriptions, English and Arabic | ✓ 303 of 303 | – | – | 203 KUEC-wide, 100 Twenty-only; 2.48 shows them only through the Help page |
| Unit suite | ✓ 251 of 251 | – | – | `evidence/01-unit-tests.txt`; `yarn test:import` 33 of 33; lint clean; typecheck ✗ (m9) |

## 2. End-to-end journeys

Personas on the rehearsal: Executive Director (ED role), Olivia Ops (Ops coordinator), Bader One and Bushra Two (BD officers), Dana Developer, Adel Analyst and Layla Legal (BD officer role, with their playbook roles), Ehab Engineer, Vera Viewer, Imran Ipoffice (IP office). Each step ran with that person's own token. Email delivery could not be proven on the rehearsal: the app requires STARTTLS (right for Office 365) and the function runtime does not trust a test certificate, so every "email" expectation below is –.

### (a) Lead to signed licence

| | |
| --- | --- |
| Preconditions | App installed; playbook role assignments (one ED, one ops coordinator, BD officers, Developer, Data analyst, Legal); forms signing secret set; Teams and uVENTURE sinks |
| Steps | Signed POST to `/s/integrations/forms/leads` (bad signature, stale timestamp, good, the same delivery again) → ops coordinator gives the lead to Bader and names Bushra as referring colleague → Bader ticks 4 of 5 checks → Bader sets Converted → W1 → Dana accepts, submits → the ED (reviewer) marks Done → step 2 released → Bader sets Signed |
| Expected record state | One lead `web:<id>`, source Inbound, triaged, owner ops coordinator, then Qualified with score 4, then Converted with its opportunity; opportunity at Qualify, Type Technology licensing, `playbookApplied` true; 6 work packages, step 1 Offered; stamps on each transition; step 2 Offered after Done; one licence contract Signed; `referralCreditedAt` on the lead |
| Expected notifications | Triage task (ops); Convert or park and two Thank the referrer tasks (Bader); licence-grade lead task and email (ED); Confirm plan (ED); Accept or decline with email (Dana); Teams for W1 and W7; Signed task (ED); T1 and T2 to uVENTURE, signed, once |
| Expected timeline | Each transition on the work package and on the opportunity |
| Actual (run a2) | **✗.** 27 of 35 checks passed. Passed: the route (401, 401, 202, 202 with one lead `b2c2eb5b-…`), triage, qualification, ED notice, conversion to `6d5930e3-…`, six work packages with the right owners and reviewers, due at 17:00 Dubai from 30 Oct to 21 Jan, transitions and stamps on step 1, release of step 2 (`f973fe1d-…`), contract `98544bcb-…`, referral credit, T1 and T2 once each. Failed: `playbookApplied` false, no Confirm plan, no W1 Teams post, Dana never told (B5); timeline (M3); email (–). Run a1 before the network fixes: route 500, then the delivery was dropped (B6, B7). `evidence/11-journey-a-run-a2.txt`, `11b-…` |

### (b) Inbound RFQ through quote, approval and submission

| | |
| --- | --- |
| Preconditions | As (a) |
| Steps | Bader creates an opportunity with a client deadline of 20 Nov and sets Type Technical service |
| Expected | 7 work packages capped before the deadline, step 1 Offered to Bader; `playbookApplied` true; then quote, internal approval (ED) and submission accepted, submitted and done in turn |
| Actual | **✗.** Work packages right (Bid or no-bid 20 Oct to Delivery hand-off 12 Nov, internal approval with the ED), then W1 fails as in (a) (`032ff62b-…`). Quote, approval and submission steps not walked. `evidence/12-journeys-b-c-f.txt` |

### (c) Workshop project

| | |
| --- | --- |
| Preconditions | As (a) |
| Steps | Ops coordinator creates a project with event date 15 Dec and sets Type Workshop → marks a milestone Missed → outcomes logged, two leads created, one converted, project Done |
| Expected | 5 milestones and 6 work packages planned back from the event; `playbookApplied` true; Missed turns health Red; percent complete updated; the closing task once all milestones are done; the project counts its opportunities, zero or more |
| Actual | **✗ (partly run).** ✓ W9: 5 milestones, 6 work packages from 21 Oct to 22 Dec, `playbookApplied` true; ✓ Missed → health Red, percent complete 0 (`3accddf9-…`). – Outcomes, the two leads, the conversion and project Done were not run. |

### (d) Escalations on shortened timers

| | |
| --- | --- |
| Preconditions | A build with 1 business day shortened (`acceptance/shortened-timers.ts`) |
| Expected | Acceptance reminder at 2 days (owner, ED), reassignment at 5 days (ops coordinator; old owner, new owner, ED, Teams); overdue at due (owner) and +2 (ED); Blocked notifies the ED with the reason; next-action guard once a day; each task once, each email once, Teams once |
| Actual | **✗ (partly run).** – Acceptance and overdue timers on shortened time: not run on the rehearsal (the 2026-10-16 report passed them on a source build, which does not count here). ✓ Blocked with reason: one "Decision needed" task for the ED (`a2c2ecd5-…`), one Teams post with the reason, `blockedAt` set. ✓ Next-action guard run twice: one "Set next action" task, due 17:00 Dubai, stamp on the Dubai date; second run flagged 0 of 211. – Email. `evidence/27-journey-d-blocked-and-guard.txt` |

### (e) CSV import with automation paused, then resumed

| | |
| --- | --- |
| Expected | Import with `LOGIC_FUNCTION_TYPE=DISABLED`, resume, run the sweeps; no work package created twice |
| Actual | **– Not run.** The import sources live outside the repository by design (`09-import.md` section 1) and the importer is a UI flow for the ops coordinator. |

### (f) uVENTURE inbound signature

| | |
| --- | --- |
| Steps | Fixture `u1-technology-created.json` signed with a wrong secret, then with the right one |
| Expected | 401 and a log line for the bad one; 202 and one Capability pointer for the good one |
| Actual | **✓ on the rehearsal.** 401 `{"error":"unauthorized"}` and `uventure delivery refused bcf1-uv-bad: BAD_SIGNATURE`; 202 and Capability `e71aae45-…` (Technology, Available, source uVENTURE). The log line exists only in a live stream (M8). |

### (g) Kill the server mid-journey, restart

| | |
| --- | --- |
| Steps | Offer a work package, delete its two timer jobs, `docker kill` server and worker, restart, run `timer-sweep` twice |
| Expected | The sweep repairs both timers; the second run repairs nothing; one job per timer |
| Actual | **✓ on the rehearsal.** "repaired 2", then "repaired 0"; one job each, same ids; the 21:00 hourly sweep ran on its own. `evidence/25-journey-g-restart-and-sweep.txt` |

### (h) A retried background job does not double-write

| | |
| --- | --- |
| Steps | Teams answers 503 while an opportunity is signed |
| Expected | Retries write nothing twice, and the contract still exists at the end |
| Actual | **✗.** Nothing was written twice (one ED task, one T1 event), but W7 gave up after 4 attempts in 8.8 s without creating the licence contract, and nothing repairs it (B6). `evidence/26-journey-h-retry.txt` |

## 3. Permissions and security

| Item | Rehearsal | Staging | Production | Evidence and notes |
| --- | --- | --- | --- | --- |
| Can and cannot matrix per role (read, create, delete) on 14 objects, one token each for 6 person roles and 2 API keys | ✓ 111 of 112 | – | – | `evidence/13-permissions.txt`; the one difference is m5 |
| Export, import and settings per role | ✓ | – | – | Permission flags match `13-roles.md`: export for ED, ops, BD, departments; import for ops only; settings for ED and Engineer; Workflows for ED and Engineer only |
| App-stamped fields (`offeredAt` and the like) refused for every principal | ✓ | – | – | 8 of 8 refused, the ED and Automation included, as `13-roles.md` section 2 says. The gate's "except Automation, ED and ops coordinator" applies to the open integration fields only |
| Locked integration fields (`externalId`) writable only by Automation, ED, ops coordinator | ✓ | – | – | 3 allowed, 5 refused |
| Files hidden on Opportunity and Contract | – | – | – | A Settings step (`record-page-files-tab.md`) not run on the rehearsal; Files shows until it is |
| Iframe origins limited to uVENTURE | – | – | – | `frame-ancestors 'self'` before the step of `iframe-embedding.md`; needs the real uVENTURE origin |
| CORS limited to uVENTURE | ✗ | – | – | m6 |
| Telemetry off | ✓ | – | – | `TELEMETRY_ENABLED=false` in both containers; but see B13 |
| Secrets absent from the repository | ✓ | – | – | Tracked files and history under `kuec/` scanned for keys, tokens and webhooks: none |
| Secrets absent from the image | ✓ (app build) | – | – | The image is upstream's; our build output holds no `.env` and no secret |
| HTTPS only | – | – | – | Rehearsal runs on HTTP; `Caddyfile.example` serves HTTPS with Caddy's redirect |
| Admin Panel limited to ED and Engineer | ✗ | – | – | B10 |
| Public invite link off | ✗ | – | – | B9 (not a gate line; found on the way) |
| Backups encrypted at rest | ✗ | – | – | B11 |
| LOCAL driver risk accepted with the ED's initials | ✗ | – | – | B12 |
| No row-level permissions accepted with the ED's initials | ✗ | – | – | B12 |

## 4. Data integrity

| Item | Rehearsal | Staging | Production | Evidence and notes |
| --- | --- | --- | --- | --- |
| Seed counts match the import files; dedupe report reconciles | – | – | – | No import run (journey (e)) |
| Every open opportunity has owner, next action and date | – | – | – | A production-data check; on the rehearsal W4 flags the gaps once a day (journey (d)) |
| Every work package has done criteria | ✓ 19 of 19 playbook work packages | – | – | `evidence/31-model-diff.txt` |
| No orphan leads or documents | – | – | – | A production-data check |
| `externalId` unique | ✓ | – | – | Unique indexes on Capability, Contract, Lead, Document |
| Every cron in UTC with its Gulf time stated | ✓ 10 of 10 | – | – | Each pattern in `src/logic-functions` has its Asia/Dubai time above it; the backup cron in `01-deploy.md` section 10 too |
| Business days use the Saturday–Sunday weekend and the holiday list | ✓ | – | – | `business-days.test.ts`; on the rehearsal the licence steps fell due on 30 Oct, 6 Nov, 13 Nov, 9 Dec, 23 Dec and 21 Jan: the last three are 3 and 4 business days later than in the 2026-10-16 run, which had no holidays, because 1 to 3 December and 1 January were in the list |
| UAE public holidays of the current year in the list | – | – | – | Data the ops coordinator enters (`kuec-bd-ops-variables.md`); nothing is seeded, by design |
| Dates render in Gulf time in the UI | ✗ | – | – | m3 |

## 5. Reliability and operations

| Item | Rehearsal | Staging | Production | Evidence and notes |
| --- | --- | --- | --- | --- |
| Load seeded: 500 companies, 2,000 people, 200 opportunities, 1,000 work packages | ✓ | – | – | `evidence/14-load-api-timings.json` |
| Record pages under 2 s | ✓ | – | – | In-app navigation as a BD officer: opportunity p95 1.0 s, work package p95 0.9 s; a cold load including sign-in state takes 5.0 to 5.5 s. API reads p95 under 100 ms |
| Dashboard tabs under 5 s | ✗ | – | – | Executive 7.3 s cold, and widgets missing (M5) |
| The sweep within the API rate limit | ✓ | – | – | 754 open work packages in 3.2 s, no 429; second run 1.0 s |
| Memory and disk headroom above 30 percent | ✗ | – | – | M7 (memory, at the planned host size); disk not measurable on the target |
| Failed-job and disk alerts posting to Teams | ✗ | – | – | B8 |
| Health check monitored | ✗ | – | – | Only the container health check; nothing watches it (B8) |
| Restore from last night's backup, timed | – | – | – | No production backup exists. Rehearsal: dump 1 s, restore 7 s, 124 of 124 table counts equal (`evidence/30-restore.txt`) |
| 2.48 → next release upgrade rehearsal with the app installed | – | – | – | No release after 2.48.0: Docker Hub's newest tags (`latest`, `v2`, `v2.48`) all point at `v2.48.0` of 2026-10-16 |
| CI job: removing an object or field fails the pull request; Vitest on every change | ✗ | – | – | M9 |

## What has to happen before the gate can be run

1. Fix B1 to B6 in the app and B7 in the IT request, then install on a disposable instance from the stock image with no local changes.
2. Build staging per `01-deploy.md` sections 3 to 11 with real host names, and write the image digest into section 2.
3. Close B8 to B13 (monitoring, invite link, admin rights, backup encryption, the ED's two signatures, the icon service decision).
4. Rerun this gate on staging, then on production, and give the ops coordinator the runbooks only for the second run.

The rehearsal can be rebuilt from `kuec/tests/release-gate/rehearsal/`: `bootstrap.sh` (it refuses any compose project but `twenty-rehearsal`), then the app installed as in `kuec/tests/acceptance/sync-app.mjs`, then `seed-members.mjs`, `seed-reference.mjs` and `set-variables.mjs`, with `sinks.mjs` running (`npm install smtp-server mailparser playwright-core` in that folder first). The journeys are `journey-a.mjs`, `journeys-bcf.mjs` and `permissions.mjs`; the load and browser checks are `load-seed.mjs`, `ui-dash.mjs`, `ui-warm.mjs` and `ui-views.mjs`. They create users, keys and records and must never point at production.
