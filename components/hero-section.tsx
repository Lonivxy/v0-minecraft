'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export default function HeroSection() {
  const [copied, setCopied] = useState(false);
  const serverIP = 'cgsbs.asia';

  const handleCopyIP = () => {
    navigator.clipboard.writeText(serverIP);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden pt-20">
      {/* Background with Minecraft texture */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url(/images/minecraft-bg.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        {/* Main Title */}
        <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black mb-4 text-transparent bg-clip-text bg-gradient-to-r from-primary to-cyan-400 animate-pulse-glow">
          CGSBS
        </h1>

        {/* Tagline */}
        <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-8 text-balance glow-text">
          最刺激的躲猫猫之旅等你来战！
        </p>

        {/* Description */}
        <p className="text-base sm:text-lg text-gray-300 mb-12 max-w-2xl mx-auto text-pretty">
          加入 CGSBS 服务器，体验紧张刺激的躲猫猫玩法，与全球玩家一起探索纯净的 Minecraft 世界
        </p>

        {/* Copy IP Button */}
        <button
          onClick={handleCopyIP}
          className="glass-strong hover:bg-primary/30 inline-flex items-center gap-3 px-8 py-4 rounded-xl text-lg font-semibold text-foreground border-2 border-primary transition-all duration-300 hover:scale-105 glow-primary cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-6 h-6" />
              已复制！
            </>
          ) : (
            <>
              <Copy className="w-6 h-6" />
              一键复制 IP
            </>
          )}
        </button>

        {/* Server Info */}
        <div className="mt-8 glass rounded-lg p-6 border border-glass-border">
          <p className="text-foreground/80 text-sm mb-2">服务器地址</p>
          <p className="text-xl font-mono font-bold text-primary">{serverIP}</p>
          <p className="text-foreground/60 text-sm mt-3">版本：1.20.4 原版纯净</p>
        </div>
      </div>

      {/* Animated scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
        <div className="animate-bounce">
          <svg
            className="w-6 h-6 text-primary"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </section>
  );
}
