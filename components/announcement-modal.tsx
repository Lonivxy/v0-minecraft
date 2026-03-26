'use client';

import { useEffect, useMemo, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Button } from '@/components/ui/button';

const ANNOUNCE_COOKIE = 'announce_ack_v1';
const FORCE_SECONDS = 5;

function hashString(input: string): string {
  let hash = 5381;
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash * 33) ^ input.charCodeAt(i);
  }
  return (hash >>> 0).toString(16);
}

function getCookieValue(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const cookies = document.cookie ? document.cookie.split('; ') : [];
  const prefix = `${name}=`;
  for (const item of cookies) {
    if (item.startsWith(prefix)) {
      return decodeURIComponent(item.slice(prefix.length));
    }
  }
  return null;
}

export default function AnnouncementModal() {
  const [content, setContent] = useState('');
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [consentCookies, setConsentCookies] = useState(false);
  const [countdown, setCountdown] = useState(FORCE_SECONDS);

  const announceVersion = useMemo(() => hashString(content), [content]);
  const canClose = countdown <= 0;

  useEffect(() => {
    let mounted = true;

    async function loadAnnouncement() {
      try {
        const response = await fetch('/announce.md', { cache: 'no-store' });
        if (!response.ok) {
          return;
        }

        const text = (await response.text()).trim();
        if (!text) {
          return;
        }

        if (!mounted) return;
        const version = hashString(text);
        const acknowledged = getCookieValue(ANNOUNCE_COOKIE);

        setContent(text);
        setVisible(acknowledged !== version);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadAnnouncement();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!visible) return;
    setCountdown(FORCE_SECONDS);

    const timer = window.setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          window.clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, [visible, announceVersion]);

  useEffect(() => {
    if (!visible) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [visible]);

  if (loading || !visible || !content) {
    return null;
  }

  const dismissForCurrentVersion = () => {
    if (!canClose || !consentCookies) return;
    document.cookie = `${ANNOUNCE_COOKIE}=${encodeURIComponent(announceVersion)}; Max-Age=31536000; Path=/; SameSite=Lax`;
    setVisible(false);
  };

  const dismissOnce = () => {
    if (!canClose) return;
    setVisible(false);
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/65 px-4">
      <div className="glass-strong w-full max-w-2xl rounded-2xl border border-white/10 p-6 shadow-2xl">
        <h2 className="text-2xl font-semibold text-foreground">公告</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          请阅读最新公告。{canClose ? '你现在可以关闭公告。' : `请至少阅读 ${countdown} 秒后再关闭。`}
        </p>

        <div className="announcement-content mt-4 max-h-[52vh] overflow-y-auto rounded-xl border border-white/10 bg-black/20 p-4">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
        </div>

        <label className="mt-4 flex items-start gap-2 text-sm text-muted-foreground">
          <input
            type="checkbox"
            className="mt-0.5 h-4 w-4 accent-primary"
            checked={consentCookies}
            onChange={(event) => setConsentCookies(event.target.checked)}
          />
          <span>我同意使用 Cookie 记录“此公告版本不再提醒”。</span>
        </label>

        <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button type="button" variant="secondary" onClick={dismissOnce} disabled={!canClose}>
            稍后提醒我
          </Button>
          <Button type="button" onClick={dismissForCurrentVersion} disabled={!canClose || !consentCookies}>
            同意并在本次公告后不再提醒
          </Button>
        </div>
      </div>
    </div>
  );
}
