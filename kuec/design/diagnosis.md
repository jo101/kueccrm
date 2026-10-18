# Current-state diagnosis: KUEC BD Ops employee experience

Written 2026-10-18 against `main` 6dfde0e8 (kuec-bd-ops 0.11.0, Twenty 2.48.0) and the uVENTURE repository `kuec-engineering/Uventure` at 10f6f228 (read-only clone). Every statement below names its evidence. Nothing here was observed with a real user; see `research.md` for what still has to be validated with the team.

## 1. What exists today

### 1.1 In Twenty (the system of record and automation engine)

| Layer | State | Evidence |
| --- | --- | --- |
| Data model | 11 objects, 234 fields, 47 select fields with 396 options, additive manifest, UUIDs fixed | `tests/22-release-gate.md` lines 84 to 110 |
| Views | 130 views; 118 at most six columns; about 70 views across eight objects visible to a BD officer | gate 22 line 92; `design/journeys.md` F2 |
| Automation | 42 logic functions (10 cron, 3 server routes): W1 to W12 work package and escalation rules, L1 to L6 lead rules, U1 to U7 uVENTURE feed, hourly sweeps | gate 22 line 99; `runbooks/04-automation.md`, `runbooks/19-leads.md`, `runbooks/21-uventure-readiness.md` |
| Roles | 13 roles: ED, ops coordinator, BD officer, engineer, leadership viewer, five department roles, uVENTURE reader, automation, function role; one role per member; no row-level permissions | `runbooks/13-roles.md` lines 32 to 44, 119 |
| Pages | Home, Exceptions, BD dashboard (Executive, Team, Mine, three packs), Data quality, uVENTURE (three iframe tabs); all built from Twenty table, chart and rich-text widgets | `app/src/page-layouts`, `app/src/page-layout-tabs` |
| Front components | One of four specified: the work package card, rendered after the Fields widget on the work package record page | `tests/23-ux-audit.md` lines 701, 720 to 722 |
| Guidance | Five-line "How this works" text on 28 screens, English then Arabic in one body | `runbooks/20-guidance.md` lines 36, 78 to 80, 181 to 505 |
| Notifications | Every notification is a Twenty Task assigned to the recipient, plus plain-text email and a Teams line; Twenty 2.48 has no notification centre | `runbooks/12-global-features.md` lines 225 to 245; `config/dashboards/sidebar.md` line 23 |
| OAuth provider | Twenty 2.48 exposes an OAuth 2.1 authorization server: dynamic registration, `authorization_code` with PKCE S256, `refresh_token`, `client_credentials`, revoke and introspect | `packages/twenty-server/src/engine/core-modules/application/application-oauth/controllers/*.ts` |
| Release state | Gate 22 NO-GO: 13 blockers and 9 majors open; production not live; `twentycrm/twenty:v2.48.0` not yet published to staging | `tests/22-release-gate.md` lines 1 to 28; `roadmap/2027-q1.md` line 15 |

### 1.2 In uVENTURE (the host for the employee experience)

| Fact | Evidence |
| --- | --- |
| Next.js 15 App Router, React 19, TypeScript strict, Mantine 8.3.18 (core, hooks, dates, form, charts, modals, notifications, spotlight, nprogress, tiptap), Tabler icons, Drizzle, PostgreSQL, Vitest, Playwright | `package.json`, `AGENTS.md` "Current Stack" |
| Theme: `brand` blue tuple (#4071F4 at shade 6), `dark`, `success`, `info`, `warning`, `error`; Inter; `defaultRadius: 'md'`; `respectReducedMotion: true`; `autoContrast: true`; component defaults for Button, Card, inputs, Badge, Modal, Drawer, Tooltip, Alert, Notification, Skeleton; semantic `--uv-*` CSS variables resolved per colour scheme | `src/theme.ts` |
| Providers: `MantineProvider` with `defaultColorScheme="auto"`, `ModalsProvider`, `Notifications`; light-only paths forced via `isLightOnlyPath` | `src/app/providers.tsx` |
| Shell: `AppShell` with 248 px navbar, header with `Burger` below 48em, `NavLink` items declared in `src/lib/rbac/navigation.ts` with `featureKey`, `section`, pinned versus "More" | `src/components/layout/AppShell.tsx` lines 700, 798, 1259 to 1600; `src/lib/rbac/navigation.ts` |
| Auth: JWT in an `access_token` cookie, verified in the route handler (`getAuthContext`), roles RESEARCHER, TTO_OFFICER, BD_INVESTMENT_OFFICER, INVESTOR, INDUSTRY_PARTNER, EXPERT, PROGRAMME_MANAGER, TENANT_ADMIN, SUPER_ADMIN; Microsoft Entra sign-in per the kuec readiness runbook | `src/lib/auth.ts`; `src/lib/rbac/routeAccess.ts` lines 2 to 11; `kuec/runbooks/21-uventure-readiness.md` line 134 |
| Feature flags: per-tenant catalog resolved per role, gating both navigation and route access; no per-user flag today | `src/lib/featureCatalog.ts`; `src/lib/rbac/routeAccess.ts` lines 33 to 48 |
| Existing BD surfaces: `/bd/inbox`, `/bd/investor-inbox`, `/bd/industry-enquiries`, `/bd/challenges`, `/bd/programme-responses`, `/deals`, `/kuec/gala` | `src/app/(dashboard)/bd`, `src/app/(dashboard)/kuec` |
| Shared patterns: `PageHeader`, `EmptyState`, `StatCard`, `StatusBadge`, `HelpTooltip`, `FieldLabelWithInfo`, `NotificationBell`, `CommandPalette`, `DataTable`, `ConfirmModal`, central copy in `src/lib/messages.ts` | `src/components/common` |
| **No internationalisation and no RTL.** No i18n library, no locale routing, no `DirectionProvider` in `src/app/layout.tsx` or `providers.tsx`; `UI_SYSTEM.md` section 1 claims a `DirectionProvider` that the code does not have; root `<html lang="en">`; Inter loaded with the `latin` subset only | grep of `src` for `DirectionProvider`, `i18n`, `useTranslation`, `next-intl`, `lingui` returns nothing; `src/app/layout.tsx` |
| **No Twenty integration code.** The only CRM mentions are marketing copy and a generic "connect a CRM" integrations form | grep of `src` for `twenty`, `kueccrm` |
| Governance: lanes (visual work to Amoudi, functional to Syed), KEZAD dependency manifest, `tto-fixes` integration branch, UI_SYSTEM.md must be updated with any new pattern | `AGENTS.md` "Page Change Routing" |

## 2. What the employee sees today, and why it is wrong

Evidence is the UX audit of 2026-10-17 (`tests/23-ux-audit.md`, 925 checks: 652 pass, 207 fail) and the gate 22 screenshots. Each row maps a symptom to the experience principle it breaks (numbers refer to section 4 of the brief).

| Symptom | Evidence | Principle broken |
| --- | --- | --- |
| Record pages open on a field wall: 29 to 42 fields (work package 29, lead 42, opportunity 38); app fields grouped under "System" below Twenty's own | `tests/ux-audit/evidence/fields.txt`; gate M4, `ui-20-opportunity-record.png`, `ui-21-work-package-record.png` | 3 progressive disclosure, 4 context before structure, 9 at most six facts above the fold |
| The one action card sits after the fields: at 390 px the Submit button is at 2,414 px with 26 px high buttons | audit U5, `phone.json` | 1 action before information, 11 capture anywhere |
| Two status vocabularies: badge says "Waiting to be accepted", the field says "Offered" | audit U10 | 6 consistent terminology |
| Arabic dates render in the Hijri calendar | audit U6, `ux-16-arabic-card-hijri-date.png` | 14 Arabic first-class |
| Guidance is a bilingual stack (five English lines then five Arabic) in every widget; it clips Arabic at 390 px | `runbooks/20-guidance.md` line 80; audit U17 | 14 one language at a time |
| Sidebar: 18 app entries plus Twenty's 5 to 7 under Help; Companies and People appear twice; "BD Executive" opens the whole dashboard | audit U20, `ux-02-home.png` | 5 role-specific, 9 low cognitive load |
| Notifications are Tasks that never close; one offer produced four "Accept or decline" tasks | audit U3, U4; journeys F4 | 12 notification is never a task |
| Home is three tables: "Needs your decision" shows everyone's blocks | audit U4; `home.page-layout-tab.ts` | 1, 5 |
| Lead capture is a 38-field side panel; Company and Person come after about 30 fields; the new lead is ownerless | audit U16, `lead-create.json` | 11 capture under 90 s |
| Department roles see Accept but the save fails with "Try again" | audit U2 | 8 clear feedback, 15 nothing shows done unless confirmed |
| Reviewers cannot approve from the card; blocking needs the full record | audit U9; `runbooks/10-cadence-en.md` line 81 | 1, 2 one primary action |
| Contrast: secondary text 2.78:1, Done badge 4.44:1 | audit U13, `contrast.json` | 10 accessibility |
| Keyboard: focus stays on body when a form opens, Enter and Escape inert, 4 extra tab stops per info icon | audit U12, `card-keys.json` | 10 |
| First sign-in blocks on Twenty's "Invite your team" | audit U1 | 8 (first run) |
| Help links to a SharePoint page that does not exist | gate M6 | 8 recovery |

Volume behind the symptoms (`design/backlog.md` lines 33 to 44): 4 BD officers, 3 engineers, about 40 open opportunities, 90 work package transitions a week, 60 notification tasks a week, and an estimated 1,400 minutes a week (23 hours) lost to friction. These are authored estimates, not measurements.

## 3. What is documented but not built

| Item | Documented in | Built? |
| --- | --- | --- |
| Today page as cards with one primary action | `design/wireframes.md` lines 216 to 494 | No. Home is three table widgets (`home.page-layout-tab.ts`) |
| Guided intake "New request" with tiles and plan preview | wireframes lines 498 to 694 | No (backlog B4) |
| Work package card first on every surface, reviewer Approve and Send back, Reassign | wireframes lines 698 to 1050 | Partial: Accept, Decline, Request help, Submit only; card after Fields |
| Exceptions as resolution cards | wireframes lines 1054 to 1157 | No. Three editable tables |
| Team board, Project room, Company 360, My week, Portfolio, Debrief | journeys section 11 | No (B6, B7, B9, B13, B17, B18) |
| Arabic labels for views, widgets, tabs, sidebar | gate minor m2: 96 of 105 view names missing Arabic | No |
| Notification quiet hours, digests, channel matrix per event | Not documented anywhere in `kuec/` | No |
| Twenty onboarding step cleared by the admin | Not in `runbooks/10-onboarding.md`; proposed in audit U1 fix row | No |
| uVENTURE embeds of Twenty views (pipeline, leads, dashboard, my work) | `runbooks/21-uventure-readiness.md` lines 82 to 113 | No code in uVENTURE |
| Technical contributor and faculty roles | Named in the brief | Do not exist; faculty appear only as People (`runbooks/19-leads.md` lines 30, 89). Playbook roles (Developer, Legal, Data analyst) are assignments, not Twenty roles (`13-roles.md` line 175) |

## 4. What must be preserved

- Data model, UUIDs, select values: additive only (`kuec/CLAUDE.md` section 2). The redesign adds no field outside the manifest.
- Automation: W1 to W12, L1 to L6, U1 to U7 and the sweeps are the business rules. The new UI calls the same transitions the card calls today (`work-package-card-api.ts`), never a side path.
- Permissions: object and field level through Twenty roles; the UI shows only what the signed-in person's Twenty role allows, which is why data access must be as the person (OAuth authorization-code against Twenty's provider), never through the automation key.
- Gate 22 blockers B1 to B13 and majors M1 to M9 stay visible in every stage report until closed on staging. Nothing in this design clears them; several (B5 W1 failing, B6 retries, U3 duplicate tasks) are the backend half of screens this design specifies.

## 5. Dependencies this design cannot resolve alone

| Dependency | Owner | Why it matters |
| --- | --- | --- |
| uVENTURE has no i18n or RTL layer | uVENTURE team (lane A for visuals, shared providers K01/K06 for the provider) | Arabic as a first-class design needs a locale per user, `DirectionProvider`, an Arabic font stack and message catalogs. The brief says "use uVENTURE's i18n"; there is none to use. Proposal in `theme.md` section 4 |
| Per-user feature flags | uVENTURE | Flags today are per tenant and role. "Every screen ships behind a per-user flag" needs a user-level override (proposal in `redesign-backlog.md` F2) |
| Twenty OAuth client for uVENTURE and server-side token store | kuec engineer + uVENTURE | Needed before any `/crm` screen reads real data as the person |
| Same registrable domain (`crm.uventure.<domain>`) and Microsoft sign-in on both | IT | Already in `21-uventure-readiness.md`; unchanged |
| Gate 22 blockers | kuec engineer, ED, IT | Launch-blocking regardless of UI |
| Discovery sessions | ED | Eight sessions requested in `research.md`; until then every persona statement is unvalidated |

## 6. Architecture decision confirmed by evidence

The brief fixes the decision: employee experience as a `/crm` route group in uVENTURE; Twenty headless plus expert UI. The spike (`spike-mantine-in-twenty.md`) records the runtime evidence for the Twenty front-component sandbox. Independent of the spike, two facts already rule out Twenty front components as the employee UI:

1. A front component is a widget inside Twenty's record page or standalone page; it cannot replace Twenty's sidebar, header, search or record pages, which is where the audit's field walls, duplicate sidebar entries and onboarding blocker live (audit U5, U20, U1).
2. Front components cannot register routes, so a phone-first "Log" action, deep links from notifications, or a bottom bar are outside their reach; the shipped card already needs a `FallbackLink` "Open full record" that on the record page links to itself (audit line 710).
