# Stage report: KUEC BD Ops UI/UX redesign

Reporting rule from the brief: what was done, what was verified, what remains unresolved, per stage. Nothing below is reported as implemented in uVENTURE; no production system was touched; no test is reported as passing unless it ran.

## Report 1, 2026-10-18: Stage 0 done, Stage 1 requested, Stage 2 foundations drafted, Stage 3 prototype built

### Done

| Step of the brief | Output | Where |
| --- | --- | --- |
| 1 Review the repositories | Read kuec docs, app inventory, tests 22 and 23, runbooks, roadmap; cloned uVENTURE (`kuec-engineering/Uventure`, read-only) and read its theme, providers, shell, auth, roles, feature flags | `diagnosis.md` |
| 2 One-day spike with fixed exit | Spike app applied to a local `twentycrm/twenty:v2.48.0` stack; seven items probed; 0 of 7 pass unmodified; standalone route confirmed; stopped | `spike-mantine-in-twenty.md`, `spike/`, `spike-evidence/` |
| 3 Discovery request | Session request to the ED, discussion guide, top-tasks exercise, card sort and tree test protocol; artefact-derived personas, jobs, moments, pains, baselines, every one marked UNVALIDATED | `research.md` |
| 4 Foundations | IA and navigation map; glossary with provenance; notification matrix with quiet hours and digest; theme inheritance and tokens; component matrix | `ia.md`, `glossary.md`, `notifications.md`, `theme.md`, `components.md` |
| 4 Prototype | Standalone Next.js 15.5.27 + Mantine 8.3.18 prototype of Today (four role variants) and the Work Package card (full action matrix, decision card for the ED), English and Arabic, 390 to 1440 px, anonymised Gulf data, simulated backend failure path | `prototype/`, `prototype-shots/` |
| 5 Test protocol | Six tasks, SEQ, SUS, pass criteria, result sheets, change log | `test-protocol.md` |
| 13 Backlog | Phased backlog with effort, priority, acceptance criteria, dependencies | `redesign-backlog.md` |

### Verified (with how)

- Spike: each item observed in the real 2.48 runtime through Playwright on the host document; errors copied from the console; four screenshots. The failures are properties of the sandbox (no `ResizeObserver`, no `ShadowRoot`, widget-clipped portal layer, container-based `matchMedia`, document attributes set on a polyfilled document), cited to source files in `packages/twenty-front-component-renderer`.
- Prototype build: `next build` clean (type check included). Twelve screenshots captured by `prototype/scripts/screenshots.mjs` with per-shot checks (`prototype-shots/checks.json`): zero console errors on every shot; no horizontal overflow at 390, 768, 1440 px; `dir="rtl"` applied for Arabic; every action at phone width at least 44 px tall; exactly one filled button per card and no competing filled button in the header.
- Principle 15 (nothing shows as done that the backend did not confirm): with the failure switch on, Accept on the offered work package showed "That didn't save. Nothing was changed. Try again.", the status stayed "Waiting to be accepted" and the button re-enabled; with the switch off, Accept moved the status to "In progress", the actions changed to Request help and Submit, and the "What do I do now?" line changed accordingly. Observed through the Playwright MCP on 2026-10-18.
- Dates: Arabic screens render Gregorian dates with Western digits ("الخميس، 22 أكتوبر") and AED amounts through `Intl` with `ar-AE-u-ca-gregory-nu-latn`, which fixes the Hijri defect of audit U6.
- Touch targets: phone action buttons measure 44 px (audit U5 measured 26 px today); the card is the first element under the breadcrumb on every width (audit U5 measured 2,414 px).
- Keyboard: each info icon is one focusable element with `role="img"` and an accessible name, no nested tab stops on `svg` or `path` (audit U12 counted four per icon).

### Not verified (and therefore not claimed)

- No user has seen any of this. Usability rounds: 0 run. Tree test: not run. SEQ, SUS: no data. Every persona statement is UNVALIDATED.
- The prototype is not connected to Twenty; no permission, automation or data behaviour is demonstrated against the real runtime. End-to-end tests as each persona against Twenty: not written (Stage 8 Q1).
- LCP under 2.5 s on 4G: not measured (needs the data layer, D5).
- WCAG 2.2 AA: not audited with a screen reader; contrast of the status colours on uVENTURE's light tints not measured (Q2).
- Arabic copy: every Draft row in `glossary.md` is machine-drafted and awaits a native-speaking BD colleague (R4).
- The Arabic font proposal (IBM Plex Sans Arabic) was not loaded in the prototype; the screenshots use the system Arabic fallback.

### Unresolved and who owns it

| Item | Owner | Blocking |
| --- | --- | --- |
| uVENTURE has no i18n or RTL layer (`UI_SYSTEM.md` claims a `DirectionProvider` that the code does not have) | uVENTURE team | Stage 2 D1; Arabic as a first-class design |
| Feature flags are per tenant and role, not per user | uVENTURE team | Stage 2 D2; "every screen behind a per-user flag" |
| Twenty OAuth client and server-side token store | kuec engineer + uVENTURE + IT (same registrable domain) | Stage 2 D3; any real data in `/crm` |
| Gate 22: 13 blockers, 9 majors open; production not live | kuec engineer, ED, IT | Launch of anything |
| W1 fails on every playbook (B5), retries give up before writing (B6), four duplicate offer tasks (U3), department roles cannot hold work packages (D6) | kuec engineer, ED decision | Stage 3 T4; the card cannot be honest without them |
| Technical contributor and faculty roles do not exist in Twenty | ED decision, `13-roles.md` | Stage 6 V1 |
| Discovery sessions | ED | Stage 1 |
| Where the prototype lives: `kuec/design/prototype` has its own `package.json` and lockfile under `kuec/`, outside the Nx workspace, like `kuec/app`; `kuec/CLAUDE.md` says everything added lives in the one SDK app, which was written for Twenty configuration, not design artefacts. Confirm or move | ED, repo owner | none, but worth a line in `kuec/CLAUDE.md` |

### Decisions taken in this report (not open)

- Architecture per the brief, now with evidence: `/crm` in uVENTURE, Twenty headless plus expert UI. The existing Twenty work package card stays as the expert fallback and is not extended with Mantine.
- Notifications stop being Twenty Tasks except where the event is itself work for a person (lead triage, record a lost reason, request help).
- Status words on employee screens are the plain words of `glossary.md`; the Twenty field keeps its value.

### Next

1. Send `research.md` section 1 to the ED this week; start the two uVENTURE dependencies (D1, D2) and the OAuth client (D3) in parallel.
2. Native review of the glossary (R4), then usability round one on the prototype with five participants (`test-protocol.md`), two rounds before build.
3. Stage 3 build behind `CRM_TODAY` and `CRM_WORK_PACKAGE` once D1 to D5 exist, against Twenty as the person, with the Playwright suite as each persona.

## Report 2, 2026-10-18 (afternoon): Phase B started; foundations and the three screens that set the standard

Scope of the Phase B brief this report covers: the repository review, the inspiration plan, the foundations, and Home, the Task card and the Opportunity record in both directions. Nothing below is reported as implemented in uVENTURE; no production system was touched; no test is reported as passing unless it ran in this session.

### Done

| Part of the brief | Output | Where |
| --- | --- | --- |
| Repository review first | What exists, is partial, is only documented, in `kuec/` and in uVENTURE (re-cloned at 10f6f228); gate 22 blockers kept visible | `repository-review.md` |
| Part 1 method | Mindsets, HMW1 to HMW5, decisions with DFV reasons, believed / saw / changed log, failures and lessons, open questions | `journal.md` |
| Part 1 inspiration | Week-1 plan: extremes and mainstreams, eight sessions, immersion day, artefacts, three analogous fields, same-day download | `inspiration.md` |
| Part 2 design system | Tokens file (`kuec-tokens.ts`), one status map, theme extension on uVENTURE's theme (extend, never fork), IBM Plex Sans + IBM Plex Sans Arabic, Storybook 10.6.1 with locale and scheme globals and the two viewports, 18 patterns each with a story, design-rule checker (raw colours, physical CSS, off-grid sizes, story coverage), Playwright visual regression over eight variants; every package pinned to an exact version at least 14 days old and verified on the registry | `prototype/` |
| Part 3 flows | Navigation state map for the shell and every screen | `flows.md` |
| Part 4 terminology | Glossary rewritten to the standard CRM vocabulary with API values; IA and shell renamed | `glossary.md`, `ia.md`, `prototype/src/i18n/messages.ts` |
| Part 5 screens | Home (greeting, performance strip, three sections with counts, one filled button), Task card (what, why, who, due, expected output, done criteria, plain status, role x status actions, sticky action bar on phones), Opportunity record (header with Account, Amount, Close Date, Stage, Owner; chevron stage path with Mark stage complete; Activity, Details, Related; timeline with composer; right rail with Next Step, key contacts, documents) | `prototype/src/app` |
| Part 6 visual contract | The numbers as tokens and enforced before review (checker and visual test) | `theme.md` section 2 |
| Part 7 Arabic | Mirrored layout, chevrons, breadcrumbs, drawer and arrows; Gregorian dates with Western digits through `Intl` and a derived dayjs locale; `<bdi>` on mixed strings; eight-variant captures | `mockups/*-rtl-*` |
| Part 8 scorecard | Filled for the three screens | `scorecard.md` |
| Part 9 gate | Static mockups at 390 and 1440 in both directions, ready for the ED's five-minute review | `mockups/` |

### Verified (with how)

- `npm run typecheck`, `npm run design-rules`, `npm run build` (Next 15.5.27 production build), `npm run storybook:build` all clean on 2026-10-18.
- `npm run test:visual`: 80 of 80 pass. Each capture also asserts: zero console errors, `dir` and `lang` follow the locale, no horizontal overflow, at most one filled button in the viewport, no all-caps text, no filled badge, every action at least 44 px tall on a phone, the Task card first on its page.
- Storybook static build probed with Playwright: four stories in Arabic and dark render with `dir="rtl"`, IBM Plex Sans, zero errors.
- The refused-write path: with the failure switch on, Accept shows "That didn't save. Nothing was changed. Try again." and the status stays Assigned (behaviour carried over from the Generation 2 store and re-exercised through the new card).

### Not verified (and therefore not claimed)

- No user has seen any of this. Discovery sessions: 0 of 8. Usability rounds: 0. Tree test: not run.
- Not connected to Twenty: no OAuth, no real permissions, no automation; the workbench store stands in.
- Contrast of the four status tones, a keyboard-only pass, a screen-reader pass, LCP and INP: not measured (`scorecard.md`).
- Every Arabic string is a machine draft awaiting a native-speaking BD colleague.
- Skeleton loading states, analytics events and feature flags: not built (the first needs a data layer, the last two need uVENTURE).

### Unresolved and who owns it

| Item | Owner | Blocking |
| --- | --- | --- |
| Gate 22: 13 blockers, 9 majors; B5, B6, U2, U3, M6, U1 touch these screens directly | kuec engineer, ED, IT | Launch of anything |
| uVENTURE i18n and RTL (D1), per-user flags (D2), Twenty OAuth client (D3), data layer (D5) | uVENTURE team, kuec engineer, IT | Any real data in `/crm` |
| Two verbs beyond the brief (Report blocker, Resume work); lead status "Working" over two Twenty values; the Meeting to Proposal and Proposal to Negotiation relabel | ED | Glossary approval |
| Twenty's own Task relabelled Reminders; stage relabels in Settings | kuec engineer (click-runbooks), ED | Expert surface consistency |
| Discovery participants and the immersion day | ED | Week 1 |
| CI for the design rules and visual regression | uVENTURE pipeline owners | Enforcement beyond `npm run verify` |

### Next

1. Send `inspiration.md` and `research.md` section 1 to the ED; name the eight participants and the immersion day.
2. Weekly review one: the mockups, the glossary's open questions, the scorecard.
3. Week 2 per the brief: synthesis; usability round one on Home, the Task card and the Opportunity record; measurements owed in `scorecard.md`.
4. Week 3: New lead (with `KuecCompanyPicker` and `KuecGuidedForm`), Opportunities board (dnd-kit) and list (sorting, column chooser, saved views, inline edit), Accounts and Contacts on the record template.
