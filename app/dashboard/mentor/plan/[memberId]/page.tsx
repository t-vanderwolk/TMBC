"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { useParams } from "next/navigation";

import { useRequireRole } from "@/lib/auth/useRequireRole";
import type { RegistryItemResponse } from "@/lib/services/server/registry.service";
import PlanSectionShell from "@/components/plan/PlanSectionShell";
import type { PlanDecisionState } from "@/lib/services/server/planSections.service";
import { planSectionKeys } from "@/lib/plan/planSectionMap";

// TMBC Canon:
// The Plan is a mentor-led registry builder.
// Registry items are proposed manually and decided by members.
// No automatic suggestions, no prices, no affiliate CTAs.
// Learn and Workbook inform decisions but never mutate the registry.

type MentorPlanPayload = {
  member: { id: string; name: string | null; email: string };
  onboarding: {
    status: string;
    tags: string[];
    answers: Record<string, unknown>;
    lifestyleSnapshot: Record<string, unknown> | null;
  } | null;
  workbook: Array<{
    id: string;
    moduleId: string;
    moduleTitle: string;
    updatedAt: string;
    responses: Array<{ prompt: string; response: string }>;
  }>;
  registryItems: RegistryItemResponse[];
  mentorSuggestions: Array<{
    id: string;
    mentorId: string;
    mentorName: string | null;
    memberId: string;
    category: string;
    productId: string;
    productName: string;
    productBrand: string | null;
    productImageUrl: string | null;
    note: string | null;
    createdAt: string;
    acceptedAt: string | null;
  }>;
  externalRegistries: Array<{
    id: string;
    provider: string;
    title: string | null;
    url: string | null;
    documentUrl: string | null;
    documentLabel: string | null;
    referenceOnly: boolean;
    createdAt: string;
    notes: Array<{
      id: string;
      authorId: string;
      authorName: string | null;
      authorRole: string;
      note: string;
      createdAt: string;
    }>;
  }>;
  planSections: PlanSection[];
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

const allowedDecisionStates: PlanDecisionState[] = ["considering", "waiting", "approved", "deferred"];
const normalizeDecisionState = (value: string | null) =>
  allowedDecisionStates.includes(value as PlanDecisionState) ? (value as PlanDecisionState) : null;

const formatLabel = (value: string) =>
  value
    .replace(/_/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\b\w/g, (char) => char.toUpperCase());

const summarizeValue = (value: unknown) => {
  if (value === null || value === undefined) return "";
  if (Array.isArray(value)) return value.join(", ");
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
};

const truncate = (value: string, max = 140) =>
  value.length > max ? `${value.slice(0, max)}...` : value;

const statusLabelForItem = (item: RegistryItemResponse) => {
  if (item.decisionStatus === "ACCEPTED") return "Aligned for now";
  if (item.status === "REMOVED") return "Revisit later";
  if (item.status === "CONSIDERING") return "In conversation";
  if (item.status === "ADDED" || item.status === "PURCHASED") return "Aligned for now";
  return "In conversation";
};

const formatDateValue = (value: unknown) => {
  if (value === null || value === undefined) return "";
  if (typeof value === "string" || typeof value === "number") {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.valueOf())) {
      return parsed.toLocaleDateString();
    }
  }
  return summarizeValue(value);
};


const chipClasses =
  "rounded-full border border-[#E3C6D4] bg-white/90 px-2.5 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.3em] text-[#A4556A]";

const postPlanSection = async (
  memberId: string,
  payload: { sectionKey: string; decisionState?: string | null; mentorNote?: string | null },
) => {
  const response = await fetch(`/api/mentor/plan/${memberId}/sections`, {
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

export default function MentorPlanPage() {
  useRequireRole(["MENTOR", "ADMIN"]);
  const params = useParams<{ memberId: string }>();
  const memberId = params?.memberId ?? "";

  const [payload, setPayload] = useState<MentorPlanPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  // PHASE 1 — Shared Planning UX
  const [planSections, setPlanSections] = useState<PlanSection[]>([]);
  const [planSyncStatus, setPlanSyncStatus] = useState<Record<string, string>>({});
  const [mentorNotes, setMentorNotes] = useState<Record<string, string>>({});
  const [noteDrafts, setNoteDrafts] = useState<Record<string, boolean>>({});
  const [noteSaved, setNoteSaved] = useState<Record<string, boolean>>({});
  const [pulseSections, setPulseSections] = useState<Record<string, boolean>>({});

  const [title, setTitle] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [mentorNote, setMentorNote] = useState("");
  const [productId, setProductId] = useState("");

  const loadPlan = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`/api/mentor/plan/${memberId}`, { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || "Unable to load member plan.");
      }
      setPayload(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load member plan.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!memberId) return;
    void loadPlan();
  }, [memberId]);

  useEffect(() => {
    if (!payload?.planSections) return;
    setPlanSections(payload.planSections);
    setMentorNotes(
      payload.planSections.reduce((acc: Record<string, string>, section) => {
        acc[section.sectionKey] = section.mentorNote ?? "";
        return acc;
      }, {}),
    );
  }, [payload]);

  const registryItems = (payload?.registryItems ?? []) as RegistryItemResponse[];
  const mentorSuggestions = payload?.mentorSuggestions ?? [];
  const pendingSuggestions = mentorSuggestions.filter((suggestion) => !suggestion.acceptedAt);
  const externalRegistries = payload?.externalRegistries ?? [];
  const [externalNotes, setExternalNotes] = useState<Record<string, string>>({});
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

  const registrySummary = useMemo(() => {
    const suggested = pendingSuggestions;
    const accepted = registryItems.filter(
      (item) =>
        item.decisionStatus === "ACCEPTED" || item.status === "ADDED" || item.status === "PURCHASED",
    );
    const deferred = registryItems.filter((item) => item.status === "REMOVED");
    return { suggested, accepted, deferred };
  }, [pendingSuggestions, registryItems]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setFormError("");
    if (!title.trim() || !category.trim() || !mentorNote.trim()) {
      setFormError("Add a suggested option, category, and mentor rationale before proposing.");
      return;
    }
    try {
      setSaving(true);
      const response = await fetch(`/api/mentor/plan/${memberId}/suggest`, {
        method: "POST",
        cache: "no-store",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          brand,
          category,
          mentorNote,
          productId: productId || null,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || "Unable to propose for plan.");
      }
      setTitle("");
      setBrand("");
      setCategory("");
      setMentorNote("");
      setProductId("");
      await loadPlan();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Unable to propose for plan.");
    } finally {
      setSaving(false);
    }
  };

  const handleExternalNote = async (registryId: string) => {
    const note = externalNotes[registryId]?.trim() ?? "";
    if (!note) {
      setFormError("Add a note before saving.");
      return;
    }
    try {
      setFormError("");
      const response = await fetch(`/api/mentor/external-registries/${registryId}/notes`, {
        method: "POST",
        cache: "no-store",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ note }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || "Unable to save note.");
      }
      setExternalNotes((prev) => ({ ...prev, [registryId]: "" }));
      await loadPlan();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Unable to save note.");
    }
  };

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
    async (sectionKey: string, payload: { decisionState?: string; mentorNote?: string }) => {
      try {
        setSectionSyncStatus(sectionKey, "Syncing...");
        const { section } = await postPlanSection(memberId, { sectionKey, ...payload });
        setPlanSections((current) => {
          const next = current.filter((entry) => entry.sectionKey !== section.sectionKey);
          return [section, ...next];
        });
        setMentorNotes((current) => ({ ...current, [section.sectionKey]: section.mentorNote ?? "" }));
        setNoteDrafts((current) => ({ ...current, [section.sectionKey]: false }));
        if (payload.mentorNote !== undefined) {
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
    [memberId, setSectionSyncStatus],
  );

  const handleDecisionStateChange = (sectionKey: string, decisionState: string) => {
    void updatePlanSection(sectionKey, { decisionState });
    setPulseSections((current) => ({ ...current, [sectionKey]: true }));
    setTimeout(() => {
      setPulseSections((current) => ({ ...current, [sectionKey]: false }));
    }, 1200);
  };

  const handleMentorNoteSave = (sectionKey: string) => {
    const note = mentorNotes[sectionKey] ?? "";
    void updatePlanSection(sectionKey, { mentorNote: note });
  };

  const onboardingAnswers = payload?.onboarding?.answers ?? {};
  const onboardingTags = payload?.onboarding?.tags ?? [];
  const answerEntries = Object.entries(onboardingAnswers).slice(0, 6);
  const dueDateEntry = Object.entries(onboardingAnswers).find(([key]) =>
    key.toLowerCase().includes("due"),
  );
  const dueDate = dueDateEntry ? formatDateValue(dueDateEntry[1]) : "";
  const mentorNoteStatusFor = (sectionKey: string) =>
    noteDrafts[sectionKey] ? "Draft" : noteSaved[sectionKey] ? "Saved" : "";
  const memberNoteStatusFor = (sectionKey: string) =>
    planSectionLookup[sectionKey]?.memberNote ? "Shared" : "";

  const sectionCardClass = (sectionKey: string, base: string) =>
    `${base} transition-shadow ring-1 ring-[#F4E2EA] ${
      pulseSections[sectionKey] ? "ring-2 ring-[#E8C2D1] motion-safe:animate-pulse" : ""
    }`;

  return (
    <main className="space-y-6 px-4 pb-20 pt-6 text-[#3E2F35] sm:px-6">
      <header className="space-y-4 rounded-[28px] bg-[#FFF9F5] p-5 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.4em] text-[#C8A1B4]">Your Shared Plan</p>
            <h1 className="font-serif text-3xl text-[#3E2F35]">Your Shared Plan</h1>
            <p className="text-sm text-[#3E2F35]/70">
              This is a shared planning space. Your mentor helps guide decisions, and nothing here is locked until you're ready.
            </p>
          </div>
          <div className="w-full rounded-2xl bg-white/90 p-4 text-xs text-[#3E2F35]/70 sm:w-[260px]">
            <p className="text-[0.6rem] uppercase tracking-[0.35em] text-[#C8A1B4]">Member snapshot</p>
            <p className="mt-2 text-sm font-semibold text-[#3E2F35]">
              {payload?.member?.name || payload?.member?.email || "Member"}
            </p>
            <p className="mt-1">Due date: {dueDate || "Not shared yet."}</p>
            <p className="mt-1">
              Key constraints: {onboardingTags.length ? onboardingTags.join(", ") : "None shared yet."}
            </p>
            <Link href="#workbook" className="mt-2 inline-block text-xs text-[#A4556A] hover:text-[#7C3B53]">
              View workbook
            </Link>
          </div>
        </div>
      </header>

      {error ? (
        <div className="rounded-[28px] border border-[#F0CCD7] bg-[#FFF4FA] px-5 py-3 text-sm text-[#8B4A61]">
          {error}
        </div>
      ) : null}

      {loading ? (
        <section className="rounded-[28px] bg-white/95 p-5 shadow-sm">
          <p className="text-sm text-[#3E2F35]/70">Loading shared context...</p>
        </section>
      ) : null}

      {!loading && payload ? (
        <>
          <PlanSectionShell
            sectionKey={planSectionKeys.onboardingContext}
            decisionState={normalizeDecisionState(
              planSectionLookup[planSectionKeys.onboardingContext]?.decisionState ?? null,
            )}
            onDecisionChange={(value) => handleDecisionStateChange(planSectionKeys.onboardingContext, value)}
            updatedByRole={planSectionLookup[planSectionKeys.onboardingContext]?.updatedByRole ?? null}
            updatedAt={planSectionLookup[planSectionKeys.onboardingContext]?.updatedAt ?? null}
            mentorNote={mentorNotes[planSectionKeys.onboardingContext] ?? ""}
            memberNote={planSectionLookup[planSectionKeys.onboardingContext]?.memberNote ?? null}
            mentorNoteStatus={mentorNoteStatusFor(planSectionKeys.onboardingContext)}
            memberNoteStatus={memberNoteStatusFor(planSectionKeys.onboardingContext)}
            memberAcknowledgement={
              planSectionLookup[planSectionKeys.onboardingContext]?.memberAcknowledgement ?? null
            }
            onMentorNoteChange={(value) => {
              setMentorNotes((current) => ({ ...current, [planSectionKeys.onboardingContext]: value }));
              setNoteDrafts((current) => ({ ...current, [planSectionKeys.onboardingContext]: true }));
            }}
            onMentorNoteSave={() => handleMentorNoteSave(planSectionKeys.onboardingContext)}
            syncStatus={planSyncStatus[planSectionKeys.onboardingContext]}
            viewerRole="mentor"
            className={sectionCardClass(
              planSectionKeys.onboardingContext,
              "space-y-3 rounded-[28px] bg-white/95 p-5 shadow-sm",
            )}
          >
            {/* TMBC Canon:
                Onboarding is mentor context only.
                Mentors decide what to suggest. */}
            <div className="space-y-6">
              <div className="space-y-3 text-sm text-[#3E2F35]/80">
                <p className="text-[0.6rem] uppercase tracking-[0.35em] text-[#C8A1B4]">Questionnaire</p>
                {payload.onboarding ? (
                  <>
                    {payload.onboarding.tags?.length ? (
                      <p>
                        Tags: {payload.onboarding.tags.join(", ")}
                      </p>
                    ) : (
                      <p>No tags yet.</p>
                    )}
                    {answerEntries.length ? (
                      <div className="space-y-2">
                        {answerEntries.map(([key, value]) => (
                          <p key={key}>
                            <span className="font-semibold text-[#3E2F35]">{formatLabel(key)}:</span>{" "}
                            {truncate(summarizeValue(value))}
                          </p>
                        ))}
                      </div>
                    ) : (
                      <p>No questionnaire answers captured yet.</p>
                    )}
                  </>
                ) : (
                  <p>Onboarding responses not found.</p>
                )}
              </div>

              <div id="workbook" className="space-y-3">
                <p className="text-[0.6rem] uppercase tracking-[0.35em] text-[#C8A1B4]">Workbook highlights</p>
                {payload.workbook.length ? (
                  <div className="space-y-3">
                    {payload.workbook.map((entry) => (
                      <details key={entry.id} className="rounded-2xl bg-[#FFF9F5] p-4">
                        <summary className="cursor-pointer text-sm font-semibold text-[#3E2F35]">
                          {entry.moduleTitle}
                        </summary>
                        <div className="mt-3 space-y-2 text-sm text-[#3E2F35]/70">
                          {entry.responses.length ? (
                            entry.responses.map((response) => (
                              <p key={response.prompt}>
                                <span className="font-semibold text-[#3E2F35]">{response.prompt}</span>{" "}
                                {response.response || "No response yet."}
                              </p>
                            ))
                          ) : (
                            <p>No workbook responses yet.</p>
                          )}
                        </div>
                      </details>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-[#3E2F35]/70">No workbook responses yet.</p>
                )}
              </div>

              <div className="space-y-3">
                <p className="text-[0.6rem] uppercase tracking-[0.35em] text-[#C8A1B4]">Plan rhythm</p>
                <div className="grid gap-3 text-sm text-[#3E2F35]/70 sm:grid-cols-3">
                  <div className="rounded-2xl bg-[#FFF9F5] p-4">
                    <p className="text-xs uppercase tracking-[0.35em] text-[#C8A1B4]">In conversation</p>
                    <p className="mt-2 text-2xl font-semibold text-[#3E2F35]">
                      {registrySummary.suggested.length}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-[#FFF9F5] p-4">
                    <p className="text-xs uppercase tracking-[0.35em] text-[#C8A1B4]">Aligned for now</p>
                    <p className="mt-2 text-2xl font-semibold text-[#3E2F35]">
                      {registrySummary.accepted.length}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-[#FFF9F5] p-4">
                    <p className="text-xs uppercase tracking-[0.35em] text-[#C8A1B4]">Revisit later</p>
                    <p className="mt-2 text-2xl font-semibold text-[#3E2F35]">
                      {registrySummary.deferred.length}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </PlanSectionShell>


          <PlanSectionShell
            sectionKey={planSectionKeys.mentorSuggestions}
            decisionState={normalizeDecisionState(
              planSectionLookup[planSectionKeys.mentorSuggestions]?.decisionState ?? null,
            )}
            onDecisionChange={(value) => handleDecisionStateChange(planSectionKeys.mentorSuggestions, value)}
            updatedByRole={planSectionLookup[planSectionKeys.mentorSuggestions]?.updatedByRole ?? null}
            updatedAt={planSectionLookup[planSectionKeys.mentorSuggestions]?.updatedAt ?? null}
            mentorNote={mentorNotes[planSectionKeys.mentorSuggestions] ?? ""}
            memberNote={planSectionLookup[planSectionKeys.mentorSuggestions]?.memberNote ?? null}
            mentorNoteStatus={mentorNoteStatusFor(planSectionKeys.mentorSuggestions)}
            memberNoteStatus={memberNoteStatusFor(planSectionKeys.mentorSuggestions)}
            memberAcknowledgement={planSectionLookup[planSectionKeys.mentorSuggestions]?.memberAcknowledgement ?? null}
            helperText="Propose ideas or products to support this part of the plan."
            onMentorNoteChange={(value) => {
              setMentorNotes((current) => ({ ...current, [planSectionKeys.mentorSuggestions]: value }));
              setNoteDrafts((current) => ({ ...current, [planSectionKeys.mentorSuggestions]: true }));
            }}
            onMentorNoteSave={() => handleMentorNoteSave(planSectionKeys.mentorSuggestions)}
            syncStatus={planSyncStatus[planSectionKeys.mentorSuggestions]}
            viewerRole="mentor"
            className={sectionCardClass(
              planSectionKeys.mentorSuggestions,
              "space-y-4 rounded-[28px] bg-[#FFF9F5] p-5 shadow-sm",
            )}
          >
            {pendingSuggestions.length ? (
              <div className="space-y-3 text-sm text-[#3E2F35]/80">
                <p className="text-[0.6rem] uppercase tracking-[0.35em] text-[#C8A1B4]">In conversation</p>
                {pendingSuggestions.map((suggestion) => (
                  <div key={suggestion.id} className="rounded-2xl bg-white/95 p-4 shadow-sm">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <p className="text-xs uppercase tracking-[0.35em] text-[#C8A1B4]">
                          {suggestion.category}
                        </p>
                        <p className="mt-2 text-base font-semibold text-[#3E2F35]">
                          {suggestion.productName}
                          {suggestion.productBrand ? ` · ${suggestion.productBrand}` : ""}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <span className={chipClasses}>Shared by you</span>
                        <span className={chipClasses}>In conversation</span>
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-[#3E2F35]/70">
                      Mentor perspective: {suggestion.note ?? "Perspective coming soon."}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-[#3E2F35]/70">
                No guidance added here yet. Your mentor will share thoughts when it's helpful.
              </p>
            )}

            <div className="mt-6 space-y-3">
              <p className="text-[0.6rem] uppercase tracking-[0.35em] text-[#C8A1B4]">Offer guidance</p>
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-[0.35em] text-[#A4556A]">Category</label>
                  <select
                    value={category}
                    onChange={(event) => setCategory(event.target.value)}
                    className="w-full rounded-2xl border border-[#E3C6D4] bg-white/90 p-3 text-sm text-[#3E2F35]"
                  >
                    <option value="">Choose a category</option>
                    <option value="Nursery">Nursery</option>
                    <option value="Gear">Gear</option>
                    <option value="Feeding">Feeding</option>
                    <option value="Postpartum">Postpartum</option>
                    <option value="Safety">Safety</option>
                    <option value="Sleep">Sleep</option>
                    <option value="Travel">Travel</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-[0.35em] text-[#A4556A]">Suggested option</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    placeholder="Describe the option"
                    className="w-full rounded-2xl border border-[#E3C6D4] bg-white/90 p-3 text-sm text-[#3E2F35]"
                  />
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-[0.35em] text-[#A4556A]">Brand</label>
                    <input
                      type="text"
                      value={brand}
                      onChange={(event) => setBrand(event.target.value)}
                      placeholder="Optional brand"
                      className="w-full rounded-2xl border border-[#E3C6D4] bg-white/90 p-3 text-sm text-[#3E2F35]"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-[0.35em] text-[#A4556A]">Canon product ID</label>
                    <input
                      type="text"
                      value={productId}
                      onChange={(event) => setProductId(event.target.value)}
                      placeholder="Optional lookup"
                      className="w-full rounded-2xl border border-[#E3C6D4] bg-white/90 p-3 text-sm text-[#3E2F35]"
                    />
                    <p className="text-xs text-[#3E2F35]/60">
                      Use this if a canon item already exists. Manual entries are always fine.
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-[0.35em] text-[#A4556A]">Mentor perspective</label>
                  <textarea
                    value={mentorNote}
                    onChange={(event) => setMentorNote(event.target.value)}
                    placeholder="Why this could fit their life and space"
                    className="min-h-[6rem] w-full rounded-2xl border border-[#E3C6D4] bg-white/90 p-3 text-sm text-[#3E2F35]"
                  />
                </div>
                {formError ? <p className="text-xs text-[#8B4A61]">{formError}</p> : null}
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full rounded-full bg-[#C8A1B4] px-5 py-3 text-xs font-semibold uppercase tracking-[0.4em] text-white disabled:opacity-60"
                >
                  {saving ? "Sending..." : "Share guidance"}
                </button>
              </form>
              <Link href="/dashboard/mentor/messages" className="text-xs text-[#A4556A] hover:text-[#7C3B53]">
                Continue the conversation
              </Link>
            </div>
          </PlanSectionShell>

          <PlanSectionShell
            sectionKey={planSectionKeys.accepted}
            decisionState={normalizeDecisionState(
              planSectionLookup[planSectionKeys.accepted]?.decisionState ?? null,
            )}
            onDecisionChange={(value) => handleDecisionStateChange(planSectionKeys.accepted, value)}
            updatedByRole={planSectionLookup[planSectionKeys.accepted]?.updatedByRole ?? null}
            updatedAt={planSectionLookup[planSectionKeys.accepted]?.updatedAt ?? null}
            mentorNote={mentorNotes[planSectionKeys.accepted] ?? ""}
            memberNote={planSectionLookup[planSectionKeys.accepted]?.memberNote ?? null}
            mentorNoteStatus={mentorNoteStatusFor(planSectionKeys.accepted)}
            memberNoteStatus={memberNoteStatusFor(planSectionKeys.accepted)}
            memberAcknowledgement={planSectionLookup[planSectionKeys.accepted]?.memberAcknowledgement ?? null}
            onMentorNoteChange={(value) => {
              setMentorNotes((current) => ({ ...current, [planSectionKeys.accepted]: value }));
              setNoteDrafts((current) => ({ ...current, [planSectionKeys.accepted]: true }));
            }}
            onMentorNoteSave={() => handleMentorNoteSave(planSectionKeys.accepted)}
            syncStatus={planSyncStatus[planSectionKeys.accepted]}
            viewerRole="mentor"
            className={sectionCardClass(
              planSectionKeys.accepted,
              "space-y-3 rounded-[28px] bg-white/95 p-5 shadow-sm",
            )}
          >
            {registrySummary.accepted.length ? (
              <div className="space-y-3 text-sm text-[#3E2F35]/80">
                {registrySummary.accepted.map((item) => (
                  <div key={item.id} className="rounded-2xl bg-[#FFF9F5] p-4">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <p className="text-base font-semibold text-[#3E2F35]">
                        {item.title ?? item.product?.name ?? "Registry item"}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {item.addedByMentor ? <span className={chipClasses}>Shared by you</span> : null}
                        <span className={chipClasses}>Aligned with member</span>
                      </div>
                    </div>
                    <p className="mt-2 text-xs text-[#3E2F35]/60">{statusLabelForItem(item)}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-[#3E2F35]/70">Nothing set yet - and that's completely normal.</p>
            )}
          </PlanSectionShell>

          <PlanSectionShell
            sectionKey={planSectionKeys.externalRegistries}
            decisionState={normalizeDecisionState(
              planSectionLookup[planSectionKeys.externalRegistries]?.decisionState ?? null,
            )}
            onDecisionChange={(value) => handleDecisionStateChange(planSectionKeys.externalRegistries, value)}
            updatedByRole={planSectionLookup[planSectionKeys.externalRegistries]?.updatedByRole ?? null}
            updatedAt={planSectionLookup[planSectionKeys.externalRegistries]?.updatedAt ?? null}
            mentorNote={mentorNotes[planSectionKeys.externalRegistries] ?? ""}
            memberNote={planSectionLookup[planSectionKeys.externalRegistries]?.memberNote ?? null}
            mentorNoteStatus={mentorNoteStatusFor(planSectionKeys.externalRegistries)}
            memberNoteStatus={memberNoteStatusFor(planSectionKeys.externalRegistries)}
            memberAcknowledgement={
              planSectionLookup[planSectionKeys.externalRegistries]?.memberAcknowledgement ?? null
            }
            onMentorNoteChange={(value) => {
              setMentorNotes((current) => ({ ...current, [planSectionKeys.externalRegistries]: value }));
              setNoteDrafts((current) => ({ ...current, [planSectionKeys.externalRegistries]: true }));
            }}
            onMentorNoteSave={() => handleMentorNoteSave(planSectionKeys.externalRegistries)}
            syncStatus={planSyncStatus[planSectionKeys.externalRegistries]}
            viewerRole="mentor"
            className={sectionCardClass(
              planSectionKeys.externalRegistries,
              "space-y-3 rounded-[28px] bg-white/95 p-5 shadow-sm",
            )}
          >
            {externalRegistries.length ? (
              <div className="space-y-4">
                {externalRegistries.map((registry) => (
                  <div key={registry.id} className="rounded-2xl bg-[#FFF9F5] p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <p className="text-xs uppercase tracking-[0.35em] text-[#C8A1B4]">
                          {registry.provider}
                        </p>
                        <p className="mt-2 text-base font-semibold text-[#3E2F35]">
                          {registry.title || "External registry"}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <span className={chipClasses}>From existing registry</span>
                        <span className={chipClasses}>Reference only</span>
                      </div>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-3 text-xs text-[#A4556A]">
                      {registry.url ? (
                        <a href={registry.url} target="_blank" rel="noreferrer" className="hover:text-[#7C3B53]">
                          Open registry
                        </a>
                      ) : null}
                      {registry.documentUrl ? (
                        <a
                          href={registry.documentUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="hover:text-[#7C3B53]"
                        >
                          {registry.documentLabel || "Open upload"}
                        </a>
                      ) : null}
                    </div>
                    <div className="mt-4 space-y-2 text-sm text-[#3E2F35]/70">
                      {registry.notes.length ? (
                        registry.notes.map((note) => (
                          <div key={note.id} className="rounded-xl bg-white/80 p-3">
                            <p>{note.note}</p>
                            <p className="mt-1 text-xs text-[#3E2F35]/60">
                              {note.authorName || note.authorRole.toLowerCase()} · Shared with member ·{" "}
                              {new Date(note.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        ))
                      ) : (
                        <p>No mentor perspective yet.</p>
                      )}
                    </div>
                    <div className="mt-3 space-y-2">
                      <textarea
                        value={externalNotes[registry.id] ?? ""}
                        onChange={(event) =>
                          setExternalNotes((prev) => ({ ...prev, [registry.id]: event.target.value }))
                        }
                        rows={3}
                        placeholder="Add planning context for this registry..."
                        className="w-full rounded-2xl border border-[#E3C6D4] bg-white/90 p-3 text-sm text-[#3E2F35]"
                      />
                      <button
                        type="button"
                        onClick={() => handleExternalNote(registry.id)}
                        className="rounded-full border border-[#C8A1B4] px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-[#A4556A]"
                      >
                        Save note
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-[#3E2F35]/70">Optional. Add outside references only if they're useful.</p>
            )}
          </PlanSectionShell>

        </>
      ) : null}
    </main>
  );
}
