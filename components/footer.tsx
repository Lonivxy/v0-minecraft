'use client';

import { MessageCircle } from 'lucide-react';

// Discord SVG Icon
const DiscordIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
  </svg>
);

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="rules" className="relative z-10 mt-20 border-t border-glass-border">
      <div className="glass-strong">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            {/* Brand Info */}
            <div className="animate-slide-in-left">
              <h3 className="text-2xl font-bold text-foreground mb-4">
                <span className="glow-text">CGSBS</span>
              </h3>
              <p className="text-foreground/70 leading-relaxed mb-4">
                致力于为全球 Minecraft 玩家提供最有趣的躲猫猫游戏体验，打造充满欢笑和惊喜的游戏社区。
              </p>
              <p className="text-sm text-foreground/50">
                服务器 IP: <span className="text-primary font-mono">cgsbs.asia</span>
              </p>
            </div>

            {/* Rules */}
            <div className="animate-slide-up">
              <h4 className="text-lg font-semibold text-foreground mb-4">服务器规则</h4>
              <ul className="space-y-2 text-foreground/70">
                <li className="flex items-start gap-2">
                  <span className="text-primary">1.</span>
                  <span>禁止使用作弊或外挂</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">2.</span>
                  <span>尊重其他玩家，禁止辱骂</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">3.</span>
                  <span>禁止恶意卡 Bug</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">4.</span>
                  <span>服从管理员的指挥</span>
                </li>
              </ul>
            </div>

            {/* Social Links */}
            <div className="animate-slide-in-right">
              <h4 className="text-lg font-semibold text-foreground mb-4">加入社区</h4>
              <div className="space-y-3">
                {/* QQ Group */}
                <a
                  href="https://qm.qq.com/cgi-bin/qm/qr?k=placeholder&jump_from=webapi"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 glass rounded-xl border border-glass-border hover:border-primary/50 hover:bg-primary/10 transition-all duration-300 hover:scale-105 hover:-translate-y-1 group"
                >
                  <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <MessageCircle className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">QQ 群</p>
                    <p className="text-foreground/60 text-sm">712839418</p>
                  </div>
                </a>

                {/* Discord */}
                <a
                  href="http://dsc.gg/cgsbs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 glass rounded-xl border border-glass-border hover:border-primary/50 hover:bg-primary/10 transition-all duration-300 hover:scale-105 hover:-translate-y-1 group"
                >
                  <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <DiscordIcon />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Discord</p>
                    <p className="text-foreground/60 text-sm">dsc.gg/cgsbs</p>
                  </div>
                </a>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-glass-border my-8" />

          {/* Bottom Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-foreground/60 text-sm text-center sm:text-left">
              &copy; {currentYear} CGSBS Minecraft Server. 保留所有权利。
            </p>
            <div className="flex items-center gap-6">
              <a
                href="#rules"
                className="text-foreground/60 hover:text-primary transition-colors text-sm"
              >
                服务器规则
              </a>
              <a
                href="#hero"
                className="text-foreground/60 hover:text-primary transition-colors text-sm"
              >
                返回顶部
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
