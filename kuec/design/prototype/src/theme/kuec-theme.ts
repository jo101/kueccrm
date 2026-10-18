import { createTheme, mergeThemeOverrides, rem } from '@mantine/core';

import { KUEC_CARD, KUEC_CONTROL, KUEC_LAYOUT, KUEC_MOTION, KUEC_TYPE } from './kuec-tokens';
import { theme as uventureTheme } from './uventure-theme';

export { KUEC_STATUS_COLOR, KUEC_STATUS_TONE, type KuecStatusTone } from './kuec-tokens';

// The prototype cannot import uVENTURE's src/theme.ts across repositories, so
// uventure-theme.ts is a verbatim copy of it (commit 10f6f228). In uVENTURE the
// /crm route group imports the real file and adds only this extension.
//
// Fonts: IBM Plex Sans and IBM Plex Sans Arabic are loaded by the root layout
// through next/font and exposed as --font-plex and --font-plex-arabic. One family
// across scripts; the Arabic face is appended so mixed strings fall through.
const KUEC_FONT_STACK = "var(--font-plex), var(--font-plex-arabic), 'IBM Plex Sans', 'IBM Plex Sans Arabic', 'Segoe UI', sans-serif";

const kuecExtension = createTheme({
  fontFamily: KUEC_FONT_STACK,
  fontSizes: {
    xs: rem(KUEC_TYPE.metaPx),
    sm: rem(KUEC_TYPE.bodyPx),
    md: rem(KUEC_TYPE.homeCardPx),
    lg: rem(KUEC_TYPE.sectionTitlePx),
    xl: rem(KUEC_TYPE.pageTitlePx),
  },
  headings: {
    fontFamily: KUEC_FONT_STACK,
    fontWeight: String(KUEC_TYPE.weightStrong),
    sizes: {
      h1: { fontSize: rem(KUEC_TYPE.pageTitlePx), lineHeight: '1.25' },
      h2: { fontSize: rem(KUEC_TYPE.sectionTitlePx), lineHeight: '1.3' },
      h3: { fontSize: rem(KUEC_TYPE.homeCardPx), lineHeight: '1.35' },
      h4: { fontSize: rem(KUEC_TYPE.bodyPx), lineHeight: '1.4' },
    },
  },
  other: {
    kuec: {
      layout: KUEC_LAYOUT,
      card: KUEC_CARD,
      control: KUEC_CONTROL,
      motion: KUEC_MOTION,
      type: KUEC_TYPE,
    },
  },
  components: {
    Card: {
      defaultProps: {
        radius: KUEC_CARD.radiusPx,
        shadow: 'none',
        padding: KUEC_CARD.paddingPx,
        withBorder: true,
      },
    },
    Button: {
      defaultProps: { radius: 'md', variant: 'default', size: 'sm' },
      styles: {
        root: {
          position: 'relative',
          height: rem(KUEC_CONTROL.buttonHeightPx),
          fontWeight: KUEC_TYPE.weightStrong,
        },
        loader: { transform: 'translate(-50%, -50%)' },
      },
    },
    Badge: {
      // Badges are kept for counts only; status never renders as a filled badge.
      defaultProps: { radius: 'xl', variant: 'light', size: 'sm' },
      styles: { root: { textTransform: 'none', fontWeight: KUEC_TYPE.weightStrong } },
    },
    Tabs: {
      defaultProps: { radius: 'md' },
      styles: { tab: { fontWeight: KUEC_TYPE.weightStrong, height: rem(KUEC_CONTROL.buttonHeightPx) } },
    },
    Modal: {
      defaultProps: {
        radius: KUEC_CARD.radiusPx,
        padding: 'lg',
        centered: true,
        overlayProps: { backgroundOpacity: 0.55, blur: 2 },
        transitionProps: { duration: KUEC_MOTION.panelMs },
      },
    },
    Drawer: {
      defaultProps: {
        padding: 'lg',
        position: 'right',
        overlayProps: { backgroundOpacity: 0.55, blur: 2 },
        transitionProps: { duration: KUEC_MOTION.panelMs },
      },
    },
    Tooltip: {
      defaultProps: { radius: 'sm', withArrow: true, transitionProps: { duration: KUEC_MOTION.microMs } },
    },
    Popover: {
      defaultProps: { radius: KUEC_CARD.radiusPx, shadow: 'md', transitionProps: { duration: KUEC_MOTION.microMs } },
    },
    Menu: {
      defaultProps: { radius: KUEC_CARD.radiusPx, shadow: 'md', transitionProps: { duration: KUEC_MOTION.microMs } },
    },
    Skeleton: {
      defaultProps: { radius: 'md' },
      styles: { root: { '--skeleton-radius': rem(KUEC_CARD.radiusPx), borderRadius: 'var(--skeleton-radius)' } },
    },
    TextInput: { defaultProps: { radius: 'md', size: 'sm' } },
    Textarea: { defaultProps: { radius: 'md', size: 'sm' } },
    Select: { defaultProps: { radius: 'md', size: 'sm', comboboxProps: { withinPortal: true } } },
    NumberInput: { defaultProps: { radius: 'md', size: 'sm' } },
    DateInput: { defaultProps: { radius: 'md', size: 'sm', popoverProps: { withinPortal: true } } },
  },
});

export const kuecTheme = mergeThemeOverrides(uventureTheme, kuecExtension);
export { themeVarsResolver } from './uventure-theme';
