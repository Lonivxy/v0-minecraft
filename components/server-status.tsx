'use client';

import { useEffect, useState } from 'react';
import { Radio, Users, Zap } from 'lucide-react';

interface ServerStatusData {
  isOnline: boolean;
  players: number;
  maxPlayers: number;
  ping: number;
}

export default function ServerStatus() {
  const [status, setStatus] = useState<ServerStatusData>({
    isOnline: true,
    players: 156,
    maxPlayers: 200,
    ping: 28,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 模拟 API 调用，获取服务器状态
    // 替换为真实 API 端点：例如 /api/server-status
    const fetchStatus = async () => {
      try {
        // const response = await fetch('/api/server-status');
        // const data = await response.json();
        // setStatus(data);

        // 暂时使用模拟数据，可定时刷新
        setStatus((prev) => ({
          ...prev,
          players: Math.floor(Math.random() * (200 - 50 + 1)) + 50,
          ping: Math.floor(Math.random() * (50 - 20 + 1)) + 20,
        }));
      } catch (error) {
        console.error('获取服务器状态失败:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();

    // 每 30 秒更新一次服务器状态
    const interval = setInterval(fetchStatus, 30000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="glass-strong rounded-xl p-8 border border-glass-border animate-pulse">
        <div className="h-32 bg-foreground/10 rounded-lg" />
      </div>
    );
  }

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-12 text-center">
        服务器实时状态
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Online Status */}
        <div className="glass-strong rounded-xl p-8 border border-glass-border hover:border-primary/50 transition-all duration-300 hover:scale-105 cursor-pointer group">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">服务器状态</h3>
            <div
              className={`p-3 rounded-lg ${
                status.isOnline
                  ? 'bg-green-500/20'
                  : 'bg-red-500/20'
              }`}
            >
              <Radio
                className={`w-6 h-6 ${
                  status.isOnline
                    ? 'text-green-400 animate-status-pulse'
                    : 'text-red-400'
                }`}
              />
            </div>
          </div>
          <p
            className={`text-2xl font-bold ${
              status.isOnline ? 'text-green-400' : 'text-red-400'
            }`}
          >
            {status.isOnline ? '在线' : '离线'}
          </p>
        </div>

        {/* Players */}
        <div className="glass-strong rounded-xl p-8 border border-glass-border hover:border-primary/50 transition-all duration-300 hover:scale-105 cursor-pointer group">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">在线玩家</h3>
            <div className="p-3 rounded-lg bg-primary/20">
              <Users className="w-6 h-6 text-primary" />
            </div>
          </div>
          <p className="text-2xl font-bold text-primary">
            {status.players}/{status.maxPlayers}
          </p>
          <p className="text-sm text-foreground/60 mt-2">
            {Math.round((status.players / status.maxPlayers) * 100)}% 容量
          </p>
        </div>

        {/* Ping */}
        <div className="glass-strong rounded-xl p-8 border border-glass-border hover:border-primary/50 transition-all duration-300 hover:scale-105 cursor-pointer group">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">网络延迟</h3>
            <div className="p-3 rounded-lg bg-cyan-500/20">
              <Zap className="w-6 h-6 text-cyan-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-cyan-400">{status.ping} ms</p>
          <p className="text-sm text-foreground/60 mt-2">
            {status.ping < 30
              ? '非常快'
              : status.ping < 60
              ? '快速'
              : '正常'}
          </p>
        </div>
      </div>

      {/* API Note */}
      <div className="mt-8 glass rounded-lg p-4 border border-glass-border/50">
        <p className="text-xs text-foreground/60 text-center">
          💡 提示：此数据通过 API 接口获取，每 30 秒自动刷新一次。可替换为您的真实服务器状态接口。
        </p>
      </div>
    </section>
  );
}
