'use client';

import { useState, useEffect } from 'react';
import type { CSSProperties } from 'react';
import { Copy, Check, Play, Download } from 'lucide-react';
import { useSettings } from '@/lib/settings-context';

const HERO_STARS = [
  { left: 6, top: 18, size: 2, delay: 0.2, duration: 5.4 },
  { left: 14, top: 32, size: 1, delay: 1.1, duration: 4.8 },
  { left: 21, top: 8, size: 2, delay: 2.3, duration: 6.2 },
  { left: 31, top: 26, size: 1, delay: 0.4, duration: 5.9 },
  { left: 42, top: 14, size: 2, delay: 1.7, duration: 5.1 },
  { left: 55, top: 36, size: 2, delay: 0.9, duration: 6.8 },
  { left: 66, top: 10, size: 1, delay: 2.7, duration: 5.6 },
  { left: 74, top: 24, size: 2, delay: 1.4, duration: 6.5 },
  { left: 84, top: 12, size: 1, delay: 0.6, duration: 4.9 },
  { left: 12, top: 62, size: 1, delay: 1.9, duration: 5.7 },
  { left: 63, top: 66, size: 1, delay: 2.9, duration: 5.2 },
] as const;

export default function HeroSection() {
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { t, isDark } = useSettings();
  const serverIP = 'cgsbs.asia';
  const videoUrl = 'https://www.youtube.com/watch?v=yHZqm44uMxY';
  const texturePackUrl = 'https://raw.githubusercontent.com/Lonivxy/cgsbsHnS/refs/heads/main/hide_and_seek.zip';

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleCopyIP = () => {
    navigator.clipboard.writeText(serverIP);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="hero" className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden pt-20">

      {/* Dark mode: Minecraft image background */}
      {mounted && isDark && (
        <div
          className="absolute inset-0 z-0 transition-opacity duration-500"
          style={{
            backgroundImage: 'url(/images/minecraft-bg.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'scroll',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-background" />
          <div className="hero-aurora" />
          <div className="hero-beam hero-beam-1" />
          <div className="hero-beam hero-beam-2" />
          <div className="hero-beam hero-beam-3" />
          <div className="hero-stars">
            {HERO_STARS.map((star, index) => (
              <span
                key={index}
                className="hero-star"
                style={
                  {
                    left: `${star.left}%`,
                    top: `${star.top}%`,
                    width: star.size,
                    height: star.size,
                    animationDelay: `${star.delay}s`,
                    animationDuration: `${star.duration}s`,
                  } as CSSProperties
                }
              />
            ))}
          </div>
          {/* Floating particles */}
          <div className="absolute inset-0 opacity-40 pointer-events-none">
            <div className="absolute top-[15%] left-[10%] w-2 h-2 bg-primary rounded-full animate-float" />
            <div className="absolute top-[25%] right-[15%] w-3 h-3 bg-cyan-400 rounded-full animate-float delay-200" />
            <div className="absolute top-[60%] left-[20%] w-2 h-2 bg-primary rounded-full animate-float delay-400" />
            <div className="absolute top-[45%] right-[25%] w-2 h-2 bg-cyan-400 rounded-full animate-float delay-300" />
            <div className="absolute top-[70%] right-[10%] w-2 h-2 bg-primary rounded-full animate-float delay-500" />
          </div>
        </div>
      )}

      {/* Light mode: animated floating blocks background */}
      {mounted && !isDark && (
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="hero-aurora" />
          <div className="hero-beam hero-beam-1" />
          <div className="hero-beam hero-beam-2" />
          <div className="hero-stars">
            {HERO_STARS.map((star, index) => (
              <span
                key={index}
                className="hero-star"
                style={
                  {
                    left: `${star.left}%`,
                    top: `${star.top}%`,
                    width: star.size,
                    height: star.size,
                    animationDelay: `${star.delay + 0.8}s`,
                    animationDuration: `${star.duration + 0.5}s`,
                  } as CSSProperties
                }
              />
            ))}
          </div>
          {/* Subtle grid pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.04)_1px,transparent_1px)] bg-[size:40px_40px]" />
          {/* Floating pixel blocks */}
          <div className="mc-block mc-block-1" />
          <div className="mc-block mc-block-2" />
          <div className="mc-block mc-block-3" />
          <div className="mc-block mc-block-4" />
          <div className="mc-block mc-block-5" />
          <div className="mc-block mc-block-6" />
          <div className="mc-block mc-block-7" />
          <div className="mc-block mc-block-8" />
          {/* Soft radial glow at center */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_40%,rgba(34,197,94,0.07),transparent)]" />
        </div>
      )}

      {/* Content */}
      <div className={`relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto ${mounted ? 'animate-slide-up' : 'opacity-0'} will-change-transform`}>
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full border border-primary/30 mb-8 animate-scale-in">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-status-pulse" />
          <span className="text-sm text-foreground/80">{t.hero.badge}</span>
        </div>

        {/* Main Title */}
        <h1 className="text-6xl sm:text-7xl lg:text-9xl font-black mb-6 animate-scale-in delay-100">
          <span className="animate-title-gradient">
            CGSBS
          </span>
        </h1>

        {/* Tagline */}
        <p
          className={`text-xl sm:text-2xl lg:text-3xl font-bold mb-4 text-balance animate-slide-up delay-200 ${
            isDark
              ? 'text-foreground glow-text drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]'
              : 'text-foreground/90 drop-shadow-[0_1px_1px_rgba(255,255,255,0.7)]'
          }`}
        >
          {t.hero.tagline}
        </p>

        {/* Description */}
        <p className="text-base sm:text-lg text-foreground/80 mb-10 max-w-2xl mx-auto text-pretty animate-slide-up delay-300 drop-shadow-lg">
          {t.hero.description}
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8 animate-slide-up delay-400">
          {/* Copy IP Button */}
          <button
            onClick={handleCopyIP}
            className="glass-strong hover:bg-primary/30 inline-flex items-center gap-3 px-8 py-4 rounded-xl text-lg font-semibold text-foreground border-2 border-primary transition-all duration-300 hover:scale-105 animate-pulse-glow cursor-pointer group will-change-transform"
          >
            {copied ? (
              <>
                <Check className="w-6 h-6 text-green-400" />
                <span className="text-green-400">{t.hero.copied}</span>
              </>
            ) : (
              <>
                <Copy className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                {t.hero.copyIP}
              </>
            )}
          </button>

          {/* Watch Video Button */}
          <a
            href={videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="glass hover:bg-foreground/10 inline-flex items-center gap-3 px-6 py-4 rounded-xl text-lg font-semibold text-foreground border border-glass-border transition-all duration-300 hover:scale-105 hover:border-primary/50 group will-change-transform"
          >
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
              <Play className="w-5 h-5 text-primary ml-0.5" />
            </div>
            {t.hero.watchVideo}
          </a>
        </div>

        {/* Download Texture Pack Button */}
        <div className="animate-slide-up delay-500 mb-12">
          <a
            href={texturePackUrl}
            download
            className="glass hover:bg-cyan-500/20 inline-flex items-center gap-3 px-6 py-3 rounded-xl text-base font-semibold text-foreground border border-cyan-500/50 transition-all duration-300 hover:scale-105 hover:border-cyan-400 group will-change-transform"
          >
            <Download className="w-5 h-5 text-cyan-400 group-hover:animate-bounce" />
            {t.hero.downloadPack}
          </a>
        </div>

        {/* Server Info Card */}
        <div className="liquid-glass-card max-w-md mx-auto animate-slide-up delay-500 transition-all duration-300 hover:scale-[1.02] will-change-transform">
          <div className="liquid-glass-marquee" aria-hidden="true" />
          <div className="liquid-glass-core p-6">
            <p className="text-foreground/60 text-sm mb-2">{t.hero.serverAddress}</p>
            <p className="text-2xl font-mono font-bold text-primary mb-1">{serverIP}</p>
            <p className="text-foreground/50 text-xs">{t.hero.version}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
