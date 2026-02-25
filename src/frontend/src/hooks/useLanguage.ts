import { useState, useCallback } from 'react';
import { type Language, type TranslationKey, translations } from '../i18n/translations';

const LANGUAGE_KEY = 'fitAlsoLanguage';

function getStoredLanguage(): Language {
  try {
    const stored = localStorage.getItem(LANGUAGE_KEY);
    if (stored === 'hi' || stored === 'en') return stored;
  } catch {}
  return 'en';
}

export function useLanguage() {
  const [language, setLanguage] = useState<Language>(getStoredLanguage);

  const toggleLanguage = useCallback(() => {
    setLanguage(prev => {
      const next: Language = prev === 'en' ? 'hi' : 'en';
      try { localStorage.setItem(LANGUAGE_KEY, next); } catch {}
      return next;
    });
  }, []);

  const t = useCallback((key: TranslationKey): string => {
    return translations[language][key] ?? key;
  }, [language]);

  return { language, toggleLanguage, t };
}
