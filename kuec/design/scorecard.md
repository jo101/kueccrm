# Quality bar scorecard

Filled for every screen before it is shown to the ED (brief part 8). Fewer than all items means the screen is not shown. "Yes" means verified and says how; "No" means not done; nothing is claimed from intent. Date of this fill: 2026-10-18, against the workbench at this commit.

## Status of the three screens

| Item | Home | Task card | Opportunity record | How verified, or why not |
| --- | --- | --- | --- | --- |
| 8 px grid alignment | Yes | Yes | Yes | Spacing from `kuec-tokens.ts` only; `npm run design-rules` fails on an off-grid size |
| Tokens only | Yes | Yes | Yes | No raw colour outside the copied uVENTURE theme (`design-rules`) |
| One accent | Yes | Yes | Yes | At most one filled button in the viewport on all 8 variants (visual test); links keep uVENTURE's link colour, noted in `journal.md` |
| Icon weight consistent | Yes | Yes | Yes | Tabler icons at the default 2 px stroke everywhere; no other icon set imported |
| Typography scale respected | Yes | Yes | Yes | 13, 14, 15, 20, 24 px and two weights from the theme; no all-caps (visual test) |
| Copy in the glossary voice | Partial | Partial | Partial | English follows `glossary.md`; every Arabic string is a Draft awaiting a native-speaking BD colleague |
| Empty, loading, error states present | Partial | Partial | Partial | Empty states and the refused-write path built and seen (failure switch); skeletons not yet built because the workbench has no latency on reads |
| Optimistic updates with undo where reversible | Partial | No | Partial | Set Next Step has Undo in its toast; task transitions are not undone (they notify people); no optimistic rendering yet, writes wait for the store |
| No layout shift | Not measured | Not measured | Not measured | Needs the data layer (D5) to measure CLS on real loads |
| Keyboard operable | Partial | Partial | Partial | One tab stop per control and focusable info icons by construction; a full keyboard-only pass of the six tasks is not run |
| WCAG 2.2 AA | No | No | No | Contrast of the four status tones on both schemes and a screen-reader pass are not measured yet |
| LCP under 2.5 s and INP under 200 ms on a 4G phone | Not measured | Not measured | Not measured | Needs the data layer (D5) |
| Storybook coverage 100 percent | Yes | Yes | Yes | 18 of 18 patterns have a story (`design-rules`); static build renders Arabic and dark (probe 2026-10-18) |
| Visual regression green in all eight variants | Yes | Yes | Yes | 80 of 80 captures and checks pass (`npm run test:visual`), baselines in `mockups/` |
| Usability pass (five users, 80 percent unaided, SEQ at least 5.5) | No | No | No | No round run; discovery not started |
| Analytics events present | No | No | No | Not built; uVENTURE's event conventions to be followed in the route group |
| Feature flag present | No | No | No | Per-user flags do not exist in uVENTURE (D2) |

**Verdict:** none of the three screens is ready for the ED gate as a built screen. All three are ready as **static mockups at 390 and 1440 px in both directions** (`mockups/`), which is the first step of the per-screen gate in brief part 9. The ED's five-minute review is on the mockups; the build is shown only after a usability round.

## What is in `mockups/`

80 PNG files named `<screen>--<width>-<direction>-<scheme>.png`: ten screens (Home for four roles; the Task card assigned, pending review and blocked; the Opportunity record as owner, with a missing Next Step and read-only) in the eight variants. They are also the Playwright baselines, so a change to a screen changes its mockup in the same commit.

## Measurements still owed before the ED gate on a built screen

1. Contrast of the four status tones (success, warning, error, gray at shade 6) on light and dark surfaces, text and dot, against 4.5:1.
2. Keyboard-only pass of the six tasks in `test-protocol.md`; screen-reader pass of the Task card.
3. LCP and INP on a throttled 4G profile once reads come from Twenty.
4. Usability round one on these mockups and the workbench (five participants, one in Arabic).
