# Flows: the navigation state map

Every screen, its entry points, exits, back behaviour, drawer versus page, deep links from notifications and keyboard shortcuts. Templates, not improvisation: a screen that needs a new pattern adds it to `components.md` and Storybook first. Built this week: the shell, Home, the Task card, the Opportunity record. The rest is specified here and arrives in weeks 3 to 5.

## 1. Shell

| Element | Desktop (from 992 px) | Phone (below 768 px) |
| --- | --- | --- |
| Navigation | Header tabs: Home, Leads, Opportunities, Accounts, Contacts, Activities, Tasks, Projects, Dashboards, More (Contracts, Documents, Products & Services, Campaigns, Help) | Bottom bar: Home, Opportunities, New, Tasks, More (the other destinations, language, scheme) |
| Search | Icon in the header; Ctrl or Cmd+K opens Spotlight over accounts, contacts, opportunities and tasks | Icon in the header; same Spotlight |
| New | Header button (default, never filled); opens New lead | Centre of the bottom bar |
| Notifications | Bell with a dot; opens the inbox | Bell in the header |
| Person menu | Language, light or dark, Help, Feedback, Open the expert CRM (ED and operations coordinator only), Sign out | Under More |
| Primary action position | Top right of the page header or the first card; one filled button per screen | Full width, 44 px; the Task card's actions stick above the bottom bar |

Back: the browser back button and the breadcrumb are the only ways back; no custom back buttons on desktop. A record opened from Home returns to Home; from a list, to that list, scrolled to the row.

## 2. Screens

| Screen | Route | Template | Entry points | Exits | Deep link from notifications |
| --- | --- | --- | --- | --- | --- |
| Home | `/crm` | Card view, 720 px column | Sign-in landing for every role but the leadership viewer; the Home tab | A card's one button opens its record; "Open list" opens the matching list with the section's filter | `/crm?filter=no-next-step` (W4 daily guard) |
| Task card | `/crm/tasks/:id` | Card view, 720 px column; the card first on every width | Home card; Tasks list row; the Opportunity record's Related tab; notification | Breadcrumb Home > Tasks; "Part of" link to the opportunity; after Decline or Approve the card updates in place and the "What do I do now?" line names the next action | `?from=notification` shows the banner (W2 assigned, W3 overdue, W6 submitted, sent back, reassigned) |
| Opportunity record | `/crm/opportunities/:id` | Record, 1200 px with the 280 px right rail; tabs Activity, Details, Related | Home card; Opportunities list or board; Task card "Part of"; search; notification | Breadcrumb Home > Opportunities; Account link; task rows open the Task card; documents open SharePoint in a new tab | W7 signed, W8 lost without reason, U4 capability unavailable |
| Set Next Step | modal over the record or the Home card | Confirmation-sized modal, one text line and one date | "Set Next Step" button | Save (toast with Undo) or Cancel | none |
| Mark stage complete | confirmation modal | One sentence, Cancel and the verb | The stage path button | Confirm moves the stage; the toast names the new stage | none |
| Log a call, New event, Email | composer on the Activity tab | Inline, not a modal | Composer buttons | Save adds the entry to the timeline | none |
| New task | drawer from the end side | Drawer, 400 px | Composer "New task" | Save creates an Assigned task; Cancel closes | none |
| Decision card | on the ED's Home; `/crm/decisions/:id` (week 4) | Card | Home; notification | Decide (toast) or Decide later with a date | W5 blocked, W3 +2 days, W1 confirm plan |
| Leads, New lead | `/crm/leads`, `/crm/leads/new` (week 3) | List; guided form as a modal on desktop and full screen on a phone | Nav; New; empty state on Home | Save returns to where New was pressed | L1 triage, L2, L3, L4 |
| Opportunities board and list | `/crm/opportunities` (week 3) | List template with a board toggle | Nav; Home "Open list" | Row or card opens the record | none |
| Accounts, Contacts | `/crm/accounts/:id`, `/crm/contacts/:id` (week 3) | Record template | Record header links; search | Breadcrumbs | none |
| Projects, Tasks, Team workload | `/crm/projects`, `/crm/tasks`, `/crm/tasks?view=team` (week 4) | List template; workload is a grouped list with Reassign in the row menu | Nav; Home "Open list" | Rows open records | none |
| Escalations | `/crm/tasks?view=escalations` (week 4) | List of resolution cards | ED and operations coordinator Home "Open list" | Each card's one button | W2 reassigned |
| Dashboards | `/crm/dashboards` (week 5) | Charts, each with a named question and a link to its list | Nav; the leadership viewer's landing | Chart to list | Thursday digest |
| Inbox | `/crm/inbox` (week 4) | List | Bell | Each entry deep-links to its card | all |
| Help | `/crm/help` | Page | More; person menu | Back | none |

## 3. Keyboard

| Keys | Where | Does |
| --- | --- | --- |
| Ctrl or Cmd+K | Everywhere | Open search |
| Escape | Modal, drawer, popover | Close without saving |
| Enter | A one-line form (Set Next Step, Decline reason) | Save when valid |
| Tab | Everywhere | One stop per control; the info icon is one stop beside its control, never inside it |
| N | Home, lists (week 3) | New lead |

## 4. Rules that hold on every screen

- One primary action: exactly one filled button in the viewport, and it is the one thing to do now. Asserted by `tests/visual/screens.spec.ts`.
- One set of action verbs (`glossary.md` section 6). A screen never invents a verb.
- Breadcrumbs are Home > destination > record, in that order, with the record name last and not a link.
- Lists open as pages, forms with one or two fields open as modals, longer forms open in the drawer on desktop and full screen on a phone.
- "What do I do now?" ends every card and every page, naming the next action for the viewer's role and the record's state.
- Every state (loading, empty, error, refused write) uses the one pattern: skeletons with real headings, a one-sentence empty state with one button, an alert that says what happened and what to do, and "That didn't save. Nothing was changed. Try again." for a refused write.
- Transitions: 150 ms for micro changes, 250 ms for panels; nothing moves when `prefers-reduced-motion` is set.
