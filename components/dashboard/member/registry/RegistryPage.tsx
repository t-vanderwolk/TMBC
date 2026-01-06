"use client";

import Link from "next/link";
import Script from "next/script";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type { RegistryDto, RegistryItemResponse } from "@/lib/services/server/registry.service";
import PlanSectionShell from "@/components/plan/PlanSectionShell";
import type { PlanDecisionState } from "@/lib/services/server/planSections.service";
import { planSectionKeys } from "@/lib/plan/planSectionMap";

// TMBC Canon:
// The Plan is a mentor-led registry builder.
// Registry items are proposed manually and decided by members.
// No automatic suggestions, no prices, no affiliate CTAs.
// Learn and Workbook inform decisions but never mutate the registry.

const API_BASE = "/api/registry";
const allowedDecisionStates: PlanDecisionState[] = ["considering", "waiting", "approved", "deferred"];
const normalizeDecisionState = (value: string | null) =>
  allowedDecisionStates.includes(value as PlanDecisionState) ? (value as PlanDecisionState) : null;

const fetchRegistry = async () => {
  const response = await fetch(API_BASE, { cache: "no-store" });
  if (!response.ok) {
    throw new Error("Unable to load registry");
  }
  return response.json();
};

const fetchPlanSections = async () => {
  const response = await fetch("/api/plan/sections", { cache: "no-store" });
  if (!response.ok) {
    throw new Error("Unable to load plan sections");
  }
  return response.json();
};

const postPlanSection = async (payload: {
  sectionKey: string;
  decisionState?: string | null;
  memberNote?: string | null;
  memberAcknowledgement?: string | null;
}) => {
  const response = await fetch("/api/plan/sections", {
    method: "POST",
    cache: "no-store",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.error || "Unable to update plan section.");
  }
  return data;
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

type PlanSection = {
  id: string;
  sectionKey: string;
  decisionState: string | null;
  mentorNote: string | null;
  memberNote: string | null;
  memberAcknowledgement: string | null;
  updatedByRole: string | null;
  updatedAt: string;
};

const deriveCategoryLabel = (item: PlanItem) =>
  item.category || item.product?.category || "General";

const learnHrefFor = (item: PlanItem) => {
  const category = deriveCategoryLabel(item).toLowerCase();
  return `/dashboard/member/learn?focus=${encodeURIComponent(category)}`;
};

const formatRelativeTime = (value?: string | null) => {
  if (!value) return "";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.valueOf())) return "";
  const diffMs = Date.now() - parsed.getTime();
  const minutes = Math.round(diffMs / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.round(hours / 24);
  if (days < 7) return `${days} day${days === 1 ? "" : "s"} ago`;
  return parsed.toLocaleDateString();
};


export default function RegistryPage() {
  const [registry, setRegistry] = useState<RegistryDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState("");
  // PHASE 1 — Shared Planning UX
  const [planSections, setPlanSections] = useState<PlanSection[]>([]);
  const [planSyncStatus, setPlanSyncStatus] = useState<Record<string, string>>({});
  const [memberNotes, setMemberNotes] = useState<Record<string, string>>({});
  const [noteDrafts, setNoteDrafts] = useState<Record<string, boolean>>({});
  const [noteSaved, setNoteSaved] = useState<Record<string, boolean>>({});
  const [pulseSections, setPulseSections] = useState<Record<string, boolean>>({});
  const [decisionBusyId, setDecisionBusyId] = useState<string | null>(null);
  const [suggestionBusyId, setSuggestionBusyId] = useState<string | null>(null);
  const [compareSelection, setCompareSelection] = useState<string[]>([]);
  const [compareError, setCompareError] = useState("");
  const [comparePayload, setComparePayload] = useState<ComparePayload | null>(null);
  const [compareOpen, setCompareOpen] = useState(false);
  const [externalProvider, setExternalProvider] = useState("");
  const [externalTitle, setExternalTitle] = useState("");
  const [externalUrl, setExternalUrl] = useState("");
  const [externalDocumentUrl, setExternalDocumentUrl] = useState("");
  const [externalDocumentLabel, setExternalDocumentLabel] = useState("");
  const [externalSaving, setExternalSaving] = useState(false);

  const loadRegistry = useCallback(async () => {
    setLoading(true);
    setStatusMessage("");
    try {
      const [{ registry: payload }, planResponse] = await Promise.all([
        fetchRegistry(),
        fetchPlanSections().catch((error) => {
          console.error(error);
          return { sections: [] };
        }),
      ]);
      setRegistry(payload);
      if (planResponse?.sections) {
        setPlanSections(planResponse.sections);
        setMemberNotes(
          planResponse.sections.reduce((acc: Record<string, string>, section: PlanSection) => {
            acc[section.sectionKey] = section.memberNote ?? "";
            return acc;
          }, {}),
        );
      }
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
  const mentorSuggestions = registry?.mentorSuggestions ?? [];
  const externalRegistries = registry?.externalRegistries ?? [];
  const planSectionLookup = useMemo(() => {
    return planSections.reduce<Record<string, PlanSection>>((acc, section) => {
      acc[section.sectionKey] = section;
      return acc;
    }, {});
  }, [planSections]);
  const previousPlanSectionsRef = useRef<Record<string, PlanSection>>({});

  useEffect(() => {
    const previous = previousPlanSectionsRef.current;
    if (!planSections.length) {
      previousPlanSectionsRef.current = planSectionLookup;
      return;
    }
    planSections.forEach((section) => {
      const prior = previous[section.sectionKey];
      if (!prior) return;
      const mentorNoteChanged =
        section.mentorNote &&
        section.mentorNote !== prior.mentorNote &&
        section.updatedByRole === "MENTOR";
      const decisionChanged = section.decisionState !== prior.decisionState;
      if (mentorNoteChanged || decisionChanged) {
        setPulseSections((current) => ({ ...current, [section.sectionKey]: true }));
        setTimeout(() => {
          setPulseSections((current) => ({ ...current, [section.sectionKey]: false }));
        }, 1200);
      }
    });
    previousPlanSectionsRef.current = planSectionLookup;
  }, [planSectionLookup, planSections]);

  const suggestedItems = items.filter(
    (item) => item.addedByMentor && item.decisionStatus !== "ACCEPTED" && item.status !== "REMOVED",
  );
  const acceptedItems = items.filter(
    (item) => item.decisionStatus === "ACCEPTED" || (!item.addedByMentor && item.status !== "REMOVED"),
  );
  const deferredItems = items.filter((item) => item.status === "REMOVED");
  const hasMentorActivity = planSections.some((section) => section.updatedByRole === "MENTOR");
  const latestPlanSection = planSections[0];
  const statusLine = latestPlanSection
    ? latestPlanSection.updatedByRole === "MENTOR"
      ? `Recently revisited by your mentor · ${formatRelativeTime(latestPlanSection.updatedAt)}`
      : `Recently revisited by you · ${formatRelativeTime(latestPlanSection.updatedAt)}`
    : "Your plan will take shape when you're ready.";

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

  // PHASE 1 — Shared Planning UX
  const setSectionSyncStatus = useCallback((sectionKey: string, message: string) => {
    setPlanSyncStatus((current) => ({ ...current, [sectionKey]: message }));
    if (message === "Saved") {
      setTimeout(() => {
        setPlanSyncStatus((current) => {
          const next = { ...current };
          if (next[sectionKey] === "Saved") {
            delete next[sectionKey];
          }
          return next;
        });
      }, 1600);
    }
  }, []);

  const updatePlanSection = useCallback(
    async (
      sectionKey: string,
      payload: { decisionState?: string; memberNote?: string; memberAcknowledgement?: string },
    ) => {
      try {
        setSectionSyncStatus(sectionKey, "Syncing...");
        const { section } = await postPlanSection({ sectionKey, ...payload });
        setPlanSections((current) => {
          const next = current.filter((entry) => entry.sectionKey !== section.sectionKey);
          return [section, ...next];
        });
        setMemberNotes((current) => ({ ...current, [section.sectionKey]: section.memberNote ?? "" }));
        setNoteDrafts((current) => ({ ...current, [section.sectionKey]: false }));
        if (payload.memberNote !== undefined) {
          setNoteSaved((current) => ({ ...current, [section.sectionKey]: true }));
          setTimeout(() => {
            setNoteSaved((current) => ({ ...current, [section.sectionKey]: false }));
          }, 1600);
        }
        setSectionSyncStatus(sectionKey, "Saved");
      } catch (error) {
        console.error(error);
        setSectionSyncStatus(sectionKey, "Couldn't save just now - try again");
      }
    },
    [setSectionSyncStatus],
  );

  const handleDecisionStateChange = (sectionKey: string, decisionState: string) => {
    void updatePlanSection(sectionKey, { decisionState });
    setPulseSections((current) => ({ ...current, [sectionKey]: true }));
    setTimeout(() => {
      setPulseSections((current) => ({ ...current, [sectionKey]: false }));
    }, 1200);
  };

  const handleMemberNoteSave = (sectionKey: string) => {
    const note = memberNotes[sectionKey] ?? "";
    void updatePlanSection(sectionKey, { memberNote: note });
  };

  const handleAcknowledgement = (sectionKey: string, acknowledgement: string) => {
    void updatePlanSection(sectionKey, { memberAcknowledgement: acknowledgement });
  };

  const mentorNoteStatusFor = (sectionKey: string) =>
    planSectionLookup[sectionKey]?.mentorNote ? "Saved" : "";
  const memberNoteStatusFor = (sectionKey: string) =>
    noteDrafts[sectionKey] ? "Draft" : noteSaved[sectionKey] ? "Saved" : "";

  const sectionCardClass = (sectionKey: string, base: string) =>
    `${base} transition-shadow ring-1 ring-[#F4E2EA] ${
      pulseSections[sectionKey] ? "ring-2 ring-[#E8C2D1] motion-safe:animate-pulse" : ""
    }`;

  const handleSuggestionAccept = useCallback(
    async (suggestionId: string) => {
      try {
        setSuggestionBusyId(suggestionId);
        setStatusMessage("");
        const response = await fetch(`/api/registry/suggestions/${suggestionId}/accept`, {
          method: "POST",
          cache: "no-store",
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data?.error || "Unable to accept suggestion.");
        }
        await loadRegistry();
      } catch (error) {
        setStatusMessage(error instanceof Error ? error.message : "Unable to accept suggestion.");
      } finally {
        setSuggestionBusyId(null);
      }
    },
    [loadRegistry],
  );

  const handleExternalRegistrySave = async () => {
    setStatusMessage("");
    if (!externalProvider.trim()) {
      setStatusMessage("Choose a registry provider.");
      return;
    }
    if (!externalUrl.trim() && !externalDocumentUrl.trim()) {
      setStatusMessage("Add a registry link or upload URL.");
      return;
    }

    try {
      setExternalSaving(true);
      const response = await fetch("/api/registry/external", {
        method: "POST",
        cache: "no-store",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider: externalProvider,
          title: externalTitle,
          url: externalUrl,
          documentUrl: externalDocumentUrl,
          documentLabel: externalDocumentLabel,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || "Unable to save external registry.");
      }
      setExternalProvider("");
      setExternalTitle("");
      setExternalUrl("");
      setExternalDocumentUrl("");
      setExternalDocumentLabel("");
      await loadRegistry();
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : "Unable to save external registry.");
    } finally {
      setExternalSaving(false);
    }
  };

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
        setCompareError("Reflection is limited to three items.");
        return prev;
      }
      return [...prev, itemId];
    });
  };

  const startCompare = async () => {
    if (compareSelection.length < 2) {
      setCompareError("Select at least two items to reflect on.");
      return;
    }
    try {
      setCompareError("");
      const payload = await postCompare({ itemIds: compareSelection, source: "member" });
      setComparePayload(payload);
    } catch (error) {
      setCompareError(error instanceof Error ? error.message : "Unable to start reflection.");
    }
  };

  const closeCompare = () => {
    setCompareOpen(false);
    setComparePayload(null);
    setCompareSelection([]);
    setCompareError("");
  };

  return (
    <main className="space-y-8 px-4 pb-20 pt-6 text-[#3E2F35] sm:px-6">
      <header className="space-y-3 rounded-[28px] bg-[#FFF9F5] p-5 shadow-sm">
        <p className="text-xs uppercase tracking-[0.4em] text-[#C8A1B4]">Your Shared Plan</p>
        <h1 className="font-serif text-3xl text-[#3E2F35]">Your Shared Plan</h1>
        <p className="text-sm text-[#3E2F35]/70">
          This is a shared planning space. Your mentor helps guide decisions, and nothing here is locked until you're ready.
        </p>
        <p className="text-xs text-[#A4556A]/70">{statusLine}</p>
      </header>

      <section className="rounded-[24px] border border-[#F3DFE9] bg-white/90 p-4 text-sm text-[#3E2F35]/70 shadow-sm">
        <p className="text-[0.65rem] uppercase tracking-[0.4em] text-[#C8A1B4]">Review status</p>
        <p className="mt-2">
          {hasMentorActivity
            ? "Your mentor revisited this plan recently."
            : "Your mentor will revisit this when you're ready."}
        </p>
      </section>

      {statusMessage ? (
        <div className="rounded-[28px] border border-[#F0CCD7] bg-[#FFF4FA] px-5 py-3 text-sm text-[#8B4A61]">
          {statusMessage}
        </div>
      ) : null}

      {loading ? (
        <section className="rounded-[28px] bg-white/95 p-5 shadow-sm">
          <p className="text-sm text-[#3E2F35]/70">Preparing your shared plan...</p>
        </section>
      ) : null}

      {!loading && !items.length && !mentorSuggestions.length ? (
        <section className="rounded-[28px] bg-white/95 p-5 shadow-sm">
          <p className="text-sm text-[#3E2F35]/70">
            Your mentor will share guidance once your onboarding context is reviewed.
          </p>
        </section>
      ) : null}

      <PlanSectionShell
        sectionKey={planSectionKeys.mentorSuggestions}
        decisionState={normalizeDecisionState(
          planSectionLookup[planSectionKeys.mentorSuggestions]?.decisionState ?? null,
        )}
        onDecisionChange={(value) => handleDecisionStateChange(planSectionKeys.mentorSuggestions, value)}
        updatedByRole={planSectionLookup[planSectionKeys.mentorSuggestions]?.updatedByRole ?? null}
        updatedAt={planSectionLookup[planSectionKeys.mentorSuggestions]?.updatedAt ?? null}
        mentorNote={planSectionLookup[planSectionKeys.mentorSuggestions]?.mentorNote ?? null}
        memberNote={memberNotes[planSectionKeys.mentorSuggestions] ?? ""}
        mentorNoteStatus={mentorNoteStatusFor(planSectionKeys.mentorSuggestions)}
        memberNoteStatus={memberNoteStatusFor(planSectionKeys.mentorSuggestions)}
        memberAcknowledgement={planSectionLookup[planSectionKeys.mentorSuggestions]?.memberAcknowledgement ?? null}
        onMemberAcknowledge={(value) => handleAcknowledgement(planSectionKeys.mentorSuggestions, value)}
        onMemberNoteChange={(value) => {
          setMemberNotes((current) => ({ ...current, [planSectionKeys.mentorSuggestions]: value }));
          setNoteDrafts((current) => ({ ...current, [planSectionKeys.mentorSuggestions]: true }));
        }}
        onMemberNoteSave={() => handleMemberNoteSave(planSectionKeys.mentorSuggestions)}
        syncStatus={planSyncStatus[planSectionKeys.mentorSuggestions]}
        viewerRole="member"
        className={sectionCardClass(
          planSectionKeys.mentorSuggestions,
          "space-y-4 rounded-[28px] bg-[#FFF9F5] p-5 shadow-sm",
        )}
      >
        {mentorSuggestions.length ? (
          <div className="space-y-3">
            <p className="text-[0.6rem] uppercase tracking-[0.35em] text-[#C8A1B4]">Direct suggestions</p>
            {mentorSuggestions.map((suggestion) => (
              <article key={suggestion.id} className="rounded-2xl bg-white/95 p-4 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.35em] text-[#C8A1B4]">
                      {suggestion.category}
                    </p>
                    <h3 className="mt-2 text-lg font-semibold text-[#3E2F35]">
                      {suggestion.productName}
                    </h3>
                    {suggestion.productBrand ? (
                      <p className="text-xs uppercase tracking-[0.3em] text-[#A4556A]">
                        {suggestion.productBrand}
                      </p>
                    ) : null}
                  </div>
                  <span className="text-[0.6rem] uppercase tracking-[0.35em] text-[#A4556A]">Guidance</span>
                </div>
                <p className="mt-2 text-sm text-[#3E2F35]/70">
                  Mentor perspective: {suggestion.note ?? "Mentor perspective incoming."}
                </p>
                <div className="mt-4 space-y-2">
                  <button
                    type="button"
                    onClick={() => handleSuggestionAccept(suggestion.id)}
                    disabled={suggestionBusyId === suggestion.id}
                    className="w-full rounded-full bg-[#C8A1B4] px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-white disabled:opacity-70"
                  >
                    {suggestionBusyId === suggestion.id ? "Saving..." : "Include for now"}
                  </button>
                  <div className="flex items-center justify-between text-xs text-[#A4556A]">
                    <a
                      href={`/api/registry/suggestions/${suggestion.id}/link`}
                      className="hover:text-[#7C3B53]"
                      target="_blank"
                      rel="noreferrer"
                    >
                      View product
                    </a>
                    <Link href="/dashboard/member/messages" className="hover:text-[#7C3B53]">
                      Talk with your mentor
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : null}

        {suggestedItems.length ? (
          <div className="space-y-3">
            <p className="text-[0.6rem] uppercase tracking-[0.35em] text-[#C8A1B4]">Guidance from your mentor</p>
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
                  <span className="text-[0.6rem] uppercase tracking-[0.35em] text-[#A4556A]">Guidance</span>
                </div>
                <p className="mt-2 text-sm text-[#3E2F35]/70">
                  Why this matters: {item.mentorNote ?? item.notes ?? "Mentor perspective incoming."}
                </p>
                <div className="mt-4 space-y-2">
                  <button
                    type="button"
                    onClick={() => handleDecision(item.id, "accept")}
                    disabled={decisionBusyId === item.id}
                    className="w-full rounded-full bg-[#C8A1B4] px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-white disabled:opacity-70"
                  >
                    {decisionBusyId === item.id ? "Saving..." : "Include for now"}
                  </button>
                  <div className="flex items-center justify-between text-xs text-[#A4556A]">
                    <Link href="/dashboard/member/messages" className="hover:text-[#7C3B53]">
                      Talk with your mentor
                    </Link>
                    <Link href={learnHrefFor(item)} className="hover:text-[#7C3B53]">
                      Learn more
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : null}

        {!mentorSuggestions.length && !suggestedItems.length ? (
          <p className="text-sm text-[#3E2F35]/70">
            No guidance added here yet. Your mentor will share perspective when it's helpful.
          </p>
        ) : null}
      </PlanSectionShell>

      <PlanSectionShell
        sectionKey={planSectionKeys.accepted}
        decisionState={normalizeDecisionState(
          planSectionLookup[planSectionKeys.accepted]?.decisionState ?? null,
        )}
        onDecisionChange={(value) => handleDecisionStateChange(planSectionKeys.accepted, value)}
        updatedByRole={planSectionLookup[planSectionKeys.accepted]?.updatedByRole ?? null}
        updatedAt={planSectionLookup[planSectionKeys.accepted]?.updatedAt ?? null}
        mentorNote={planSectionLookup[planSectionKeys.accepted]?.mentorNote ?? null}
        memberNote={memberNotes[planSectionKeys.accepted] ?? ""}
        mentorNoteStatus={mentorNoteStatusFor(planSectionKeys.accepted)}
        memberNoteStatus={memberNoteStatusFor(planSectionKeys.accepted)}
        memberAcknowledgement={planSectionLookup[planSectionKeys.accepted]?.memberAcknowledgement ?? null}
        onMemberAcknowledge={(value) => handleAcknowledgement(planSectionKeys.accepted, value)}
        onMemberNoteChange={(value) => {
          setMemberNotes((current) => ({ ...current, [planSectionKeys.accepted]: value }));
          setNoteDrafts((current) => ({ ...current, [planSectionKeys.accepted]: true }));
        }}
        onMemberNoteSave={() => handleMemberNoteSave(planSectionKeys.accepted)}
        syncStatus={planSyncStatus[planSectionKeys.accepted]}
        viewerRole="member"
        className={sectionCardClass(
          planSectionKeys.accepted,
          "space-y-4 rounded-[28px] bg-[#FFF9F5] p-5 shadow-sm",
        )}
      >
        {acceptedItems.length ? (
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
                  <span className="text-[0.6rem] uppercase tracking-[0.35em] text-[#A4556A]">Aligned for now</span>
                </div>
                {item.mentorNote || item.notes ? (
                  <p className="mt-2 text-sm text-[#3E2F35]/70">
                    Mentor perspective: {item.mentorNote ?? item.notes}
                  </p>
                ) : null}
                <div className="mt-4 space-y-2">
                  <button
                    type="button"
                    onClick={() => openCompare(item.id)}
                    className="w-full rounded-full bg-[#C8A1B4] px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-white"
                  >
                    Think through
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
        ) : (
          <p className="text-sm text-[#3E2F35]/70">Nothing set yet - and that's completely normal.</p>
        )}

        <div className="mt-6 space-y-3">
          <p className="text-[0.6rem] uppercase tracking-[0.35em] text-[#C8A1B4]">Still deciding</p>
          <p className="text-sm text-[#3E2F35]/70">
            It's okay to wait. These don't need a decision yet.
          </p>
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
                  <span className="text-[0.6rem] uppercase tracking-[0.35em] text-[#A4556A]">Revisit later</span>
                </div>
                <p className="mt-2 text-sm text-[#3E2F35]/70">
                  We can revisit this when the timing feels right.
                </p>
                <div className="mt-4 flex items-center justify-between text-xs text-[#A4556A]">
                  <Link href={learnHrefFor(item)} className="hover:text-[#7C3B53]">
                    Learn more
                  </Link>
                  <Link href="/dashboard/member/messages" className="hover:text-[#7C3B53]">
                    Talk with your mentor
                  </Link>
                </div>
              </article>
            ))
          ) : (
            <p className="text-sm text-[#3E2F35]/70">Nothing in this lane yet.</p>
          )}
        </div>

        <div className="mt-6 rounded-[28px] bg-white/95 p-5 text-sm text-[#3E2F35]/70 shadow-sm">
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
        </div>
      </PlanSectionShell>

      <PlanSectionShell
        sectionKey={planSectionKeys.externalRegistries}
        decisionState={normalizeDecisionState(
          planSectionLookup[planSectionKeys.externalRegistries]?.decisionState ?? null,
        )}
        onDecisionChange={(value) => handleDecisionStateChange(planSectionKeys.externalRegistries, value)}
        updatedByRole={planSectionLookup[planSectionKeys.externalRegistries]?.updatedByRole ?? null}
        updatedAt={planSectionLookup[planSectionKeys.externalRegistries]?.updatedAt ?? null}
        mentorNote={planSectionLookup[planSectionKeys.externalRegistries]?.mentorNote ?? null}
        memberNote={memberNotes[planSectionKeys.externalRegistries] ?? ""}
        mentorNoteStatus={mentorNoteStatusFor(planSectionKeys.externalRegistries)}
        memberNoteStatus={memberNoteStatusFor(planSectionKeys.externalRegistries)}
        memberAcknowledgement={planSectionLookup[planSectionKeys.externalRegistries]?.memberAcknowledgement ?? null}
        onMemberAcknowledge={(value) => handleAcknowledgement(planSectionKeys.externalRegistries, value)}
        onMemberNoteChange={(value) => {
          setMemberNotes((current) => ({ ...current, [planSectionKeys.externalRegistries]: value }));
          setNoteDrafts((current) => ({ ...current, [planSectionKeys.externalRegistries]: true }));
        }}
        onMemberNoteSave={() => handleMemberNoteSave(planSectionKeys.externalRegistries)}
        syncStatus={planSyncStatus[planSectionKeys.externalRegistries]}
        viewerRole="member"
        className={sectionCardClass(
          planSectionKeys.externalRegistries,
          "space-y-4 rounded-[28px] bg-white/95 p-5 shadow-sm",
        )}
      >
        <div className="grid gap-3 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-[0.35em] text-[#A4556A]">Provider</label>
            <select
              value={externalProvider}
              onChange={(event) => setExternalProvider(event.target.value)}
              className="w-full rounded-2xl border border-[#E3C6D4] bg-white/90 p-3 text-sm text-[#3E2F35]"
            >
              <option value="">Choose provider</option>
              <option value="MyRegistry">MyRegistry</option>
              <option value="Babylist">Babylist</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-[0.35em] text-[#A4556A]">Title</label>
            <input
              value={externalTitle}
              onChange={(event) => setExternalTitle(event.target.value)}
              placeholder="Optional title"
              className="w-full rounded-2xl border border-[#E3C6D4] bg-white/90 p-3 text-sm text-[#3E2F35]"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-[0.35em] text-[#A4556A]">Registry link</label>
            <input
              value={externalUrl}
              onChange={(event) => setExternalUrl(event.target.value)}
              placeholder="https://"
              className="w-full rounded-2xl border border-[#E3C6D4] bg-white/90 p-3 text-sm text-[#3E2F35]"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-[0.35em] text-[#A4556A]">Upload link</label>
            <input
              value={externalDocumentUrl}
              onChange={(event) => setExternalDocumentUrl(event.target.value)}
              placeholder="PDF or photo link"
              className="w-full rounded-2xl border border-[#E3C6D4] bg-white/90 p-3 text-sm text-[#3E2F35]"
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="text-xs uppercase tracking-[0.35em] text-[#A4556A]">Upload label</label>
            <input
              value={externalDocumentLabel}
              onChange={(event) => setExternalDocumentLabel(event.target.value)}
              placeholder="Optional label for the upload"
              className="w-full rounded-2xl border border-[#E3C6D4] bg-white/90 p-3 text-sm text-[#3E2F35]"
            />
          </div>
        </div>
        <button
          type="button"
          onClick={handleExternalRegistrySave}
          disabled={externalSaving}
          className="rounded-full bg-[#C8A1B4] px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-white disabled:opacity-70"
        >
          {externalSaving ? "Saving..." : "Save reference"}
        </button>

        {externalRegistries.length ? (
          <div className="space-y-3">
            {externalRegistries.map((external) => (
              <div key={external.id} className="rounded-2xl bg-[#FFF9F5] p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-xs uppercase tracking-[0.35em] text-[#C8A1B4]">
                      {external.provider}
                    </p>
                    <p className="mt-2 text-base font-semibold text-[#3E2F35]">
                      {external.title || "External registry"}
                    </p>
                  </div>
                  <span className="text-[0.6rem] uppercase tracking-[0.35em] text-[#A4556A]">
                    Reference Only
                  </span>
                </div>
                <div className="mt-2 flex flex-wrap gap-3 text-xs text-[#A4556A]">
                  {external.url ? (
                    <a href={external.url} target="_blank" rel="noreferrer" className="hover:text-[#7C3B53]">
                      Open registry
                    </a>
                  ) : null}
                  {external.documentUrl ? (
                    <a
                      href={external.documentUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-[#7C3B53]"
                    >
                      {external.documentLabel || "Open upload"}
                    </a>
                  ) : null}
                </div>
                {external.notes.length ? (
                  <div className="mt-3 space-y-2 text-sm text-[#3E2F35]/70">
                    {external.notes.map((note) => (
                      <div key={note.id} className="rounded-xl bg-white/80 p-3">
                        <p>{note.note}</p>
                        <p className="mt-1 text-xs text-[#3E2F35]/60">
                          {note.authorName || note.authorRole.toLowerCase()} ·{" "}
                          {new Date(note.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="mt-3 text-sm text-[#3E2F35]/70">No mentor perspective yet.</p>
                )}
              </div>
            ))}
          </div>
          ) : (
            <p className="text-sm text-[#3E2F35]/70">Optional. Add outside references only if they're useful.</p>
          )}
      </PlanSectionShell>

      {compareOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#3E2F35]/40 px-4 py-10">
          <div className="w-full max-w-4xl space-y-5 rounded-[32px] bg-[#FFF9F5] p-6 shadow-[0_40px_80px_rgba(62,47,53,0.25)]">
            {!comparePayload ? (
              <>
                <header className="space-y-2">
                  <p className="text-[0.65rem] uppercase tracking-[0.45em] text-[#C8A1B4]">Reflect</p>
                  <h2 className="text-2xl font-semibold text-[#3E2F35]">Pick up to three aligned items</h2>
                  <p className="text-sm text-[#3E2F35]/70">This is a clarity check, not a transaction.</p>
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
                    Start reflection
                  </button>
                </div>
              </>
            ) : (
              <>
                <header className="space-y-2">
                  <p className="text-[0.65rem] uppercase tracking-[0.45em] text-[#C8A1B4]">Reflect</p>
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
                          <span className="font-semibold text-[#3E2F35]">Mentor perspective:</span>{" "}
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
                    <p className="uppercase tracking-[0.35em] text-[#C8A1B4]">Mentor perspective</p>
                    <div className="mt-2 space-y-2">
                      {comparePayload.mentorSuggestions.map((suggestion) => (
                        <p key={suggestion.id}>
                          {suggestion.productName} — {suggestion.note || "Mentor perspective available."}
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
