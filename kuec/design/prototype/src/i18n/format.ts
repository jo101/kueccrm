import type { Locale } from './messages';

export const GULF_TIME_ZONE = 'Asia/Dubai';

// Gregorian calendar and Western digits in both languages (design/glossary.md section 7).
const intlLocale = (locale: Locale): string => (locale === 'ar' ? 'ar-AE-u-ca-gregory-nu-latn' : 'en-AE');

export const formatShortDate = (locale: Locale, iso: string): string =>
  new Intl.DateTimeFormat(intlLocale(locale), {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    timeZone: GULF_TIME_ZONE,
  }).format(new Date(iso));

export const formatLongDate = (locale: Locale, iso: string): string =>
  new Intl.DateTimeFormat(intlLocale(locale), {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: GULF_TIME_ZONE,
  }).format(new Date(iso));

export const formatAed = (locale: Locale, amount: number): string =>
  new Intl.NumberFormat(intlLocale(locale), {
    style: 'currency',
    currency: 'AED',
    maximumFractionDigits: 0,
  }).format(amount);

const gulfDayKey = (date: Date): string =>
  new Intl.DateTimeFormat('en-CA', { timeZone: GULF_TIME_ZONE, year: 'numeric', month: '2-digit', day: '2-digit' }).format(date);

// Calendar-day difference in Gulf time, so 23:30 and 00:30 count as different days.
export const daysBetweenInGulf = (fromIso: string, toIso: string): number => {
  const from = new Date(gulfDayKey(new Date(fromIso)) + 'T00:00:00Z').getTime();
  const to = new Date(gulfDayKey(new Date(toIso)) + 'T00:00:00Z').getTime();

  return Math.round((to - from) / 86_400_000);
};

// UAE weekend is Saturday and Sunday; public holidays are data in the app, not here.
export const workingDaysBetweenInGulf = (fromIso: string, toIso: string): number => {
  const total = daysBetweenInGulf(fromIso, toIso);
  let count = 0;
  const cursor = new Date(gulfDayKey(new Date(fromIso)) + 'T12:00:00Z');

  for (let index = 0; index < total; index += 1) {
    cursor.setUTCDate(cursor.getUTCDate() + 1);
    const weekday = cursor.getUTCDay();
    if (weekday !== 0 && weekday !== 6) {
      count += 1;
    }
  }

  return count;
};
