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

// Lee el locale guardado en localStorage; si no existe, usa español por defecto
const detectInitial = (): Locale => {
  try {
    const stored = localStorage.getItem('postq-locale');
    if (stored === 'en' || stored === 'es') return stored;
  } catch {
    /* ignore */
  }
  return 'es';
};

// Proveedor de internacionalización: gestiona el locale activo, lo persiste
// y expone la función t() para traducir claves
export const I18nProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [locale, setLocaleState] = useState<Locale>(detectInitial);

  // Persiste el locale en localStorage y actualiza el atributo lang del documento
  useEffect(() => {
    try {
      localStorage.setItem('postq-locale', locale);
    } catch {
      /* ignore */
    }
    document.documentElement.lang = locale;
  }, [locale]);

  // t() devuelve la traducción del locale activo, con fallback a español
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

// Hook que expone locale, setLocale y t(); lanza error fuera del proveedor
export const useI18n = (): I18nContextValue => {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used inside <I18nProvider>');
  return ctx;
};

// Atajo para obtener solo la función t() sin necesitar locale ni setLocale
export const useT = (): I18nContextValue['t'] => useI18n().t;
