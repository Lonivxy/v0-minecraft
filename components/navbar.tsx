'use client';

import { useState, useEffect, useRef } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, Sun, Moon, Globe, Palette } from 'lucide-react';
import { useSettings } from '@/lib/settings-context';
import { Language } from '@/lib/i18n';

const LANGUAGES: { code: Language; label: string }[] = [
  { code: 'zh-cn', label: '简体中文' },
  { code: 'zh-hant', label: '繁體中文' },
  { code: 'zh-hk', label: '香港中文' },
  { code: 'zh-tw', label: '台灣中文' },
  { code: 'en-us', label: 'English (US)' },
  { code: 'en-gb', label: 'English (UK)' },
  { code: 'ja', label: '日本語' },
  { code: 'fr', label: 'Français' },
  { code: 'de', label: 'Deutsch' },
  { code: 'nl', label: 'Nederlands' },
  { code: 'pl', label: 'Polski' },
  { code: 'bo', label: 'བོད་ཡིག' },
  { code: 'ko', label: '한국어' },
  { code: 'ar', label: 'العربية' },
  { code: 'th', label: 'ไทย' },
  { code: 'ru', label: 'Русский' },
  { code: 'hi', label: 'हिन्दी' },
];

const HUE_PRESETS = [155, 180, 220, 260, 320, 30, 60];

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [colorOpen, setColorOpen] = useState(false);
  const { t, language, setLanguage, isDark, setIsDark, primaryHue, setPrimaryHue } = useSettings();
  const langRef = useRef<HTMLDivElement>(null);
  const colorRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [chromaMode, setChromaMode] = useState(false);
  const chromaIndexRef = useRef(0);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (langRef.current && !langRef.current.contains(e.target as Node)) setLangOpen(false);
      if (colorRef.current && !colorRef.current.contains(e.target as Node)) {
        setColorOpen(false);
        setChromaMode(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  useEffect(() => {
    if (!chromaMode || !colorOpen) return;
    const timer = window.setInterval(() => {
      chromaIndexRef.current = (chromaIndexRef.current + 1) % 256;
      const nextHue = (chromaIndexRef.current / 255) * 360;
      setPrimaryHue(nextHue);
    }, 80);
    return () => window.clearInterval(timer);
  }, [chromaMode, colorOpen, setPrimaryHue]);

  // Draw color wheel on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !colorOpen) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const r = Math.min(cx, cy) - 4;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let angle = 0; angle < 360; angle++) {
      const start = (angle - 1) * Math.PI / 180;
      const end = (angle + 1) * Math.PI / 180;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, r, start, end);
      ctx.closePath();
      ctx.fillStyle = `hsl(${angle}, 80%, 55%)`;
      ctx.fill();
    }
    // Inner dark circle
    ctx.beginPath();
    ctx.arc(cx, cy, r * 0.45, 0, Math.PI * 2);
    ctx.fillStyle = isDark ? 'rgba(15,15,25,0.92)' : 'rgba(240,240,250,0.92)';
    ctx.fill();
    // Selection indicator
    const selAngle = primaryHue * Math.PI / 180;
    const ir = r * 0.725;
    const ix = cx + Math.cos(selAngle) * ir;
    const iy = cy + Math.sin(selAngle) * ir;
    ctx.beginPath();
    ctx.arc(ix, iy, 9, 0, Math.PI * 2);
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(ix, iy, 5, 0, Math.PI * 2);
    ctx.fillStyle = `hsl(${primaryHue}, 80%, 55%)`;
    ctx.fill();
  }, [primaryHue, colorOpen, isDark]);

  const updateHueFromPointer = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left - rect.width / 2;
    const y = clientY - rect.top - rect.height / 2;
    const dist = Math.sqrt(x * x + y * y);
    const r = Math.min(rect.width, rect.height) / 2 - 4;
    if (dist > r * 0.45 && dist < r) {
      let angle = Math.atan2(y, x) * 180 / Math.PI;
      if (angle < 0) angle += 360;
      setChromaMode(false);
      chromaIndexRef.current = Math.round((angle / 360) * 255);
      setPrimaryHue(Math.round(angle));
    }
  };

  const handlePointerDown = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
    updateHueFromPointer(e.clientX, e.clientY);
  };

  const handlePointerMove = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    if (!isDragging) return;
    updateHueFromPointer(e.clientX, e.clientY);
  };

  const handlePointerUp = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    setIsDragging(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  const navItems = [
    { label: t.nav.home, href: '#hero' },
    { label: t.nav.rules, href: '#rules' },
  ];

  const switchLanguageRoute = (lang: Language) => {
    const segments = pathname.split('/').filter(Boolean);
    const remaining = segments.length > 1 ? segments.slice(1) : [];
    const hash = typeof window !== 'undefined' ? window.location.hash : '';
    router.push(`/${lang}${remaining.length ? `/${remaining.join('/')}` : ''}${hash}`);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'py-2' : 'py-4'}`}>
      <div className={`glass-strong mx-4 rounded-xl border border-glass-border transition-all duration-500 ${scrolled ? 'shadow-lg shadow-primary/10' : ''}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <a href="#hero" className="flex-shrink-0 group">
              <span className="text-2xl font-bold glow-text transition-all duration-300 group-hover:scale-110 inline-block">CGSBS</span>
            </a>

            {/* Desktop: nav links + controls */}
            <div className="hidden md:flex items-center gap-2">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-foreground hover:bg-primary/20 hover:text-primary transition-all duration-300 hover:scale-105"
                >
                  {item.label}
                </a>
              ))}

              {/* Divider */}
              <div className="w-px h-6 bg-foreground/20 mx-1" />

              {/* Day/Night toggle */}
              <button
                onClick={() => setIsDark(!isDark)}
                title={isDark ? t.settings.lightMode : t.settings.darkMode}
                className="p-2 rounded-lg hover:bg-primary/20 hover:text-primary text-foreground/70 transition-all duration-300 hover:scale-110"
              >
                {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>

              {/* Language dropdown */}
              <div ref={langRef} className="relative">
                <button
                  onClick={() => { setLangOpen(!langOpen); setColorOpen(false); }}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-primary/20 hover:text-primary text-foreground/70 transition-all duration-300 text-sm font-medium"
                >
                  <Globe className="w-4 h-4" />
                  <span>{LANGUAGES.find(l => l.code === language)?.label}</span>
                </button>
                {langOpen && (
                  <div className="absolute right-0 top-full mt-2 w-44 glass-strong rounded-xl border border-glass-border shadow-xl overflow-hidden animate-scale-in">
                    {LANGUAGES.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setLanguage(lang.code);
                          setLangOpen(false);
                          switchLanguageRoute(lang.code);
                        }}
                        className={`w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-primary/20 ${
                          language === lang.code ? 'text-primary font-semibold' : 'text-foreground/80'
                        }`}
                      >
                        {lang.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Color picker dropdown */}
              <div ref={colorRef} className="relative">
                <button
                  onClick={() => { setColorOpen(!colorOpen); setLangOpen(false); }}
                  className={`p-2 rounded-lg hover:bg-primary/20 transition-all duration-300 hover:scale-110 ${colorOpen ? 'theme-trigger-active' : ''}`}
                  title={t.settings.themeColor}
                >
                  <div
                    className="w-5 h-5 rounded-full border-2 border-foreground/30 theme-trigger-orb"
                    style={{ backgroundColor: `hsl(${primaryHue}, 80%, 55%)` }}
                  />
                </button>
                {colorOpen && (
                  <div className="absolute right-0 top-full mt-2 glass-strong rounded-xl border border-glass-border shadow-xl p-4 theme-popover">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-xs text-foreground/50 font-medium">{t.settings.themeColor}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-foreground/60 font-mono">H {Math.round(((((primaryHue % 360) + 360) % 360) / 360) * 255)}</span>
                        <button
                          onClick={() => {
                            const idx = Math.round(((((primaryHue % 360) + 360) % 360) / 360) * 255);
                            chromaIndexRef.current = idx;
                            setChromaMode((prev) => !prev);
                          }}
                          className={`px-2 py-1 rounded-md text-[10px] font-bold tracking-wide transition-all duration-300 ${
                            chromaMode
                              ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30'
                              : 'glass text-foreground/70 hover:text-primary hover:bg-primary/15'
                          }`}
                        >
                          CHROMA
                        </button>
                      </div>
                    </div>
                    <div className="theme-spectrum mb-3" />
                    <canvas
                      ref={canvasRef}
                      width={180}
                      height={180}
                      className="cursor-crosshair block mx-auto touch-none transition-transform duration-300 ease-out hover:scale-[1.03] theme-wheel"
                      onPointerDown={handlePointerDown}
                      onPointerMove={handlePointerMove}
                      onPointerUp={handlePointerUp}
                      onPointerCancel={handlePointerUp}
                      onPointerLeave={(e) => {
                        if (isDragging) handlePointerUp(e);
                      }}
                    />
                    {/* Presets */}
                    <div className="flex justify-center gap-1.5 mt-3">
                      {HUE_PRESETS.map((hue) => (
                        <button
                          key={hue}
                          onClick={() => {
                            setChromaMode(false);
                            chromaIndexRef.current = Math.round((hue / 360) * 255);
                            setPrimaryHue(hue);
                          }}
                          className={`w-6 h-6 rounded-full transition-all duration-200 hover:scale-125 ${
                            primaryHue === hue ? 'ring-2 ring-white ring-offset-1 ring-offset-transparent scale-110' : ''
                          }`}
                          style={{ backgroundColor: `hsl(${hue}, 80%, 55%)` }}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center gap-2">
              {/* Day/Night toggle (mobile) */}
              <button
                onClick={() => setIsDark(!isDark)}
                className="p-2 rounded-lg hover:bg-primary/20 text-foreground/70 transition-all duration-300"
              >
                {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2 rounded-lg text-foreground hover:bg-primary/20 focus:outline-none transition-all duration-300"
              >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-[34rem] border-t border-glass-border' : 'max-h-0'}`}>
          <div className="px-4 py-3 space-y-1">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="block px-3 py-2 rounded-lg text-base font-medium text-foreground hover:bg-primary/20 hover:text-primary transition-all duration-300"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </a>
            ))}
            {/* Mobile language selector */}
            <div className="pt-2 border-t border-glass-border">
              <p className="text-xs text-foreground/50 px-3 pb-1 flex items-center gap-1"><Globe className="w-3 h-3" /> {t.settings.language}</p>
              <div className="flex gap-2 px-3 flex-wrap">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLanguage(lang.code);
                      setIsOpen(false);
                      switchLanguageRoute(lang.code);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                      language === lang.code ? 'bg-primary text-primary-foreground' : 'glass text-foreground/80'
                    }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            </div>
            {/* Mobile color presets */}
            <div className="pt-2">
              <p className="text-xs text-foreground/50 px-3 pb-1 flex items-center gap-1"><Palette className="w-3 h-3" /> {t.settings.themeColor}</p>
              <div className="flex gap-2 px-3">
                {HUE_PRESETS.map((hue) => (
                  <button
                    key={hue}
                    onClick={() => {
                      setChromaMode(false);
                      chromaIndexRef.current = Math.round((hue / 360) * 255);
                      setPrimaryHue(hue);
                    }}
                    className={`w-7 h-7 rounded-full transition-all ${primaryHue === hue ? 'ring-2 ring-white scale-110' : ''}`}
                    style={{ backgroundColor: `hsl(${hue}, 80%, 55%)` }}
                  />
                ))}
                <button
                  onClick={() => {
                    const idx = Math.round(((((primaryHue % 360) + 360) % 360) / 360) * 255);
                    chromaIndexRef.current = idx;
                    setChromaMode((prev) => !prev);
                  }}
                  className={`px-2 py-1 rounded-md text-[10px] font-bold tracking-wide transition-all duration-300 ${
                    chromaMode
                      ? 'bg-primary text-primary-foreground'
                      : 'glass text-foreground/70 hover:text-primary'
                  }`}
                >
                  CHROMA
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
