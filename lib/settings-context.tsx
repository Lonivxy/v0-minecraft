'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { usePathname } from 'next/navigation';
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

function normalizeLanguage(lang: string | null | undefined): Language {
  if (!lang) return 'zh-cn';
  const l = lang.toLowerCase();
  if (l === 'zh') return 'zh-cn';
  if (l === 'en') return 'en-us';
  if (
    [
      'zh-cn',
      'zh-hant',
      'zh-hk',
      'zh-tw',
      'en-us',
      'en-gb',
      'ja',
      'fr',
      'de',
      'nl',
      'pl',
      'bo',
      'ko',
      'ar',
      'th',
      'ru',
      'hi',
    ].includes(l)
  ) {
    return l as Language;
  }
  return 'zh-cn';
}

function detectLanguage(): Language {
  if (typeof navigator === 'undefined') return 'zh-cn';
  const lang = navigator.language.toLowerCase();
  if (lang.startsWith('zh-hk')) return 'zh-hk';
  if (lang.startsWith('zh-mo')) return 'zh-hk';
  if (lang.startsWith('zh-tw')) return 'zh-tw';
  if (lang.startsWith('zh-hant-hk')) return 'zh-hk';
  if (lang.startsWith('zh-hant-tw')) return 'zh-tw';
  if (lang.startsWith('zh-hant')) return 'zh-hant';
  if (lang.startsWith('zh')) return 'zh-cn';
  if (lang.startsWith('ja')) return 'ja';
  if (lang.startsWith('fr')) return 'fr';
  if (lang.startsWith('de')) return 'de';
  if (lang.startsWith('nl')) return 'nl';
  if (lang.startsWith('pl')) return 'pl';
  if (lang.startsWith('bo')) return 'bo';
  if (lang.startsWith('ko')) return 'ko';
  if (lang.startsWith('ar')) return 'ar';
  if (lang.startsWith('th')) return 'th';
  if (lang.startsWith('ru')) return 'ru';
  if (lang.startsWith('hi')) return 'hi';
  if (lang.startsWith('en-gb')) return 'en-gb';
  if (lang.startsWith('en-us')) return 'en-us';
  if (lang.startsWith('en')) return 'en-us';
  return 'en-us';
}

function shouldBeDark(): boolean {
  const hour = new Date().getHours();
  // Dark mode outside 6am–6pm
  return hour < 6 || hour >= 18;
}

function applyTheme(dark: boolean, hue: number) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  const normalizedHue = ((hue % 360) + 360) % 360;
  const titleHueStart = (normalizedHue + 315) % 360;
  const titleHueEnd = (normalizedHue + 45) % 360;

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
    root.style.setProperty('--title-grad-start', `hsl(${titleHueStart} 78% 67%)`);
    root.style.setProperty('--title-grad-mid', `hsl(${normalizedHue} 72% 58%)`);
    root.style.setProperty('--title-grad-end', `hsl(${titleHueEnd} 76% 64%)`);
    root.style.setProperty('--title-grad-shadow', 'rgba(96, 104, 210, 0.34)');
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
    root.style.setProperty('--title-grad-start', `hsl(${titleHueStart} 62% 70%)`);
    root.style.setProperty('--title-grad-mid', `hsl(${normalizedHue} 58% 64%)`);
    root.style.setProperty('--title-grad-end', `hsl(${titleHueEnd} 62% 68%)`);
    root.style.setProperty('--title-grad-shadow', 'rgba(94, 98, 152, 0.28)');
  }
  // Use HSL for hue-driven theme color so wheel hue matches UI hue 1:1.
  root.style.setProperty('--primary', `hsl(${hue} 82% 56%)`);
  root.style.setProperty('--accent', `hsl(${hue} 82% 56%)`);
  root.style.setProperty('--ring', `hsl(${hue} 82% 56%)`);
  root.style.setProperty('--glow', `hsl(${hue} 88% 56% / 0.52)`);
}

export function SettingsProvider({
  children,
  initialLanguage,
}: {
  children: ReactNode;
  initialLanguage?: Language;
}) {
  const pathname = usePathname();
  const [language, setLanguageState] = useState<Language>(normalizeLanguage(initialLanguage));
  const [primaryHue, setPrimaryHueState] = useState(155);
  const [isDark, setIsDarkState] = useState(true);

  useEffect(() => {
    const routeLocale = pathname.split('/').filter(Boolean)[0];
    const savedLang = normalizeLanguage(localStorage.getItem('cgsbs-language'));
    const resolvedLanguage = normalizeLanguage(routeLocale ?? initialLanguage ?? savedLang ?? detectLanguage());
    setLanguageState(resolvedLanguage);
    localStorage.setItem('cgsbs-language', resolvedLanguage);

    // Detect dark/light mode: check saved preference, else use time
    const savedDark = localStorage.getItem('cgsbs-dark');
    const dark = savedDark !== null ? savedDark === 'true' : shouldBeDark();
    setIsDarkState(dark);

    // Load hue
    const savedHue = localStorage.getItem('cgsbs-hue');
    const hue = savedHue ? parseInt(savedHue, 10) : 155;
    const validHue = isNaN(hue) ? 155 : hue;
    setPrimaryHueState(validHue);

  }, [initialLanguage, pathname]);

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
    const normalized = normalizeLanguage(lang);
    setLanguageState(normalized);
    localStorage.setItem('cgsbs-language', normalized);
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
