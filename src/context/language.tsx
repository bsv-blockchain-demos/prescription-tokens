import React, { createContext, useContext, useState, useCallback } from 'react';
import { translations, type Lang, type TranslationKeys } from '../i18n/translations';

interface LanguageContextType {
  lang: Lang;
  t: TranslationKeys;
  toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

const getInitialLang = (): Lang => {
  const stored = localStorage.getItem('lang');
  if (stored === 'en' || stored === 'es') return stored;
  return 'es';
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Lang>(getInitialLang);

  const toggleLanguage = useCallback(() => {
    setLang(prev => {
      const next = prev === 'en' ? 'es' : 'en';
      localStorage.setItem('lang', next);
      return next;
    });
  }, []);

  const t = translations[lang];

  return (
    <LanguageContext.Provider value={{ lang, t, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
};
