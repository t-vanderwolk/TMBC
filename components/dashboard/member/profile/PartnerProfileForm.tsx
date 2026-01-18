"use client";

import { FormEvent, useState } from "react";

const ROLE_OPTIONS = [
  { label: "Partner", value: "PARTNER" },
  { label: "Spouse", value: "SPOUSE" },
  { label: "Co-parent", value: "COPARENT" },
] as const;

type PartnerProfileFormProps = {
  initial: {
    name?: string | null;
    roleLabel?: string | null;
    notes?: string | null;
  };
};

export default function PartnerProfileForm({ initial }: PartnerProfileFormProps) {
  const [name, setName] = useState(initial.name ?? "");
  const [roleLabel, setRoleLabel] = useState(initial.roleLabel ?? "");
  const [notes, setNotes] = useState(initial.notes ?? "");
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const fieldClass =
    "mt-1 w-full rounded-2xl border border-member-border-soft bg-member-background-card px-3 py-2 text-sm text-member-text-primary placeholder:text-member-text-secondary focus:border-member-accent-primary focus:outline-none focus:ring-2 focus:ring-member-state-focus/40";

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);
    setStatusMessage("");
    setErrorMessage("");
    try {
      const response = await fetch("/api/member/settings/partner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim() || undefined,
          roleLabel: roleLabel || undefined,
          notes: notes.trim() || undefined,
        }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(payload?.error || "Unable to save partner info.");
      }

      setStatusMessage("Partner context updated quietly.");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to save partner info.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1 text-[0.65rem] uppercase tracking-[0.4em] text-member-accent-secondary">
        <p>Partner / spouse (optional)</p>
        <p className="text-[0.75rem] text-member-text-secondary">
          Share a name and role so your mentor sees the shared decision-making context.
        </p>
      </div>
      <div className="space-y-2">
        <label className="text-[0.6rem] uppercase tracking-[0.35em] text-member-text-secondary">
          Name
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Partner or spouse name"
            className={fieldClass}
          />
        </label>
        <label className="text-[0.6rem] uppercase tracking-[0.35em] text-member-text-secondary">
          Relationship label
          <select
            value={roleLabel}
            onChange={(event) => setRoleLabel(event.target.value)}
            className={fieldClass}
          >
            <option value="">Select a label</option>
            {ROLE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>
      <label className="space-y-1 text-[0.6rem] uppercase tracking-[0.35em] text-member-text-secondary">
        Notes & preferences
        <textarea
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          rows={3}
          placeholder="Share a gentle note about shared decision-making or different preferences."
          className={fieldClass}
        />
      </label>
      <p className="text-[0.65rem] text-member-text-secondary">
        This is context only — no invites, no auth, just shared notes for your mentor.
      </p>
      <div className="flex items-center justify-between gap-3 border-t border-member-border-soft pt-3">
        <button
          type="submit"
          disabled={isSaving}
          className="rounded-full bg-member-accent-primary px-5 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-member-text-inverse transition hover:-translate-y-[1px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-member-state-focus/40 disabled:opacity-60"
        >
          {isSaving ? "Saving…" : "Save partner context"}
        </button>
        <div className="text-xs text-member-text-secondary" aria-live="polite">
          {errorMessage || statusMessage || "No partner info required — leave this blank."}
        </div>
      </div>
    </form>
  );
}
