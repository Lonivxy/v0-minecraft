'use client';

import { useEffect, useState, useRef } from 'react';
import { Eye, Zap, Gamepad2 } from 'lucide-react';

const features = [
  {
    icon: Eye,
    title: '经典躲猫猫',
    description: '体验最刺激的躲猫猫玩法！变身成各种方块躲避猎人，或成为猎人追捕躲藏者，每一局都充满惊喜和欢笑',
    color: 'from-orange-500 to-red-500',
    iconBg: 'bg-orange-500/20',
    iconColor: 'text-orange-400',
  },
  {
    icon: Gamepad2,
    title: '自研游戏模式',
    description: '不断更新的自研小游戏模式，让躲猫猫玩法更加丰富多彩，独特的游戏机制带来前所未有的游戏体验',
    color: 'from-primary to-cyan-500',
    iconBg: 'bg-primary/20',
    iconColor: 'text-primary',
  },
  {
    icon: Zap,
    title: 'BGP 高速线路',
    description: '全球 BGP 加速节点，延迟低至 20ms，稳定可靠的网络环境，让你的游戏体验丝滑顺畅无卡顿',
    color: 'from-cyan-500 to-blue-500',
    iconBg: 'bg-cyan-500/20',
    iconColor: 'text-cyan-400',
  },
];

export default function FeaturesSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

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
            为什么选择 <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-cyan-400">CGSBS</span>
          </h2>
          <p className="text-foreground/70 max-w-2xl mx-auto text-lg">
            我们致力于打造最有趣的躲猫猫游戏体验，为玩家提供稳定、创新、欢乐的游戏环境
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className={`glass-strong rounded-2xl p-8 border border-glass-border hover:border-primary/50 transition-all duration-500 hover:scale-105 hover:-translate-y-3 hover:shadow-2xl hover:shadow-primary/10 group cursor-pointer ${isVisible ? 'animate-slide-up' : 'opacity-0'}`}
                style={{ animationDelay: `${index * 150}ms` }}
              >
                {/* Icon */}
                <div className={`w-16 h-16 rounded-xl ${feature.iconBg} flex items-center justify-center mb-6 group-hover:scale-110 transition-all duration-300`}>
                  <Icon className={`w-8 h-8 ${feature.iconColor}`} />
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors duration-300">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-foreground/70 leading-relaxed">
                  {feature.description}
                </p>

                {/* Bottom accent line */}
                <div className={`h-1 w-0 group-hover:w-full bg-gradient-to-r ${feature.color} mt-6 transition-all duration-500 rounded-full`} />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
