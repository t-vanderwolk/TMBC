"use client";

import { useState } from "react";
import StatusBadge from "./StatusBadge";
import { usePlanContext } from "../PlanContext";

const CONTEXT_LABELS: Record<string, string> = {
  "registry-item": "Registry",
  budget: "Budget",
  module: "Module",
};

export default function MentorChatPanel() {
  const { mentorNotes, meta } = usePlanContext();
  const [noteDraft, setNoteDraft] = useState("");
  const canWrite = meta.canMentor;
  const headerTitle = canWrite ? "Coaching cockpit" : "Mentor support";

  return (
    <div className="space-y-4">
      <header>
        <p className="text-[0.65rem] uppercase tracking-[0.4em] text-[#A4556A]">Mentor chat</p>
        <h3 className="text-lg font-semibold text-[#3E2F35]">{headerTitle}</h3>
        <p className="text-xs text-[#3E2F35]/70">Notes stay calm, curated, and searchable.</p>
      </header>
      <div className="space-y-3 rounded-[24px] border border-[#E4D5D9] bg-[#FCF9F7] p-4">
        {mentorNotes.length ? (
          mentorNotes.slice(0, 3).map((note) => (
            <div key={note.id} className="space-y-1">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-[#3E2F35]">
                  {note.content ? note.content.slice(0, 60) : "Quiet note"}
                </p>
                <StatusBadge label={CONTEXT_LABELS[note.contextType] ?? "Mentor"} variant="default" />
              </div>
              <p className="text-xs text-[#3E2F35]/60">{new Date(note.createdAt).toLocaleDateString()}</p>
            </div>
          ))
        ) : (
          <p className="text-sm text-[#3E2F35]/70">No mentor notes yet.</p>
        )}
      </div>
      {canWrite ? (
        <div className="space-y-2 rounded-[24px] border border-[#E4D5D9] bg-white/80 p-4">
          <p className="text-sm font-semibold text-[#3E2F35]">Mentor notes editor</p>
          <textarea
            className="h-24 w-full rounded-2xl border border-[#DDD2D4] bg-[#FCF9F7] p-3 text-sm text-[#3E2F35]"
            placeholder="Draft a calm, actionable note or suggestion."
            value={noteDraft}
            onChange={(event) => setNoteDraft(event.target.value)}
          />
          <button
            className="inline-flex items-center justify-center rounded-full bg-[#B47484] px-4 py-2 text-sm font-semibold text-white"
            type="button"
          >
            Save draft
          </button>
        </div>
      ) : null}
    </div>
  );
}
