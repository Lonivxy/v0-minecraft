'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft } from 'lucide-react';

type UILanguage =
  | 'zh-cn'
  | 'zh-hant'
  | 'zh-hk'
  | 'zh-tw'
  | 'en-us'
  | 'en-gb'
  | 'ja'
  | 'fr'
  | 'de'
  | 'nl'
  | 'pl'
  | 'bo'
  | 'ko'
  | 'ar'
  | 'th'
  | 'ru'
  | 'hi';

const SUPPORTED_LOCALES: UILanguage[] = [
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
];

const notFoundCopy: Record<UILanguage, { title: string; description: string; backHome: string; codeLabel: string }> = {
  'zh-cn': {
    title: '页面不存在',
    description: '你访问的页面可能已移动、删除，或链接填写错误。',
    backHome: '返回主页',
    codeLabel: '错误代码',
  },
  'zh-hant': {
    title: '頁面不存在',
    description: '你造訪的頁面可能已移動、刪除，或連結輸入錯誤。',
    backHome: '返回主頁',
    codeLabel: '錯誤代碼',
  },
  'zh-hk': {
    title: '頁面不存在',
    description: '你造訪嘅頁面可能已搬走、刪除，或者連結輸入錯誤。',
    backHome: '返回主頁',
    codeLabel: '錯誤代碼',
  },
  'zh-tw': {
    title: '頁面不存在',
    description: '你造訪的頁面可能已移動、刪除，或連結輸入錯誤。',
    backHome: '返回主頁',
    codeLabel: '錯誤代碼',
  },
  'en-us': {
    title: 'Page Not Found',
    description: 'The page may have moved, been removed, or the URL might be incorrect.',
    backHome: 'Back To Home',
    codeLabel: 'Error Code',
  },
  'en-gb': {
    title: 'Page Not Found',
    description: 'The page may have moved, been removed, or the URL might be incorrect.',
    backHome: 'Back To Home',
    codeLabel: 'Error Code',
  },
  ja: {
    title: 'ページが見つかりません',
    description: 'ページは移動・削除されたか、URL が間違っている可能性があります。',
    backHome: 'ホームへ戻る',
    codeLabel: 'エラーコード',
  },
  fr: {
    title: 'Page introuvable',
    description: 'La page a peut-etre ete deplacee, supprimee, ou l URL est incorrecte.',
    backHome: 'Retour a l accueil',
    codeLabel: 'Code erreur',
  },
  de: {
    title: 'Seite nicht gefunden',
    description: 'Die Seite wurde moeglicherweise verschoben, geloescht oder die URL ist falsch.',
    backHome: 'Zur Startseite',
    codeLabel: 'Fehlercode',
  },
  nl: {
    title: 'Pagina niet gevonden',
    description: 'De pagina is mogelijk verplaatst, verwijderd of de URL is onjuist.',
    backHome: 'Terug naar home',
    codeLabel: 'Foutcode',
  },
  pl: {
    title: 'Nie znaleziono strony',
    description: 'Strona mogla zostac przeniesiona, usunieta lub adres URL jest niepoprawny.',
    backHome: 'Wroc do strony glownej',
    codeLabel: 'Kod bledu',
  },
  bo: {
    title: 'ཤོག་ངོས་མ་རྙེད།',
    description: 'ཤོག་ངོས་འདི་སྤོས་པ་ཡིན་སྲིད། ཡང་ན་བསུབས་པ་ཡིན་སྲིད། URL ཡང་ནོར་སྲིད།',
    backHome: 'གཙོ་ངོས་ལ་ལོག',
    codeLabel: 'ནོར་འཁྲུལ་ཨང',
  },
  ko: {
    title: '페이지를 찾을 수 없습니다',
    description: '페이지가 이동되었거나 삭제되었거나, 주소가 잘못되었을 수 있습니다.',
    backHome: '홈으로 돌아가기',
    codeLabel: '오류 코드',
  },
  ar: {
    title: 'الصفحة غير موجودة',
    description: 'قد تكون الصفحة قد نُقلت أو حُذفت أو أن الرابط غير صحيح.',
    backHome: 'العودة الى الرئيسية',
    codeLabel: 'رمز الخطأ',
  },
  th: {
    title: 'ไม่พบหน้าเว็บ',
    description: 'หน้านี้อาจถูกย้าย ลบออก หรือ URL ไม่ถูกต้อง',
    backHome: 'กลับหน้าแรก',
    codeLabel: 'รหัสข้อผิดพลาด',
  },
  ru: {
    title: 'Страница не найдена',
    description: 'Страница могла быть перемещена, удалена или URL введен неверно.',
    backHome: 'Вернуться на главную',
    codeLabel: 'Код ошибки',
  },
  hi: {
    title: 'पेज नहीं मिला',
    description: 'यह पेज स्थानांतरित किया गया हो सकता है, हटाया गया हो सकता है, या URL गलत हो सकता है।',
    backHome: 'होम पेज पर लौटें',
    codeLabel: 'त्रुटि कोड',
  },
};

function normalizeLocale(locale: string | undefined): UILanguage | null {
  if (!locale) return null;
  const value = locale.toLowerCase();
  if (value === 'zh') return 'zh-cn';
  if (value === 'en') return 'en-us';
  if (SUPPORTED_LOCALES.includes(value as UILanguage)) return value as UILanguage;
  return null;
}

function detectBrowserLocale(): UILanguage {
  if (typeof navigator === 'undefined') return 'zh-cn';
  const nav = navigator.language.toLowerCase();
  if (nav.startsWith('zh-hk') || nav.startsWith('zh-mo')) return 'zh-hk';
  if (nav.startsWith('zh-tw')) return 'zh-tw';
  if (nav.startsWith('zh-hant')) return 'zh-hant';
  if (nav.startsWith('zh')) return 'zh-cn';
  if (nav.startsWith('en-gb')) return 'en-gb';
  if (nav.startsWith('en')) return 'en-us';
  if (nav.startsWith('ja')) return 'ja';
  if (nav.startsWith('fr')) return 'fr';
  if (nav.startsWith('de')) return 'de';
  if (nav.startsWith('nl')) return 'nl';
  if (nav.startsWith('pl')) return 'pl';
  if (nav.startsWith('bo')) return 'bo';
  if (nav.startsWith('ko')) return 'ko';
  if (nav.startsWith('ar')) return 'ar';
  if (nav.startsWith('th')) return 'th';
  if (nav.startsWith('ru')) return 'ru';
  if (nav.startsWith('hi')) return 'hi';
  return 'en-us';
}

export default function NotFoundView() {
  const pathname = usePathname();
  const localeFromPath = useMemo(() => normalizeLocale(pathname.split('/').filter(Boolean)[0]), [pathname]);
  const [uiLanguage, setUiLanguage] = useState<UILanguage>(localeFromPath ?? 'zh-cn');

  useEffect(() => {
    if (localeFromPath) {
      setUiLanguage(localeFromPath);
      return;
    }
    setUiLanguage(detectBrowserLocale());
  }, [localeFromPath]);

  const copy = notFoundCopy[uiLanguage];
  const homePath = `/${uiLanguage}`;

  return (
    <main className="min-h-screen relative overflow-hidden bg-background text-foreground flex items-center justify-center px-4">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 -left-1/3 w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-20" />
        <div className="absolute bottom-1/3 -right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl opacity-20" />
      </div>

      <section className="relative z-10 w-full max-w-2xl glass-strong rounded-3xl border border-glass-border p-8 sm:p-10 text-center animate-scale-in">
        <p className="text-7xl sm:text-8xl font-black animate-title-gradient leading-none mb-5">404</p>
        <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-balance">{copy.title}</h1>
        <p className="text-foreground/75 text-base sm:text-lg mb-8">{copy.description}</p>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass border border-primary/35 text-xs text-foreground/70 mb-6">
          <span>{copy.codeLabel}</span>
          <span className="font-mono text-primary">404_NOT_FOUND</span>
        </div>

        <div>
          <Link
            href={homePath}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:brightness-110 transition-all duration-300 hover:scale-105"
          >
            <ArrowLeft className="w-4 h-4" />
            {copy.backHome}
          </Link>
        </div>
      </section>
    </main>
  );
}
