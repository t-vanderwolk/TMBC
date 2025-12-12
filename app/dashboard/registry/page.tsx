"use client";

import { useEffect, useState } from "react";

import { api } from "@/lib/api";
import SectionNav from "@/components/dashboard/SectionNav";

type RegistryRow = {
  id: string;
  title: string;
  status: string;
  essentials: number;
  niceToHave: number;
};

type RegistrySummary = {
  totalItems: number;
  essentials: number;
  niceToHave: number;
  rows: RegistryRow[];
};

const FALLBACK_SUMMARY: RegistrySummary = {
  totalItems: 18,
  essentials: 12,
  niceToHave: 6,
  rows: [
    { id: "sleep", title: "Sleep Sanctuary", status: "Ready", essentials: 5, niceToHave: 2 },
    { id: "care", title: "Care & Changing", status: "Review", essentials: 4, niceToHave: 1 },
    { id: "nourish", title: "Feeding Rituals", status: "Planning", essentials: 3, niceToHave: 3 },
  ],
};

export default function RegistryPage() {
  const [summary, setSummary] = useState<RegistrySummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/registry/summary")
      .then((response) => {
        setSummary(response.data);
      })
      .catch((err) => {
        console.warn("Registry summary error:", err);
        setSummary(FALLBACK_SUMMARY);
        setError("Registry service unavailable. Showing a curated fallback.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center px-4 py-16">
        <p className="text-sm uppercase tracking-[0.4em] text-[#C8A1B4]">Checking your registry…</p>
      </div>
    );
  }

  if (error || !summary) {
    return (
      <div className="px-4 py-10 text-sm text-[#C8A1B4]">
        <p>{error || "No registry summary available."}</p>
      </div>
    );
  }

  return (
    <main className="space-y-6 px-4 py-8 text-[#3E2F35] sm:px-6">
      <section className="rounded-[36px] border border-[#C8A1B4]/40 bg-white/80 p-6 shadow-[0_30px_90px_rgba(199,166,199,0.25)]">
        <p className="text-[0.65rem] uppercase tracking-[0.5em] text-[#3E2F35]/70">Registry · Snapshot</p>
        <h1 className="mt-2 font-serif text-3xl text-[#3E2F35]">Curated favorites</h1>
        <p className="mt-2 text-sm text-[#3E2F35]/70">
          Essentials are cozy and ready, while a few nice-to-haves are still waiting for your touch.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-[30px] border border-[#3E2F35]/10 bg-[#FFFAF8] p-4 text-sm">
            <p className="text-[0.6rem] uppercase tracking-[0.4em] text-[#3E2F35]/60">Total items</p>
            <p className="mt-2 text-3xl font-semibold text-[#3E2F35]">{summary.totalItems}</p>
          </div>
          <div className="rounded-[30px] border border-[#3E2F35]/10 bg-white p-4 text-sm">
            <p className="text-[0.6rem] uppercase tracking-[0.4em] text-[#3E2F35]/60">Essentials</p>
            <p className="mt-2 text-3xl font-semibold text-[#3E2F35]">{summary.essentials}</p>
          </div>
          <div className="rounded-[30px] border border-[#3E2F35]/10 bg-white p-4 text-sm">
            <p className="text-[0.6rem] uppercase tracking-[0.4em] text-[#3E2F35]/60">Nice-to-haves</p>
            <p className="mt-2 text-3xl font-semibold text-[#3E2F35]">{summary.niceToHave}</p>
          </div>
        </div>
      </section>
      <SectionNav />

      <section className="space-y-4">
        {summary.rows.map((row) => (
          <article
            key={row.id}
            className="flex flex-col gap-3 rounded-[28px] border border-[#3E2F35]/10 bg-white/90 p-5 shadow-[0_20px_60px_rgba(199,166,199,0.15)]"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[0.55rem] uppercase tracking-[0.5em] text-[#3E2F35]/60">Focus</p>
                <h2 className="text-lg font-semibold text-[#3E2F35]">{row.title}</h2>
              </div>
              <span className="rounded-full bg-[#F7E3E8] px-3 py-1 text-[0.65rem] uppercase tracking-[0.3em] text-[#3E2F35]/70">
                {row.status}
              </span>
            </div>
            <div className="flex justify-between text-[0.8rem] uppercase tracking-[0.3em] text-[#3E2F35]/60">
              <span>Essentials: {row.essentials}</span>
              <span>Nice: {row.niceToHave}</span>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
