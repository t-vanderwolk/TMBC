"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import type { RegistryDto, RegistryItemResponse } from "@/lib/services/server/registry.service";
import RegistryHeader from "@/components/dashboard/member/registry/RegistryHeader";
import RegistrySection from "@/components/dashboard/member/registry/RegistrySection";
import RegistryItemCard from "@/components/dashboard/member/registry/RegistryItemCard";
import RegistryEmptyState from "@/components/dashboard/member/registry/RegistryEmptyState";

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

export default function RegistryPage() {
  const [registry, setRegistry] = useState<RegistryDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

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

  return (
    <main className="space-y-6 px-4 pb-28 pt-6 text-[#3E2F35] sm:px-6">
      <RegistryHeader status="You’ve started strong. We’ll refine this together." />

      {statusMessage && (
        <div className="rounded-[28px] border border-[#F0CCD7] bg-[#FFF4FA] px-5 py-3 text-sm text-[#8B4A61]">
          {statusMessage}
        </div>
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
    </main>
  );
}
