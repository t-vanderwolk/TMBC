"use client";

import { usePlanContext } from "../PlanContext";
import StatusBadge from "./StatusBadge";

export default function CommunityInsightPanel() {
  const { communitySignals, meta } = usePlanContext();
  const headerTitle = meta.canMentor ? "Curated intelligence" : "Signals";
  const headerCopy = meta.canMentor
    ? "You decide what surfaces for members."
    : "Community signals arrive here as a gentle read-only pulse.";

  return (
    <div className="space-y-3">
      <header>
        <p className="text-[0.65rem] uppercase tracking-[0.4em] text-[#A4556A]">Community</p>
        <h3 className="text-lg font-semibold text-[#3E2F35]">{headerTitle}</h3>
        <p className="text-xs text-[#3E2F35]/70">{headerCopy}</p>
      </header>
      <div className="space-y-3 rounded-[24px] border border-[#E4D5D9] bg-[#FCF9F7] p-4">
        {communitySignals.length ? (
          communitySignals.slice(0, 4).map((signal) => (
            <div key={signal.id} className="space-y-1">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-[#3E2F35]">{signal.topic}</p>
                <StatusBadge label={`${signal.sourceCount} sources`} variant="default" />
              </div>
              <p className="text-xs text-[#3E2F35]/70">{signal.summary}</p>
            </div>
          ))
        ) : (
          <p className="text-sm text-[#3E2F35]/70">No insights to share yet.</p>
        )}
        {meta.canMentor ? (
          <button type="button" className="text-xs font-semibold text-[#A4556A] underline-offset-2 hover:underline">
            Curate this space
          </button>
        ) : null}
      </div>
    </div>
  );
}
