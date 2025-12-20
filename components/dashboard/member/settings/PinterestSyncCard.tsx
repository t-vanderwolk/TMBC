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
    <section className="rounded-3xl border border-[#E3D0D7] bg-white/90 p-6 shadow-[0_30px_90px_rgba(189,147,189,0.25)]">
      <h3 className="font-serif text-2xl text-[#3E2F35]">Pinterest sync</h3>
      <p className="text-xs uppercase tracking-[0.4em] text-[#C8A1B4]">Inspiration boards</p>
      <div className="mt-4 space-y-2">
        {loading ? (
          <p className="text-sm text-[#3E2F35]/70">Checking connection…</p>
        ) : connected ? (
          <p className="text-sm text-[#C8A1B4]">Connected ✓</p>
        ) : (
          <p className="text-sm text-[#3E2F35]/70">
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
      {message && <p className="mt-3 text-xs text-[#3E2F35]/70">{message}</p>}
    </section>
  );
}
