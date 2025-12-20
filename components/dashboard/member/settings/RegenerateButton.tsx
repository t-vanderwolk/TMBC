"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { regenerateRecommendations } from "@/app/dashboard/settings/actions";

type RegenerateButtonProps = {
  lastUpdated?: string | null;
};

export default function RegenerateButton({ lastUpdated }: RegenerateButtonProps) {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleRefresh = () => {
    startTransition(async () => {
      const result = await regenerateRecommendations();
      setMessage(result?.message ?? "Recommendations refreshed.");
      router.refresh();
    });
  };

  return (
    <div className="rounded-3xl border border-[#E3D0D7] bg-white/90 p-6 shadow-[0_30px_90px_rgba(189,147,189,0.25)]">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[0.65rem] uppercase tracking-[0.4em] text-[#C8A1B4]">Registry suggestions</p>
          <h3 className="text-xl font-medium text-[#3E2F35]">Refresh recommendations</h3>
          <p className="text-xs text-[#3E2F35]/70">
            This regenerates suggestions only. Your existing registry items remain untouched, but mentors may see the update.
          </p>
        </div>
        <button
          type="button"
          onClick={handleRefresh}
          disabled={isPending}
          className="rounded-full border border-[#C29EB3] px-5 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-[#C29EB3] disabled:opacity-60"
        >
          {isPending ? "Refreshing…" : "Refresh suggestions"}
        </button>
      </div>

      <div className="mt-3 text-xs uppercase tracking-[0.4em] text-[#C8A1B4]">
        Last refreshed: {lastUpdated ? new Date(lastUpdated).toLocaleString("en-US", { month: "short", day: "numeric" }) : "Not yet"}
      </div>
      {message && (
        <p className="mt-2 text-xs text-emerald-600">{message}</p>
      )}
    </div>
  );
}
