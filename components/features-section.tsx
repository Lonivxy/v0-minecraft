import { Gamepad2, Zap, Shield } from 'lucide-react';

const features = [
  {
    icon: Gamepad2,
    title: '自研小游戏',
    description: '不仅有经典躲猫猫，还有多种自研小游戏模式，让你的 Minecraft 生涯永远充满乐趣和挑战',
    color: 'from-purple-500 to-pink-500',
  },
  {
    icon: Shield,
    title: '纯净生存',
    description: '100% 原版纯净，无任何插件修改。体验最原汁原味的 Minecraft 生存体验，建造你的梦想世界',
    color: 'from-green-500 to-emerald-500',
  },
  {
    icon: Zap,
    title: 'BGP 高速线路',
    description: '全球 BGP 加速节点，延迟低至 20ms，稳定可靠的网络环境，让你的游戏体验丝滑顺畅',
    color: 'from-cyan-500 to-blue-500',
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4 text-center text-balance">
          为什么选择 CGSBS
        </h2>
        <p className="text-center text-foreground/70 mb-16 max-w-2xl mx-auto">
          我们致力于打造最优质的 Minecraft 游戏体验，为玩家提供稳定、创新、有趣的游戏环境
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="glass-strong rounded-xl p-8 border border-glass-border hover:border-primary/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl group cursor-pointer"
              >
                {/* Icon */}
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${feature.color} p-3 mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-full h-full text-white" />
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold text-foreground mb-4">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-foreground/70 leading-relaxed">
                  {feature.description}
                </p>

                {/* Bottom accent line */}
                <div className={`h-1 w-0 group-hover:w-full bg-gradient-to-r ${feature.color} mt-6 transition-all duration-300 rounded-full`} />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
