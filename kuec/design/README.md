# kuec/design

Design artefacts for the KUEC CRM employee experience. Three generations live here; the newest is Phase B.

**Generation 1 (Twenty front components, 2026-10 until the spike):** `wireframes.md`, `journeys.md`, `backlog.md`. Still valid for the expert surface inside Twenty and for the backend items the new UI depends on.

**Generation 2 (uVENTURE `/crm`, Mantine, Twenty headless; morning of 2026-10-18):** `diagnosis.md`, `spike-mantine-in-twenty.md` with `spike/` and `spike-evidence/`, `research.md`, `notifications.md`, `test-protocol.md`, `redesign-backlog.md`, `prototype-shots/` (the first prototype's screenshots, kept as the record of what the ED was not yet shown).

**Phase B (afternoon of 2026-10-18 onwards): human-centred design the IDEO way, standard CRM vocabulary, the visual contract as tokens.**

| File | What it is |
| --- | --- |
| `journal.md` | The IDEO mindsets, the How-might-we statements, every decision with its desirability, feasibility and viability reasons, the believed / saw / changed log, what failed and what it taught, open questions for the ED |
| `inspiration.md` | Week 1: extremes and mainstreams, eight sessions, the immersion day, artefacts, analogous inspiration from three fields, the same-day download |
| `repository-review.md` | What exists, what is partial, what is only documented, in this repository and in uVENTURE; gate 22 blockers visible |
| `glossary.md` | The Part 4 vocabulary in English and Arabic with the Twenty API value beside each label; Existing or Draft provenance; two verbs pending the ED |
| `ia.md` | Destinations, shell, role landing, navigation map, tree test tasks |
| `flows.md` | The navigation state map: entry points, exits, back, drawer versus page, deep links, keyboard, the rules that hold on every screen |
| `theme.md` | What inherits from uVENTURE, the visual contract as tokens, the status map, Arabic typography, direction and locale |
| `components.md` | Every `Kuec*` pattern, what it composes, where it is used, built or planned; library decisions |
| `scorecard.md` | The Part 8 scorecard filled honestly for Home, the Task card and the Opportunity record |
| `mockups/` | 80 PNG mockups: ten screens x (390, 1440) x (LTR, RTL) x (light, dark). The ED gate artefacts and the Playwright baselines |
| `prototype/` | The design workbench: Next.js 15 + Mantine 8.3.18 on anonymised data; tokens, pattern library, Storybook, visual regression, design-rule checker. Not connected to Twenty |
| `redesign-stage-report.md` | What was done, what was verified, what remains, per report |

Reading order for a newcomer: `journal.md`, `repository-review.md`, `glossary.md`, `flows.md`, then open the workbench.
