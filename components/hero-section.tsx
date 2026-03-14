'use client';

import { useState, useEffect } from 'react';
import { Copy, Check, Play } from 'lucide-react';

export default function HeroSection() {
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);
  const serverIP = 'cgsbs.asia';
  const videoUrl = 'https://www.youtube.com/watch?v=yHZqm44uMxY';

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
        {/* Dark overlay with gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-background" />
        
        {/* Animated particles effect */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary rounded-full animate-float" />
          <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-cyan-400 rounded-full animate-float delay-200" />
          <div className="absolute bottom-1/3 left-1/3 w-2 h-2 bg-primary rounded-full animate-float delay-400" />
          <div className="absolute top-2/3 right-1/3 w-2 h-2 bg-cyan-400 rounded-full animate-float delay-300" />
        </div>
      </div>

      {/* Content */}
      <div className={`relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto ${mounted ? 'animate-slide-up' : 'opacity-0'}`}>
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full border border-primary/30 mb-8 animate-scale-in">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-status-pulse" />
          <span className="text-sm text-foreground/80">1.20.4 原版</span>
        </div>

        {/* Main Title */}
        <h1 className="text-6xl sm:text-7xl lg:text-9xl font-black mb-6 animate-scale-in delay-100">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-cyan-400 to-primary bg-[length:200%_auto] animate-shimmer">
            CGSBS
          </span>
        </h1>

        {/* Tagline */}
        <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-4 text-balance glow-text animate-slide-up delay-200">
          最刺激的躲猫猫之旅等你来战!
        </p>

        {/* Description */}
        <p className="text-base sm:text-lg text-foreground/70 mb-10 max-w-2xl mx-auto text-pretty animate-slide-up delay-300">
          加入 CGSBS 服务器，体验紧张刺激的躲猫猫玩法，与全球玩家一起享受最有趣的捉迷藏游戏
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 animate-slide-up delay-400">
          {/* Copy IP Button */}
          <button
            onClick={handleCopyIP}
            className="glass-strong hover:bg-primary/30 inline-flex items-center gap-3 px-8 py-4 rounded-xl text-lg font-semibold text-foreground border-2 border-primary transition-all duration-300 hover:scale-105 animate-pulse-glow cursor-pointer group"
          >
            {copied ? (
              <>
                <Check className="w-6 h-6 text-green-400" />
                <span className="text-green-400">已复制!</span>
              </>
            ) : (
              <>
                <Copy className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                一键复制 IP
              </>
            )}
          </button>

          {/* Watch Video Button */}
          <a
            href={videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="glass hover:bg-foreground/10 inline-flex items-center gap-3 px-6 py-4 rounded-xl text-lg font-semibold text-foreground border border-glass-border transition-all duration-300 hover:scale-105 hover:border-primary/50 group"
          >
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
              <Play className="w-5 h-5 text-primary ml-0.5" />
            </div>
            观看玩法视频
          </a>
        </div>

        {/* Server Info Card */}
        <div className="glass-strong rounded-2xl p-6 border border-glass-border max-w-md mx-auto animate-slide-up delay-500 hover:border-primary/50 transition-all duration-300 hover:scale-[1.02]">
          <p className="text-foreground/60 text-sm mb-2">服务器地址</p>
          <p className="text-2xl font-mono font-bold text-primary mb-1">{serverIP}</p>
          <p className="text-foreground/50 text-xs">版本: 1.20.4 原版</p>
        </div>
      </div>

      {/* Animated scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 animate-bounce">
        <div className="w-6 h-10 border-2 border-foreground/30 rounded-full flex items-start justify-center p-2">
          <div className="w-1 h-2 bg-primary rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
}
