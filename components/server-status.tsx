'use client';

import { useEffect, useState, useRef } from 'react';
import { Radio, Users, Server, RefreshCw } from 'lucide-react';
import { useSettings } from '@/lib/settings-context';

interface ServerStatusData {
  online: boolean;
  players: {
    online: number;
    max: number;
  };
  version: string;
  motd?: {
    clean: string[];
  };
}

export default function ServerStatus() {
  const [status, setStatus] = useState<ServerStatusData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('down');
  const sectionRef = useRef<HTMLElement>(null);
  const lastScrollYRef = useRef(0);
  const { t, triggerPageLoading, isDark } = useSettings();

  const fetchStatus = async () => {
    try {
      setRefreshing(true);
      const response = await fetch('https://api.mcsrvstat.us/3/x42.minekuai.com:53380');
      const data = await response.json();
      setStatus(data);
      setError(false);
    } catch (err) {
      console.error('Failed to fetch server status:', err);
      setError(true);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    lastScrollYRef.current = window.scrollY;
    const handleScroll = () => {
      const currentY = window.scrollY;
      const delta = currentY - lastScrollYRef.current;
      if (Math.abs(delta) > 2) {
        setScrollDirection(delta > 0 ? 'down' : 'up');
        lastScrollYRef.current = currentY;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleRefresh = () => {
    if (!refreshing) {
      triggerPageLoading(820);
      fetchStatus();
    }
  };

  const sectionDelay = (index: number, total: number, step = 100) => {
    const order = scrollDirection === 'down' ? index : total - 1 - index;
    return `${order * step}ms`;
  };

  if (loading) {
    return (
      <section ref={sectionRef} className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-12 text-center">
          {t.status.title}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass-strong rounded-xl p-8 border border-glass-border animate-pulse">
              <div className="h-24 bg-foreground/10 rounded-lg" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  const isOnline = status?.online ?? false;
  const playersOnline = status?.players?.online ?? 0;
  const playersMax = status?.players?.max ?? 0;
  const version = status?.version ?? '1.20.4';

  return (
    <section ref={sectionRef} className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-center gap-4 mb-12">
        <h2 className="text-3xl sm:text-4xl font-bold text-foreground text-center">
          {t.status.title}
        </h2>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="p-2 rounded-lg glass hover:bg-primary/20 transition-all duration-300 disabled:opacity-50"
          title={t.status.refresh}
        >
          <RefreshCw className={`w-5 h-5 text-primary ${refreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Online Status */}
        <div
          className={`glass-strong rounded-xl p-8 border border-glass-border hover:border-primary/50 transition-all duration-500 hover:scale-105 hover:-translate-y-2 cursor-pointer group will-change-transform ${isVisible ? 'animate-slide-up' : 'opacity-0'}`}
          style={{ animationDelay: sectionDelay(0, 3) }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">{t.status.serverStatus}</h3>
            <div className={`p-3 rounded-lg transition-all duration-300 group-hover:scale-110 ${isOnline ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
              <Radio className={`w-6 h-6 ${isOnline ? 'text-green-400 animate-status-pulse' : 'text-red-400'}`} />
            </div>
          </div>
          <p className={`text-3xl font-bold ${isOnline ? 'text-green-400' : 'text-red-400'}`}>
            {isOnline ? t.status.online : t.status.offline}
          </p>
          <p className="text-sm text-foreground/50 mt-2">
            {error ? t.status.fetchFailed : isOnline ? t.status.runningNormal : t.status.maintenance}
          </p>
        </div>

        {/* Players */}
        <div
          className={`glass-strong rounded-xl p-8 border border-glass-border hover:border-primary/50 transition-all duration-500 hover:scale-105 hover:-translate-y-2 cursor-pointer group will-change-transform ${isVisible ? 'animate-slide-up' : 'opacity-0'}`}
          style={{ animationDelay: sectionDelay(1, 3) }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">{t.status.onlinePlayers}</h3>
            <div className="p-3 rounded-lg bg-primary/20 transition-all duration-300 group-hover:scale-110">
              <Users className="w-6 h-6 text-primary" />
            </div>
          </div>
          <p className="text-3xl font-bold text-primary">
            {playersOnline}<span className="text-lg text-foreground/50">/{playersMax}</span>
          </p>
          <div className="mt-3">
            <div className="h-2 bg-foreground/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary to-cyan-400 rounded-full transition-all duration-500"
                style={{ width: `${playersMax > 0 ? (playersOnline / playersMax) * 100 : 0}%` }}
              />
            </div>
            <p className="text-xs text-foreground/50 mt-2">
              {playersMax > 0 ? Math.round((playersOnline / playersMax) * 100) : 0}% {t.status.capacity}
            </p>
          </div>
        </div>

        {/* Version */}
        <div
          className={`glass-strong rounded-xl p-8 border border-glass-border hover:border-primary/50 transition-all duration-500 hover:scale-105 hover:-translate-y-2 cursor-pointer group will-change-transform ${isVisible ? 'animate-slide-up' : 'opacity-0'}`}
          style={{ animationDelay: sectionDelay(2, 3) }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">{t.status.gameVersion}</h3>
            <div className="p-3 rounded-lg bg-cyan-500/20 transition-all duration-300 group-hover:scale-110">
              <Server className="w-6 h-6 text-cyan-400" />
            </div>
          </div>
          <p className="text-3xl font-bold text-cyan-400">{version}</p>
          <p className="text-sm text-foreground/50 mt-2">{t.status.pureVanilla}</p>
        </div>
      </div>

      {/* Display IP hint with NameMC link */}
      <div
        className={`mt-8 glass rounded-lg p-4 border border-glass-border/50 ${isVisible ? 'animate-slide-up' : 'opacity-0'}`}
        style={{ animationDelay: scrollDirection === 'down' ? '300ms' : '120ms' }}
      >
        <p className="text-xs text-foreground/60 text-center">
          {t.status.serverIP}: <span className="text-primary font-mono">cgsbs.asia</span> | {t.status.autoRefresh} | <a href="https://namemc.com/server/cgsbs.asia?q=cgsbs.asia" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-cyan-400 transition-colors underline underline-offset-2">{t.status.viewOnNameMC}</a>
        </p>
        <p className="text-sm text-foreground/80 text-center mt-3">
          对于要玩Harpy列车的玩家
          <a
            href="https://github.com/Lonivxy/v0-minecraft/releases/download/DownloadsModpack/TLVotHE.1.3.2-DLC.exe"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 text-primary hover:text-cyan-400 transition-colors underline underline-offset-2"
          >
            点击此链接下载
          </a>
        </p>
      </div>

      <div
        className={`mt-6 rounded-xl p-4 transition-all duration-300 ${isVisible ? 'animate-slide-up' : 'opacity-0'} ${
          isDark
            ? 'border border-black/80 hover:border-primary/60'
            : 'border border-zinc-300/80 shadow-lg shadow-zinc-400/35 hover:border-zinc-500/80'
        }`}
        style={{
          animationDelay: scrollDirection === 'down' ? '380ms' : '0ms',
          background: isDark
            ? 'radial-gradient(circle at center, rgb(0 0 0) 0%, rgb(10 10 14) 32%, rgb(24 24 33) 58%, rgb(34 197 94 / 0.2) 82%, rgb(34 197 94 / 0.06) 100%)'
            : 'radial-gradient(circle at center, rgb(0 0 0) 0%, rgb(28 28 35) 34%, rgb(113 113 122) 64%, rgb(244 244 245) 100%)',
        }}
      >
        <div className={`rounded-lg overflow-hidden ${isDark ? 'bg-black' : 'bg-zinc-900/95'}`}>
          <iframe
            style={{ width: '728px', height: '90px', maxWidth: '100%', border: 'none', display: 'block', margin: 'auto' }}
            src="https://namemc.com/server/cgsbs.asia/embed"
            width="728"
            height="90"
            loading="lazy"
            title="NameMC server banner for cgsbs.asia"
          />
        </div>
      </div>
    </section>
  );
}
