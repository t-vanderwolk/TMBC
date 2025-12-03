'use client';

import { useEffect, useState } from 'react';

import { api } from '@/lib/api';

export default function SettingsPinterestPage() {
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const loadStatus = async () => {
      try {
        const response = await api.get('/api/pinterest/status');
        if (!mounted) return;
        setConnected(Boolean(response.data?.connected));
      } catch {
        if (mounted) {
          setMessage('Unable to check Pinterest connection');
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadStatus();
    return () => {
      mounted = false;
    };
  }, []);

  const handleConnect = async () => {
    setMessage(null);
    try {
      const response = await api.get('/api/pinterest/auth');
      const authUrl = response.data?.authUrl;
      if (authUrl) {
        window.open(authUrl, '_blank', 'width=520,height=720');
        setMessage('Pinterest auth window opened. Close it once connected.');
      } else {
        setMessage('Unable to find Pinterest auth endpoint');
      }
    } catch {
      setMessage('Unable to connect to Pinterest');
    }
  };

  return (
    <div className="space-y-6">
      <section className="rounded-3xl bg-white p-6 shadow tm-fade-in">
        <h2 className="font-playfair text-xl text-[var(--tm-deep-mauve)]">Pinterest</h2>
        <p className="text-xs uppercase tracking-[0.4em] text-[var(--tm-mauve)]/70">Inspiration sync</p>
        <div className="mt-4 space-y-2">
          {loading ? (
            <p className="text-sm text-[var(--tm-deep-mauve)]/70">Checking connection…</p>
          ) : connected ? (
            <p className="text-sm text-[var(--tm-mauve)]">Connected ✓</p>
          ) : (
            <p className="text-sm text-[var(--tm-deep-mauve)]/80">
              Connect Pinterest to bring board inspiration straight into your moodboards.
            </p>
          )}
          {!connected && (
            <button
              type="button"
              onClick={handleConnect}
              className="inline-flex items-center justify-center rounded-xl bg-[var(--tm-mauve)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-white transition hover:bg-[var(--tm-mauve)]/90"
            >
              Connect Pinterest
            </button>
          )}
        </div>
        {message && (
          <p className="mt-3 text-xs text-[var(--tm-deep-mauve)]/80">{message}</p>
        )}
      </section>
    </div>
  );
}
