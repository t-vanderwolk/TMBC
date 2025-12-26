"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import type { RegistryDto, RegistryItemResponse } from "@/lib/services/server/registry.service";
import RegistryHeader from "@/components/dashboard/member/registry/RegistryHeader";
import RegistrySection from "@/components/dashboard/member/registry/RegistrySection";
import RegistryItemCard from "@/components/dashboard/member/registry/RegistryItemCard";
import RegistryEmptyState from "@/components/dashboard/member/registry/RegistryEmptyState";
import RegistryMentorCollabCard from "@/components/dashboard/member/registry/RegistryMentorCollabCard";

const API_BASE = "/api/registry";

const fetchRegistry = async () => {
  const response = await fetch(API_BASE, { cache: "no-store" });
  if (!response.ok) {
    throw new Error("Unable to load registry");
  }
  return response.json();
};

const postAction = async (path: string) => {
  const response = await fetch(path, { method: "POST", cache: "no-store" });
  if (!response.ok) {
    throw new Error("Request failed");
  }
  return response.json();
};

const postCompare = async (path: string, payload: Record<string, unknown>) => {
  const response = await fetch(path, {
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

  const postPriceIntelligence = async () => {
    const response = await fetch("/api/registry/price-intelligence", {
      method: "POST",
      cache: "no-store",
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data?.error || "Unable to refresh price insights.");
    }
    return data as { alerts: Array<{ message: string }> };
  };

const SECTIONS = [
  {
    id: "nursery",
    title: "Nursery",
    helper: "Soft layers and restful light for the space you come home to.",
    keywords: ["nursery", "sleep", "cradle", "bassinet"],
  },
  {
    id: "gear",
    title: "Gear",
    helper: "Tools that move with you, your body, and your rhythm.",
    keywords: ["gear", "stroller", "car", "travel", "seat"],
  },
  {
    id: "feeding",
    title: "Feeding",
    helper: "Comfort-first options for feeding, pumping, and bonding.",
    keywords: ["feeding", "bottle", "nursing", "lactation"],
  },
  {
    id: "postpartum",
    title: "Postpartum",
    helper: "Restorative rituals to support recovery and relationship rhythms.",
    keywords: ["postpartum", "recovery", "support", "wellness"],
  },
  {
    id: "later",
    title: "Nice-to-have / Later",
    helper: "These can rest until the moment feels right.",
    keywords: [],
  },
];

const itemSection = (item: RegistryItemResponse) => {
  const sectionId = (item.section ?? "gear").toLowerCase();
  return SECTIONS.find((section) => section.id === sectionId) ?? SECTIONS.at(-1)!;
};

const mapStatus = (status?: string | null) => {
  if (!status) return "Considering";
  const normalized = status.toUpperCase();
  if (normalized === "PURCHASED") return "Purchased";
  if (normalized === "CONSIDERING") return "Considering";
  if (normalized === "REMOVED") return "Removed";
  return "Added";
};

type SectionGroup = {
  id: string;
  title: string;
  helper: string;
  items: RegistryItemResponse[];
};

type ComparePayload = {
  category: string;
  items: Array<{
    id: string;
    name: string;
    brand: string;
    category: string;
    imageUrl: string | null;
    merchant: string | null;
    section: string;
    status: string;
    notes: string | null;
    mentorNotes: Array<{
      id: string;
      note: string;
      mentorName: string | null;
      createdAt: string;
    }>;
  }>;
  mentorSuggestions: Array<{
    id: string;
    mentorId: string;
    mentorName: string | null;
    category: string;
    productId: string;
    productName: string;
    productBrand: string;
    productImageUrl: string | null;
    note: string;
    createdAt: string;
  }>;
  lifestyleTags: string[];
  academy: {
    completedCount: number;
    totalCount: number;
    relevantModules: Array<{ id: string; title: string; completed: boolean }>;
  };
  mentorInvolvement: boolean;
  registryId: string;
  source: string;
};

export default function RegistryPage() {
  const [registry, setRegistry] = useState<RegistryDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [priceAlerts, setPriceAlerts] = useState<string[]>([]);
  const [priceAlertError, setPriceAlertError] = useState("");
  const [priceAlertLoading, setPriceAlertLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [comparePayload, setComparePayload] = useState<ComparePayload | null>(null);
  const [compareBusy, setCompareBusy] = useState(false);
  const [compareError, setCompareError] = useState("");
  const [acceptedItemId, setAcceptedItemId] = useState<string | null>(null);

  const loadRegistry = useCallback(async () => {
    setLoading(true);
    setStatusMessage("");
    try {
      const { registry: payload } = await fetchRegistry();
      setRegistry(payload);
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : "Unable to reach the registry service.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadRegistry();
  }, [loadRegistry]);

  useEffect(() => {
    const loadPriceInsights = async () => {
      try {
        setPriceAlertLoading(true);
        const payload = await postPriceIntelligence();
        setPriceAlerts((payload.alerts ?? []).map((alert) => alert.message));
        setPriceAlertError("");
      } catch (error) {
        setPriceAlertError(error instanceof Error ? error.message : "Unable to load price insights.");
      } finally {
        setPriceAlertLoading(false);
      }
    };

    void loadPriceInsights();
  }, []);

  const handleSync = useCallback(async () => {
    setSyncing(true);
    try {
      const { registry: payload } = await postAction(`${API_BASE}/sync`);
      setRegistry(payload);
    } catch {
      setStatusMessage("Unable to sync right now.");
    } finally {
      setSyncing(false);
    }
  }, []);

  const groupedSections = useMemo<SectionGroup[]>(() => {
    const map: Record<string, RegistryItemResponse[]> = {};
    SECTIONS.forEach((section) => {
      map[section.id] = [];
    });
    (registry?.items ?? []).forEach((item) => {
      const section = itemSection(item);
      const bucket = map[section.id];
      if (!bucket) {
        map[section.id] = [item];
        return;
      }
      bucket.push(item);
    });
    return SECTIONS.map((section) => ({
      id: section.id,
      title: section.title,
      helper: section.helper,
      items: map[section.id] ?? [],
    }));
  }, [registry?.items]);

  const hasItems = (registry?.items?.length ?? 0) > 0;
  const itemLookup = useMemo(() => {
    return new Map((registry?.items ?? []).map((item) => [item.id, item]));
  }, [registry?.items]);

  const selectedItems = selectedIds.map((id) => itemLookup.get(id)).filter(Boolean) as RegistryItemResponse[];
  const selectedCategories = new Set(
    selectedItems.map((item) => (item.category ?? item.product.category ?? "").trim().toLowerCase()).filter(Boolean),
  );
  const selectionCount = selectedIds.length;
  const canCompare = selectionCount >= 2 && selectionCount <= 3 && selectedCategories.size === 1;

  useEffect(() => {
    setSelectedIds((prev) => prev.filter((id) => itemLookup.has(id)));
  }, [itemLookup]);

  const toggleSelection = useCallback(
    (itemId: string) => {
      setSelectedIds((prev) => {
        if (prev.includes(itemId)) {
          return prev.filter((id) => id !== itemId);
        }
        if (prev.length >= 3) {
          setStatusMessage("Compare is limited to three items.");
          return prev;
        }
        return [...prev, itemId];
      });
    },
    [setSelectedIds],
  );

  const clearSelection = useCallback(() => {
    setSelectedIds([]);
    setCompareError("");
  }, []);

  const startCompare = useCallback(async () => {
    if (!canCompare) {
      setCompareError("Select 2 or 3 items in the same category to compare.");
      return;
    }
    try {
      setCompareBusy(true);
      setCompareError("");
      const payload = await postCompare("/api/registry/compare/start", {
        itemIds: selectedIds,
        source: "member",
      });
      setComparePayload(payload);
      setAcceptedItemId(null);
    } catch (error) {
      setCompareError(error instanceof Error ? error.message : "Unable to start compare.");
    } finally {
      setCompareBusy(false);
    }
  }, [canCompare, selectedIds]);

  const submitDecision = useCallback(
    async (
      decision: "accept" | "modify" | "defer",
      options?: { acceptedSuggestionId?: string | null },
    ) => {
      try {
        setCompareBusy(true);
        setCompareError("");
        await postCompare("/api/registry/compare/decision", {
          itemIds: selectedIds,
          decision,
          source: "member",
          acceptedItemId:
            decision === "accept" && !options?.acceptedSuggestionId ? acceptedItemId : null,
          acceptedSuggestionId: options?.acceptedSuggestionId ?? null,
        });
        setComparePayload(null);
        setAcceptedItemId(null);
        clearSelection();
      } catch (error) {
        setCompareError(error instanceof Error ? error.message : "Unable to save decision.");
      } finally {
        setCompareBusy(false);
      }
    },
    [acceptedItemId, clearSelection, selectedIds],
  );

  return (
    <main className="space-y-6 px-4 pb-28 pt-6 text-[#3E2F35] sm:px-6">
      <RegistryHeader status="You’ve started strong. We’ll refine this together." />
      <RegistryMentorCollabCard />
      {(priceAlerts.length > 0 || priceAlertLoading || priceAlertError) && (
        <section className="rounded-[28px] border border-[#E3C6D4] bg-[#FFF9F5] px-5 py-4 text-sm text-[#3E2F35]/80 shadow-sm">
          <p className="text-[0.65rem] uppercase tracking-[0.45em] text-[#C8A1B4]">
            Price intelligence
          </p>
          {priceAlertLoading && (
            <p className="mt-2 text-sm text-[#3E2F35]/70">Checking for calm price shifts...</p>
          )}
          {priceAlertError && (
            <p className="mt-2 text-xs text-[#8B4A61]">{priceAlertError}</p>
          )}
          {priceAlerts.length > 0 && (
            <div className="mt-3 space-y-2 text-sm text-[#3E2F35]/75">
              {priceAlerts.map((message, index) => (
                <p key={`${message}-${index}`}>{message}</p>
              ))}
            </div>
          )}
          <p className="mt-3 text-xs text-[#3E2F35]/60">
            Price insights are advisory and never include checkout links.
          </p>
        </section>
      )}

      {statusMessage && (
        <div className="rounded-[28px] border border-[#F0CCD7] bg-[#FFF4FA] px-5 py-3 text-sm text-[#8B4A61]">
          {statusMessage}
        </div>
      )}

      {selectionCount > 0 && (
        <section className="rounded-[28px] border border-[#E3C6D4] bg-[#FFF9F5] px-5 py-4 text-sm text-[#3E2F35]/80 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[0.65rem] uppercase tracking-[0.45em] text-[#C8A1B4]">Compare</p>
              <p className="text-sm text-[#3E2F35]/75">
                {selectionCount} selected{selectedCategories.size === 1 && selectedItems[0]?.category
                  ? ` · ${selectedItems[0].category}`
                  : ""}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={clearSelection}
                className="rounded-full border border-[#E3C6D4] px-4 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.25em] text-[#B98AA5]"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={startCompare}
                disabled={!canCompare || compareBusy}
                className="rounded-full bg-[#C8A1B4] px-5 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.25em] text-white disabled:cursor-not-allowed disabled:opacity-70"
              >
                {compareBusy ? "Preparing..." : "Compare"}
              </button>
            </div>
          </div>
          {!canCompare && (
              <p className="mt-2 text-xs text-[#3E2F35]/60">
                Compare is limited to 2-3 items from the same category.
              </p>
          )}
          {compareError && <p className="mt-2 text-xs text-[#8B4A61]">{compareError}</p>}
        </section>
      )}

      {loading ? (
        <RegistryEmptyState title="Preparing your Registry…" message="Preparing your Registry…" />
      ) : !hasItems ? (
        <RegistryEmptyState />
      ) : (
        groupedSections.map((section) => (
          <RegistrySection key={section.id} title={section.title} helper={section.helper}>
            {section.items.length ? (
              <div className="space-y-3">
                {section.items.map((item) => (
                  <RegistryItemCard
                    key={item.id}
                    image={item.product.imageUrl}
                    name={item.product.name}
                    category={item.product.category}
                    reason={item.notes ?? item.mentorNotes[0]?.note}
                    statusLabel={mapStatus(item.status)}
                    mentorNote={item.mentorNotes[0]?.note ?? undefined}
                    mentorName={item.mentorNotes[0]?.mentorName ?? undefined}
                    selectable
                    selected={selectedIds.includes(item.id)}
                    onToggleSelect={() => toggleSelection(item.id)}
                  />
                ))}
              </div>
            ) : (
              <RegistryEmptyState
                title="You don’t need everything at once."
                message="This can wait until the moment feels right."
                className="border-none bg-transparent shadow-none text-left"
              />
            )}
          </RegistrySection>
        ))
      )}

      <button
        type="button"
        className="fixed inset-x-4 bottom-4 z-20 rounded-2xl bg-[#C8A1B4] px-6 py-3 text-xs font-semibold uppercase tracking-[0.35em] text-white shadow-lg shadow-[#3E2F35]/20 transition hover:bg-[#B98AA5] md:relative md:inset-auto md:bottom-auto"
      >
        Add item
      </button>

      {syncing && (
        <p className="text-center text-xs uppercase tracking-[0.35em] text-[#3E2F35]/60">
          Syncing your updates…
        </p>
      )}

      {comparePayload && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#3E2F35]/40 px-4 py-10">
          <div className="w-full max-w-5xl space-y-6 rounded-[32px] border border-[#E3C6D4] bg-[#FFF9F5] p-6 shadow-[0_40px_80px_rgba(62,47,53,0.25)]">
            <header className="space-y-2">
              <p className="text-[0.65rem] uppercase tracking-[0.45em] text-[#C8A1B4]">
                Compare - Decision Support
              </p>
              <h2 className="text-2xl font-semibold text-[#3E2F35]">
                {comparePayload.category} comparison
              </h2>
              <p className="text-sm text-[#3E2F35]/70">
                This is a confidence check, not a checkout. Make a decision to return to your registry.
              </p>
            </header>

            <div className="grid gap-4 md:grid-cols-3">
              {comparePayload.items.map((item) => (
                <div
                  key={item.id}
                  className="rounded-[24px] border border-[#E3C6D4] bg-white/90 p-4 shadow-sm"
                >
                  <div className="flex items-start gap-3">
                    <div className="h-14 w-14 overflow-hidden rounded-2xl bg-[#FFF8F6]">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-[0.6rem] uppercase tracking-[0.2em] text-[#C8A1B4]">
                          Photo
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-base font-semibold text-[#3E2F35]">{item.name}</p>
                      <p className="text-xs uppercase tracking-[0.35em] text-[#3E2F35]/60">
                        {item.brand}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 space-y-2 text-xs text-[#3E2F35]/70">
                    <p>
                      <span className="font-semibold text-[#3E2F35]">Lifestyle fit:</span>{" "}
                      {comparePayload.lifestyleTags.length
                        ? comparePayload.lifestyleTags.join(", ")
                        : "No lifestyle tags yet."}
                    </p>
                    <p>
                      <span className="font-semibold text-[#3E2F35]">Growth & space:</span>{" "}
                      {item.notes || "Consider longevity, storage, and daily flow."}
                    </p>
                    <p>
                      <span className="font-semibold text-[#3E2F35]">Safety cues:</span> Check manuals and brand
                      guidance for your setup.
                    </p>
                    <p>
                      <span className="font-semibold text-[#3E2F35]">Mentor insight:</span>{" "}
                      {item.mentorNotes.length
                        ? item.mentorNotes[0]?.note
                        : "No mentor notes on this item yet."}
                    </p>
                  </div>
                  <label className="mt-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#B98AA5]">
                    <input
                      type="radio"
                      name="acceptedItem"
                      checked={acceptedItemId === item.id}
                      onChange={() => setAcceptedItemId(item.id)}
                    />
                    Accept this
                  </label>
                </div>
              ))}
            </div>

            {comparePayload.mentorSuggestions.length > 0 && (
              <div className="rounded-[24px] border border-[#E3C6D4] bg-white/90 p-4">
                <p className="text-[0.65rem] uppercase tracking-[0.45em] text-[#C8A1B4]">
                  Suggested by your mentor
                </p>
                <p className="mt-2 text-xs text-[#3E2F35]/60">
                  Advisory only - you decide what lands in your registry.
                </p>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  {comparePayload.mentorSuggestions.map((suggestion) => (
                    <div
                      key={suggestion.id}
                      className="rounded-[20px] border border-[#E3C6D4] bg-[#FFF9F5] p-4"
                    >
                      <div className="flex items-start gap-3">
                        <div className="h-12 w-12 overflow-hidden rounded-2xl bg-[#FFF8F6]">
                          {suggestion.productImageUrl ? (
                            <img
                              src={suggestion.productImageUrl}
                              alt={suggestion.productName}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-[0.6rem] uppercase tracking-[0.2em] text-[#C8A1B4]">
                              Photo
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-base font-semibold text-[#3E2F35]">
                            {suggestion.productName}
                          </p>
                          <p className="text-xs uppercase tracking-[0.35em] text-[#3E2F35]/60">
                            {suggestion.productBrand}
                          </p>
                        </div>
                      </div>
                      <p className="mt-3 text-xs text-[#3E2F35]/70">
                        Mentor rationale: {suggestion.note}
                      </p>
                      <button
                        type="button"
                        onClick={() => submitDecision("accept", { acceptedSuggestionId: suggestion.id })}
                        disabled={compareBusy}
                        className="mt-4 rounded-full bg-[#C8A1B4] px-4 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.25em] text-white disabled:opacity-70"
                      >
                        Accept mentor suggestion
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="rounded-[24px] border border-[#E3C6D4] bg-white/80 p-4 text-xs text-[#3E2F35]/70">
              <p className="uppercase tracking-[0.35em] text-[#C8A1B4]">Academy signals</p>
              <p className="mt-2">
                {comparePayload.academy.completedCount} of {comparePayload.academy.totalCount} modules completed.
              </p>
              {comparePayload.academy.relevantModules.length > 0 && (
                <p className="mt-1">
                  Relevant modules:{" "}
                  {comparePayload.academy.relevantModules
                    .map((module) => `${module.title}${module.completed ? " (done)" : ""}`)
                    .join(", ")}
                </p>
              )}
            </div>

            {compareError && <p className="text-xs text-[#8B4A61]">{compareError}</p>}

            <div className="flex flex-wrap items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => submitDecision("defer")}
                disabled={compareBusy}
                className="rounded-full border border-[#E3C6D4] px-5 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#B98AA5] disabled:opacity-70"
              >
                Defer
              </button>
              <button
                type="button"
                onClick={() => submitDecision("modify")}
                disabled={compareBusy}
                className="rounded-full border border-[#E3C6D4] px-5 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#B98AA5] disabled:opacity-70"
              >
                Modify
              </button>
              <button
                type="button"
                onClick={() => submitDecision("accept")}
                disabled={compareBusy || !acceptedItemId}
                className="rounded-full bg-[#C8A1B4] px-6 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-white disabled:opacity-70"
              >
                Accept
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
