'use client';

import { Languages } from 'lucide-react';
import { useSettings } from '@/lib/settings-context';

type OverlayLocale = 'zhHans' | 'zhHant' | 'en';

function resolveOverlayLocale(language: string): OverlayLocale {
  const normalized = language.toLowerCase();
  if (normalized === 'zh-hant' || normalized === 'zh-hk' || normalized === 'zh-tw') return 'zhHant';
  if (normalized.startsWith('zh')) return 'zhHans';
  return 'en';
}

const overlayCopy = {
  title: {
    zhHans: '正在加载页面',
    zhHant: '正在載入頁面',
    en: 'Loading Page',
  },
  subtitle: {
    zhHans: '提示: 右上角可更改语言',
    zhHant: '提示: 右上角可更改語言',
    en: 'Tip: change language at the top-right corner',
  },
  hintsTitle: {
    zhHans: '多语言提示',
    zhHant: '多語言提示',
    en: 'Multilingual Hint',
  },
} as const;

const multilingualHints = [
  '简体中文: 右上角可更改语言',
  '繁體中文: 右上角可更改語言',
  'English: Change language in the top-right corner',
  'English (UK): Change language in the top-right corner',
  '日本語: 右上で言語を変更できます',
  'Français: Vous pouvez changer la langue en haut a droite',
  'Deutsch: Oben rechts kannst du die Sprache wechseln',
  'Nederlands: Rechtsboven kun je de taal wijzigen',
  'Polski: Jezyk mozna zmienic w prawym gornym rogu',
  'བོད་ཡིག: གཡས་སྟེང་ནས་སྐད་ཡིག་བསྒྱུར་ཐུབ།',
  '한국어: 오른쪽 상단에서 언어를 변경할 수 있습니다',
  'العربية: يمكنك تغيير اللغة من اعلى اليمين',
  'ไทย: เปลี่ยนภาษาได้ที่มุมขวาบน',
  'Русский: Язык можно изменить в правом верхнем углу',
  'हिन्दी: आप ऊपर दाईं ओर भाषा बदल सकते हैं',
];

export default function LoadingOverlay() {
  const { language, isPageLoading } = useSettings();
  const locale = resolveOverlayLocale(language);

  return (
    <div
      className={`fixed inset-0 z-[120] flex items-center justify-center px-4 transition-all duration-500 ${
        isPageLoading ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
      aria-live="polite"
      aria-busy={isPageLoading}
    >
      <div className="absolute inset-0 bg-background/85 backdrop-blur-md" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_18%,rgba(34,197,94,0.28),transparent_42%),radial-gradient(circle_at_84%_80%,rgba(34,211,238,0.2),transparent_44%)]" />

      <section className="relative w-full max-w-3xl glass-strong rounded-2xl border border-primary/35 p-6 sm:p-8 shadow-2xl shadow-primary/20">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="w-10 h-10 rounded-xl bg-primary/25 border border-primary/50 flex items-center justify-center animate-pulse-glow">
            <Languages className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-foreground">{overlayCopy.title[locale]}</h2>
            <p className="text-sm text-foreground/75">{overlayCopy.subtitle[locale]}</p>
          </div>
        </div>

        <div className="mt-5 h-1.5 rounded-full bg-foreground/10 overflow-hidden">
          <div className="h-full w-full bg-gradient-to-r from-primary via-cyan-400 to-primary animate-pulse" />
        </div>

        <div className="mt-5">
          <p className="text-xs uppercase tracking-[0.18em] text-foreground/55 mb-3">
            {overlayCopy.hintsTitle[locale]}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-44 overflow-auto pr-1">
            {multilingualHints.map((hint, index) => (
              <p
                key={hint}
                className={`text-xs sm:text-sm text-foreground/82 ${
                  isPageLoading ? 'animate-slide-up' : 'opacity-0'
                }`}
                style={{ animationDelay: `${index * 45}ms` }}
              >
                {hint}
              </p>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
