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

  const registrySummary = useMemo(() => {
    const suggested = registryItems.filter(
      (item) => item.addedByMentor && item.decisionStatus !== "ACCEPTED" && item.status !== "REMOVED",
    );
    const accepted = registryItems.filter(
      (item) => item.decisionStatus === "ACCEPTED" || (!item.addedByMentor && item.status !== "REMOVED"),
    );
    const deferred = registryItems.filter((item) => item.status === "REMOVED");
    return { suggested, accepted, deferred };
  }, [registryItems]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setFormError("");
    if (!title.trim() || !category.trim() || !mentorNote.trim()) {
      setFormError("Add a product, category, and mentor rationale before sending.");
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
        throw new Error(data?.error || "Unable to send suggestion.");
      }
      setTitle("");
      setBrand("");
      setCategory("");
      setMentorNote("");
      setProductId("");
      await loadPlan();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Unable to send suggestion.");
    } finally {
      setSaving(false);
    }
  };

  const onboardingAnswers = payload?.onboarding?.answers ?? {};
  const answerEntries = Object.entries(onboardingAnswers).slice(0, 6);

  return (
    <main className="space-y-6 px-4 pb-20 pt-6 text-[#3E2F35] sm:px-6">
      <header className="space-y-2 rounded-[28px] bg-[#FFF9F5] p-5 shadow-sm">
        <p className="text-xs uppercase tracking-[0.4em] text-[#C8A1B4]">Mentor plan</p>
        <h1 className="font-serif text-3xl text-[#3E2F35]">
          {payload?.member?.name ? `Plan for ${payload.member.name}` : "Plan overview"}
        </h1>
        <p className="text-sm text-[#3E2F35]/70">
          Context is read-only. Suggestions are manual, intentional, and mentor-led.
        </p>
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

          <section className="space-y-3 rounded-[28px] bg-white/95 p-5 shadow-sm">
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
                Registry overview
              </h2>
              <p className="text-sm text-[#3E2F35]/70">Mentor suggestions and member decisions.</p>
            </div>
            <div className="grid gap-3 text-sm text-[#3E2F35]/70 sm:grid-cols-3">
              <div className="rounded-2xl bg-[#FFF9F5] p-4">
                <p className="text-xs uppercase tracking-[0.35em] text-[#C8A1B4]">Suggested</p>
                <p className="mt-2 text-2xl font-semibold text-[#3E2F35]">
                  {registrySummary.suggested.length}
                </p>
              </div>
              <div className="rounded-2xl bg-[#FFF9F5] p-4">
                <p className="text-xs uppercase tracking-[0.35em] text-[#C8A1B4]">Accepted</p>
                <p className="mt-2 text-2xl font-semibold text-[#3E2F35]">
                  {registrySummary.accepted.length}
                </p>
              </div>
              <div className="rounded-2xl bg-[#FFF9F5] p-4">
                <p className="text-xs uppercase tracking-[0.35em] text-[#C8A1B4]">Deferred</p>
                <p className="mt-2 text-2xl font-semibold text-[#3E2F35]">
                  {registrySummary.deferred.length}
                </p>
              </div>
            </div>
            {registryItems.length ? (
              <div className="space-y-2">
                {registryItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between text-xs text-[#3E2F35]/70">
                    <span>{item.title ?? item.product?.name}</span>
                    <span className="uppercase tracking-[0.3em] text-[#A4556A]">
                      {item.status.toLowerCase()}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-[#3E2F35]/70">No registry items yet.</p>
            )}
          </section>

          <section className="space-y-4 rounded-[28px] bg-[#FFF9F5] p-5 shadow-sm">
            <div className="space-y-1">
              <h2 className="text-xs font-semibold uppercase tracking-[0.35em] text-[#A4556A]">
                Send a suggestion
              </h2>
              <p className="text-sm text-[#3E2F35]/70">
                Mentor proposals are intentional drafts. Members decide what to accept.
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
                <label className="text-xs uppercase tracking-[0.35em] text-[#A4556A]">Product reference</label>
                <input
                  type="text"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="Manual product name"
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
                {saving ? "Sending..." : "Send suggestion"}
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
