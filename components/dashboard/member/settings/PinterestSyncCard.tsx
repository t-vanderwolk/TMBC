"use client";

import { useEffect, useState } from "react";

import { api } from "@/lib/api";

export default function PinterestSyncCard() {
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const loadStatus = async () => {
      try {
        const response = await api.get("/pinterest/status");
        if (!mounted) return;
        setConnected(Boolean(response.data?.connected));
      } catch {
        if (mounted) {
          setMessage("Unable to check Pinterest connection");
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
      const response = await api.get("/pinterest/auth");
      const authUrl = response.data?.authUrl;
      if (authUrl) {
        window.open(authUrl, "_blank", "width=520,height=720");
        setMessage("Pinterest auth window opened. Close it once connected.");
      } else {
        setMessage("Unable to find Pinterest auth endpoint");
      }
    } catch {
      setMessage("Unable to connect Pinterest");
    }
  };

  return (
    <section className="rounded-3xl border border-member-border-soft bg-member-background-card p-6 shadow-[0_30px_90px_rgba(189,147,189,0.25)]">
      <h3 className="font-serif text-2xl text-member-text-primary">Pinterest sync</h3>
      <p className="text-xs uppercase tracking-[0.4em] text-member-accent-secondary">Inspiration boards</p>
      <div className="mt-4 space-y-2">
        {loading ? (
          <p className="text-sm text-member-text-secondary">Checking connection…</p>
        ) : connected ? (
          <p className="text-sm text-member-accent-secondary">Connected ✓</p>
        ) : (
          <p className="text-sm text-member-text-secondary">
            Connect Pinterest to bring board inspiration straight into your moodboards.
          </p>
        )}
        {!connected && (
          <button
            type="button"
            onClick={handleConnect}
            className="inline-flex items-center justify-center rounded-xl bg-member-accent-primary px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-member-text-inverse transition hover:bg-member-accent-secondary"
          >
            Connect Pinterest
          </button>
        )}
      </div>
      {message && <p className="mt-3 text-xs text-member-text-secondary">{message}</p>}
    </section>
  );
}
