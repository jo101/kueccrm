# Information architecture and navigation map

Status: the brief (part 4) fixes the destinations as standard CRM vocabulary; the tree test in `research.md` section 8.3 still runs, with these names, to measure first-click success (pass: at least 80 percent per task). Arabic names are tested separately and a native-speaking colleague approves them. Everything here lives in uVENTURE under `/crm`; Twenty's own navigation is never shown to employees. Screen-level entry, exit and back rules are in `flows.md`.

## 1. Destinations

| Destination | Route | Question it answers | Who lands here | Twenty data behind it |
| --- | --- | --- | --- | --- |
| Home | `/crm` | What needs me now, and the one thing to do on each | Everyone but the leadership viewer | tasks (owner or reviewer = me), opportunities with a Next Step due, decisions and escalations (ED, operations coordinator) |
| Leads | `/crm/leads` | What came in and who owns it; the triage queue for the operations coordinator | BD officers, operations coordinator | lead |
| Opportunities | `/crm/opportunities` | Where every opportunity stands and what happens next; board and list | BD officers, ED | opportunity by stage |
| Accounts | `/crm/accounts` | Who we work with, what is open, what happened last | BD officers, ED | company, engagements, contracts, documents |
| Contacts | `/crm/contacts` | Who we know and their roles | BD officers | person with decision role |
| Activities | `/crm/activities` | What happened, when, with whom | BD officers, ED | engagement |
| Tasks | `/crm/tasks` | What work is in flight, who owns it, what is late or blocked; the team workload view | Everyone with work; the operations coordinator | workPackage |
| Projects | `/crm/projects` | Delivery after signature: milestones and their tasks | Technical contributors, operations coordinator, ED | project, milestone |
| Dashboards | `/crm/dashboards` | How are we doing, where is the risk, what is waiting on a decision | ED, leadership viewer | the BD Executive and Team queries; each chart links to its list |
| More: Contracts, Documents, Products & Services, Campaigns, Help | `/crm/contracts`, `/crm/documents`, `/crm/products`, `/crm/campaigns`, `/crm/help` | Reference lists and help | As their roles allow | contract, document, capability, campaign |

Mobile bar: Home, Opportunities, New, Tasks, More.

## 2. Shell

Header: KUEC mark, the nine destination tabs and More (from 992 px), search (Ctrl or Cmd+K over accounts, contacts, opportunities, tasks, in Arabic and English), New (default button, never filled; opens New lead), the bell (in-app inbox, never a Twenty task), the person menu (language, light or dark, Help, Feedback, Open the expert CRM for roles that have it, Sign out). Below 768 px the bottom bar replaces the tabs. Every screen has the info icon that opens the five lines of "How this works" in the user's language only, and ends with "What do I do now?".

## 3. Role-specific landing

| Role (Twenty) | Home shows | Sections |
| --- | --- | --- |
| BD officer | Performance strip (mine), then cards | Needs your attention, Next Steps due, In progress |
| ED | Performance strip (team), then cards | Decisions, Escalations, In progress |
| Operations coordinator | Performance strip (team), then cards | Needs your attention (lead triage first), Escalations, In progress |
| Technical contributor (engineer and department roles) | Cards only | Needs your attention, In progress |
| Leadership viewer | Dashboards | Home is not shown |

Visibility is Twenty's: the UI reads as the signed-in person, so a role that cannot read an object never gets the card.

## 4. Navigation map

```
/crm                              Home
/crm/leads                        Leads list; triage queue for the operations coordinator
/crm/leads/new                    New lead (modal on desktop, full screen on a phone)
/crm/leads/:id                    Lead record
/crm/opportunities                Opportunities: board | list
/crm/opportunities/:id            Opportunity record (built)
/crm/accounts, /crm/accounts/:id  Accounts list and record
/crm/contacts, /crm/contacts/:id  Contacts list and record
/crm/activities                   Activities list
/crm/tasks                        Tasks list; ?view=mine | team | escalations | decisions
/crm/tasks/:id                    Task card (built)
/crm/projects, /crm/projects/:id  Projects list and record
/crm/dashboards                   Dashboards
/crm/contracts, /crm/documents, /crm/products, /crm/campaigns
/crm/inbox                        Notification inbox
/crm/help                         Help
```

Deep links from notifications always land on a card or a record (`/crm/tasks/:id`, `/crm/opportunities/:id`), never on a list.

## 5. What a BD officer never sees

System fields, object API names, filter chips and toolbars by default (a single Filters control holds them), field groups, Twenty's sidebar, status values in system words, view names, Twenty's onboarding. Anything expert goes through "Open the expert CRM".

## 6. Tree test tasks

1. Where would you find who we know at a company?
2. Where would you set what happens next on an opportunity?
3. Where would you see what is blocked across the team?
4. Where would you log a lead from a business card?
5. Where would you accept a task assigned to you?
6. Where would you check what closed this month?
7. Where would you find the contract with a company?
8. Where would you see the leads waiting for triage?
