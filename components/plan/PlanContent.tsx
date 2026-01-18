import Link from "next/link";
import type { PlanDecisionState } from "@/lib/services/server/planSections.service";

export type PlanContentSection = {
  sectionKey: string;
  title: string;
  summary: string;
  decisionState?: PlanDecisionState | null;
  updatedAt?: string | null;
};

type PlanContentProps = {
  sections: PlanContentSection[];
  expandedKey: string | null;
  onToggle: (key: string) => void;
  status: "idle" | "loading" | "success" | "error";
  errorMessage?: string;
};

const formatDecisionState = (value?: string | null) => {
  if (!value) return "Not reviewed";
  return value
    .split(/[_-]/)
    .map((fragment) => fragment.charAt(0).toUpperCase() + fragment.slice(1).toLowerCase())
    .join(" ");
};

const formatUpdatedAt = (value?: string | null) => {
  if (!value) return "";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.valueOf())) return "";
  return parsed.toLocaleDateString(undefined, { month: "short", day: "numeric" });
};

const SectionActions = () => (
  <div className="flex flex-wrap items-center gap-3">
    <button
      type="button"
      disabled
      title="Save is disabled until the workspace syncs with your mentor notes."
      className="rounded-full border border-[#E3C6D4] bg-white/90 px-4 py-2 text-[0.6rem] font-semibold uppercase tracking-[0.35em] text-[#A4556A] disabled:opacity-60"
    >
      Save
    </button>
    <button
      type="button"
      disabled
      title="Sharing plans is coming soon."
      className="rounded-full border border-[#E3C6D4] bg-white/90 px-4 py-2 text-[0.6rem] font-semibold uppercase tracking-[0.35em] text-[#A4556A] disabled:opacity-60"
    >
      Share (coming soon)
    </button>
    <Link
      href="/dashboard/support"
      className="rounded-full border border-[#C8A1B4] bg-transparent px-4 py-2 text-[0.6rem] font-semibold uppercase tracking-[0.35em] text-[#A4556A] transition hover:border-[#A4556A]"
    >
      Invite Concierge
    </Link>
  </div>
);

export default function PlanContent({
  sections,
  expandedKey,
  onToggle,
  status,
  errorMessage,
}: PlanContentProps) {
  if (status === "loading" || status === "idle") {
    return (
      <div className="space-y-4">
        <div className="h-[260px] animate-pulse rounded-[32px] border border-dashed border-[#E3C6D4] bg-[#FFF9F5]" />
        <div className="h-[180px] animate-pulse rounded-[32px] border border-dashed border-[#E3C6D4] bg-[#FFF9F5]" />
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="rounded-[32px] border border-[#F5A4B2] bg-[#FFF0F4] p-6 text-sm text-[#3E2F35] shadow-sm">
        <p className="font-semibold">Plan workspace unavailable</p>
        <p className="mt-2 text-[#A4556A]">{errorMessage ?? "Please try again in a moment."}</p>
      </div>
    );
  }

  if (sections.length === 0) {
    return (
      <div className="space-y-4 rounded-[32px] border border-[#EAE2E8] bg-white/90 p-8 text-sm text-[#3E2F35]/80 shadow-sm">
        <p className="text-[0.65rem] uppercase tracking-[0.4em] text-[#A4556A]">Plan workspace</p>
        <h2 className="text-2xl font-semibold text-[#3E2F35]">Your plan is waiting</h2>
        <p>Your plan workspace will grow as you move through the Academy.</p>
        <p className="text-[0.65rem] uppercase tracking-[0.35em] text-[#C8A1B4]">
          Complete Academy modules to unlock each section.
        </p>
        <SectionActions />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {sections.map((section) => {
        const isOpen = expandedKey === section.sectionKey;
        const updatedAtLabel = formatUpdatedAt(section.updatedAt);
        return (
          <article
            key={section.sectionKey}
            className="rounded-[32px] border border-[#E3C6D4] bg-white/90 shadow-sm"
          >
            <button
              type="button"
              onClick={() => onToggle(section.sectionKey)}
              className="w-full px-6 py-5 text-left"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-[#A4556A]">Section</p>
                  <h3 className="text-2xl font-serif text-[#3E2F35]">{section.title}</h3>
                </div>
                <div className="text-xs uppercase tracking-[0.35em] text-[#C8A1B4]">
                  {formatDecisionState(section.decisionState)}
                </div>
              </div>
              <p className="mt-2 text-sm text-[#3E2F35]/70">{section.summary}</p>
            </button>
            {isOpen && (
              <div className="space-y-4 px-6 pb-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-[0.65rem] uppercase tracking-[0.35em] text-[#A4556A]">Last updated</p>
                  {updatedAtLabel && (
                    <p className="text-[0.65rem] uppercase tracking-[0.35em] text-[#C8A1B4]">
                      {updatedAtLabel}
                    </p>
                  )}
                </div>
                <div className="space-y-2 rounded-[24px] border border-[#EAE2E8] bg-[#FFF9F5] p-4 text-sm text-[#3E2F35]/80">
                  <p className="text-[0.65rem] uppercase tracking-[0.35em] text-[#A4556A]">Notes</p>
                  <p>Notes will be saved automatically once this workspace is activated.</p>
                </div>
                <div className="space-y-2 rounded-[24px] border border-[#EAE2E8] bg-white/90 p-4 text-sm text-[#3E2F35]/80">
                  <p className="text-[0.65rem] uppercase tracking-[0.35em] text-[#A4556A]">Mentor notes</p>
                  <p>No mentor notes yet. Your mentor will add reflections when the section is ready.</p>
                </div>
                <div className="pt-3">
                  <SectionActions />
                </div>
              </div>
            )}
          </article>
        );
      })}
    </div>
  );
}
