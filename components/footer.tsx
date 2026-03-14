import { MessageCircle, Globe } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative z-10 mt-20 border-t border-glass-border">
      <div className="glass-strong">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            {/* Brand Info */}
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-4">
                <span className="glow-text">CGSBS</span>
              </h3>
              <p className="text-foreground/70 leading-relaxed">
                致力于为全球 Minecraft 玩家提供最优质的游戏体验，打造充满创意和乐趣的游戏社区。
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold text-foreground mb-4">快速链接</h4>
              <ul className="space-y-2">
                {['首页', '规则', '地图', '皮肤站', '充值中心'].map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-foreground/70 hover:text-primary transition-colors duration-200"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Social Links */}
            <div>
              <h4 className="text-lg font-semibold text-foreground mb-4">加入社区</h4>
              <div className="space-y-3">
                {/* QQ Group */}
                <a
                  href="https://jq.qq.com/?_wv=1027&k=your-qq-group-id"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 glass rounded-lg border border-glass-border hover:border-primary/50 hover:bg-primary/10 transition-all duration-200 group"
                >
                  <MessageCircle className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
                  <div>
                    <p className="font-semibold text-foreground text-sm">QQ 群</p>
                    <p className="text-foreground/60 text-xs">712839418</p>
                  </div>
                </a>

                {/* Discord */}
                <a
                  href="http://dsc.gg/cgsbs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 glass rounded-lg border border-glass-border hover:border-primary/50 hover:bg-primary/10 transition-all duration-200 group"
                >
                  <Globe className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
                  <div>
                    <p className="font-semibold text-foreground text-sm">Discord</p>
                    <p className="text-foreground/60 text-xs">dsc.gg/cgsbs</p>
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
              © {currentYear} CGSBS Minecraft Server. 保留所有权利。
            </p>
            <div className="flex items-center gap-6">
              <a
                href="#"
                className="text-foreground/60 hover:text-primary transition-colors text-sm"
              >
                隐私政策
              </a>
              <a
                href="#"
                className="text-foreground/60 hover:text-primary transition-colors text-sm"
              >
                服务条款
              </a>
              <a
                href="#"
                className="text-foreground/60 hover:text-primary transition-colors text-sm"
              >
                联系我们
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
