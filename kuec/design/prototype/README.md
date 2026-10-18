# KUEC CRM design workbench

The working screens of the Phase B redesign: Next.js 15.5.27 + Mantine 8.3.18 on anonymised data (`src/data/seed.ts`) with an in-memory store. It holds the tokens, the pattern library with a story per pattern, Storybook, the design-rule checker and the visual regression that produces the mockups in `../mockups`. It is **not connected to Twenty and is not an implementation**; in uVENTURE the `/crm` route group imports the real theme and shell and reads Twenty as the signed-in person.

## Run

```bash
cd kuec/design/prototype
npm ci                                  # exact versions pinned in package.json, all at least 14 days old
npm run build && npm run start          # http://localhost:3100/crm (production build, as uVENTURE tests)
npm run storybook                       # http://localhost:6006
```

Switch persona, language and scheme from the avatar menu, or by URL: `?as=bd1|bd2|ed|ops|eng1|eng2|viewer`, `?lang=en|ar`, `?scheme=light|dark`. `?from=notification` on a task shows the deep-link banner. The avatar menu has "Simulate a backend failure on the next write": the next action is refused, nothing changes, and the screen says so.

## Verify

```bash
npm run verify     # typecheck, design rules, build, Storybook build, visual regression
npm run test:visual:update   # regenerate ../mockups after an intended change (review the diff)
```

`CHROMIUM_PATH` points Playwright at a system Chromium when the bundled one is not installed; the pinned Playwright 1.56.1 matches Chromium 1194.

## Structure

```
src/theme/kuec-tokens.ts        the visual contract as numbers; the status map
src/theme/kuec-theme.ts         extension of the verbatim copy of uVENTURE's theme
src/i18n/messages.ts            every string, English and Arabic (Draft rows per design/glossary.md)
src/i18n/dates.ts               dayjs ar-ae locale: Gregorian, Western digits
src/data/model.ts, seed.ts      Twenty objects as the employee sees them; anonymised Gulf data
src/store/rules.ts              pure rules: actions per role and status, tones, due labels, next-step state
src/store/WorkbenchStore.tsx    in-memory writes with latency and the failure switch
src/components/kuec/*           the pattern library and its stories
src/components/shell/CrmShell   header tabs, search (Ctrl+K), New, bell, person menu, phone bottom bar
src/app/page.tsx                Home
src/app/tasks/[id]              Task card
src/app/opportunities/[id]      Opportunity record
tests/visual                    the eight-variant matrix and the structural checks
scripts/check-design-rules.mjs  raw colours, physical CSS, off-grid sizes, story coverage
```
