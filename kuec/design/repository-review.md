# Repository review for Phase B

Written 2026-10-18 against `jo101/kueccrm` at `3d52bb4f` (kuec-bd-ops 0.11.0, Twenty 2.48.0) and `kuec-engineering/uventure` at `10f6f228` (read-only clone, cloned again today). It records what exists, what is partial and what is only documented, so that no screen is reported as built when it is not. Gate 22 stays open and blocks launch regardless of anything in this file.

## 1. Launch blockers that no design work clears

`tests/22-release-gate.md` is **NO-GO**: 13 Blockers (B1 to B13) and 9 Majors (M1 to M9) open; neither staging nor production exists; `tests/23-ux-audit.md` adds 10 Majors and 15 Minors and reports **not ready to invite users**. Nothing in Phase B closes them. The ones that the three screens of this week depend on directly:

| Gate item | Why the new screens need it |
| --- | --- |
| B5 W1 fails on every opportunity playbook | The Task card's "Assigned" state never happens for the first step of a playbook; "Mark stage complete" starts playbook tasks that today are never offered |
| B6 retries give up before writing | The Task card promises "a backend failure is never shown as success"; the backend must also finish the write before it notifies |
| Audit U2 department roles cannot change work packages (decision D6) | A technical contributor on the Commercialization role cannot Accept; the card would show an action the role cannot complete |
| Audit U3 four duplicate offer tasks | The notification deep link `/crm/tasks/:id?from=notification` assumes one notification per event |
| Gate M6 Help link, audit U1 "Invite your team" | First run and Help in the shell point at pages that do not exist |

## 2. What exists

### 2.1 In this repository, `kuec/`

| Area | State | Evidence |
| --- | --- | --- |
| Data model | 11 objects, 234 fields, additive manifest | `app/src/objects`, `app/src/fields`; gate 22 section 1 |
| Automation | 42 logic functions: W1 to W12, L1 to L6, U1 to U7, sweeps | `app/src/logic-functions` |
| Roles | 13; one per member; object and field level | `app/src/roles`, `runbooks/13-roles.md` |
| Work package card (Twenty front component) | Built: Accept, Decline, Request help, Submit; stays as the expert-surface fallback | `app/src/front-components/work-package-card*` |
| Guidance texts | Five lines per screen, English and Arabic, 28 screens; field and option descriptions complete | `app/src/i18n/guidance.json`, `fields.json`, `options.json` |
| Taxonomy | 18 KUEC-wide lists, bilingual, shared with uVENTURE | `playbooks/lookups.json` |
| Generation 1 design | Wireframes, journeys, backlog B1 to B19 for Twenty front components | `design/wireframes.md`, `journeys.md`, `backlog.md` |
| Generation 2 design (2026-10-18, morning) | Diagnosis, spike (0 of 7), research plan, IA, glossary, notifications, theme, components, test protocol, redesign backlog, stage report, a Next.js prototype of Today and the Work package card | `design/*.md`, `design/prototype` |
| Phase B workbench (this review's session) | Tokens, status map, Plex type family, pattern library with a story each, Home, Task card and Opportunity record in both directions, visual regression over eight variants, design-rule checker | `design/prototype`, `design/mockups`, `scorecard.md` |

### 2.2 In uVENTURE

| Area | State | Evidence |
| --- | --- | --- |
| Stack | Next.js 15.5.27, React 19, Mantine 8.3.18 (core, hooks, dates, form, charts, modals, notifications, spotlight, nprogress, tiptap), Tabler icons, mantine-datatable, Drizzle, Vitest, Playwright | `package.json` |
| Theme | `src/theme.ts`: brand tuple, dark tuple, success, info, warning, error; Inter; radius md 8 px; component defaults; `--uv-*` semantic variables per scheme | `src/theme.ts` (copied verbatim to `prototype/src/theme/uventure-theme.ts`) |
| Providers | `MantineProvider` (auto scheme, light forced on public routes) > `ModalsProvider` > `Notifications`; **no `DirectionProvider`** despite `UI_SYSTEM.md` section 1 claiming one | `src/app/providers.tsx`, `src/app/layout.tsx` |
| Shell | `AppShell` with 248 px navbar, header 60 to 68 px, `Burger` below `sm`; navigation per role in `src/lib/rbac/navigation.ts`; route policies in `routeAccess.ts`; feature flags per tenant and role in `featureCatalog.ts` | `src/components/layout/AppShell.tsx` (1,604 lines) |
| Auth | JWT in an `access_token` cookie; nine roles (RESEARCHER, TTO_OFFICER, BD_INVESTMENT_OFFICER, INVESTOR, INDUSTRY_PARTNER, EXPERT, PROGRAMME_MANAGER, TENANT_ADMIN, SUPER_ADMIN); Microsoft Entra per the readiness runbook | `src/lib/auth.ts`, `src/lib/rbac/routeAccess.ts` |
| Shared components | `PageHeader`, `EmptyState`, `StatCard`, `StatusBadge`, `HelpTooltip`, `FieldLabelWithInfo`, `DataTable`, `CommandPalette`, `NotificationBell`, `ConfirmModal`; copy in `src/lib/messages.ts` | `src/components/common` |
| Tests and CI | Vitest; Playwright smoke suites against a production build only; `npm run verify` chain; **no Storybook, no visual regression, no stylelint**; ESLint is `next/core-web-vitals` only | `package.json`, `eslint.config.mjs`, `playwright.config.ts` |
| Internationalisation | **None.** No i18n library, no locale per user, `<html lang="en">`, Inter with the `latin` subset | grep of `src` |
| Twenty integration | **None** in code | grep of `src` |
| Governance | Visual work is lane A (Amoudi); shared providers K01/K06 are Syed's; `UI_SYSTEM.md` must be updated with any new pattern; branches integrate through `tto-fixes` | `AGENTS.md` |

## 3. What is partial

| Item | What exists | What is missing |
| --- | --- | --- |
| The three screens of this week | Built in the workbench on anonymised data, eight variants each, checks green | Not connected to Twenty; no OAuth; no real permissions; no usability round; contrast and screen-reader passes not run (`scorecard.md`) |
| Pattern library | 18 of the brief's patterns with stories: PageHeader, RecordHeader, StagePath, SectionHeader, ActionCard, OpportunityCard, TaskCard, DecisionCard, Status, NextStep, MetricStrip, EmptyState, PersonPicker, ContextPanel, ListView, Drawer, plus Timeline and Composer | CompanyPicker and GuidedForm (week 3, New lead); ListView sorting, column chooser, saved views, inline edit and virtualised rows (week 3, Opportunities list) |
| Lint rules | A rule checker for raw colours, physical CSS properties, off-grid sizes and story coverage, run in `npm run verify` | It is not in any CI: `kuec/CLAUDE.md` forbids `.github` changes here and the production pipeline is uVENTURE's |
| Visual regression | Playwright over 10 screens x 8 variants with structural checks | Runs locally against a production build; the baselines are the mockups; no CI |
| Storybook | 10.6.1 with locale and scheme globals and the two viewports; every pattern has a story; the static build is verified to render Arabic, dark and Plex | No story-level visual regression; no accessibility addon yet |
| Arabic | Every string has an Arabic draft; dates are Gregorian with Western digits; layout mirrors; directional icons mirror | Every Arabic string is machine-drafted and marked Draft until a native-speaking BD colleague approves it |
| Glossary | Part 4 vocabulary in English and Arabic with the Twenty API value beside each label | Native review; two verbs added beyond the brief await the ED |
| Notifications | Matrix per event, quiet hours and digest specified (`notifications.md`) | Nothing built; `notify.ts` still creates Twenty Tasks |
| First run | Specified (role-based welcome, three-step tour, day-one checklist in-app) | Nothing built |

## 4. What is only documented

| Item | Where | Owner to make it real |
| --- | --- | --- |
| uVENTURE `DirectionProvider`, locale per user, message catalog, Arabic font stack | `theme.md` section 4; `redesign-backlog.md` D1 | uVENTURE team (lane A, K01/K06) |
| Per-user feature flags `CRM_*` | `redesign-backlog.md` D2 | uVENTURE team |
| Twenty OAuth client for uVENTURE and server-side token store | `redesign-backlog.md` D3; Twenty 2.48 `application-oauth` | kuec engineer, uVENTURE, IT |
| Data layer over Twenty GraphQL as the signed-in person | `redesign-backlog.md` D5 | kuec engineer |
| Discovery sessions, top tasks, card sort, tree test | `research.md`, `inspiration.md` | ED (participants), design |
| Usability rounds | `test-protocol.md` | design, five participants per round |
| Twenty's own Task relabelled "Reminders" and kept off employee screens | Brief part 4; needs a click-runbook since Task is a standard object | kuec engineer, ED |
| Stage relabels in Twenty (Qualification to Closed Won) | `config/dashboards/opportunity-stages.md` covers only Signed, Lost, Parked | kuec engineer (click-runbook), ED |

## 5. Dependencies this design cannot resolve alone

Unchanged from `diagnosis.md` section 5: uVENTURE i18n and RTL (D1), per-user flags (D2), the OAuth client (D3), the same registrable domain and Microsoft sign-in on both (IT), gate 22, and the discovery sessions. Each is named in the stage report with its owner.
