# 05: Screens (Phase B) tests

Written against Twenty 2.48.0 and `kuec-bd-ops` 0.4.0. Covers the screens built from `design/wireframes.md`: Home (native tables), Work package card, Manager exceptions. Intake and the Home primary action are not built yet; see "Not built" below.

## What shipped

| Screen | Surface | Files |
| --- | --- | --- |
| Home | Standalone page "Home" (sidebar, above My work), one grid tab, three read-only native tables | `page-layouts/home.page-layout.ts`, `page-layout-tabs/home.page-layout-tab.ts`, `navigation-menu-items/home.navigation-menu-item.ts`, `views/home/*.view.ts` |
| Work package card | Front component on the Home tab of the work package record page (after Fields), and from a pinned record-selection command on any work package list, including My work | `front-components/work-package-card.front-component.tsx`, `front-components/work-package-card/*`, `front-components/shared/*`, `page-layout-widgets/work-package-card.page-layout-widget.ts`, `command-menu-items/open-work-package-card.command-menu-item.ts` |
| Manager exceptions | Standalone page "Exceptions" (sidebar, below Home), one grid tab, three editable native tables over the existing views Blocked, Overdue and No next action | `page-layouts/exceptions.page-layout.ts`, `page-layout-tabs/exceptions.page-layout-tab.ts`, `navigation-menu-items/exceptions.navigation-menu-item.ts` |

Data model: one additive field, `workPackage.declinedReason` (TEXT), which holds the one-line reason typed when declining.

A navigation menu item can only open a `STANDALONE_PAGE` layout (Twenty rejects any other type, and an app cannot create a Dashboard record), so "dashboard-type page" means a standalone page laid out on the dashboard grid, the same way as the existing BD page.

### Home tables

| Table | View | Rows |
| --- | --- | --- |
| Needs your decision | `Home: Needs your decision` | The Blocked view's filters OR the Submitted for my review view's filters, as two AND groups under one OR group (one table reads one view) |
| Your next actions | `Home: My work due within 7 days` | Every My work filter, plus due date in the past, today, or the next 7 days (Asia/Dubai), late first |
| Other work is progressing | `Home: Other work by status` | Open work packages (Offered, Accepted, Submitted, Blocked) owned by someone else, grouped by status with a count. A view cannot filter on "cases I own", so this is team-wide |

### Card writes

Nothing else is written. Each write re-reads the record first and is refused (warning toast, card reloads) if the status or owner changed since the card was shown.

| Action | Shown to | Confirmation | Writes |
| --- | --- | --- | --- |
| Accept | Owner, status Offered | none | `status = ACCEPTED`, `acceptedAt` |
| Decline | Owner, status Offered | host modal, danger | `status = DECLINED`, `declinedReason` (one line, required) |
| Request help | Owner, status Accepted | host modal | One Task "Help needed: {title}" for the first active ops coordinator assignment, due today 17:00 Asia/Dubai, linked to the work package. Owner and status unchanged |
| Submit | Owner, status Accepted | host modal | `status = SUBMITTED` |

The card shows a skeleton while loading, a toast for every completed or failed action, and an "Open full record" link to the native record page at all times (repeated as a button on the error state). Typed but unsent reasons and questions are kept in `localStorage` until sent.

## Unit tests

No server needed. From `kuec/app`: `yarn test:unit`.

| File | Proves |
| --- | --- |
| `front-components/work-package-card/work-package-card-rules.test.ts` | Which actions the owner gets per status, none for anyone else; one-line reason handling; each action's write is exactly the fields above; the help task's assignee, due time and body |
| `front-components/work-package-card/work-package-card-api.test.ts` | Against a fake client: each action sends exactly one update (or task plus task target) with only those fields; a changed status or owner sends nothing; user id to member, first active ops coordinator |
| `front-components/work-package-card/work-package-card-surfaces.test.ts` | Widget availability limited to work package record pages; the widget sits on the generated Home tab after Fields; the command is record-selection on work packages |
| `page-layout-tabs/home-and-exceptions.test.ts` | Both pages are standalone pages reached from the sidebar above My work; Home has three read-only tables on its three views; Exceptions has three editable tables on Blocked, Overdue, No next action; Needs your decision equals Blocked OR Submitted for my review filter for filter; Your next actions keeps every My work filter |
| `__tests__/utils/manifest-identities.test.ts` | The additivity check used by the upgrade test catches a removed entity, a removed select option and a renamed field |

## Integration tests: a disposable instance

Same instance and command as `04-automation.md`. The card tests sign in as a workspace member (`TWENTY_TEST_USER_EMAIL` / `TWENTY_TEST_USER_PASSWORD`, default `tim@apple.dev`, the seeded dev user) and ask Twenty for the token it issues to the card, so the writes run with the person's role intersected with the app role, exactly as in the browser. `global-setup.ts` now adds the Signed, Lost and Parked stage options before installing, since the install fails without them.

| File | Case | Pass when |
| --- | --- | --- |
| `screens.integration-test.ts` | Sidebar and pages | Home and Exceptions are standalone pages opened by their sidebar items, three RECORD_TABLE widgets each, read-only on Home and editable on Exceptions |
| | Filter groups survive install | Needs your decision has one OR and two AND groups and three filters |
| | Card surfaces | The card is a visible component offered on record pages; exactly one command opens it, record-selection; its widget sits on the work package Home tab |
| | Viewer | The user id the host gives the card resolves to the signed-in member |
| | Accept, Decline, Request help, Submit | The writes in the table above, with the person's token; Request help leaves owner and status alone and links one task to the work package |
| | Conflict | Accept on a Done work package writes nothing |
| `upgrade.integration-test.ts` | v1 to v2 | Installs 0.3.0 from git (`main` at `0ac8b13d`), writes an opportunity and a work package with it, then syncs this checkout over it without allowing destructive actions. Passes when every v1 universalIdentifier, select option id, field name and field type is still in the v2 manifest; the plan reads "0 to destroy"; the v1 records are unchanged; the new field is writable on them; the v1 sidebar items remain next to Home and Exceptions |

## Status

Unit tests: 101 passing. Typecheck (against both the SDK stub client and the client generated by an install), lint and an offline `appBuild` pass.

Integration: `screens.integration-test.ts` (9 tests) and `upgrade.integration-test.ts` (5 tests) pass against the `twentycrm/twenty-app-dev:v2.47.0` image, the newest published (2.48.0 is not on npm or Docker Hub yet). For that run only, `engines.twenty` was lowered to 2.47.0 in the app and in the v1 copy; re-run unchanged once 2.48.0 is published. The 0.3.0 to 0.4.0 plan read "65 to add, 17 to change, 0 to destroy"; the 17 changes are the rebuilt bundle checksums of the 17 logic functions, nothing else.

`automation.integration-test.ts` on the same instance: 2 of 15 pass. The 13 failures are identical on `main` without these changes: every logic-function run fails with "Authentication failed: GraphQL auth error", so W01 never sets `playbookApplied` and the manual `functionExecute` calls are refused. That suite had not been run against an instance before; it needs its own fix.

## Not built

- **Intake** and the **Home primary action** that opens it. The brief's six tiles and `motion` field do not match the data model: `templates.json` has two opportunity playbooks (RFQ / technical service, Technology licensing) and one project playbook (Industry workshop), the Type field has two options, and there is no `motion` field. Building it means new playbook content (needs the ED's sign-off) and new fields, which is a decision, not an implementation detail.
- **App role.** The app has one application role, used by both the logic functions and the front components (Twenty intersects it with the person's role for components). It cannot grant "exactly the fields the components write" without taking away what W01 to W11 write, so it is unchanged and still grants read and update on all objects.
