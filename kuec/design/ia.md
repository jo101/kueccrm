# Information architecture and navigation map

Status: hypothesis, to be validated by the tree test in `research.md` section 8.3 (pass: at least 80 percent first-click success). Names are placeholders until the team's words win; Arabic names are tested separately. Everything here lives in uVENTURE under `/crm`; Twenty's own navigation is never shown to employees.

## 1. Destinations

| Destination | Route | Question it answers | Who lands here | Twenty data behind it |
| --- | --- | --- | --- | --- |
| Today | `/crm` | What needs me now, and what is the one thing to do on each | Everyone (default landing) | work packages (owner or reviewer = me), opportunities with next action due, tasks assigned to me, blocked items (ED, ops coordinator) |
| Pipeline | `/crm/pipeline` | Where every case stands and what happens next; tab 1 for the ops coordinator is the Lead inbox | BD officers, ED, ops coordinator | opportunities by stage (Qualify, Scope, Propose, Negotiate, Signed, Lost, Parked), leads |
| Accounts | `/crm/accounts` | Who we know, what is open with them, what happened last | BD officers, ED | companies, people, engagements, contracts, documents |
| Delivery | `/crm/delivery` | What work is in flight, who owns it, what is late or blocked | Technical contributors, ops coordinator, ED | work packages, projects, milestones |
| Insights | `/crm/insights` | How are we doing, where is the risk, what is waiting on a decision | ED, leadership viewer | the BD Executive and Team dashboards' queries; each chart links to its list |

Not destinations: documents (live on the account, opportunity and work package they belong to); capabilities (shown inside lead intake and the opportunity as "What we can offer"); exceptions (a filter of Today for the ED and ops coordinator, and the Delivery "Blocked" tab); administration (Twenty's own UI, linked from More for admins only).

## 2. Shell

- Header: KUEC mark, destination tabs (desktop), global search (Cmd/Ctrl-K, searches companies, people, opportunities, work packages by name, Arabic and English), the **Log** button (always visible, opens the guided capture), the inbox bell (in-app notifications, never tasks), the person menu.
- More (person menu): Help, Switch language, Open the expert CRM (Twenty; shown only to roles that have it), Feedback, Sign out. Administration lives behind "Open the expert CRM" and never in routine paths.
- Mobile (below 768 px): bottom bar Today, Pipeline, Log (centre, raised), Delivery, More. Accounts and Insights sit under More. One primary action per screen, full-width 44 px targets.
- Every screen: an info icon that opens the five-line "How this works" in the user's language only; a "What do I do now?" line at the end of every card and form; a Feedback button.

## 3. Role-specific landing and visibility

Visibility is Twenty's: the UI reads as the signed-in person, so a role that cannot read an object never gets the card. The landing order differs by role:

| Role (Twenty) | Today shows first | Then |
| --- | --- | --- |
| BD officer | Work offered to me, my next actions due today and overdue | My cases moving this week, other work progressing |
| ED | Decisions (blocked with reason, declined, tight deadlines, licence confirmations) | Team exceptions, Thursday digest |
| Ops coordinator | Team exceptions (unaccepted after 2 days, no owner, no next action), lead inbox count | Reassignments pending |
| Department and engineer roles (technical contributors) | Work offered to me, my accepted work with due dates | Reviews waiting on me |
| Leadership viewer | Insights (read-only) | Nothing else; Today is not shown |

## 4. Navigation map

```
/crm                         Today
/crm/log                     Log (guided capture: lead, contact, note, next action)   [modal on desktop, full screen on phone]
/crm/pipeline                Pipeline: kanban | list ; tab "Lead inbox" first for the ops coordinator
/crm/pipeline/leads          Lead inbox (ops coordinator); "My leads" for others
/crm/opportunities/:id       Opportunity detail (sections in the fixed order of the brief)
/crm/accounts                Companies list (search first)
/crm/accounts/:id            Company page: who we know, what is open, what happened last, what is next
/crm/people/:id              Person (progressive disclosure inside the company page; direct route for search)
/crm/delivery                Delivery: Active work | Reviews | Blocked | Milestones
/crm/work/:id                Work Package card (first on the page, on every width)
/crm/decisions/:id           Decision card (ED and ops coordinator)
/crm/insights                Insights
/crm/inbox                   Notification inbox
/crm/help                    Help (the five lines per screen, glossary, screencasts)
```

Deep links from notifications always land on the card (`/crm/work/:id`, `/crm/decisions/:id`, `/crm/opportunities/:id`), never on a list.

## 5. What a BD officer never sees

System fields, object names (Opportunity, WorkPackage), filter chips, field groups, Twenty's sidebar, "System" groups, status values in system words, view names, the Twenty onboarding. Anything expert goes through "Open the expert CRM".

## 6. Tree test tasks (for section 8.3 of research.md)

1. Where would you find who we know at a company?
2. Where would you set what happens next on a case?
3. Where would you see what is blocked across the team?
4. Where would you log a lead from a business card?
5. Where would you accept a piece of work offered to you?
6. Where would you check what closed this month?
7. Where would you find the contract with a company?
8. Where would you see the leads waiting for triage?
