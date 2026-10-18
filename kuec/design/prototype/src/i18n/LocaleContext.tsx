'use client';

import { createContext, type ReactNode, useCallback, useContext, useMemo } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { getMessage, type Locale, LOCALES, type MessageKey } from './messages';

type TranslationValues = Record<string, string | number>;

export type Direction = 'ltr' | 'rtl';

type LocaleContextValue = {
  locale: Locale;
  direction: Direction;
  t: (key: MessageKey, values?: TranslationValues) => string;
  setLocale: (locale: Locale) => void;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

const interpolate = (template: string, values?: TranslationValues): string =>
  template.replace(/\{(\w+)\}/g, (match, name: string) => (values && name in values ? String(values[name]) : match));

export const isLocale = (value: string | null | undefined): value is Locale => typeof value === 'string' && (LOCALES as string[]).includes(value);

export const directionOf = (locale: Locale): Direction => (locale === 'ar' ? 'rtl' : 'ltr');

export const htmlLangOf = (locale: Locale): string => (locale === 'ar' ? 'ar-AE' : 'en-AE');

type LocaleProviderProps = {
  locale: Locale;
  onLocaleChange: (locale: Locale) => void;
  children: ReactNode;
};

// The provider takes the locale explicitly so Storybook and tests can set it
// without a router. In uVENTURE it comes from the user record.
export const LocaleProvider = ({ locale, onLocaleChange, children }: LocaleProviderProps) => {
  const value = useMemo<LocaleContextValue>(
    () => ({
      locale,
      direction: directionOf(locale),
      t: (key, values) => interpolate(getMessage(locale, key), values),
      setLocale: onLocaleChange,
    }),
    [locale, onLocaleChange],
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
};

type UrlLocaleProviderProps = { children: ReactNode };

// The workbench carries the locale in the URL (?lang=ar) so a screenshot or a
// shared link reproduces the exact screen.
export const UrlLocaleProvider = ({ children }: UrlLocaleProviderProps) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const requested = searchParams.get('lang');
  const locale: Locale = isLocale(requested) ? requested : 'en';

  const setLocale = useCallback(
    (next: Locale) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set('lang', next);
      router.replace(`${pathname}?${params.toString()}`);
    },
    [pathname, router, searchParams],
  );

  return (
    <LocaleProvider locale={locale} onLocaleChange={setLocale}>
      {children}
    </LocaleProvider>
  );
};

export const useLocale = (): LocaleContextValue => {
  const value = useContext(LocaleContext);
  if (value === null) {
    throw new Error('useLocale must be used inside LocaleProvider');
  }

  return value;
};
