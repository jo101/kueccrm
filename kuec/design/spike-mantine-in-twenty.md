# Spike: Mantine 8.3.18 inside the Twenty 2.48.0 front component runtime

Date 2026-10-18. Stage 0 of the redesign. Exit criterion fixed before the run: unless every one of the seven items passes unmodified, the spike confirms the standalone route (employee experience as a `/crm` route group in uVENTURE, Twenty headless) and stops.

**Result: 0 of 7 pass unmodified. The standalone route is confirmed. No further work on Mantine inside Twenty.**

## 1. Setup

| Item | Value |
| --- | --- |
| Twenty | `twentycrm/twenty:v2.48.0`, brought up with `config/deploy/docker-compose.yml` + `tests/release-gate/rehearsal/override.yml` and `rehearsal/bootstrap.sh` (fresh workspace, admin API key, stage options) |
| SDK | `twenty-sdk` 2.48.0, `twenty-client-sdk` 2.48.0, `twenty-ui` 2.48.0 from npm |
| Mantine | `@mantine/core` 8.3.18, `@mantine/hooks` 8.3.18 (uVENTURE's pinned version, published 2026-03-17) |
| React | 19.2.0 |
| Spike app | `kuec/design/spike/` (one object `spikeNote`, one front component, one record-page widget, one standalone page with the same component, one navigation item, one default role). Applied with `yarn twenty apply .`; plan showed 45 to add, 0 to change, 0 to destroy |
| Browser | Chromium 141 headless, viewport 1280 x 720, signed in as the workspace admin; Twenty's "Create profile" and "Invite your team" steps had to be completed first (the second needs "Skip anyway") |
| Surfaces | Record page `/object/spikeNote/<id>` (widget column 313 px wide) and standalone page `/page/<layoutId>` (widget 1007 px wide) |

The component (`spike/src/front-components/mantine-spike.front-component.tsx`) imports `@mantine/core/styles.css`, wraps each item in an error boundary and prints one `PROBE <id> ...` line per item, plus a `PROBE 0` line listing which browser globals exist in the sandbox. Host-side facts were read with Playwright `page.evaluate` on the real document.

## 2. Results

| Item | Observed | Verdict |
| --- | --- | --- |
| Sandbox globals (PROBE 0) | `window`, `document`, `document.body`, `matchMedia`, `MutationObserver`, `getComputedStyle`, `requestAnimationFrame`, `localStorage` present; **`ResizeObserver` undefined, `IntersectionObserver` undefined, `CSS` undefined, `ShadowRoot` undefined** | context |
| A `MantineProvider` | Mounts; `useMantineTheme()` returns the default theme. Its CSS variables are injected into the host `:root` (`--mantine-color-blue-6` = `#228be6` on the Twenty document), but every variable Mantine scopes to `:root[data-mantine-color-scheme]` is **missing** on the host (`--mantine-primary-color-filled`, `--mantine-color-text`, `--mantine-color-body` all empty) because the provider sets that attribute on the worker's polyfilled document, not on the host. Consequence: a filled `Button` renders with transparent background and white text (invisible, `spike-03-probes-c-to-g.png`). | FAIL |
| B `Select` | Throws during render: `ReferenceError: ShadowRoot is not defined` (floating-ui inside `Combobox`, both with `withinPortal: true` and `false`). Nothing renders. | FAIL |
| C `Tooltip` | Renders and is positioned next to its target (host rect 113 x 26 px, opacity 1), but with transparent background and body-coloured text because the colour variables are missing: the label ghosts over the paragraph beneath it. | FAIL |
| D `Modal` | Opens on click. Overlay and content are rendered inside the widget's portal layer (`position: fixed; clip-path: inset(-200px); width 313px`), so the overlay covers only the widget column and the dialog sits at the top of that column, partly above the viewport (content rect y = -55 px, `spike-02-modal-open.png`). Not a page-level dialog. | FAIL |
| E `useMediaQuery('(max-width: 768px)')` | Returns `true` on the record page and `false` on the standalone page with the same 1280 px viewport: the polyfilled `matchMedia` answers for the widget container width (313 px, then 1007 px), not the viewport. | FAIL |
| F `DirectionProvider` | `useDirection()` reports `rtl` and Arabic text renders, but the provider cannot set `dir` on the host document (`document.documentElement.getAttribute('dir')` stays `ltr` on the host, `null` in the sandbox), so Mantine's `[dir="rtl"]` style rules never match. | FAIL |
| G `ScrollArea` | Throws during render: `ReferenceError: ResizeObserver is not defined`. Nothing renders. | FAIL |

Side effects observed on the host page, independent of the items above:

- Mantine's full stylesheet (218,582 characters across three `style[data-remote-style]` tags) is injected into Twenty's document, once wrapped in `@layer twenty-ui` and once unlayered. It is not scoped to the widget.
- Mantine's `:root` variables overwrite nothing today only because Twenty uses `--t-*` names; a second Mantine-based component, or a Twenty upgrade that adopts Mantine, would collide.
- Five uncaught errors per page load in the console (two `ShadowRoot`, three `ResizeObserver`).

## 3. Why these cannot be fixed without modifying Twenty or forking Mantine

The runtime executes the component in a Web Worker against a Remote DOM (`packages/twenty-front-component-renderer/src/remote/worker/remote-worker.ts`), mirrors an allowlist of HTML elements and attributes to the host (`src/constants/AllowedHtmlElements.ts`, `src/constants/HtmlCommonProperties.ts`), renders anything outside the component root into a fixed portal layer clipped to the widget plus 200 px (`src/host/components/FrontComponentRemoteRootRenderer.tsx`, `src/constants/FrontComponentPortalMargin.ts`), polyfills `matchMedia` from the container (`src/polyfills/matchMedia/installMatchMediaPolyfill.ts`) and ships no `ResizeObserver`, `IntersectionObserver` or `ShadowRoot` in the worker. Mantine depends on document-level attributes (`data-mantine-color-scheme`, `dir`), document-level portals (Modal, Drawer, Combobox, Notifications, Spotlight), floating-ui (which touches `ShadowRoot`), and `ResizeObserver` (ScrollArea, Combobox, Tabs indicator). Every one of the seven failures is a property of that sandbox, not a bug in the spike. Both rules of the brief hold: never modify Twenty core, never fork Mantine.

## 4. Decision

The employee experience is built as a Next.js route group `/crm` inside uVENTURE, with uVENTURE's `MantineProvider`, theme, `AppShell`, auth and (to be added) i18n. Twenty stays the system of record, the automation engine and the expert and admin UI. The existing work package card stays as the expert-surface fallback inside Twenty and is not extended with Mantine.

## 5. Reproduce

```bash
# rehearsal stack (needs Docker; see tests/release-gate/rehearsal/bootstrap.sh)
cd kuec/tests/release-gate/rehearsal && bash bootstrap.sh
# spike app
cd kuec/design/spike && corepack enable && yarn install && yarn twenty apply .
# create one record, open /object/spikeNote/<id> signed in, read the PROBE lines
```

Evidence: `spike-evidence/spike-01-record-page.png`, `spike-02-modal-open.png`, `spike-03-probes-c-to-g.png`, `spike-04-standalone-page.png`. The rehearsal stack and the spike workspace are local and disposable; nothing was deployed.
