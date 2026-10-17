import {
  CRM_PACK_ENABLED_VARIABLE,
  GTM_PACK_ENABLED_VARIABLE,
  PM_PACK_ENABLED_VARIABLE,
} from 'src/application.config';

export const PACK = {
  CRM: 'CRM',
  PM: 'PM',
  GTM: 'GTM',
} as const;

export type Pack = (typeof PACK)[keyof typeof PACK];

export const PACK_ENABLED_VARIABLE: Record<Pack, string> = {
  [PACK.CRM]: CRM_PACK_ENABLED_VARIABLE,
  [PACK.PM]: PM_PACK_ENABLED_VARIABLE,
  [PACK.GTM]: GTM_PACK_ENABLED_VARIABLE,
};

// Unset counts as on, so an install that never set the variable keeps the
// behaviour it shipped with. A switch stands down a pack's own automations
// only, never the operating rules of kuec/CLAUDE.md section 7.
export const isPackEnabled = (pack: Pack): boolean =>
  process.env[PACK_ENABLED_VARIABLE[pack]] !== 'false';

export const packStandDown = (pack: Pack) => ({ skipped: `${pack} pack is off` });
