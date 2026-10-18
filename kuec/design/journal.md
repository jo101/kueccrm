# Design journal: KUEC CRM, Phase B

The running record of the redesign, kept the IDEO way: what we believed, what we saw, what we changed, with the evidence beside each line. Every weekly review with the ED reads it. Entries are dated and never rewritten; a later entry corrects an earlier one.

## Mindsets we hold ourselves to

| Mindset | What it means on this project | How a review checks it |
| --- | --- | --- |
| Empathy before opinion | No screen is argued from taste. Each decision names the person it serves and the evidence (session note, audit row, measurement) it rests on | "Whose problem, and where did we see it?" |
| Make it tangible early | Working screens on anonymised data before documents; the workbench (`prototype/`) is where ideas are tested, not slides | "Can I click it?" |
| Iterate | Two usability rounds before any screen is built for the pilot; the change log in `test-protocol.md` names the quote that caused each change | "What changed since last week, and why?" |
| Optimism | The quality bar (an experienced Salesforce or HubSpot user says "this is a real CRM"; a first-week BD officer says "I know what to do next") is treated as reachable, and the gap is measured, not debated | "How far from the bar, in numbers?" |
| Embrace ambiguity | Discovery has not run; every persona statement stays marked UNVALIDATED until a named participant confirms it (`research.md`) | "Which assumptions are still open?" |
| Learn from failure | A failed round, a refused write, a red visual test, a NO-GO gate: each is recorded as the cheapest lesson available, never hidden | "What failed this week, and what did it teach?" |
| Creative confidence | Three concepts per key screen before choosing; the chosen one is written up with the desirability, feasibility and viability reasons | "What else did we try?" |

## How-might-we statements

Starting set from the brief, to be ranked after synthesis (`inspiration.md` section 5).

| # | How might we... | Persona | Insight it rests on (status) |
| --- | --- | --- | --- |
| HMW1 | ...let a first-week BD officer close a loop with industry without being told what to do next? | BD officer | Today the card sits under 29 to 42 fields and the status words contradict each other (audit U5, U10). UNVALIDATED with a user |
| HMW2 | ...make the ED's decisions arrive formed rather than as chases? | ED | Blocks reach the ED as notification tasks with no options or consequence (journeys F4, cadence section 3). UNVALIDATED |
| HMW3 | ...let a colleague in another department take a task without learning a CRM? | Technical contributor | Department roles see Accept but the save fails; the entry point is email (audit U2, research 2). UNVALIDATED |
| HMW4 | ...make sure a lead logged on a phone after a site visit is never lost? | BD officer | Lead capture is a 38-field panel; the lead is ownerless (audit U16). UNVALIDATED |
| HMW5 | ...make Arabic-first colleagues feel the product was made for them? | Arabic-first BD officer, ops coordinator | Hijri dates, bilingual stacks that clip at 390 px, 96 of 105 view names in English (audit U6, U17, gate m2). UNVALIDATED |

## Decisions, with the desirability, feasibility and viability reasons

| Date | Decision | Desirability | Feasibility | Viability | Evidence |
| --- | --- | --- | --- | --- | --- |
| 2026-10-18 | Employee experience as a `/crm` route group in uVENTURE; Twenty headless | One shell, one sign-in, one language switch for the whole day | Mantine cannot run inside Twenty's Remote DOM: 0 of 7 spike items pass | No Twenty core change, no Mantine fork | `spike-mantine-in-twenty.md` |
| 2026-10-18 | Standard CRM vocabulary (Home, Leads, Opportunities, Accounts, Contacts, Activities, Tasks, Projects, Dashboards; Qualification to Closed Won; Not Started to Cancelled) replaces the Generation 2 words (Today, Pipeline, Delivery, Insights; Qualify to Signed; Waiting to be accepted) | An experienced CRM user recognises it at first glance; a new officer learns words that transfer to any CRM | API values unchanged; labels only | The glossary stays small and standard; plain explanations move to helper text | Brief part 4; `glossary.md` |
| 2026-10-18 | One semantic status map with four tones (ok, attention, blocked, neutral) shown as a 6 px dot or coloured text, never a filled badge | Status reads in the same place and shape on every screen | One component (`KuecStatus`) reads one map (`kuec-tokens.ts`) | Visual regression and the rule checker fail on any filled badge | Brief part 6; `prototype/src/theme/kuec-tokens.ts` |
| 2026-10-18 | Exactly one filled button per screen: the one thing to do now | Answers "what do I do now" without reading | Cards pass a `primary` flag; the first card of the first section carries it | Asserted on every mockup by the visual test | `tests/visual/screens.spec.ts` |
| 2026-10-18 | Lists on mantine-datatable 8.3.13, not mantine-react-table | Same table everywhere; inherits uVENTURE's `DataTable` conventions | mantine-react-table's latest release (1.3.4) peer-depends on Mantine 6; no Mantine 8 release exists; uVENTURE already ships mantine-datatable | One table library in the host, no fork | `npm view mantine-react-table peerDependencies`, 2026-10-18 |
| 2026-10-18 | Type family IBM Plex Sans with IBM Plex Sans Arabic, weights 400 and 600, loaded through next/font as uVENTURE loads Inter; the variables sit on `<html>` | One family across scripts; Arabic reads at 1.6 line height | The first build put the variables on `<body>` and every screen rendered in a serif fallback, because Mantine resolves its font variable at `:root`. Fixed and asserted by eye on the mockups | No third font, no icon-font | `prototype/src/app/layout.tsx` |
| 2026-10-18 | Two verbs added to the brief's list, pending ED approval: Report blocker (owner, In Progress) and Resume work (owner, Blocked) | A blocked owner needs a way in and a way out without the full record | The Twenty status BLOCKED and `blockedReason` already exist | Both stay out of the pilot until the ED approves the words | `glossary.md` section 6 |
| 2026-10-18 | Links keep uVENTURE's link colour (brand blue) even though the contract says one accent | Lightning, the structural reference, uses blue links; a neutral link reads as text | Inherited from `--uv-content-link-color` | To be tested in usability round one; if links compete with the primary button on a 390 px screen, they go neutral | Mockups `home-*` |
| 2026-10-18 | On phones the chevron stage path keeps only the current stage's label; completed stages keep their check | Five labels do not fit in 390 px without scrolling | CSS only | Same component, no second pattern | `mockups/*--390-*` |

## Log: believed, saw, changed

| Date | We believed | We saw | We changed |
| --- | --- | --- | --- |
| 2026-10-18 | The Generation 2 prototype (Today, Work package card) could be restyled to the new contract | The vocabulary, the status component, the card template and the shell all changed; keeping the old files would have left two visual languages | Rebuilt the workbench on the tokens file; deleted the old components; kept the data, the rules and the failure switch |
| 2026-10-18 | Status should be a light badge, as uVENTURE's `StatusBadge` does it | The brief forbids filled badges; audit U13 measured 4.17 to 4.46 contrast on today's tags | A 6 px dot plus coloured text at shade 6; contrast of the four tones on both schemes is still to be measured (scorecard) |
| 2026-10-18 | A full-page phone screenshot is a fair mockup | Fixed chrome (the bottom bar) rendered mid-page in every full-page capture and the first review read it as a layout bug | The capture pins the bar to the end of the document after the checks have run; the live page is unchanged |
| 2026-10-18 | The fonts loaded | Every screen rendered in a serif fallback | Font variables moved from `<body>` to `<html>`; the Storybook preview loads the same family self-hosted |
| 2026-10-18 | Playwright 1.64 was the right pin | 1.64.1 is four days old and would download a browser this environment forbids | Pinned 1.56.1, the version whose Chromium (1194) is pre-installed, which also satisfies the 14-day rule |

## What failed this week and what it taught

- The first Playwright run passed 0 of 80 because `baseURL` ended in `/crm` and root-relative paths dropped it; every capture was Next's 404 inside our shell. Lesson: a visual test must assert content, not only that a page rendered; the suite now checks the direction attribute, the filled-button count and the first card position, which all fail on a 404.
- The design-rule checker first flagged `fw={600}` as a size and `maxLength={400}` as a height. Lesson: a lint rule needs its own fixtures; a word-boundary fixed it and the rule now explains each named value.

## Open questions for the ED (first weekly review)

1. Approve or replace the two added verbs (Report blocker, Resume work).
2. Lead status "Working" collapses Twenty's Contacted and Engaged into one word on screen. Keep both as sub-states in helper text, or relabel the Twenty options?
3. Stage mapping: Twenty's Meeting becomes Proposal and Twenty's Proposal becomes Negotiation. Confirm, since the Thursday review reads the stage names aloud.
4. Who are the eight discovery participants, and which day is the site-visit immersion?
