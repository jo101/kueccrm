# Theme and tokens: inheriting uVENTURE

Rule: extend, never fork. `/crm` renders inside uVENTURE's `MantineProvider` (`src/app/providers.tsx`) with `src/theme.ts` and the `--uv-*` semantic variables. Nothing in `/crm` creates a second provider or theme.

## 1. What is inherited as is

| Token group | uVENTURE value (`src/theme.ts`) | Used in `/crm` for |
| --- | --- | --- |
| `primaryColor: 'brand'` (#4071F4 at shade 6, `primaryShade {light 6, dark 8}`) | filled primary actions, active navigation, focus ring | the one primary button per screen, selected tab, progress steps |
| `success`, `info`, `warning`, `error` tuples | semantic states | status indicator only: on track / waiting / late / blocked; never decorative |
| `dark` tuple, `defaultColorScheme: 'auto'` | dark mode | inherited; `/crm` is tested in both schemes |
| Inter, headings 600, `h1 1.875rem`, `h2 1.5rem`, `h3 1.25rem`, `h4 1.125rem` | type scale | card title h3, page title h2 |
| `defaultRadius: 'md'` (0.5rem), radius xs to xl | corners | cards md, chips xl (Badge default) |
| spacing xs 0.25rem to xl 2rem | layout | card padding lg, section gap xl |
| shadows xs to xl | elevation | Card default `shadow: 'sm'` |
| `focusRing: 'auto'`, `respectReducedMotion: true`, `autoContrast: true` | accessibility | inherited |
| Component defaults: Button `variant: 'default'`, Card `withBorder`, inputs `size: 'md'`, Badge `variant: 'light' size: 'sm'`, Modal centered, Tooltip `withArrow` | | inherited; `/crm` passes `variant="filled"` explicitly for the single primary action |
| `--uv-content-link-color`, `--uv-accent-icon-color`, `--uv-surface-neutral*`, `--uv-surface-accent*`, `--uv-field-border*` | content colours independent of tenant branding | links, info icons, quiet tiles, selected cards |
| Tenant branding (`src/lib/tenantBrandingColors.ts`, applied in `AppShell.tsx`) | filled actions and chrome per institution | KUEC's navy and blue arrive as the tenant's primary and secondary colours, on light neutral surfaces, never as a full dark background |

## 2. Tokens to add (documented in uVENTURE's `docs/engineering/UI_SYSTEM.md` when merged)

| Token | Value | Why |
| --- | --- | --- |
| `--kuec-status-waiting` | `var(--mantine-color-warning-6)` | one name for "waiting on someone" so cards and lists cannot drift |
| `--kuec-status-late` | `var(--mantine-color-error-6)` | |
| `--kuec-status-blocked` | `var(--mantine-color-error-8)` | darker than late: a decision, not a delay |
| `--kuec-status-on-track` | `var(--mantine-color-success-6)` | |
| `--kuec-status-done` | `var(--mantine-color-gray-6)` | done is quiet |
| `theme.other.kuec.touchTarget` | `44px` | minimum height of every action on phones (audit U5 measured 26 px today) |
| `theme.other.kuec.cardMaxWidth` | `720px` | reading width of a card column (wireframes line 112) |
| `theme.other.kuec.factsAboveTheFold` | `6` | design-time constant, enforced by the pattern specs |

Contrast: every status colour on its light surface is checked against WCAG 2.2 AA 4.5:1 in both schemes before use; audit U13 measured 4.17 to 4.46 on today's tags, which fails. The prototype uses `autoContrast` and the shade 6 or darker for text.

## 3. Typography for Arabic

uVENTURE loads Inter with the `latin` subset only (`src/app/layout.tsx`). Inter has no Arabic glyphs, so Arabic text falls back to the system font today. Proposal: load `IBM Plex Sans Arabic` (open licence, pairs with Inter's x-height) via `next/font/google` with `subsets: ['arabic']` and expose `--font-arabic`; set `fontFamily` per direction with `[dir="rtl"] { font-family: var(--font-arabic), var(--font-inter), ... }`. Western digits are kept by the `latn` numbering system in formatting, not by the font. Line height 1.6 for Arabic body text. To be validated with the Arabic participants in usability round one (the prototype uses this stack).

## 4. Direction and locale (a dependency on uVENTURE)

uVENTURE has no i18n layer and no `DirectionProvider` (`UI_SYSTEM.md` says it does; the code does not). Minimum for `/crm`:

1. A `locale` per user (`en` or `ar`), stored on the user record, switchable from More, defaulting from the browser.
2. `DirectionProvider` around `MantineProvider` in `src/app/providers.tsx`, direction derived from the locale, `dir` and `lang` set on `<html>` in the root layout.
3. A message catalog for `/crm` (ICU messages, Arabic plural categories); the prototype uses a small typed dictionary to show the pattern; the production choice (Lingui, next-intl, or uVENTURE's own `src/lib/messages.ts` extended) is uVENTURE's call and is listed as dependency D1 in `redesign-backlog.md`.
4. Logical CSS properties only (`margin-inline-start`, `padding-inline`, `inset-inline-end`); Mantine 8 already does this internally.
5. Mirrored directional icons, listed explicitly: `IconArrowRight`/`IconArrowLeft`, `IconChevronRight`/`IconChevronLeft`, `IconArrowBack`, `IconCornerDownLeft`, `IconLogout`, `IconPlayerTrackNext`. Not mirrored: clocks, calendars, checks, flags, the KUEC mark.
6. Bidi isolation for mixed names and emails.

## 5. Breakpoints

Mantine's `xs 36em (576px)`, `sm 48em (768px)`, `md 62em (992px)`, `lg 75em (1200px)` are inherited; design checkpoints are 390, 768, 1024, 1440 px. Below `sm` the shell switches to the bottom bar; cards go full width; tables become card lists, never shrunken tables.
