// The visual contract of the Phase B brief (part 6), as numbers. Every component
// reads these; nothing declares its own size, colour or motion. Values that
// uVENTURE's theme already provides (spacing, radius scale, semantic tuples)
// are referenced by name, never copied.

export const KUEC_GRID_PX = 8;

export const KUEC_LAYOUT = {
  // Home and card views read in one column; records and lists get a right rail.
  cardColumnMaxWidthPx: 720,
  recordMaxWidthPx: 1200,
  rightRailWidthPx: 280,
  rhythmPx: 24,
  sectionGapPx: 32,
  headerHeightPx: 56,
  bottomBarHeightPx: 64,
} as const;

export const KUEC_TYPE = {
  // Two weights only; sentence case everywhere; no all-caps.
  weightRegular: 400,
  weightStrong: 600,
  metaPx: 13,
  bodyPx: 14,
  homeCardPx: 15,
  sectionTitlePx: 20,
  pageTitlePx: 24,
  arabicLineHeight: 1.6,
} as const;

export const KUEC_CARD = {
  borderPx: 1,
  radiusPx: 12,
  paddingPx: 16,
  gapPx: 8,
} as const;

export const KUEC_CONTROL = {
  buttonHeightPx: 36,
  touchTargetPx: 44,
  listRowHeightPx: 36,
  statusDotPx: 6,
} as const;

export const KUEC_MOTION = {
  microMs: 150,
  panelMs: 250,
} as const;

// One semantic status map. Every component that shows state reads one of these
// four tones; the tone decides the dot and the text colour, never a filled badge.
export const KUEC_STATUS_TONE = {
  ok: 'ok',
  attention: 'attention',
  blocked: 'blocked',
  neutral: 'neutral',
} as const;

export type KuecStatusTone = (typeof KUEC_STATUS_TONE)[keyof typeof KUEC_STATUS_TONE];

// Mantine colour names from uVENTURE's theme (success, warning, error, gray).
// Shade 6 in both schemes keeps the palette identical in light and dark.
export const KUEC_STATUS_COLOR: Record<KuecStatusTone, string> = {
  ok: 'success',
  attention: 'warning',
  blocked: 'error',
  neutral: 'gray',
};

export const KUEC_STATUS_SHADE = 6;

export const kuecStatusCssColor = (tone: KuecStatusTone): string =>
  `var(--mantine-color-${KUEC_STATUS_COLOR[tone]}-${KUEC_STATUS_SHADE})`;

// Design checkpoints for mockups and visual regression (part 7 test matrix).
export const KUEC_VIEWPORTS = {
  phone: { width: 390, height: 844 },
  desktop: { width: 1440, height: 1000 },
} as const;

export const KUEC_FACTS_ABOVE_THE_FOLD = 6;
