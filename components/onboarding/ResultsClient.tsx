"use client";

import CategoryTile from "@/components/tmbc/CategoryTile";
import SectionHeader from "@/components/tmbc/SectionHeader";
import StyledButton from "@/components/tmbc/StyledButton";
import type { CuratedRegistry } from "@/lib/registry/recommendations";
import { useState } from "react";

type ResultsClientProps = {
  initialRegistry: CuratedRegistry;
  defaultTags: string[];
  moodboardUploaded?: boolean;
};

export default function ResultsClient({
  initialRegistry,
  defaultTags,
  moodboardUploaded = true,
}: ResultsClientProps) {
  const [registry, setRegistry] = useState(initialRegistry);
  const [status, setStatus] = useState<"idle" | "loading">("idle");
  const [error, setError] = useState("");

  const handleRegenerate = async () => {
    setStatus("loading");
    setError("");

    try {
      const response = await fetch("/api/onboarding/results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tags: defaultTags }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data?.error ?? "Unable to refresh your registry.");
      }
      if (data?.registry) {
        setRegistry(data.registry);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to refresh your registry.");
    } finally {
      setStatus("idle");
    }
  };

  return (
    <div className="space-y-8">
      <SectionHeader
        title="Curated registry"
        subtitle="Everything is pulled from your responses and mentor attention."
        actions={<StyledButton variant="ghost">Share reasoning</StyledButton>}
      />

      {moodboardUploaded && (
        <div className="rounded-[2rem] border border-[#E3C6D4] bg-[#FFFAF8] px-6 py-4 text-sm text-[#3E2F35]">
          Your nursery is already cuter than my house.
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {registry.categories.map((category) => (
          <CategoryTile
            key={category.id}
            title={category.title}
            description={category.reason}
            href="/dashboard/plan"
            accent={<span>{category.priority ? "Priority" : "Explore"}</span>}
          />
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={handleRegenerate}
          disabled={status === "loading"}
          className="flex flex-1 min-w-[220px] rounded-full px-5 py-3 text-xs font-semibold uppercase tracking-[0.4em] transition bg-tmMauve text-white disabled:opacity-70"
        >
          {status === "loading" ? "Adding…" : "Add all"}
        </button>
        <StyledButton variant="secondary">Customize</StyledButton>
        <StyledButton variant="ghost">View reasoning</StyledButton>
      </div>

      {error && (
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[#D0465F]">
          {error}
        </p>
      )}
    </div>
  );
}
