'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { translations, Language, Translations } from './i18n';

interface SettingsContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
  primaryHue: number;
  setPrimaryHue: (hue: number) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('zh');
  const [primaryHue, setPrimaryHueState] = useState(155); // Default green hue
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Load saved settings from localStorage
    const savedLang = localStorage.getItem('cgsbs-language') as Language;
    const savedHue = localStorage.getItem('cgsbs-hue');
    
    if (savedLang && (savedLang === 'zh' || savedLang === 'en')) {
      setLanguageState(savedLang);
    }
    if (savedHue) {
      const hue = parseInt(savedHue, 10);
      if (!isNaN(hue)) {
        setPrimaryHueState(hue);
        updateThemeColor(hue);
      }
    }
  }, []);

  const updateThemeColor = (hue: number) => {
    document.documentElement.style.setProperty('--primary', `oklch(0.72 0.19 ${hue})`);
    document.documentElement.style.setProperty('--accent', `oklch(0.72 0.19 ${hue})`);
    document.documentElement.style.setProperty('--ring', `oklch(0.72 0.19 ${hue})`);
    document.documentElement.style.setProperty('--glow', `oklch(0.72 0.19 ${hue} / 0.5)`);
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('cgsbs-language', lang);
  };

  const setPrimaryHue = (hue: number) => {
    setPrimaryHueState(hue);
    localStorage.setItem('cgsbs-hue', hue.toString());
    updateThemeColor(hue);
  };

  const t = translations[language];

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <SettingsContext.Provider value={{ language, setLanguage, t, primaryHue, setPrimaryHue }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
