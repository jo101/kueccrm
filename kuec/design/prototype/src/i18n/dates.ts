import dayjs from 'dayjs';
import 'dayjs/locale/ar';
import 'dayjs/locale/en-gb';
import type { DayOfWeek } from '@mantine/dates';

import type { Locale } from './messages';

// dayjs's "ar" locale converts digits to Arabic-Indic; the UAE convention and
// the glossary want Western digits and the Gregorian calendar, so a derived
// locale drops the digit conversion. Week starts on Monday; weekend Saturday and Sunday.
type LocaleWithDigits = typeof dayjs.Ls.ar & { preparse?: (value: string) => string; postformat?: (value: string) => string };

const { preparse: _preparse, postformat: _postformat, ...arabicWithoutDigitConversion } = dayjs.Ls.ar as LocaleWithDigits;

dayjs.locale('ar-ae', { ...arabicWithoutDigitConversion, name: 'ar-ae', weekStart: 1 }, true);

export const DAYJS_LOCALE: Record<Locale, string> = { en: 'en-gb', ar: 'ar-ae' };

// Saturday and Sunday (UAE weekend since 2022).
export const WEEKEND_DAYS: DayOfWeek[] = [6, 0];

export const FIRST_DAY_OF_WEEK: DayOfWeek = 1;
