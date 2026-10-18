import { createTheme, mergeThemeOverrides } from '@mantine/core';

import { theme as uventureTheme } from './uventure-theme';

// The prototype cannot import uVENTURE's src/theme.ts across repositories, so
// uventure-theme.ts is a verbatim copy of it (commit 10f6f228). In uVENTURE the
// /crm route group imports the real file and only this extension is added.
export const KUEC_STATUS_COLOR = {
  onTrack: 'success',
  waiting: 'warning',
  late: 'error',
  blocked: 'error',
  done: 'gray',
} as const;

export type KuecStatusTone = keyof typeof KUEC_STATUS_COLOR;

export const KUEC_TOUCH_TARGET_PX = 44;
export const KUEC_CARD_MAX_WIDTH_PX = 720;
export const KUEC_FACTS_ABOVE_THE_FOLD = 6;

const kuecExtension = createTheme({
  other: {
    kuec: {
      touchTarget: KUEC_TOUCH_TARGET_PX,
      cardMaxWidth: KUEC_CARD_MAX_WIDTH_PX,
      factsAboveTheFold: KUEC_FACTS_ABOVE_THE_FOLD,
    },
  },
});

export const kuecTheme = mergeThemeOverrides(uventureTheme, kuecExtension);
export { themeVarsResolver } from './uventure-theme';
