# Redesign backlog: phased, with effort, priority and acceptance criteria

Companion to `backlog.md` (the Twenty-side Phase B list B1 to B19, which stays valid for the expert surface and for the backend fixes the new UI depends on). Effort is in engineer-days for one engineer who knows the stack; "pair" means a designer day is needed as well. Priority: P0 blocks the next stage, P1 is in the stage, P2 can slip one stage. Every item names the user problem it solves (evidence) and the measurable benefit it is expected to produce; the benefit is measured in the usability rounds and the pilot metrics, never asserted.

## Stage 0: decision and spike (done 2026-10-18)

| Id | Item | Status |
| --- | --- | --- |
| S0.1 | Compatibility spike, seven items, fixed exit | Done: 0 of 7 pass, standalone route confirmed (`spike-mantine-in-twenty.md`) |
| S0.2 | Current-state diagnosis with evidence | Done (`diagnosis.md`) |

## Stage 1: discovery (week of 2026-10-26), in parallel with foundations

| Id | Item | Effort | Priority | Acceptance | Depends on |
| --- | --- | --- | --- | --- | --- |
| R1 | Eight contextual sessions requested through the ED | 0.5 + sessions | P0 | Eight one-page anonymised notes; baselines in `research.md` section 7 filled | ED |
| R2 | Top-tasks exercise, six people | 0.5 | P0 | Ranked list replaces `research.md` section 4 | R1 |
| R3 | Card sort and tree test, six people, Arabic separately | 1 pair | P0 | First-click success per task recorded; destinations renamed where the team's words win; `ia.md` and `glossary.md` updated with the quote that caused each change | R1 |
| R4 | Native-speaker review of every Draft row in `glossary.md` | 0.5 (BD colleague) | P0 | No Draft row left before usability round one | none |

## Stage 2: foundations (dependencies on uVENTURE first)

| Id | Item | Effort | Priority | Acceptance | Depends on |
| --- | --- | --- | --- | --- | --- |
| D1 | uVENTURE locale per user, `DirectionProvider`, message catalog, Arabic font stack (`theme.md` section 4) | 4 (uVENTURE, lane A + K01/K06 owners) | P0 | A user switches to Arabic from More; `<html dir lang>` change; Mantine RTL styles apply; existing uVENTURE screens unaffected (Playwright) | uVENTURE team agreement |
| D2 | Per-user feature flag override on top of the tenant catalog (`featureCatalog.ts`), keys `CRM_TODAY`, `CRM_WORK_PACKAGE`, `CRM_LOG`, `CRM_PIPELINE`, `CRM_ACCOUNTS`, `CRM_DELIVERY`, `CRM_INSIGHTS` | 2 | P0 | Flag on for one user shows the route; off hides nav and blocks the route (`canRoleAccessPath`) | uVENTURE |
| D3 | Twenty OAuth client for uVENTURE: registration, authorization-code with PKCE, refresh, server-side token store per user, revoke on sign-out; every `/crm` read and write as the signed-in person | 4 | P0 | A BD officer sees only what their Twenty role allows (role test from `tests/release-gate/rehearsal/permissions.mjs` rerun through `/crm`); the automation key is never used by `/crm`; token never reaches the browser | Twenty 2.48 `application-oauth`; same registrable domain; IT |
| D4 | `/crm` route group skeleton: shell additions (destination tabs, Log, bell, bottom bar), `Kuec*` patterns from `components.md`, theme extension from `theme.md`, analytics events, feedback button | 5 pair | P0 | Storybook-free: each pattern has a Playwright visual test at 390 and 1440 in both languages; one filled button per screen asserted | D1, D2 |
| D5 | Data layer: typed read models over Twenty GraphQL (work packages mine, opportunities mine, decisions, exceptions), polling with ETag, never push | 4 | P0 | Today loads under 2.5 s LCP on a throttled 4G profile with 40 open opportunities and 750 work packages (the gate 22 load set) | D3 |
| N1 | Notifications: retire task-as-notification in `notify.ts`; in-app sink to uVENTURE through the signed route; quiet hours; Thursday digest; one message per transition (`notifications.md`) | 5 | P0 | Fixed-clock tests: one entry per transition after three retries (fixes audit U3); nothing sent 20:00 to 07:00 except escalations; digest at Thursday 08:00 Gulf | kuec app, backlog B5 and B10 |
| F4 | Admin clears Twenty onboarding before first sign-in; step added to `runbooks/01-deploy.md` section 4 | 0.25 | P0 | A new member lands on `/crm` without seeing "Invite your team" (verified on staging) | none |

## Phase B (2026-10-18 onwards): what this brief adds or changes

Vocabulary per `glossary.md`: Today is Home, Pipeline is Opportunities, Delivery is Tasks and Projects, Insights is Dashboards, the Work Package card is the Task card. The stage ids below keep their names; the screens they produce follow the Phase B templates (`flows.md`, `components.md`).

| Id | Item | Effort | Priority | Acceptance | Status |
| --- | --- | --- | --- | --- | --- |
| F1 | Tokens, status map, theme extension, Plex type family | done | P0 | `design-rules` clean; mockups in both scripts | Done 2026-10-18 (`prototype/src/theme`) |
| F2 | Storybook with locale and scheme globals, a story per pattern | done | P0 | `storybook:build` clean; probe in Arabic and dark | Done 2026-10-18 |
| F3 | Design-rule checker and Playwright visual regression over the eight variants | done | P0 | `npm run verify` green locally | Done 2026-10-18; CI is uVENTURE's (open) |
| F4b | List template on mantine-datatable: sorting, column chooser, saved views, inline edit, virtualised rows | 3 | P1 | Opportunities list passes the eight variants | Week 3 |
| F5 | `KuecCompanyPicker`, `KuecGuidedForm` | 2 pair | P1 | New lead under 90 s on a phone (round) | Week 3 |
| F6 | Accessibility measurements: contrast of the four tones, keyboard and screen-reader passes | 1 per screen | P0 | `scorecard.md` rows turn Yes | Week 2 |

## Stage 3: Today and the Work Package card (Phase B: Home and the Task card)

| Id | Item | Effort | Priority | Acceptance | Evidence it answers | Expected benefit |
| --- | --- | --- | --- | --- | --- | --- |
| T1 | Today per role (BD officer, ED, ops coordinator, technical contributor) | 6 pair | P0 | Usability round pass (80 percent, SEQ 5.5) on tasks 3 and 6; at most six facts per card; role landing per `ia.md` section 3; EN and AR; 390 px; WCAG 2.2 AA; flag `CRM_TODAY` | audit U4, U20, journeys F1, F2 | Manager interventions per week down; time to find what is blocked under 45 s |
| T2 | Work Package card with the full action matrix (Accept, Decline, Request help, Submit with output link, Resolve blocker; Approve, Send back; Reassign) and deep link from notifications | 6 | P0 | Round pass on task 2 (under 30 s from the notification); writes through the same transitions as the Twenty card; a refused write shows the failure and changes nothing; flag `CRM_WORK_PACKAGE` | audit U2, U5, U9, U10, U12, U13, U25 | Share of work packages accepted within 2 days up |
| T3 | Decision card for the ED and ops coordinator, Decide later with a date | 3 pair | P1 | ED distinguishes routine from commercial on sight (round task added); deferral returns the card on the date | journeys "must never have to" (ED) | Decisions pending count visible and falling |
| T4 | Backend prerequisites from the Twenty side: W1 finishing (gate B5), retries writing before notifying (B6), reviewer Approve and next-step offer (B1), department roles allowed to hold work packages (D6) | per `backlog.md` | P0 | Gate 22 B5 and B6 closed on staging; `t2-t3` and `t5` acceptance tests green | gate 22 | None of T1 to T3 can be honest without them |

## Stage 4: Log a lead and Opportunity detail

| Id | Item | Effort | Priority | Acceptance |
| --- | --- | --- | --- | --- |
| L1 | Guided lead capture (contact, company, need, source, referred by defaults to me, optional deadline or link; search before create; one Save; automation does the rest) | 6 pair | P0 | Round pass on task 1 under 90 s; duplicate search hits an existing person by email and company by domain; the lead has an owner on save (fixes U8, U16); phone-first, flag `CRM_LOG` |
| O1 | Opportunity detail in the fixed order (identity and commercial summary; stage and progress; next action; current work plan; risks and blockers; stakeholders; communications and documents; details; audit trail) | 7 pair | P0 | Round pass on task 4 under 60 s; next action visible without scrolling at 390 px; system metadata behind "Details" |

## Stage 5: Pipeline, Exceptions, Decision cards

| Id | Item | Effort | Priority | Acceptance |
| --- | --- | --- | --- | --- |
| P1 | Pipeline kanban and list with the agreed stages; Lead inbox first tab for the ops coordinator | 6 pair | P1 | Stage relabel click-runbook done (gate P3); semantic colour only; tree test task 8 passes |
| E1 | Exceptions as resolution cards (problem, consequence, owner, urgency, available resolution) in Today and Delivery | 3 | P1 | Replaces the three Exceptions tables for flagged users |

## Stage 6: Accounts and Delivery

| Id | Item | Effort | Priority | Acceptance |
| --- | --- | --- | --- | --- |
| A1 | Company page: who we know and roles, what is open, what happened last, what is next, relationship owner, contracts and documents | 6 pair | P1 | Round pass on task 5 under 45 s; no logo or avatar service |
| V1 | Delivery: active work, reviews, blocked, milestones; technical contributor finishes without CRM administration | 6 pair | P1 | A faculty contributor (new persona, role to be created per `13-roles.md`) completes accept and submit without help |

## Stage 7: Insights

| Id | Item | Effort | Priority | Acceptance |
| --- | --- | --- | --- | --- |
| I1 | Insights with `@mantine/charts`: each chart answers a named question and links to its list | 6 pair | P2 | Usability pass; the Twenty BD Executive dashboard stays the ED's view until then |

## Stage 8: quality and adoption

| Id | Item | Effort | Priority | Acceptance |
| --- | --- | --- | --- | --- |
| Q1 | Playwright as each persona against the real Twenty runtime, visual regression at 390 and 1440, EN and AR | 4 | P0 | Green in CI (which lives in uVENTURE's pipeline; `kuec/CLAUDE.md` forbids `.github` changes here) |
| Q2 | Accessibility audit per screen (keyboard, screen reader, contrast, focus, reduced motion) | 2 per screen | P0 | WCAG 2.2 AA with no unexplained failure |
| Q3 | Pilot metrics: leads per week, median time to log, share accepted within 2 days, manager interventions per week, daily active users; weekly 30-minute retro; feedback button triage | 1 + weekly | P0 | Same metrics as the quarterly review (`roadmap/2027-q1.md`) with before and after filled |

## Not in scope, by rule

Twenty core changes, Mantine forks, side tables for CRM data, a second notification store of record, push channels, logo and avatar services, production deploys, destructive migrations.
