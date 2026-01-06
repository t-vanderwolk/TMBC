"use client";

import type { ReactNode } from "react";

import PlanDecisionChip from "@/components/plan/PlanDecisionChip";
import { planSectionMap, type PlanSectionKey } from "@/lib/plan/planSectionMap";
import type { PlanDecisionState } from "@/lib/services/server/planSections.service";

type PlanSectionShellProps = {
  sectionKey: PlanSectionKey;
  decisionState?: PlanDecisionState | null;
  onDecisionChange?: (value: PlanDecisionState) => void;
  updatedByRole?: string | null;
  updatedAt?: string | null;
  mentorNote?: string | null;
  memberNote?: string | null;
  mentorNoteStatus?: string;
  memberNoteStatus?: string;
  syncStatus?: string;
  memberAcknowledgement?: string | null;
  onMentorNoteChange?: (value: string) => void;
  onMentorNoteSave?: () => void;
  onMemberNoteChange?: (value: string) => void;
  onMemberNoteSave?: () => void;
  onMemberAcknowledge?: (value: "got_it" | "lets_discuss") => void;
  viewerRole: "member" | "mentor";
  className?: string;
  helperText?: string;
  children?: ReactNode;
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

const updatedByLabel = (updatedByRole: string | null | undefined, viewerRole: "member" | "mentor") => {
  if (updatedByRole === "MENTOR") return viewerRole === "mentor" ? "you" : "your mentor";
  if (updatedByRole === "MEMBER") return viewerRole === "mentor" ? "member" : "you";
  return viewerRole === "mentor" ? "member" : "your mentor";
};

export default function PlanSectionShell({
  sectionKey,
  decisionState,
  onDecisionChange,
  updatedByRole,
  updatedAt,
  mentorNote,
  memberNote,
  mentorNoteStatus,
  memberNoteStatus,
  syncStatus,
  memberAcknowledgement,
  onMentorNoteChange,
  onMentorNoteSave,
  onMemberNoteChange,
  onMemberNoteSave,
  onMemberAcknowledge,
  viewerRole,
  className,
  helperText,
  children,
}: PlanSectionShellProps) {
  const section = planSectionMap[sectionKey];
  const relativeTime = formatRelativeTime(updatedAt);
  const updatedLabel = updatedByLabel(updatedByRole ?? null, viewerRole);
  const metaLine = updatedAt
    ? `Last reviewed by ${updatedLabel}${relativeTime ? ` · ${relativeTime}` : ""} · visible to both of you`
    : `Last reviewed by ${updatedLabel} · not yet · visible to both of you`;

  return (
    <section className={className}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-sm font-semibold uppercase tracking-[0.35em] text-[#A4556A]">{section.title}</h2>
          <p className="text-sm text-[#3E2F35]/70">{helperText ?? section.helper}</p>
        </div>
        <div className="flex flex-col items-end gap-2 text-xs text-[#A4556A]">
          <PlanDecisionChip
            value={(decisionState ?? "considering") as PlanDecisionState}
            onChange={onDecisionChange}
          />
          {syncStatus ? (
            <p className="text-[0.65rem] uppercase tracking-[0.35em] text-[#C8A1B4]">{syncStatus}</p>
          ) : null}
        </div>
      </div>
      <p className="mt-2 text-xs text-[#A4556A]/70">{metaLine}</p>

      <div className="mt-4 space-y-3 border-t border-[#F1DDE6] pt-4">
        <div className="rounded-2xl border border-[#EFD3DF] bg-[#FFF4FA] p-4">
          <div className="flex items-center justify-between text-[0.65rem] uppercase tracking-[0.35em] text-[#B5758C]">
            <span>Mentor perspective</span>
            {mentorNoteStatus ? <span className="tracking-[0.25em] text-[#C8A1B4]">{mentorNoteStatus}</span> : null}
          </div>
          {onMentorNoteChange ? (
            <>
              <textarea
                value={mentorNote ?? ""}
                onChange={(event) => onMentorNoteChange(event.target.value)}
                rows={3}
                placeholder="Share guidance, reasoning, or things to consider."
                className="mt-3 w-full rounded-2xl border border-[#E3C6D4] bg-white/90 p-3 text-sm text-[#3E2F35]"
              />
              <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-xs text-[#A4556A]">
                <button
                  type="button"
                  onClick={onMentorNoteSave}
                  className="rounded-full border border-[#C8A1B4] px-4 py-2 text-[0.6rem] font-semibold uppercase tracking-[0.35em] text-[#A4556A]"
                >
                  Save note
                </button>
              </div>
            </>
          ) : (
            <p className="mt-3 text-sm text-[#3E2F35]/80">{mentorNote || "No mentor note yet."}</p>
          )}
          {onMemberAcknowledge ? (
            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              <button
                type="button"
                onClick={() => onMemberAcknowledge("got_it")}
                className="rounded-full border border-[#E3C6D4] bg-white/80 px-3 py-1 text-[#A4556A]"
              >
                Got it
              </button>
              <button
                type="button"
                onClick={() => onMemberAcknowledge("lets_discuss")}
                className="rounded-full border border-[#E3C6D4] bg-white/80 px-3 py-1 text-[#A4556A]"
              >
                Let's discuss
              </button>
              {memberAcknowledgement ? (
                <span className="ml-auto text-[#A4556A]/70">
                  Acknowledged: {memberAcknowledgement === "got_it" ? "Got it" : "Let's discuss"}
                </span>
              ) : null}
            </div>
          ) : null}
        </div>

        <div className="rounded-2xl border border-[#E3C6D4] bg-white/90 p-4">
          <div className="flex items-center justify-between text-[0.65rem] uppercase tracking-[0.35em] text-[#A4556A]">
            <span>Your perspective</span>
            {memberNoteStatus ? <span className="tracking-[0.25em] text-[#C8A1B4]">{memberNoteStatus}</span> : null}
          </div>
          {onMemberNoteChange ? (
            <>
              <textarea
                value={memberNote ?? ""}
                onChange={(event) => onMemberNoteChange(event.target.value)}
                rows={3}
                placeholder="Questions, concerns, or what you're feeling unsure about."
                className="mt-3 w-full rounded-2xl border border-[#E3C6D4] bg-white/90 p-3 text-sm text-[#3E2F35]"
              />
              <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-xs text-[#A4556A]">
                <button
                  type="button"
                  onClick={onMemberNoteSave}
                  className="rounded-full border border-[#C8A1B4] px-4 py-2 text-[0.6rem] font-semibold uppercase tracking-[0.35em] text-[#A4556A]"
                >
                  Save note
                </button>
              </div>
            </>
          ) : (
            <p className="mt-3 text-sm text-[#3E2F35]/80">{memberNote || "No member note yet."}</p>
          )}
          {!onMemberAcknowledge && memberAcknowledgement ? (
            <p className="mt-3 text-xs text-[#A4556A]/70">
              Acknowledged: {memberAcknowledgement === "got_it" ? "Got it" : "Let's discuss"}
            </p>
          ) : null}
        </div>
      </div>

      <div className="mt-4">{children}</div>
    </section>
  );
}
