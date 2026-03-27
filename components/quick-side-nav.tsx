'use client';

import { useEffect, useMemo, useState } from 'react';
import type { ComponentType } from 'react';
import { Compass, Home, Radio, Sparkles, ScrollText, Gamepad2, Menu, X } from 'lucide-react';
import { useSettings } from '@/lib/settings-context';

type NavItem = {
  id: string;
  icon: ComponentType<{ className?: string }>;
  label: string;
};

export default function QuickSideNav() {
  const { t, language } = useSettings();
  const [desktopOpen, setDesktopOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeId, setActiveId] = useState('hero');

  const navItems = useMemo<NavItem[]>(
    () => [
      { id: 'hero', icon: Home, label: t.nav.home },
      { id: 'status', icon: Radio, label: t.status.title },
      { id: 'features', icon: Sparkles, label: t.features.title },
      {
        id: 'launchers',
        icon: Gamepad2,
        label: language.startsWith('en') ? 'Launchers' : '常用启动器',
      },
      { id: 'rules', icon: ScrollText, label: t.nav.rules },
    ],
    [t, language]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: '-30% 0px -45% 0px', threshold: [0.2, 0.4, 0.7] }
    );

    navItems.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [navItems]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setDesktopOpen(false);
        setMobileOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const jumpTo = (id: string) => {
    const element = document.getElementById(id);
    if (!element) return;
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setActiveId(id);
    setMobileOpen(false);
  };

  return (
    <>
      <div
        className="fixed left-0 top-0 z-[88] hidden h-screen w-3 md:block"
        onMouseEnter={() => setDesktopOpen(true)}
        aria-hidden="true"
      />
      <div className="fixed left-0 top-1/2 z-[90] hidden -translate-y-1/2 md:block">
        <div
          className={`flex items-stretch transition-transform duration-500 ease-out ${desktopOpen ? 'translate-x-0' : '-translate-x-[calc(100%-2.9rem)]'}`}
          onMouseEnter={() => setDesktopOpen(true)}
          onMouseLeave={() => setDesktopOpen(false)}
          style={{ contain: 'layout paint' }}
        >
          <button
            type="button"
            className="nav-handle flex w-11 items-center justify-center rounded-r-xl border border-l-0 border-glass-border bg-black/40 text-primary"
            aria-label="Open quick navigation"
          >
            <Compass className="h-4 w-4" />
          </button>
          <nav className="side-nav-panel flex min-w-56 flex-col gap-1 rounded-r-2xl border border-glass-border border-l-0 p-2 shadow-xl shadow-black/30">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = activeId === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => jumpTo(item.id)}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-all duration-300 ${
                    active
                      ? 'bg-primary/20 text-primary shadow-md shadow-primary/20'
                      : 'text-foreground/80 hover:bg-primary/10 hover:text-primary'
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="line-clamp-1">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      <div className="fixed bottom-6 left-4 z-[96] md:hidden">
        <button
          type="button"
          onClick={() => setMobileOpen((prev) => !prev)}
          className="side-nav-fab flex h-11 w-11 items-center justify-center rounded-full border border-glass-border shadow-lg shadow-black/35 transition-transform duration-300 active:scale-95"
          aria-label={mobileOpen ? 'Close quick navigation' : 'Open quick navigation'}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="h-5 w-5 text-primary" /> : <Menu className="h-5 w-5 text-primary" />}
        </button>

        <nav
          className={`side-nav-panel absolute bottom-14 left-0 flex w-56 flex-col gap-1 rounded-2xl border border-glass-border p-2 shadow-xl shadow-black/30 transition-all duration-300 ${
            mobileOpen ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'
          }`}
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = activeId === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => jumpTo(item.id)}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-all duration-300 ${
                  active
                    ? 'bg-primary/20 text-primary shadow-md shadow-primary/20'
                    : 'text-foreground/80 hover:bg-primary/10 hover:text-primary'
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="line-clamp-1">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </>
  );
}
