import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { translations, type TranslationKey } from './translations';

export type Locale = 'es' | 'en';

interface I18nContextValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: TranslationKey) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

const detectInitial = (): Locale => {
  try {
    const stored = localStorage.getItem('quanta-locale');
    if (stored === 'en' || stored === 'es') return stored;
  } catch {
    /* ignore */
  }
  return 'es';
};

export const I18nProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [locale, setLocaleState] = useState<Locale>(detectInitial);

  useEffect(() => {
    try {
      localStorage.setItem('quanta-locale', locale);
    } catch {
      /* ignore */
    }
    document.documentElement.lang = locale;
  }, [locale]);

  const value = useMemo<I18nContextValue>(
    () => ({
      locale,
      setLocale: setLocaleState,
      t: (key) => {
        const dict = translations[locale];
        return dict[key] ?? translations.es[key] ?? key;
      },
    }),
    [locale],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export const useI18n = (): I18nContextValue => {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used inside <I18nProvider>');
  return ctx;
};

export const useT = (): I18nContextValue['t'] => useI18n().t;
