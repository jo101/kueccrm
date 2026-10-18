# Theme and tokens: inheriting uVENTURE

Rule: extend, never fork. `/crm` renders inside uVENTURE's `MantineProvider` (`src/app/providers.tsx`) with `src/theme.ts` and the `--uv-*` semantic variables. Nothing in `/crm` creates a second provider or theme. The workbench carries a verbatim copy of `src/theme.ts` (`prototype/src/theme/uventure-theme.ts`, commit 10f6f228) because it cannot import across repositories; the extension is `prototype/src/theme/kuec-theme.ts` and the numbers are `prototype/src/theme/kuec-tokens.ts`.

## 1. What is inherited as is

| Token group | uVENTURE value | Used in `/crm` for |
| --- | --- | --- |
| `primaryColor: 'brand'` (#4071F4 at shade 6) | the one accent | the single filled button per screen, the selected tab, the progress fill of the performance strip |
| `success`, `warning`, `error`, `gray` tuples | the four semantic tones | the status map only (section 2); never decorative |
| `dark` tuple | dark scheme | inherited; every screen is captured in both schemes |
| spacing xs 4, sm 8, md 16, lg 24, xl 32 px | the 8 px grid, 24 px rhythm, 32 px section gaps | everything |
| radius md 8 px | buttons, inputs | everything but cards |
| `--uv-content-link-color`, `--uv-accent-icon-color`, `--uv-surface-neutral*`, `--uv-surface-accent*`, `--uv-field-border*` | content colours independent of tenant branding | links, info icons, the quiet chevron surfaces, the current stage surface |
| `focusRing: 'auto'`, `respectReducedMotion: true`, `autoContrast: true` | accessibility | inherited |
| Tenant branding (`src/lib/tenantBrandingColors.ts`) | filled actions and chrome per institution | arrives as the brand colour; never a full dark background |

## 2. The visual contract as tokens (`kuec-tokens.ts`)

| Token | Value | Enforced by |
| --- | --- | --- |
| Layout | card column 720 px; record 1200 px with a 280 px right rail; 8 px grid; 24 px rhythm; 32 px section gaps; header 56 px; bottom bar 64 px | `KUEC_LAYOUT`; `design-rules` rejects off-grid sizes |
| Type | IBM Plex Sans with IBM Plex Sans Arabic; 13 px meta, 14 px lists and records, 15 px Home cards, 20 px section titles, 24 px page titles; weights 400 and 600; sentence case | `fontSizes` and `headings` in `kuec-theme.ts`; the visual test fails on any `text-transform: uppercase` |
| Colour | 90 percent neutral; one accent; four semantic tones as a 6 px dot or coloured text, never a filled badge; identical palette in both schemes | `KUEC_STATUS_TONE`, `KuecStatus`; the visual test fails on any filled badge |
| Cards | 1 px border, no shadow, 12 px radius, 16 px padding, 8 px gaps; title, context, meta (owner only when not me · due · status), one button | `Card` defaults in `kuec-theme.ts`; `KuecActionCard` |
| Lists | 36 px rows, sticky header, no filters shown by default | `KuecListView` |
| Controls | buttons 36 px; full width only on phones; 44 px touch targets | `Button` default styles; `.kuec-action` at the sm breakpoint; the visual test measures the smallest action on every phone capture |
| Motion | 150 ms micro, 250 ms panels; nothing under reduced motion | `KUEC_MOTION`; `transitionProps` on Modal, Drawer, Tooltip, Popover, Menu |
| Status map | ok = success, attention = warning, blocked = error, neutral = gray, all at shade 6 | `KUEC_STATUS_COLOR`, `kuecStatusCssColor()` |

Status map rules: a task is blocked when its status is Blocked or it is late; attention when Assigned, Pending Review or due today; neutral when Not Started, Completed, Declined or Cancelled; otherwise ok. An opportunity's Next Step is blocked when missing or late, attention when due today or tomorrow, neutral when the opportunity is closed, otherwise ok. One function per rule in `prototype/src/store/rules.ts`.

Contrast of the four tones on light and dark surfaces is **not yet measured** (scorecard). Audit U13 measured 4.17 to 4.46 on today's tags; shade 6 text on the body surface is the hypothesis to verify.

## 3. Typography for Arabic

IBM Plex Sans (latin, 400 and 600) and IBM Plex Sans Arabic (arabic, 400 and 600) through `next/font/google`, exposed as `--font-plex` and `--font-plex-arabic` **on `<html>`**, because Mantine resolves `--mantine-font-family` at `:root`; a variable defined only on `<body>` leaves every font invalid (seen on the first build, fixed the same day). The font stack lists both faces so mixed strings fall through; Arabic body text gets 1.6 line height. Storybook loads the same family self-hosted through `@fontsource`.

## 4. Direction and locale (a dependency on uVENTURE)

uVENTURE has no i18n layer and no `DirectionProvider` (`UI_SYSTEM.md` says it does; the code does not). Minimum for `/crm`, unchanged as dependency D1:

1. A `locale` per user (`en` or `ar`), switchable from the person menu, defaulting from the browser.
2. `DirectionProvider` around `MantineProvider`, direction from the locale, `dir` and `lang` on `<html>`. The workbench's provider order is the proposal: DirectionProvider > MantineProvider > DatesProvider > ModalsProvider > Notifications > app providers.
3. A message catalog (the workbench uses a typed dictionary, `prototype/src/i18n/messages.ts`; the production choice is uVENTURE's).
4. Logical CSS properties only; `design-rules` fails on physical ones.
5. Mirrored directional icons: arrows and chevrons (including breadcrumb separators) mirror with `scaleX(-1)`; checks, clocks, calendars, flags and the KUEC mark do not. The drawer opens from the end side.
6. `<bdi>` around names, emails and phone numbers in mixed-script sentences.
7. Dates through `@mantine/dates` with a derived `ar-ae` dayjs locale that keeps Western digits; week starts Monday; weekend Saturday and Sunday.

## 5. Breakpoints

Mantine's `sm 48em (768 px)` and `md 62em (992 px)` are the two that matter: below sm the bottom bar, full-width 44 px actions and the compact stage path; from md the record's right rail. Design checkpoints and the visual test matrix are 390 and 1440 px.
