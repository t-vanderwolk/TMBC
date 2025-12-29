"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useParams } from "next/navigation";

import { useRequireRole } from "@/lib/auth/useRequireRole";
import type { RegistryItemResponse } from "@/lib/services/server/registry.service";

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
};

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
  if (item.decisionStatus === "ACCEPTED") return "Confirmed";
  if (item.status === "REMOVED") return "Not moving forward";
  if (item.status === "CONSIDERING") return "Awaiting member";
  if (item.status === "ADDED" || item.status === "PURCHASED") return "Confirmed";
  return "Needs discussion";
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

export default function MentorPlanPage() {
  useRequireRole(["MENTOR", "ADMIN"]);
  const params = useParams<{ memberId: string }>();
  const memberId = params?.memberId ?? "";

  const [payload, setPayload] = useState<MentorPlanPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

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

  const registryItems = (payload?.registryItems ?? []) as RegistryItemResponse[];
  const mentorSuggestions = payload?.mentorSuggestions ?? [];
  const pendingSuggestions = mentorSuggestions.filter((suggestion) => !suggestion.acceptedAt);
  const externalRegistries = payload?.externalRegistries ?? [];
  const [externalNotes, setExternalNotes] = useState<Record<string, string>>({});

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

  const onboardingAnswers = payload?.onboarding?.answers ?? {};
  const onboardingTags = payload?.onboarding?.tags ?? [];
  const answerEntries = Object.entries(onboardingAnswers).slice(0, 6);
  const dueDateEntry = Object.entries(onboardingAnswers).find(([key]) =>
    key.toLowerCase().includes("due"),
  );
  const dueDate = dueDateEntry ? formatDateValue(dueDateEntry[1]) : "";
  const memberName = payload?.member?.name || payload?.member?.email || "this member";

  return (
    <main className="space-y-6 px-4 pb-20 pt-6 text-[#3E2F35] sm:px-6">
      <header className="space-y-4 rounded-[28px] bg-[#FFF9F5] p-5 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.4em] text-[#C8A1B4]">Mentor plan</p>
            <h1 className="font-serif text-3xl text-[#3E2F35]">
              {payload?.member?.name ? `Plan for ${payload.member.name}` : `Plan for ${memberName}`}
            </h1>
            <p className="text-sm text-[#3E2F35]/70">
              One shared plan, shaped by mentor guidance and member confirmation.
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
          <p className="text-sm text-[#3E2F35]/70">Loading mentor context...</p>
        </section>
      ) : null}

      {!loading && payload ? (
        <>
          <section className="space-y-3 rounded-[28px] bg-white/95 p-5 shadow-sm">
            {/* TMBC Canon:
                Onboarding is mentor context only.
                Mentors decide what to suggest. */}
            <div className="space-y-1">
              <h2 className="text-xs font-semibold uppercase tracking-[0.35em] text-[#A4556A]">
                Onboarding context
              </h2>
              <p className="text-sm text-[#3E2F35]/70">
                Read-only context to support mentor judgment.
              </p>
            </div>
            {payload.onboarding ? (
              <div className="space-y-3 text-sm text-[#3E2F35]/80">
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
              </div>
            ) : (
              <p className="text-sm text-[#3E2F35]/70">Onboarding responses not found.</p>
            )}
          </section>

          <section id="workbook" className="space-y-3 rounded-[28px] bg-white/95 p-5 shadow-sm">
            <div className="space-y-1">
              <h2 className="text-xs font-semibold uppercase tracking-[0.35em] text-[#A4556A]">
                Workbook highlights
              </h2>
              <p className="text-sm text-[#3E2F35]/70">
                Notes shared with mentors. Use them as planning context.
              </p>
            </div>
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
          </section>

          <section className="space-y-3 rounded-[28px] bg-white/95 p-5 shadow-sm">
            <div className="space-y-1">
              <h2 className="text-xs font-semibold uppercase tracking-[0.35em] text-[#A4556A]">
                Planning In Progress
              </h2>
              <p className="text-sm text-[#3E2F35]/70">
                Suggestions in flight while members decide what to confirm.
              </p>
            </div>
            <div className="grid gap-3 text-sm text-[#3E2F35]/70 sm:grid-cols-3">
              <div className="rounded-2xl bg-[#FFF9F5] p-4">
                <p className="text-xs uppercase tracking-[0.35em] text-[#C8A1B4]">Awaiting member</p>
                <p className="mt-2 text-2xl font-semibold text-[#3E2F35]">
                  {registrySummary.suggested.length}
                </p>
              </div>
              <div className="rounded-2xl bg-[#FFF9F5] p-4">
                <p className="text-xs uppercase tracking-[0.35em] text-[#C8A1B4]">Confirmed</p>
                <p className="mt-2 text-2xl font-semibold text-[#3E2F35]">
                  {registrySummary.accepted.length}
                </p>
              </div>
              <div className="rounded-2xl bg-[#FFF9F5] p-4">
                <p className="text-xs uppercase tracking-[0.35em] text-[#C8A1B4]">Not moving forward</p>
                <p className="mt-2 text-2xl font-semibold text-[#3E2F35]">
                  {registrySummary.deferred.length}
                </p>
              </div>
            </div>
            {pendingSuggestions.length ? (
              <div className="space-y-3 text-sm text-[#3E2F35]/80">
                {pendingSuggestions.map((suggestion) => (
                  <div key={suggestion.id} className="rounded-2xl bg-[#FFF9F5] p-4">
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
                        <span className={chipClasses}>Suggested by you</span>
                        <span className={chipClasses}>Awaiting member</span>
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-[#3E2F35]/70">
                      Mentor context: {suggestion.note ?? "Context coming soon."}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-sm text-[#3E2F35]/70">
                Use this space to guide the family based on their onboarding answers and workbook notes. Nothing
                appears in their plan until they confirm.
              </p>
            )}
          </section>

          <section className="space-y-3 rounded-[28px] bg-white/95 p-5 shadow-sm">
            <div className="space-y-1">
              <h2 className="text-xs font-semibold uppercase tracking-[0.35em] text-[#A4556A]">
                Confirmed Plan
              </h2>
              <p className="text-sm text-[#3E2F35]/70">Items the member has confirmed for their plan.</p>
            </div>
            {registrySummary.accepted.length ? (
              <div className="space-y-3 text-sm text-[#3E2F35]/80">
                {registrySummary.accepted.map((item) => (
                  <div key={item.id} className="rounded-2xl bg-[#FFF9F5] p-4">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <p className="text-base font-semibold text-[#3E2F35]">
                        {item.title ?? item.product?.name ?? "Registry item"}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {item.addedByMentor ? <span className={chipClasses}>Suggested by you</span> : null}
                        <span className={chipClasses}>Confirmed by member</span>
                      </div>
                    </div>
                    <p className="mt-2 text-xs text-[#3E2F35]/60">{statusLabelForItem(item)}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-[#3E2F35]/70">No confirmed plan items yet.</p>
            )}
          </section>

          <section className="space-y-3 rounded-[28px] bg-white/95 p-5 shadow-sm">
            <div className="space-y-1">
              <h2 className="text-xs font-semibold uppercase tracking-[0.35em] text-[#A4556A]">
                Existing Registry (Reference Only)
              </h2>
              <p className="text-sm text-[#3E2F35]/70">
                Members can share external registries for context. TMBC never imports or edits them.
              </p>
            </div>
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
                        <p>No mentor notes yet.</p>
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
              <p className="text-sm text-[#3E2F35]/70">No external registries shared yet.</p>
            )}
          </section>

          <section className="space-y-4 rounded-[28px] bg-[#FFF9F5] p-5 shadow-sm">
            <div className="space-y-1">
              <h2 className="text-xs font-semibold uppercase tracking-[0.35em] text-[#A4556A]">
                Propose for plan
              </h2>
              <p className="text-sm text-[#3E2F35]/70">
                Proposals are intentional drafts. Members decide what to confirm.
              </p>
            </div>
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
                <label className="text-xs uppercase tracking-[0.35em] text-[#A4556A]">Mentor rationale</label>
                <textarea
                  value={mentorNote}
                  onChange={(event) => setMentorNote(event.target.value)}
                  placeholder="Why this fits their life and space"
                  className="min-h-[6rem] w-full rounded-2xl border border-[#E3C6D4] bg-white/90 p-3 text-sm text-[#3E2F35]"
                />
              </div>
              {formError ? <p className="text-xs text-[#8B4A61]">{formError}</p> : null}
              <button
                type="submit"
                disabled={saving}
                className="w-full rounded-full bg-[#C8A1B4] px-5 py-3 text-xs font-semibold uppercase tracking-[0.4em] text-white disabled:opacity-60"
              >
                {saving ? "Sending..." : "Propose for plan"}
              </button>
            </form>
            <Link href="/dashboard/mentor/messages" className="text-xs text-[#A4556A] hover:text-[#7C3B53]">
              Message this member
            </Link>
          </section>
        </>
      ) : null}
    </main>
  );
}
