"use client";

import Link from "next/link";
import Script from "next/script";
import { useCallback, useEffect, useMemo, useState } from "react";

import type { RegistryDto, RegistryItemResponse } from "@/lib/services/server/registry.service";

// TMBC Canon:
// The Plan is a mentor-led registry builder.
// Registry items are proposed manually and decided by members.
// No automatic suggestions, no prices, no affiliate CTAs.
// Learn and Workbook inform decisions but never mutate the registry.

const API_BASE = "/api/registry";

const fetchRegistry = async () => {
  const response = await fetch(API_BASE, { cache: "no-store" });
  if (!response.ok) {
    throw new Error("Unable to load registry");
  }
  return response.json();
};

const postDecision = async (payload: { itemId: string; decision: "accept" | "defer" }) => {
  const response = await fetch(`${API_BASE}/decision`, {
    method: "POST",
    cache: "no-store",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.error || "Unable to save decision.");
  }
  return data;
};

const postCompare = async (payload: { itemIds: string[]; source: string }) => {
  const response = await fetch(`${API_BASE}/compare/start`, {
    method: "POST",
    cache: "no-store",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.error || "Unable to compare items.");
  }
  return data;
};

type PlanItem = RegistryItemResponse & {
  decisionStatus?: string | null;
  addedByMentor?: boolean;
  mentorNote?: string | null;
};

type ComparePayload = {
  category: string;
  items: Array<{
    id: string;
    name: string;
    brand: string;
    category: string;
    imageUrl: string | null;
    notes: string | null;
    mentorNotes: Array<{ note: string; mentorName: string | null }>;
  }>;
  mentorSuggestions: Array<{
    id: string;
    mentorName: string | null;
    productName: string;
    productBrand: string;
    note: string | null;
  }>;
  academy: {
    completedCount: number;
    totalCount: number;
    relevantModules: Array<{ id: string; title: string; completed: boolean }>;
  };
};

const deriveCategoryLabel = (item: PlanItem) =>
  item.category || item.product?.category || "General";

const learnHrefFor = (item: PlanItem) => {
  const category = deriveCategoryLabel(item).toLowerCase();
  return `/dashboard/member/learn?focus=${encodeURIComponent(category)}`;
};

export default function RegistryPage() {
  const [registry, setRegistry] = useState<RegistryDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState("");
  const [decisionBusyId, setDecisionBusyId] = useState<string | null>(null);
  const [compareSelection, setCompareSelection] = useState<string[]>([]);
  const [compareError, setCompareError] = useState("");
  const [comparePayload, setComparePayload] = useState<ComparePayload | null>(null);
  const [compareOpen, setCompareOpen] = useState(false);

  const loadRegistry = useCallback(async () => {
    setLoading(true);
    setStatusMessage("");
    try {
      const { registry: payload } = await fetchRegistry();
      setRegistry(payload);
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : "Unable to reach the Plan right now.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadRegistry();
  }, [loadRegistry]);

  const items = (registry?.items ?? []) as PlanItem[];

  const suggestedItems = items.filter(
    (item) => item.addedByMentor && item.decisionStatus !== "ACCEPTED" && item.status !== "REMOVED",
  );
  const acceptedItems = items.filter(
    (item) => item.decisionStatus === "ACCEPTED" || (!item.addedByMentor && item.status !== "REMOVED"),
  );
  const deferredItems = items.filter((item) => item.status === "REMOVED");

  const handleDecision = useCallback(
    async (itemId: string, decision: "accept" | "defer") => {
      try {
        setDecisionBusyId(itemId);
        setStatusMessage("");
        await postDecision({ itemId, decision });
        await loadRegistry();
      } catch (error) {
        setStatusMessage(error instanceof Error ? error.message : "Unable to save that decision.");
      } finally {
        setDecisionBusyId(null);
      }
    },
    [loadRegistry],
  );

  const openCompare = useCallback(
    (itemId: string) => {
      setCompareSelection([itemId]);
      setComparePayload(null);
      setCompareError("");
      setCompareOpen(true);
    },
    [],
  );

  const compareCandidates = useMemo(() => {
    if (!compareSelection.length) return [] as PlanItem[];
    const selected = items.find((item) => item.id === compareSelection[0]);
    if (!selected) return [] as PlanItem[];
    const category = deriveCategoryLabel(selected).toLowerCase();
    return acceptedItems.filter((item) => deriveCategoryLabel(item).toLowerCase() === category);
  }, [acceptedItems, compareSelection, items]);

  const toggleCompareSelection = (itemId: string) => {
    setCompareSelection((prev) => {
      if (prev.includes(itemId)) {
        return prev.filter((id) => id !== itemId);
      }
      if (prev.length >= 3) {
        setCompareError("Compare is limited to three items.");
        return prev;
      }
      return [...prev, itemId];
    });
  };

  const startCompare = async () => {
    if (compareSelection.length < 2) {
      setCompareError("Select at least two accepted items to compare.");
      return;
    }
    try {
      setCompareError("");
      const payload = await postCompare({ itemIds: compareSelection, source: "member" });
      setComparePayload(payload);
    } catch (error) {
      setCompareError(error instanceof Error ? error.message : "Unable to start compare.");
    }
  };

  const closeCompare = () => {
    setCompareOpen(false);
    setComparePayload(null);
    setCompareSelection([]);
    setCompareError("");
  };

  return (
    <main className="space-y-6 px-4 pb-20 pt-6 text-[#3E2F35] sm:px-6">
      <header className="space-y-2 rounded-[28px] bg-[#FFF9F5] p-5 shadow-sm">
        <p className="text-xs uppercase tracking-[0.4em] text-[#C8A1B4]">Your Plan</p>
        <h1 className="font-serif text-3xl text-[#3E2F35]">Built with your mentor</h1>
        <p className="text-sm text-[#3E2F35]/70">
          This is a calm, human plan. Nothing appears here without a real conversation.
        </p>
      </header>

      {statusMessage ? (
        <div className="rounded-[28px] border border-[#F0CCD7] bg-[#FFF4FA] px-5 py-3 text-sm text-[#8B4A61]">
          {statusMessage}
        </div>
      ) : null}

      {loading ? (
        <section className="rounded-[28px] bg-white/95 p-5 shadow-sm">
          <p className="text-sm text-[#3E2F35]/70">Preparing your plan...</p>
        </section>
      ) : null}

      {!loading && !items.length ? (
        <section className="rounded-[28px] bg-white/95 p-5 shadow-sm">
          <p className="text-sm text-[#3E2F35]/70">
            Your mentor will start sending suggestions once your onboarding context is reviewed.
          </p>
        </section>
      ) : null}

      {!!suggestedItems.length && (
        <section className="space-y-4 rounded-[28px] bg-[#FFF9F5] p-5 shadow-sm">
          <div className="space-y-1">
            <h2 className="text-sm font-semibold uppercase tracking-[0.35em] text-[#A4556A]">
              Suggested by your mentor
            </h2>
            <p className="text-sm text-[#3E2F35]/70">Consider these when you feel ready.</p>
          </div>
          <div className="space-y-3">
            {suggestedItems.map((item) => (
              <article key={item.id} className="rounded-2xl bg-white/95 p-4 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.35em] text-[#C8A1B4]">
                      {deriveCategoryLabel(item)}
                    </p>
                    <h3 className="mt-2 text-lg font-semibold text-[#3E2F35]">
                      {item.title ?? item.product?.name}
                    </h3>
                  </div>
                  <span className="text-[0.6rem] uppercase tracking-[0.35em] text-[#A4556A]">Suggested</span>
                </div>
                <p className="mt-2 text-sm text-[#3E2F35]/70">
                  Why this was suggested: {item.mentorNote ?? item.notes ?? "Mentor context incoming."}
                </p>
                <div className="mt-4 space-y-2">
                  <button
                    type="button"
                    onClick={() => handleDecision(item.id, "accept")}
                    disabled={decisionBusyId === item.id}
                    className="w-full rounded-full bg-[#C8A1B4] px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-white disabled:opacity-70"
                  >
                    {decisionBusyId === item.id ? "Saving..." : "Accept"}
                  </button>
                  <div className="flex items-center justify-between text-xs text-[#A4556A]">
                    <Link href="/dashboard/member/messages" className="hover:text-[#7C3B53]">
                      Ask your mentor
                    </Link>
                    <Link href={learnHrefFor(item)} className="hover:text-[#7C3B53]">
                      Learn more
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {!!acceptedItems.length && (
        <section className="space-y-4 rounded-[28px] bg-[#FFF9F5] p-5 shadow-sm">
          <div className="space-y-1">
            <h2 className="text-sm font-semibold uppercase tracking-[0.35em] text-[#A4556A]">Accepted</h2>
            <p className="text-sm text-[#3E2F35]/70">These are your current picks.</p>
          </div>
          <div className="space-y-3">
            {acceptedItems.map((item) => (
              <article key={item.id} className="rounded-2xl bg-white/95 p-4 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.35em] text-[#C8A1B4]">
                      {deriveCategoryLabel(item)}
                    </p>
                    <h3 className="mt-2 text-lg font-semibold text-[#3E2F35]">
                      {item.title ?? item.product?.name}
                    </h3>
                  </div>
                  <span className="text-[0.6rem] uppercase tracking-[0.35em] text-[#A4556A]">Accepted</span>
                </div>
                {item.mentorNote || item.notes ? (
                  <p className="mt-2 text-sm text-[#3E2F35]/70">
                    Mentor note: {item.mentorNote ?? item.notes}
                  </p>
                ) : null}
                <div className="mt-4 space-y-2">
                  <button
                    type="button"
                    onClick={() => openCompare(item.id)}
                    className="w-full rounded-full bg-[#C8A1B4] px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-white"
                  >
                    Compare
                  </button>
                  <div className="flex items-center justify-between text-xs text-[#A4556A]">
                    <Link href={learnHrefFor(item)} className="hover:text-[#7C3B53]">
                      Learn more
                    </Link>
                    <button type="button" className="text-[#A4556A]/60" disabled>
                      Track price (coming later)
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      <details className="rounded-[28px] bg-[#FFF9F5] p-5 shadow-sm">
        <summary className="cursor-pointer text-sm font-semibold uppercase tracking-[0.35em] text-[#A4556A]">
          Revisit later
        </summary>
        <div className="mt-4 space-y-3">
          {deferredItems.length ? (
            deferredItems.map((item) => (
              <article key={item.id} className="rounded-2xl bg-white/95 p-4 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.35em] text-[#C8A1B4]">
                      {deriveCategoryLabel(item)}
                    </p>
                    <h3 className="mt-2 text-lg font-semibold text-[#3E2F35]">
                      {item.title ?? item.product?.name}
                    </h3>
                  </div>
                  <span className="text-[0.6rem] uppercase tracking-[0.35em] text-[#A4556A]">Deferred</span>
                </div>
                <p className="mt-2 text-sm text-[#3E2F35]/70">
                  We can revisit this when the timing feels right.
                </p>
                <div className="mt-4 flex items-center justify-between text-xs text-[#A4556A]">
                  <Link href={learnHrefFor(item)} className="hover:text-[#7C3B53]">
                    Learn more
                  </Link>
                  <Link href="/dashboard/member/messages" className="hover:text-[#7C3B53]">
                    Ask your mentor
                  </Link>
                </div>
              </article>
            ))
          ) : (
            <p className="text-sm text-[#3E2F35]/70">Nothing deferred right now.</p>
          )}
        </div>
      </details>

      <section className="rounded-[28px] bg-white/95 p-5 text-sm text-[#3E2F35]/70 shadow-sm">
        <p className="text-[0.65rem] uppercase tracking-[0.4em] text-[#C8A1B4]">Schedule</p>
        <p className="mt-2">Schedule a video chat with your mentor.</p>
        <div
          className="embedded-booking mt-4"
          data-url="https://babyconcierge.totsquad.com"
          data-query="&t=s&uuid=e95b1c84-b8f7-4f11-b7ce-4f81a1961b67"
          data-employee="taylor-vanderwolk"
          data-lang="en"
          data-autoresize="1"
          data-showsidebar="1"
          data-showservices="0"
          style={{ minWidth: 320 }}
        />
        <Script src="https://babyconcierge.totsquad.com/embed.js" async />
      </section>

      {compareOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#3E2F35]/40 px-4 py-10">
          <div className="w-full max-w-4xl space-y-5 rounded-[32px] bg-[#FFF9F5] p-6 shadow-[0_40px_80px_rgba(62,47,53,0.25)]">
            {!comparePayload ? (
              <>
                <header className="space-y-2">
                  <p className="text-[0.65rem] uppercase tracking-[0.45em] text-[#C8A1B4]">Compare</p>
                  <h2 className="text-2xl font-semibold text-[#3E2F35]">Pick up to three accepted items</h2>
                  <p className="text-sm text-[#3E2F35]/70">This is a clarity check, not a checkout.</p>
                </header>
                <div className="grid gap-3 md:grid-cols-2">
                  {compareCandidates.map((item) => (
                    <label
                      key={item.id}
                      className="flex items-start gap-3 rounded-2xl bg-white/90 p-4 text-sm text-[#3E2F35]/80"
                    >
                      <input
                        type="checkbox"
                        checked={compareSelection.includes(item.id)}
                        onChange={() => toggleCompareSelection(item.id)}
                      />
                      <span>
                        <span className="text-xs uppercase tracking-[0.35em] text-[#C8A1B4]">
                          {deriveCategoryLabel(item)}
                        </span>
                        <span className="mt-2 block text-base font-semibold text-[#3E2F35]">
                          {item.title ?? item.product?.name}
                        </span>
                      </span>
                    </label>
                  ))}
                </div>
                {compareError ? <p className="text-xs text-[#8B4A61]">{compareError}</p> : null}
                <div className="flex flex-wrap items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={closeCompare}
                    className="rounded-full border border-[#E3C6D4] px-5 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#B98AA5]"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={startCompare}
                    className="rounded-full bg-[#C8A1B4] px-6 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-white"
                  >
                    Start compare
                  </button>
                </div>
              </>
            ) : (
              <>
                <header className="space-y-2">
                  <p className="text-[0.65rem] uppercase tracking-[0.45em] text-[#C8A1B4]">Compare</p>
                  <h2 className="text-2xl font-semibold text-[#3E2F35]">
                    {comparePayload.category} differences that matter
                  </h2>
                  <p className="text-sm text-[#3E2F35]/70">Use this to talk through trade-offs with your mentor.</p>
                </header>
                <div className="grid gap-4 md:grid-cols-2">
                  {comparePayload.items.map((item) => (
                    <div key={item.id} className="rounded-2xl bg-white/90 p-4 text-sm text-[#3E2F35]/80">
                      <p className="text-base font-semibold text-[#3E2F35]">{item.name}</p>
                      <p className="text-xs uppercase tracking-[0.35em] text-[#C8A1B4]">{item.brand}</p>
                      <div className="mt-3 space-y-2">
                        <p>
                          <span className="font-semibold text-[#3E2F35]">Mentor rationale:</span>{" "}
                          {item.mentorNotes[0]?.note || item.notes || "Add a mentor note for clarity."}
                        </p>
                        <p>
                          <span className="font-semibold text-[#3E2F35]">Fit & space:</span> Consider footprint and storage.
                        </p>
                        <p>
                          <span className="font-semibold text-[#3E2F35]">Daily flow:</span> Think about carry, setup, and cleanup.
                        </p>
                        <p>
                          <span className="font-semibold text-[#3E2F35]">Longevity:</span> Note how long it supports your routines.
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                {comparePayload.mentorSuggestions.length ? (
                  <div className="rounded-2xl bg-white/90 p-4 text-xs text-[#3E2F35]/70">
                    <p className="uppercase tracking-[0.35em] text-[#C8A1B4]">Mentor suggestions</p>
                    <div className="mt-2 space-y-2">
                      {comparePayload.mentorSuggestions.map((suggestion) => (
                        <p key={suggestion.id}>
                          {suggestion.productName} — {suggestion.note || "Mentor context available."}
                        </p>
                      ))}
                    </div>
                  </div>
                ) : null}
                <div className="rounded-2xl bg-white/90 p-4 text-xs text-[#3E2F35]/70">
                  <p className="uppercase tracking-[0.35em] text-[#C8A1B4]">Academy context</p>
                  <p className="mt-2">
                    {comparePayload.academy.completedCount} of {comparePayload.academy.totalCount} modules completed.
                  </p>
                  {comparePayload.academy.relevantModules.length ? (
                    <p className="mt-1">
                      Relevant modules: {comparePayload.academy.relevantModules.map((mod) => mod.title).join(", ")}
                    </p>
                  ) : null}
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={closeCompare}
                    className="rounded-full border border-[#E3C6D4] px-5 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#B98AA5]"
                  >
                    Close
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
