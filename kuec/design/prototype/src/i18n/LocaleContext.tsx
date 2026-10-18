'use client';

import { createContext, type ReactNode, useCallback, useContext, useEffect, useMemo } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { getMessage, type Locale, LOCALES, type MessageKey } from './messages';

type TranslationValues = Record<string, string | number>;

type LocaleContextValue = {
  locale: Locale;
  direction: 'ltr' | 'rtl';
  t: (key: MessageKey, values?: TranslationValues) => string;
  setLocale: (locale: Locale) => void;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

const interpolate = (template: string, values?: TranslationValues): string =>
  template.replace(/\{(\w+)\}/g, (match, name: string) => (values && name in values ? String(values[name]) : match));

const isLocale = (value: string | null): value is Locale => value !== null && (LOCALES as string[]).includes(value);

type LocaleProviderProps = { children: ReactNode };

// The locale travels in the URL (?lang=ar) so a screenshot or a shared link
// reproduces the exact screen; in uVENTURE it would come from the user record.
export const LocaleProvider = ({ children }: LocaleProviderProps) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const requested = searchParams.get('lang');
  const locale: Locale = isLocale(requested) ? requested : 'en';
  const direction = locale === 'ar' ? 'rtl' : 'ltr';

  useEffect(() => {
    document.documentElement.setAttribute('dir', direction);
    document.documentElement.setAttribute('lang', locale === 'ar' ? 'ar-AE' : 'en-AE');
  }, [direction, locale]);

  const setLocale = useCallback(
    (next: Locale) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set('lang', next);
      router.replace(`${pathname}?${params.toString()}`);
    },
    [pathname, router, searchParams],
  );

  const value = useMemo<LocaleContextValue>(
    () => ({
      locale,
      direction,
      t: (key, values) => interpolate(getMessage(locale, key), values),
      setLocale,
    }),
    [direction, locale, setLocale],
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
};

export const useLocale = (): LocaleContextValue => {
  const value = useContext(LocaleContext);
  if (value === null) {
    throw new Error('useLocale must be used inside LocaleProvider');
  }

  return value;
};
