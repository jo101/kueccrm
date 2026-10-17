# 13: Roles, field locks, API keys, access reviews, joiners and leavers

Written against Twenty 2.48.0 and `kuec-bd-ops` 0.6.0. Owners: the ED (who gets which role, decisions in section 0) and the engineering lead (the manifest). Readers: the ED, engineers, the ops coordinator.

The roles live in the app manifest, one file per role in `kuec/app/src/roles/`. Their full definitions, object by object and flag by flag, are in `kuec/config/roles/role-definitions.md`. This runbook covers how they are used: what 2.48 can and cannot enforce, the Admin and break-glass accounts, the API key inventory, the quarterly access review, and joiners and leavers.

Tests:

- `kuec/app/src/roles/roles.test.ts` (unit, `yarn test:unit`) pins every grant in this runbook: who holds Workflows, who deletes, who imports and exports, every field lock, and the BD officer's work package fields. A field added later under a locked name fails it until the lock is added.
- T10, `kuec/app/src/__tests__/acceptance/t10-roles.integration-test.ts`, runs against a live disposable instance: seeded members get each role and try what it allows and refuses with their own token. Evidence: `kuec/tests/acceptance/evidence/logs/t10.txt` (7 of 7 passed on 2026-10-17, Twenty 2.48.0 built from this checkout).

## 0. Decisions for the ED

| # | Decision | What is built now | To change it |
| --- | --- | --- | --- |
| 1 | Confidential record classes (sponsored-chair negotiations, offset-related deals) as separate objects | Nothing. Open, section 5 | Your call |
| 2 | The ED works on the **ED** role, not the built-in Admin. A sealed break-glass account holds Admin (section 3) | As described | Keep the ED on Admin: the ED role then stays unassigned |
| 3 | Leadership viewer also reads **Company** and **Milestone**. The BD Executive dashboard charts both ("accounts not engaged", "milestones due in 30 days"), and an opportunity row shows its company. Neither holds people or engagement detail | As described | Remove the two objects from `leadership-viewer.role.ts`; those widgets then disappear for the role |
| 4 | BD officer on a work package: Status, Accepted at and Blocked reason as asked, plus **Declined reason**: the work package card's Decline writes it with the status, so without it a BD officer cannot decline. "Notes" means notes attached to the work package (Note and Note target), not a field | As described | Lock `declinedReason` in `bd-officer.role.ts` |
| 5 | **Lead** and **Document** are objects since 0.9.0 (`19-leads.md`). The four department roles write them, with Opportunity, Engagement, Task and Note; so do BD officers and the Automation key. The Leadership viewer reads neither: leads are about people, and documents carry confidentiality labels | As described | Remove them from `DEPARTMENT_WRITABLE_OBJECT_UNIVERSAL_IDENTIFIERS`, `bd-officer.role.ts` or `automation.role.ts` |
| 6 | Department roles cannot change work packages. If a playbook gives a department member a step, they cannot accept it | As described | Give the department roles the BD officer's work package grant |
| 7 | Locked names not yet fields: `serviceCaseId`, `version`, and `externalId` and `sourceSystem` on Company and Person. Since 0.9.0 Lead and Document have `externalId` and `sourceSystem`, locked and `writability: OPEN` | The lock list holds the names; the unit test forces the lock when a field with one of them is added | Nothing until the fields exist |
| 8 | **Default role** for anyone who joins without a role chosen: Leadership viewer, the narrowest role. Every invitation names the role, so nobody should land there | Click-runbook `members-and-roles.md` | Pick another default there |
| 9 | **Upload files**: only engineers (publishing the app uploads its build). Nobody else can attach a file, which enforces `kuec/CLAUDE.md` section 4 | As described | Add `UPLOAD_FILE` to a role |
| 10 | **Send email** and **Create calendar event** from Twenty: off for every role. People write from Outlook and the mail syncs in | As described | Add `SEND_EMAIL_TOOL` or `CREATE_CALENDAR_EVENT_TOOL` to a role |
| 11 | Engineers hold Workflows, as asked. That breaks condition 2 of `config/deploy/logic-function-type.md` (LOCAL is accepted only while no role but the ED's holds Workflows or Applications) | The file is updated with the engineers and the added risk | Re-sign `logic-function-type.md`, or set `LOGIC_FUNCTION_TYPE=LAMBDA` |
| 12 | Since 0.11.0: **Commercialization** is a department role like IP office, Leasing, Lab access and Startups and investment, for the team that takes KU technologies to market. Every person holds the same role in uVENTURE (`config/roles/uventure-role-map.json`, `21-uventure-readiness.md` section 2.3) | As described | Retire it as any role: move its members, relabel it `(deprecated)`, `canBeAssignedToUsers: false` |
| 13 | Since 0.11.0: **Capability** is read-only for every role, the ED and the ops coordinator included, and readable by every person role and the uVENTURE key. Only the uVENTURE feed writes it; a wrong pointer is corrected in uVENTURE | As described | Give the ED write on Capability in `ed.role.ts` (the next snapshot overwrites any edit anyway) |

## 1. The roles

Twenty 2.48 gives each member exactly one role; assigning another replaces it. So each role below is complete on its own.

| Role | Held by | Records | Delete and merge | Import, export | Settings | Workflows (and Code actions) |
| --- | --- | --- | --- | --- | --- | --- |
| **ED** | the ED | read and write all | yes | export | workspace, members, roles, security, data model, API keys, apps, layouts, views | yes |
| **Ops coordinator** | the ops coordinator | read and write all | yes | import and export | none | no |
| **BD officer** | the BD staff | read all; write Lead, Opportunity, Company, Person, Engagement, Document, Campaign target (0.11.0), Task, Note; on a work package only Status, Accepted at, Blocked reason, Declined reason | no | export | none | no |
| **Engineer** | engineers | read all; write no business data (dashboards only) | no | neither | workspace, data model, apps, layouts, views | yes |
| **Leadership viewer** | nobody yet | read Opportunity, Project, Milestone, Contract, Company and dashboards | no | neither | none | no |
| **IP office**, **Leasing**, **Lab access**, **Startups and investment**, **Commercialization** (0.11.0) | department staff, one role per department | read all; write Lead, Opportunity, Engagement, Document, Campaign target, Task, Note | no | export | none | no |
| **uVENTURE reader** (0.11.0) | the uVENTURE API key only | read Opportunity, Lead, Engagement, Contract, Capability, Company, Person; nothing else, not even tasks, notes or history | no | neither | none | no |
| **Automation** | the automation API key only | read and write Opportunity, Company, Person, Task, Note, their link objects, Project, Milestone, Work package, Contract, Engagement, Lead, Document; read members | no | neither | none | no |
| KUEC BD Ops function role | the app's logic functions; never a person | read and write all | no | n/a | none | n/a |

Every role a person holds also has: connect their own mailbox and calendar, edit their profile, open (download) files already on a record. The Leadership viewer has only the profile. No role has AI, code interpreter, HTTP request, impersonation, marketplace apps, billing, SSO bypass or AI settings.

### 1.1 Why the roles look the way they do

- **Merge** has no permission of its own. Twenty 2.48 offers Merge (Companies, People) only to a role with Update and Destroy on the object, and the merge itself also updates every record that points at the duplicates. Only the ED and the ops coordinator hold Destroy, so only they merge.
- **BD officer and departments delete nothing.** A wrong record goes to the ops coordinator, who deletes or merges it.
- **Engineers write no business data in production.** They have no Roles, Members, API keys or Security setting, because each of those lets the holder hand themselves or a key write access. Tests that need data run on the staging instance (`01-deploy.md` section 11), where engineers hold Admin.
- **Workflows sits with the ED and engineers only.** A manual-trigger workflow runs only for a role holding Workflows, so BD officers get no workflow buttons in Phase A. Their actions are status fields and, in Phase B, the work package card. Code actions are part of Workflows, not of the Code interpreter permission.
- **Import** is the ops coordinator's (`09-import.md`). The **Import** command is hidden from every other role; the server itself only checks that the role can write the object.
- **Upload** stays off so documents cannot be attached anywhere (`kuec/CLAUDE.md` section 4). Engineers have it because publishing the app uploads its build.
- **History objects are read-only** for every role except the ED and the ops coordinator, and closed to the Leadership viewer: timeline, attachments, synced mail and calendar records. Twenty treats these as system objects, which every role can otherwise change and destroy through the API regardless of its other settings.

### 1.2 How the roles reach the workspace

- The roles ship in the app. `app:install` (or the deploy in `01-deploy.md` section 8) creates or updates them in Settings > Members > **Roles**.
- Change a role only in `kuec/app/src/roles/`, with `roles.test.ts` updated, `npx twenty plan` read, then deployed. Settings shows app roles as editable, but edits to their object, field or permission settings are refused (the role belongs to the app). Label and role-wide switch edits may save; they are not in the manifest, so make none.
- Never remove a role from the manifest (`kuec/CLAUDE.md` section 2). To retire one: move its members, relabel it `(deprecated)`, set `canBeAssignedToUsers: false`.
- **Never uninstall `kuec-bd-ops` in production.** Uninstalling deletes its roles, and every member on them is left with no role: every request fails with "has no role assigned" until an Admin assigns one. 2.48 does not fall back to the default role in that case (tested, `evidence/logs/t10.txt`). The break-glass account (section 3) is how you recover.

## 2. Field locks

Fields only automation, the ED and the ops coordinator may change. Every other role, including those that cannot write the object at all, has **canUpdateFieldValue = false** on each, so a later grant on the object does not open them.

| Name | Object | Field (label) | In the data model | Who can write it today |
| --- | --- | --- | --- | --- |
| `offeredAt` | Work package | Offered at | yes | the app only |
| `completedAt` | Work package | Completed at | yes | the app only |
| `playbookStep` | Work package, Milestone | Playbook step | yes, on both | the app only |
| `stageEnteredAt` | Opportunity | Stage entered at | yes | the app only |
| `lastEngagementAt` | Company | Last engagement | yes | the app only |
| `percentComplete` | Project | Percent complete | yes | the app only |
| `health` | Project | Health | yes | the app only |
| `lastEngagementAt` | Lead | Last engagement | yes (0.9.0) | the app only |
| `externalId`, `sourceSystem` | Lead, Document | External id, Source system | yes (0.9.0), `writability: OPEN` | the app, the ED, the ops coordinator, the Automation key |
| `externalId`, `sourceSystem` | Capability, Contract | External id, Source system | yes (0.11.0), `writability: OPEN` | the app (the uVENTURE feed), the ED, the ops coordinator, the Automation key; Capability itself is read-only for every person role (decision 13) |
| `externalId`, `sourceSystem` on Company and Person, `serviceCaseId`, `version` | | | **no** | |

**Two layers.** The eight existing fields were already app-stamped in the manifest (`writability: APPLICATION`): Twenty refuses a write to them from any person or API key, the ED, the ops coordinator and the Automation key included. Only the app's logic functions and front components write them. The role locks add the second layer and matter where the app acts for a person (below). The exemption for the ED, the ops coordinator and Automation becomes real for fields people may edit: when the four missing fields are added (they read like integration fields the Automation key fills), give them `writability: OPEN` so the key can write them, and add them to `LOCKED_FIELDS` in `kuec/app/src/roles/utils/field-locks.ts` so everyone else cannot. If the ED or the ops coordinator should be able to correct a stamped value such as Health, that field has to become OPEN too; we recommend leaving the stamps to the app. The first two that exist, `externalId` and `sourceSystem` on Lead and Document (0.9.0), are built that way: OPEN, and in `LOCKED_FIELDS`.

**What people see.** A locked field shows read-only. Through the API the whole update is refused with `no permission to write field "<name>"`; a kanban drag that would change a locked field fails.

**The app acting for a person.** A logic function started by a member's change writes as that member's role intersected with the app's role, and a lock on either side wins. With the roles above, a BD officer could not have started a playbook: W1 creates work packages with fields the BD officer cannot write. Before this change, a BD officer setting an opportunity's Type created no work package at all (`evidence/logs/t10-before-app-scoped-writes.txt`). The writes that are the app's own work now run as the app: playbook work packages and milestones (W1, W9), the reassignment to the ops coordinator (W2), releasing the next step (W6), and the licence contract (W7). Notification tasks are still created as the person, so every role that can start automation also writes Task and Task target (`roles.test.ts` checks it). `04-automation.md` section 2 lists who each function writes as.

## 3. Admin, the break-glass account and the ED

The built-in **Admin** role has every permission, including impersonation, billing and marketplace apps. 2.48 will not let the last Admin be unassigned, and nobody can change their own role. So:

- One **break-glass account** holds Admin in production and nobody else does: a KUEC Microsoft account such as `crm-breakglass@kuec.example`, assigned to the Twenty enterprise app in Entra, MFA on, credentials in the secrets manager at `twenty/prod/BREAKGLASS`. It is used only to change the ED's role, to recover members left without a role, and in emergencies. Every sign-in is recorded in the access review table (section 6) with the reason.
- The **ED** works on the ED role. It covers everything the ED does day to day and leaves impersonation, billing, SSO bypass, marketplace apps and AI settings to the break-glass account.
- First deploy order, after `01-deploy.md` section 8 has installed the app with the ED as the first (Admin) user: the ED invites the break-glass address with role **Admin**; the break-glass account signs in once and assigns the ED the **ED** role (Settings > Members > Roles > ED > Assignment); it signs out and its credentials are sealed. From then on the ED is no longer an Admin.
- On staging, engineers hold Admin. Staging holds test data only.

## 4. API keys

### 4.1 Inventory

Every API key in production and staging has a row here before it is created. A key must have a named owner, a role other than Admin, and an expiry of at most one year. No secret goes in this file: the key itself is only in the secrets manager.

| Key name in Settings | Instance | Role | Owner | Created | Expires | Rotation due | Secret path | Used by |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `automation-prod-<yyyy-mm>` | prod | Automation | ED | | created + 1 year | every quarter | `twenty/prod/AUTOMATION_API_KEY` | inbound integrations and scripts that write BD records |
| `automation-staging-<yyyy-mm>` | staging | Automation | engineering lead | | created + 1 year | every quarter | `twenty/staging/AUTOMATION_API_KEY` | the same, against staging |
| `uventure-reader-prod-<yyyy-mm>` | prod | uVENTURE reader | ED | | created + 1 year | every quarter | `twenty/prod/UVENTURE_READER_API_KEY` | uVENTURE's nightly read (`21-uventure-readiness.md` section 4.3) |
| `uventure-reader-staging-<yyyy-mm>` | staging | uVENTURE reader | engineering lead | | created + 1 year | every quarter | `twenty/staging/UVENTURE_READER_API_KEY` | the same, against staging |

Revoked keys stay in the table, with the revocation date, for a year.

- **Who can create one:** the ED role (creating a key needs both the API keys and the Roles permission) and the break-glass Admin. Engineers cannot.
- **Not keys:** a CLI login for deploys (it is the person's session), and the tokens Twenty gives the app's logic functions on each run. Neither belongs in the inventory.
- Steps to create, verify, rotate and revoke: `config/dashboards/automation-api-key.md`.

## 5. Confidentiality: what the free plan cannot do

**Row-level permissions and record sharing are Organization-plan features, also when self-hosted** (2.48 checks the `RLS` and `RECORD_SHARING` billing entitlements). KUEC runs the free plan. So **everyone whose role can read an object reads every record in it**: in lists, views, search, dashboards, export where the role has it, and the API. Owner fields decide who is notified and whose lists a record appears in, not who can see it. Field read restrictions exist but apply to every record of the object alike.

If a class of records has to be hidden from part of the team, the answer is a **separate object with its own role access**. Not a workaround: a private view, a naming convention, a "Confidential" checkbox or detail kept in notes hides nothing from a member who can read the object or call the API.

Candidates, for the ED to decide:

| Candidate | Where it would sit today | As its own object |
| --- | --- | --- |
| Sponsored-chair negotiations | Opportunities, readable by every BD officer, department role and the Leadership viewer | An object such as "Sponsored chair" (company, owner, stage, value, next action and date, SharePoint folder), readable only by the ED, the ops coordinator and any role you name |
| Offset-related deals | Opportunities with a company flagged **Offset obligor** (view "Offset obligors") | An object such as "Offset deal", same pattern |

What a separate object costs, for either:

- Roles grant per role, not per person. If only some BD officers may see it, they need their own role (for example "BD officer, chairs"), which they hold instead of BD officer.
- The pipeline views, dashboards, playbooks (W1), next-action guard (W4), stale and engagement tracking work on Opportunity. The new object needs its own views and, if wanted, its own automation.
- Existing records do not move; they are re-created in the new object and the old ones deleted, which loses their timeline.
- Before deciding, check on staging that a role without read on the new object sees none of its records in search, on the related company's page and timeline, or in the command menu.

Until you decide, record only what every reader of Opportunity may see, and keep the rest in SharePoint behind the record's link.

## 6. Quarterly access review

First week of January, April, July and October, together with the API key rotation and the `config/deploy/logic-function-type.md` review. The ED and the engineering lead, about 45 minutes.

1. **Members.** Settings > Members against the HR list: every member is a current KUEC person, the `bd-ops` service member or the break-glass account. Nobody who has left is still there.
2. **Assignments.** Settings > Members > Roles > each role > **Assignment**:
   - Admin: the break-glass account only.
   - ED: the ED only. Ops coordinator: the ops coordinator only.
   - Member, and any other role not in section 1: nobody.
   - Leadership viewer: nobody, until leadership access is decided.
   - Automation: no members; under **API keys**, only the automation key.
   - Everyone else holds the role section 1 gives them.
3. **Default role** (Settings > Members > Roles, **Default Role**): Leadership viewer.
4. **Role definitions unchanged.** From `kuec/app`, `npx twenty plan` against production shows no role change; `yarn test:unit` passes on the deployed commit.
5. **API keys.** Settings > MCP & APIs: the keys match section 4.1; none is bound to Admin; none is expired but still listed as active; the quarterly rotation is done.
6. **Workflows.** The Workflows list (sidebar > Workflows): none (`kuec/CLAUDE.md` section 6), or each one is approved by the ED, has no Code step, and no manual trigger.
7. **Apps.** Settings > Apps: `kuec-bd-ops` only.
8. **Break-glass.** Entra sign-in log for the account: every sign-in this quarter has a line in the table below. Rotate its password if it was used.
9. **Logic functions.** The conditions in `config/deploy/logic-function-type.md` still hold; re-sign it if a role changed.
10. **Spot check.** As a BD officer: Settings shows no Workflows, Data model, Applications or API keys; **Delete** is not offered on an opportunity; Due cannot be changed on a work package.

Record:

| Quarter | Date | Reviewed by | Findings | Actions, by whom, done on |
| --- | --- | --- | --- | --- |
| | | | | |

## 7. Joiners

Who: the ED (invites, assigns), the new member, the ops coordinator. Since 0.11.0 a joiner in the commercialization vertical is set up in Twenty and in uVENTURE the same day, with the mapped role: `21-uventure-readiness.md` section 2.5 wraps the steps below.

1. **IT** creates the KUEC Microsoft account and assigns it to the Twenty enterprise application in Entra (it-request item 1, "Assignment required").
2. **ED:** Settings > Members > **Invite**. Enter the work address and pick the **role** from section 1 in the role list next to it, so the member never passes through the default role. **Invite**.
3. **Member:** opens the invitation and signs in with **Continue with Microsoft**.
4. **ED:** Settings > Members > Roles > the role > **Assignment** lists the member.
5. **Member: connect mail and calendar.** Settings > Accounts > **Connect with Microsoft**, then the settings in `config/dashboards/email-calendar-sync.md` (email visibility Subject and metadata, contact auto-creation off, calendar visibility Everything).
6. **Ops coordinator:** if the member takes playbook steps (BD officer, Developer, Data analyst, Legal and the other playbook roles), add a **Playbook role assignment** (member, playbook role, active). W1 and W9 assign work by these.
7. **BD staff:** the day-one checklist in `runbooks/10-onboarding.md`.
8. **Check:** the member signs in and lands on Home; Settings shows only what section 1 gives the role.

A member changing job: the ED assigns the new role (Settings > Members > Roles > new role > **Assignment**); it replaces the old one. Nobody can change their own role: the ED's role is changed with the break-glass account.

## 8. Leavers

Who: the ops coordinator (records), the ED (access), IT. Since 0.11.0 the uVENTURE account is reassigned and disabled the same day: `21-uventure-readiness.md` section 2.5. Steps 1 to 4 happen before the member is removed: **removing a member unassigns them from all their records** (owner fields become empty) and moves their synced mailbox and calendar to the person who removes them.

1. **Find their open records.** For each object, open the list and filter by the leaver:

   | Object | Filter on |
   | --- | --- |
   | Work packages | Owner, and separately Reviewer |
   | Opportunities | Owner |
   | Companies | Account Owner |
   | Engagements, Projects, Milestones, Contracts | Owner |
   | Tasks | Assignee |

2. **Reassign.** Select the records, **Update** (bulk, 2 or more records), set the owner to the successor or the ops coordinator. Tell the new owner of any Offered work package: the acceptance clock keeps running from the original offer, and at 5 business days it goes to the ops coordinator.
3. **Playbook role assignments.** Set the leaver's assignments to inactive; never delete them. If the leaver is the ED or the ops coordinator, add the successor's assignment first: the escalations find the ED and the ops coordinator through these (`kuec/CLAUDE.md` section 7).
4. **Mail.** Mail that only the leaver's mailbox synced disappears from the records when that account is removed. Outlook stays the system of record; decide with the ED whether to keep the account connected (it stops syncing once moved to the ED) or remove it under Settings > Accounts.
5. **Remove.** ED: Settings > Members > the member > **Remove member**, confirm.
6. **IT** disables the Microsoft account and removes its assignment to the Twenty application.
7. **Keys and secrets.** If the leaver owned a key in section 4.1, give it a new owner and rotate it. An engineer leaving: rotate every secret they could read in the secrets manager (SMTP password, Teams webhook, automation keys) and remove their repository access.
8. **Escalations they started.** Within the hour, the timer sweep re-runs, as the app, any escalation that failed because it was started by the leaver's account. Check the sweep's "sweep repaired" log line the next morning.
9. **ED leaving:** the break-glass account assigns the successor the ED role before the old ED is removed.
10. Add a line to the access review table (section 6).

## 9. After changing a role

1. `yarn test:unit` in `kuec/app`, with `roles.test.ts` updated in the same change.
2. `npx twenty plan` against staging: only the intended role changes, nothing removed.
3. Deploy to staging and run T10 there (`kuec/tests/acceptance/README.md`).
4. Deploy to production; repeat the section 6 spot check.

## 10. Limits of 2.48 to keep in mind

- **"Export own views only" cannot be enforced.** Export CSV is one switch for the whole role. BD officers and the departments have no Views permission, so the views they make are personal (only they see them), but Export works on any view they open, and their role can read the same data through the API. "Export only from your own views" is a team rule; the export itself is not logged.
- **Manual-trigger workflow buttons** still show to roles without Workflows and fail when clicked. Do not publish manual-trigger workflows in production in Phase A.
- **Workflows lets engineers write business data indirectly**: a workflow started by a record event runs with broad rights (Twenty's standard workflow role, Admin if none is set), and Code steps run unsandboxed under `LOGIC_FUNCTION_TYPE=LOCAL`. The control is `kuec/CLAUDE.md` section 6 (no UI workflows) and review step 6.
- **A member without Views** can create personal views in the UI. Reading the 2.48 code, the API does not appear to stop them turning their own personal view into a workspace view. Low risk; a stray workspace view shows up in the view pickers and is removed by the ED.
- **Field read restrictions and locks apply to the whole object**, never to some records (section 5).
