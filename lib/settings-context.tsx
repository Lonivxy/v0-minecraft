'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { translations, Language, Translations } from './i18n';

interface SettingsContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
  primaryHue: number;
  setPrimaryHue: (hue: number) => void;
  isDark: boolean;
  setIsDark: (dark: boolean) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

function detectLanguage(): Language {
  if (typeof navigator === 'undefined') return 'zh';
  const lang = navigator.language.toLowerCase();
  if (lang.startsWith('zh')) return 'zh';
  if (lang.startsWith('ja')) return 'ja';
  if (lang.startsWith('fr')) return 'fr';
  return 'en';
}

function shouldBeDark(): boolean {
  const hour = new Date().getHours();
  // Dark mode outside 6am–6pm
  return hour < 6 || hour >= 18;
}

function applyTheme(dark: boolean, hue: number) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  if (dark) {
    root.style.setProperty('--background', 'oklch(0.12 0.01 250)');
    root.style.setProperty('--foreground', 'oklch(0.95 0 0)');
    root.style.setProperty('--card', 'oklch(0.15 0.01 250 / 0.6)');
    root.style.setProperty('--card-foreground', 'oklch(0.95 0 0)');
    root.style.setProperty('--muted-foreground', 'oklch(0.65 0 0)');
    root.style.setProperty('--glass', 'oklch(0.15 0.02 250 / 0.4)');
    root.style.setProperty('--glass-border', 'oklch(0.5 0.05 250 / 0.3)');
    root.classList.add('dark-mode');
    root.classList.remove('light-mode');
  } else {
    root.style.setProperty('--background', 'oklch(0.97 0.005 250)');
    root.style.setProperty('--foreground', 'oklch(0.15 0.01 250)');
    root.style.setProperty('--card', 'oklch(1 0 0 / 0.7)');
    root.style.setProperty('--card-foreground', 'oklch(0.15 0.01 250)');
    root.style.setProperty('--muted-foreground', 'oklch(0.45 0.01 250)');
    root.style.setProperty('--glass', 'oklch(1 0 0 / 0.5)');
    root.style.setProperty('--glass-border', 'oklch(0.7 0.03 250 / 0.4)');
    root.classList.add('light-mode');
    root.classList.remove('dark-mode');
  }
  // Use HSL for hue-driven theme color so wheel hue matches UI hue 1:1.
  root.style.setProperty('--primary', `hsl(${hue} 82% 56%)`);
  root.style.setProperty('--accent', `hsl(${hue} 82% 56%)`);
  root.style.setProperty('--ring', `hsl(${hue} 82% 56%)`);
  root.style.setProperty('--glow', `hsl(${hue} 88% 56% / 0.52)`);
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('zh');
  const [primaryHue, setPrimaryHueState] = useState(155);
  const [isDark, setIsDarkState] = useState(true);

  useEffect(() => {
    // Detect language from browser
    const savedLang = localStorage.getItem('cgsbs-language') as Language;
    if (savedLang && ['zh', 'en', 'ja', 'fr'].includes(savedLang)) {
      setLanguageState(savedLang);
    } else {
      setLanguageState(detectLanguage());
    }

    // Detect dark/light mode: check saved preference, else use time
    const savedDark = localStorage.getItem('cgsbs-dark');
    const dark = savedDark !== null ? savedDark === 'true' : shouldBeDark();
    setIsDarkState(dark);

    // Load hue
    const savedHue = localStorage.getItem('cgsbs-hue');
    const hue = savedHue ? parseInt(savedHue, 10) : 155;
    const validHue = isNaN(hue) ? 155 : hue;
    setPrimaryHueState(validHue);

  }, []);

  useEffect(() => {
    applyTheme(isDark, primaryHue);
  }, [isDark, primaryHue]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      localStorage.setItem('cgsbs-hue', primaryHue.toString());
    }, 420);
    return () => window.clearTimeout(timer);
  }, [primaryHue]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('cgsbs-language', lang);
  };

  const setPrimaryHue = (hue: number) => {
    setPrimaryHueState(hue);
  };

  const setIsDark = (dark: boolean) => {
    setIsDarkState(dark);
    localStorage.setItem('cgsbs-dark', dark.toString());
  };

  const t = translations[language];

  return (
    <SettingsContext.Provider value={{ language, setLanguage, t, primaryHue, setPrimaryHue, isDark, setIsDark }}>
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
