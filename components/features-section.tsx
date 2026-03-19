'use client';

import { useEffect, useState, useRef } from 'react';
import { Eye, Zap, Gamepad2, ExternalLink } from 'lucide-react';
import { useSettings } from '@/lib/settings-context';
import type { Language } from '@/lib/i18n';

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

type LauncherId = 'pcl2' | 'pclce' | 'hmcl' | 'atlauncher' | 'prism' | 'lunar';

interface LauncherItem {
  id: LauncherId;
  name: string;
  url: string;
}

function normalizeUILanguage(language: Language): UILanguage {
  if (language === 'zh') return 'zh-cn';
  if (language === 'en') return 'en-us';
  return language;
}

const launcherSectionCopy: Record<UILanguage, { title: string; subtitle: string; openLink: string }> = {
  'zh-cn': {
    title: '常用启动器推荐',
    subtitle: '这里整理了常见启动器的官方链接与简介，点击即可前往下载或发布页面。',
    openLink: '打开链接',
  },
  'zh-hant': {
    title: '常用啟動器推薦',
    subtitle: '這裡整理了常見啟動器的官方連結與簡介，點擊即可前往下載或發佈頁面。',
    openLink: '開啟連結',
  },
  'zh-hk': {
    title: '常用啟動器推薦',
    subtitle: '呢度整理咗常見啟動器嘅官方連結同簡介，撳一下就可以去下載或發佈頁。',
    openLink: '開啟連結',
  },
  'zh-tw': {
    title: '常用啟動器推薦',
    subtitle: '這裡整理了常見啟動器的官方連結與簡介，點擊即可前往下載或發佈頁面。',
    openLink: '開啟連結',
  },
  'en-us': {
    title: 'Recommended Launchers',
    subtitle: 'Official links and short intros for popular launchers. Click to open their download or release pages.',
    openLink: 'Open Link',
  },
  'en-gb': {
    title: 'Recommended Launchers',
    subtitle: 'Official links and short intros for popular launchers. Click to open their download or release pages.',
    openLink: 'Open Link',
  },
  ja: {
    title: 'おすすめランチャー',
    subtitle: 'よく使われるランチャーの公式リンクと簡単な紹介です。クリックで配布ページへ移動できます。',
    openLink: 'リンクを開く',
  },
  fr: {
    title: 'Lanceurs recommandes',
    subtitle: 'Liens officiels et presentation rapide des lanceurs populaires. Cliquez pour ouvrir la page de telechargement.',
    openLink: 'Ouvrir le lien',
  },
  de: {
    title: 'Empfohlene Launcher',
    subtitle: 'Offizielle Links und kurze Einfuehrungen zu beliebten Launchern. Klicke fuer Download oder Releases.',
    openLink: 'Link oeffnen',
  },
  nl: {
    title: 'Aanbevolen launchers',
    subtitle: 'Officiele links en korte uitleg van populaire launchers. Klik om de download- of releasepagina te openen.',
    openLink: 'Link openen',
  },
  pl: {
    title: 'Polecane launchery',
    subtitle: 'Oficjalne linki i krotkie opisy popularnych launcherow. Kliknij, aby otworzyc strone pobierania.',
    openLink: 'Otworz link',
  },
  bo: {
    title: 'འདེམས་བསྐོས་ཀྱི་ Launcher',
    subtitle: 'Launcher མང་པོའི་དངོས་མའི་སྦྲེལ་མཐུད་དང་ངོ་སྤྲོད་ཐུང་ངུ་བསྒྲིགས་ཡོད།',
    openLink: 'སྦྲེལ་མཐུད་འབྱེད',
  },
  ko: {
    title: '추천 런처',
    subtitle: '자주 쓰는 런처의 공식 링크와 간단한 소개입니다. 클릭하면 다운로드/릴리스 페이지로 이동합니다.',
    openLink: '링크 열기',
  },
  ar: {
    title: 'المشغلات الموصى بها',
    subtitle: 'روابط رسمية مع تعريفات قصيرة لاشهر المشغلات. اضغط لفتح صفحة التنزيل او الإصدارات.',
    openLink: 'فتح الرابط',
  },
  th: {
    title: 'ตัวเปิดเกมที่แนะนำ',
    subtitle: 'รวมลิงก์ทางการและคำแนะนำสั้นๆ ของตัวเปิดเกมยอดนิยม คลิกเพื่อไปยังหน้าดาวน์โหลดหรือรีลีส',
    openLink: 'เปิดลิงก์',
  },
  ru: {
    title: 'Рекомендуемые лаунчеры',
    subtitle: 'Официальные ссылки и краткие описания популярных лаунчеров. Нажмите, чтобы открыть страницу загрузки.',
    openLink: 'Открыть ссылку',
  },
  hi: {
    title: 'अनुशंसित लॉन्चर',
    subtitle: 'लोकप्रिय लॉन्चरों के आधिकारिक लिंक और छोटे परिचय यहां दिए गए हैं। क्लिक करके डाउनलोड या रिलीज पेज खोलें।',
    openLink: 'लिंक खोलें',
  },
};

const launcherDescriptions: Record<UILanguage, Record<LauncherId, string>> = {
  'zh-cn': {
    pcl2: 'PCL2 官方发布页，适合追踪稳定版本与更新记录。',
    pclce: 'PCL 社区版发布页，提供社区维护的增强功能与修复。',
    hmcl: '经典跨平台启动器，支持 Fabric/Forge/NeoForge 等一键安装。',
    atlauncher: '偏向整合包管理体验，适合管理多整合包与多实例。',
    prism: '开源多实例启动器，适合精细管理版本、模组与实例。',
    lunar: '主打性能优化与 PvP 体验，内置常用功能模组。',
  },
  'zh-hant': {
    pcl2: 'PCL2 官方發佈頁，適合追蹤穩定版本與更新記錄。',
    pclce: 'PCL 社群版發佈頁，提供社群維護的增強功能與修復。',
    hmcl: '經典跨平台啟動器，支援 Fabric/Forge/NeoForge 等一鍵安裝。',
    atlauncher: '偏向整合包管理體驗，適合管理多整合包與多實例。',
    prism: '開源多實例啟動器，適合精細管理版本、模組與實例。',
    lunar: '主打效能優化與 PvP 體驗，內建常用功能模組。',
  },
  'zh-hk': {
    pcl2: 'PCL2 官方發佈頁，方便追蹤穩定版本同更新記錄。',
    pclce: 'PCL 社群版發佈頁，提供社群維護嘅增強功能同修復。',
    hmcl: '經典跨平台啟動器，支援 Fabric/Forge/NeoForge 等一鍵安裝。',
    atlauncher: '偏向整合包管理體驗，適合管理多整合包同多實例。',
    prism: '開源多實例啟動器，適合精細管理版本、模組同實例。',
    lunar: '主打效能優化同 PvP 體驗，內建常用功能模組。',
  },
  'zh-tw': {
    pcl2: 'PCL2 官方發佈頁，適合追蹤穩定版本與更新記錄。',
    pclce: 'PCL 社群版發佈頁，提供社群維護的增強功能與修復。',
    hmcl: '經典跨平台啟動器，支援 Fabric/Forge/NeoForge 等一鍵安裝。',
    atlauncher: '偏向整合包管理體驗，適合管理多整合包與多實例。',
    prism: '開源多實例啟動器，適合精細管理版本、模組與實例。',
    lunar: '主打效能優化與 PvP 體驗，內建常用功能模組。',
  },
  'en-us': {
    pcl2: 'Official PCL2 release page for tracking stable builds and changelogs.',
    pclce: 'Community Edition release page with community-maintained fixes and extra features.',
    hmcl: 'Classic cross-platform launcher with one-click support for Fabric, Forge, and NeoForge.',
    atlauncher: 'Great for modpack workflows, with convenient multi-pack and multi-instance management.',
    prism: 'Open-source multi-instance launcher focused on clean version and mod management.',
    lunar: 'Performance and PvP focused client with commonly used built-in mods.',
  },
  'en-gb': {
    pcl2: 'Official PCL2 release page for tracking stable builds and changelogs.',
    pclce: 'Community Edition release page with community-maintained fixes and extra features.',
    hmcl: 'Classic cross-platform launcher with one-click support for Fabric, Forge, and NeoForge.',
    atlauncher: 'Great for modpack workflows, with convenient multi-pack and multi-instance management.',
    prism: 'Open-source multi-instance launcher focused on clean version and mod management.',
    lunar: 'Performance and PvP focused client with commonly used built-in mods.',
  },
  ja: {
    pcl2: 'PCL2 の公式リリースページ。安定版と更新履歴を確認できます。',
    pclce: 'コミュニティ版 PCL のリリースページ。追加修正や拡張機能を追えます。',
    hmcl: '定番のクロスプラットフォームランチャー。各種ローダー導入が簡単です。',
    atlauncher: 'Modパック管理に向いたランチャー。複数パックを扱いやすいです。',
    prism: 'オープンソースの多インスタンスランチャー。版管理とMod管理に強いです。',
    lunar: 'PvP とパフォーマンス重視のクライアント。便利な機能Modを内蔵しています。',
  },
  fr: {
    pcl2: 'Page officielle des versions PCL2 pour suivre les versions stables et les mises a jour.',
    pclce: 'Page de la version communautaire PCL avec correctifs et fonctions supplementaires.',
    hmcl: 'Lanceur multiplateforme classique avec installation simple de Fabric/Forge/NeoForge.',
    atlauncher: 'Tres pratique pour les modpacks et la gestion de plusieurs instances.',
    prism: 'Lanceur open source multi-instances, ideal pour gerer versions et mods.',
    lunar: 'Client oriente performances et PvP, avec des mods utiles integres.',
  },
  de: {
    pcl2: 'Offizielle PCL2-Release-Seite zum Verfolgen stabiler Versionen und Aenderungen.',
    pclce: 'Release-Seite der Community Edition mit zusaetzlichen Fixes und Funktionen.',
    hmcl: 'Bewaehrter plattformuebergreifender Launcher mit einfacher Loader-Installation.',
    atlauncher: 'Besonders gut fuer Modpacks und die Verwaltung mehrerer Instanzen geeignet.',
    prism: 'Open-Source-Launcher fuer mehrere Instanzen mit sauberem Versions- und Mod-Management.',
    lunar: 'Auf Leistung und PvP fokussierter Client mit nuetzlichen integrierten Mods.',
  },
  nl: {
    pcl2: 'Officiele PCL2-releasepagina om stabiele versies en updates te volgen.',
    pclce: 'Releasepagina van de PCL Community Edition met extra fixes en functies.',
    hmcl: 'Klassieke cross-platform launcher met makkelijke installatie van loaders.',
    atlauncher: 'Sterk gericht op modpack-beheer en handig voor meerdere instances.',
    prism: 'Open-source multi-instance launcher voor nette versie- en modbeheer.',
    lunar: 'Prestatie- en PvP-gerichte client met ingebouwde veelgebruikte mods.',
  },
  pl: {
    pcl2: 'Oficjalna strona wydań PCL2 do śledzenia stabilnych wersji i zmian.',
    pclce: 'Strona wydań społecznościowej wersji PCL z dodatkowymi poprawkami.',
    hmcl: 'Klasyczny launcher wieloplatformowy z łatwą instalacją loaderów.',
    atlauncher: 'Dobry do pracy z modpackami i zarządzania wieloma instancjami.',
    prism: 'Otwartoźródłowy launcher wielu instancji do wygodnego zarządzania wersjami i modami.',
    lunar: 'Klient nastawiony na wydajność i PvP z wbudowanymi przydatnymi modami.',
  },
  bo: {
    pcl2: 'PCL2 གི་དངོས་མའི་འགྲེམས་སྤེལ་ཤོག་ངོས། པར་གཞི་བརྟན་པོ་དང་གསར་བཅོས་ལྟ་ཐུབ།',
    pclce: 'PCL སྤྱི་ཚོགས་པའི་པར་གཞི་ཤོག་ངོས། སྣོན་མའི་བཅོས་བསྒྱུར་དང་ནུས་ལྡན་ཡོད།',
    hmcl: 'མ་ལག་མང་པོར་སྤྱོད་ཐུབ་པའི launcher གསུམ་སྒྲིག་བཀོལ་སྤྱོད་སླ་པོ།',
    atlauncher: 'modpack དོ་དམ་ལ་འཚམས་པ་དང་ཚོགས་པའི instance མང་པོ་དོ་དམ་བྱེད་ཐུབ།',
    prism: 'open source ཡིན་པའི multi-instance launcher དང་པར་གཞི་དང mod དོ་དམ་ལ་འཚམས།',
    lunar: 'མྱུར་ཚད་དང PvP ལ་གཙོ་བོར་དམིགས་པའི client ཡིན་པས mod འགའ་ཤས་ནང་བཞག་ཡོད།',
  },
  ko: {
    pcl2: 'PCL2 공식 릴리스 페이지로, 안정 버전과 업데이트 내역을 확인하기 좋습니다.',
    pclce: 'PCL 커뮤니티 에디션 릴리스 페이지로, 커뮤니티 수정 사항과 기능을 볼 수 있습니다.',
    hmcl: '대표적인 크로스플랫폼 런처로 Fabric/Forge/NeoForge 설치가 편리합니다.',
    atlauncher: '모드팩 관리에 강한 런처로 여러 팩과 인스턴스 운영에 적합합니다.',
    prism: '오픈소스 멀티 인스턴스 런처로 버전/모드 관리를 깔끔하게 할 수 있습니다.',
    lunar: '성능 최적화와 PvP 중심 클라이언트로 자주 쓰는 기능 모드를 내장합니다.',
  },
  ar: {
    pcl2: 'صفحة الإصدارات الرسمية لـ PCL2 لمتابعة النسخ المستقرة وسجل التحديثات.',
    pclce: 'صفحة إصدار نسخة المجتمع من PCL مع إصلاحات وميزات إضافية.',
    hmcl: 'مشغل متعدد المنصات معروف مع تثبيت سهل لـ Fabric وForge وNeoForge.',
    atlauncher: 'مناسب لإدارة حزم المودات وتشغيل عدة حزم ونسخ بسهولة.',
    prism: 'مشغل مفتوح المصدر متعدد النسخ لإدارة الإصدارات والمودات بشكل منظم.',
    lunar: 'عميل يركز على الأداء وPvP مع مودات مفيدة مدمجة.',
  },
  th: {
    pcl2: 'หน้ารวมรีลีสทางการของ PCL2 สำหรับติดตามเวอร์ชันเสถียรและบันทึกอัปเดต',
    pclce: 'หน้ารวมรีลีสของ PCL Community Edition พร้อมฟีเจอร์และการแก้ไขจากชุมชน',
    hmcl: 'ตัวเปิดเกมข้ามแพลตฟอร์มยอดนิยม ติดตั้ง Fabric/Forge/NeoForge ได้สะดวก',
    atlauncher: 'เหมาะกับการจัดการม็อดแพ็ก และการดูแลหลายอินสแตนซ์',
    prism: 'ตัวเปิดเกมโอเพนซอร์สแบบหลายอินสแตนซ์ จัดการเวอร์ชันและม็อดได้เป็นระบบ',
    lunar: 'ไคลเอนต์เน้นประสิทธิภาพและ PvP พร้อมม็อดยอดนิยมในตัว',
  },
  ru: {
    pcl2: 'Официальная страница релизов PCL2 для отслеживания стабильных версий и изменений.',
    pclce: 'Страница релизов PCL Community Edition с дополнительными исправлениями и функциями.',
    hmcl: 'Классический кроссплатформенный лаунчер с удобной установкой Fabric/Forge/NeoForge.',
    atlauncher: 'Подходит для работы с модпаками и управления несколькими инстансами.',
    prism: 'Open-source лаунчер с несколькими инстансами для аккуратного управления версиями и модами.',
    lunar: 'Клиент с упором на производительность и PvP, с набором встроенных полезных модов.',
  },
  hi: {
    pcl2: 'PCL2 का आधिकारिक रिलीज पेज, स्थिर संस्करण और अपडेट इतिहास देखने के लिए उपयुक्त।',
    pclce: 'PCL Community Edition का रिलीज पेज, जिसमें समुदाय द्वारा सुधार और अतिरिक्त फीचर मिलते हैं।',
    hmcl: 'लोकप्रिय क्रॉस-प्लेटफॉर्म लॉन्चर, Fabric/Forge/NeoForge इंस्टॉल करना आसान बनाता है।',
    atlauncher: 'मॉडपैक प्रबंधन के लिए अच्छा विकल्प, कई पैक और इंस्टेंस संभालने में सहायक।',
    prism: 'ओपन-सोर्स मल्टी-इंस्टेंस लॉन्चर, संस्करण और मॉड प्रबंधन के लिए उपयुक्त।',
    lunar: 'परफॉर्मेंस और PvP केंद्रित क्लाइंट, सामान्य उपयोग के फीचर मॉड के साथ।',
  },
};

const launchers: LauncherItem[] = [
  { id: 'pcl2', name: 'PCL2', url: 'https://github.com/Meloong-Git/PCL/releases' },
  { id: 'pclce', name: 'PCL CE', url: 'https://github.com/PCL-Community/PCL-CE/releases' },
  { id: 'hmcl', name: 'HMCL', url: 'https://hmcl.huangyuhui.net/download/' },
  { id: 'atlauncher', name: 'ATLauncher', url: 'https://atlauncher.com/downloads' },
  { id: 'prism', name: 'Prism Launcher', url: 'https://prismlauncher.org/download/' },
  { id: 'lunar', name: 'Lunar Client', url: 'https://www.lunarclient.com/download' },
];

export default function FeaturesSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const { t, language } = useSettings();
  const uiLanguage = normalizeUILanguage(language);
  const sectionCopy = launcherSectionCopy[uiLanguage];
  const descriptions = launcherDescriptions[uiLanguage];

  const features = [
    {
      icon: Eye,
      title: t.features.hideAndSeek,
      description: t.features.hideAndSeekDesc,
      color: 'from-orange-500 to-red-500',
      iconBg: 'bg-orange-500/20',
      iconColor: 'text-orange-400',
    },
    {
      icon: Gamepad2,
      title: t.features.gameModes,
      description: t.features.gameModesDesc,
      color: 'from-primary to-cyan-500',
      iconBg: 'bg-primary/20',
      iconColor: 'text-primary',
      link: 'https://minecraft-mcworld.com/70901/',
    },
    {
      icon: Zap,
      title: t.features.bgpNetwork,
      description: t.features.bgpNetworkDesc,
      color: 'from-cyan-500 to-blue-500',
      iconBg: 'bg-cyan-500/20',
      iconColor: 'text-cyan-400',
    },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-20 px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="max-w-7xl mx-auto">
        <div className={`text-center mb-16 ${isVisible ? 'animate-slide-up' : 'opacity-0'}`}>
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4 text-balance">
            {t.features.title} <span className="animate-title-gradient inline-block">CGSBS</span>
          </h2>
          <p className="text-foreground/70 max-w-2xl mx-auto text-lg">
            {t.features.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className={`glass-strong rounded-2xl p-8 border border-glass-border hover:border-primary/50 transition-all duration-500 hover:scale-105 hover:-translate-y-3 hover:shadow-2xl hover:shadow-primary/10 group cursor-pointer will-change-transform ${isVisible ? 'animate-slide-up' : 'opacity-0'}`}
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className={`w-16 h-16 rounded-xl ${feature.iconBg} flex items-center justify-center mb-6 group-hover:scale-110 transition-all duration-300`}>
                  <Icon className={`w-8 h-8 ${feature.iconColor}`} />
                </div>

                <h3 className="text-2xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors duration-300">
                  {feature.title}
                </h3>

                <p className="text-foreground/70 leading-relaxed">
                  {feature.description}
                </p>
                {feature.link && (
                  <a
                    href={feature.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex mt-4 text-sm text-primary hover:text-cyan-400 underline underline-offset-4 transition-colors"
                  >
                    https://minecraft-mcworld.com/70901/
                  </a>
                )}

                <div className={`h-1 w-0 group-hover:w-full bg-gradient-to-r ${feature.color} mt-6 transition-all duration-500 rounded-full`} />
              </div>
            );
          })}
        </div>

        <div
          id="launchers"
          className={`mt-20 ${isVisible ? 'animate-slide-up' : 'opacity-0'}`}
          style={{ animationDelay: '300ms' }}
        >
          <div className="text-center mb-8">
            <h3 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
              {sectionCopy.title}
            </h3>
            <p className="text-foreground/70 max-w-3xl mx-auto">
              {sectionCopy.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {launchers.map((launcher, index) => (
              <article
                key={launcher.name}
                className="glass-strong rounded-2xl p-6 border border-glass-border hover:border-primary/50 transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1"
                style={{ animationDelay: `${index * 80}ms` }}
              >
                <div className="flex items-center justify-between gap-3 mb-3">
                  <h4 className="text-xl font-bold text-foreground">{launcher.name}</h4>
                  <a
                    href={launcher.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-primary hover:text-cyan-400 transition-colors"
                  >
                    {sectionCopy.openLink}
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
                <p className="text-foreground/75 leading-relaxed text-sm">
                  {descriptions[launcher.id]}
                </p>
                <a
                  href={launcher.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex mt-4 text-xs sm:text-sm text-foreground/70 hover:text-primary underline underline-offset-4 break-all transition-colors"
                >
                  {launcher.url}
                </a>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
