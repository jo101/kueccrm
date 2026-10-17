# Role definitions

- **Source of truth:** the app manifest, `kuec/app/src/roles/*.role.ts`, deployed with `kuec-bd-ops`. This file is the readable copy; change it in the same commit as the role files. `kuec/app/src/roles/roles.test.ts` checks the grants below.
- **Written against:** Twenty 2.48.0, `kuec-bd-ops` 0.6.0.
- **How they are used** (Admin and break-glass, API keys, reviews, joiners and leavers): `kuec/runbooks/13-roles.md`.
- **Why roles are not set in the Settings UI:** app roles are created and kept by the manifest. Settings shows them as editable, but object, field and permission edits there are refused; label and switch edits may save but are not in the manifest, so make none. Assigning roles to people is done in Settings: `config/dashboards/members-and-roles.md`.

Every person holds exactly one role.

## Roles

| Role | File | Universal identifier | Assignable to |
| --- | --- | --- | --- |
| ED | `ed.role.ts` | `b2d2354f-fec7-4e6f-a5ed-ccef69ebed96` | people |
| Ops coordinator | `ops-coordinator.role.ts` | `68ce3927-3689-436e-9170-c297f3fed980` | people |
| BD officer | `bd-officer.role.ts` | `076a7c33-d5fe-4944-9a31-77eabc22ee18` | people |
| Engineer | `engineer.role.ts` | `6aee78fc-1d03-4428-a948-7fb653d3f5ca` | people |
| Leadership viewer | `leadership-viewer.role.ts` | `e9cd5e6f-57b3-4df7-b304-866c6d5e80b4` | people (none assigned yet) |
| IP office | `ip-office.role.ts` | `b69517ff-b89d-4c6d-bd66-eaf50cca0661` | people |
| Leasing | `leasing.role.ts` | `dc924d87-981a-4ce0-bafc-ee1a03483f06` | people |
| Lab access | `lab-access.role.ts` | `3c966902-6644-429c-b98e-0f92a1633a95` | people |
| Startups and investment | `startups-and-investment.role.ts` | `4d069939-dbea-4965-a3eb-b62f7c3d7a06` | people |
| Automation | `automation.role.ts` | `41f3a443-1174-463a-9586-b9fd5027cc57` | API keys only |
| KUEC BD Ops function role | `default-function.role.ts` | `67077129-a376-41fb-817e-d3a9e300a864` | nobody: the app's logic functions and front components run as it |

No role can be assigned to AI agents.

## Records

R read, W create and update, D delete (soft delete and destroy), `-` no access. "Dept" is each of IP office, Leasing, Lab access, Startups and investment: they share one definition (`roles/utils/build-department-role.ts`).

| Object | ED | Ops coordinator | BD officer | Engineer | Leadership viewer | Dept | Automation | Function role |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Opportunity | RWD | RWD | RW | R | R | RW | RW | RW |
| Company | RWD | RWD | RW | R | R | R | RW | RW |
| Person | RWD | RWD | RW | R | - | R | RW | RW |
| Engagement | RWD | RWD | RW | R | - | RW | RW | RW |
| Work package | RWD | RWD | RW, 4 fields only (below) | R | - | R | RW | RW |
| Project | RWD | RWD | R | R | R | R | RW | RW |
| Milestone | RWD | RWD | R | R | R | R | RW | RW |
| Contract | RWD | RWD | R | R | R | R | RW | RW |
| Task | RWD | RWD | RW | R | - | RW | RW | RW |
| Note | RWD | RWD | RW | R | - | RW | RW | RW |
| Dashboard | RWD | RWD | R | RW | R | R | - | RW |
| Playbook role assignment | RWD | RWD | R | R | - | R | - | RW |
| Public holiday | RWD | RWD | R | R | - | R | - | RW |
| Task target, Note target (links) | RWD | RWD | RWD | R | - | RWD | RW | RWD |
| Timeline, attachments, synced mail and calendar | RWD | RWD | R | R | - | R | R | RWD |
| Workspace members | R, W with Members | R | R | R | R | R | R | R |
| Workflows, workflow versions and runs | with Workflows | - | - | with Workflows | - | - | - | - |

- "Timeline, attachments, synced mail and calendar" is `timelineActivity`, `attachment`, `message`, `messageThread`, `messageParticipant`, `messageThreadTarget`, `calendarEvent`, `calendarEventParticipant`, `calendarEventTarget`, `callRecording` (`roles/utils/system-objects.ts`). Twenty treats them as system objects: without an explicit permission every role may read, change and destroy them, so every role except the ED, the ops coordinator and the function role sets them explicitly.
- Other system objects (blocklist, message lists, record shares and similar) keep Twenty's default for every role.
- Merge needs Update and Destroy on the object and Update on the records that point at it: only the ED and the ops coordinator.

### BD officer on a work package

Writable: **Status**, **Accepted at** (the work package card writes it with Accepted), **Blocked reason**, **Declined reason** (the card's Decline writes it with the status). Notes are attached through Notes and Note target.

Locked (canUpdateFieldValue false): Title, Due, Objective, Expected output, Done criteria, Due offset (business days), Submitted at, Blocked at, Acceptance reminder sent at, Reassigned at, Overdue owner notified at, Overdue ED notified at, Owner, Reviewer, Opportunity, Project, Milestone, Depends on, plus the field locks below (Offered at, Completed at, Playbook step).

A BD officer therefore cannot create work packages; the playbooks and the ops coordinator do.

## Field locks

canUpdateFieldValue false for **every role except ED, Ops coordinator, Automation and the function role**:

| Object | Field | Universal identifier |
| --- | --- | --- |
| Work package | `offeredAt` | `52bcf262-410c-473c-bc73-482ffdd5555b` |
| Work package | `completedAt` | `358cfea6-34ac-41a1-a6d0-f06f9466f8c0` |
| Work package | `playbookStep` | `eb6e8f40-fae2-4397-89d1-eae1fd9d4206` |
| Milestone | `playbookStep` | `1e9a7463-8568-4a1c-9344-3c90bcd80398` |
| Opportunity | `stageEnteredAt` | `e6b85f62-3fbb-4abd-bdb7-c76f1e8b9458` |
| Company | `lastEngagementAt` | `b24f9955-8e9c-4d8c-9fc6-a61d73074aaf` |
| Project | `percentComplete` | `3daef18d-7300-4b2b-8564-8d660b61541c` |
| Project | `health` | `d9ae87e2-fd5f-479e-9c61-d8be140679ef` |

Also on the lock list, not in the data model yet: `externalId`, `sourceSystem`, `serviceCaseId`, `version` (`roles/utils/field-locks.ts`, `LOCKED_FIELD_NAMES`). All eight fields above are also app-stamped (`writability: APPLICATION`), so no person or API key writes them directly; see `runbooks/13-roles.md` section 2.

## Settings and tools

Settings permissions are listed one by one; no role has "all settings" or "all tools".

| Permission | ED | Ops coordinator | BD officer | Engineer | Leadership viewer | Dept | Automation |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Workspace (general settings) | yes | | | yes | | | |
| Members | yes | | | | | | |
| Roles | yes | | | | | | |
| Security | yes | | | | | | |
| Data model | yes | | | yes | | | |
| Workflows (includes Code actions) | yes | | | yes | | | |
| API keys and webhooks | yes | | | | | | |
| Apps (Applications) | yes | | | yes | | | |
| Layouts | yes | | | yes | | | |
| Views (workspace views) | yes | | | yes | | | |
| Import CSV | | yes | | | | | |
| Export CSV | yes | yes | yes | | | yes | |
| Upload files | | | | yes | | | |
| Download files | yes | yes | yes | yes | | yes | |
| Sync account (mail, calendar) | yes | yes | yes | yes | | yes | |
| Edit profile | yes | yes | yes | yes | yes | yes | |

Held by no role: Impersonate, SSO bypass, Billing, Marketplace apps, AI settings, Ask AI, Send email, Create calendar event, HTTP request, Code interpreter. The break-glass account on the built-in Admin role has all of them.
