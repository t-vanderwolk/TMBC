"use client";

import { FormEvent, useState } from "react";

type ProfileDetailsFormProps = {
  initial: {
    firstName?: string | null;
    lastName?: string | null;
    preferredName?: string | null;
    city?: string | null;
    state?: string | null;
    dueDate?: string | null;
    location?: string | null;
  };
};

export default function ProfileDetailsForm({ initial }: ProfileDetailsFormProps) {
  const [firstName, setFirstName] = useState(initial.firstName ?? "");
  const [lastName, setLastName] = useState(initial.lastName ?? "");
  const [preferredName, setPreferredName] = useState(initial.preferredName ?? "");
  const [city, setCity] = useState(initial.city ?? "");
  const [state, setState] = useState(initial.state ?? "");
  const [location, setLocation] = useState(initial.location ?? "");
  const [dueDate, setDueDate] = useState(initial.dueDate ?? "");
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const inputClass =
    "w-full rounded-2xl border border-member-border-soft bg-member-background-card px-3 py-2 text-sm text-member-text-primary placeholder:text-member-text-secondary focus:border-member-accent-primary focus:outline-none focus:ring-2 focus:ring-member-state-focus/40";

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);
    setStatusMessage("");
    setErrorMessage("");
    try {
      const response = await fetch("/api/member/settings/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: firstName.trim() || undefined,
          lastName: lastName.trim() || undefined,
          preferredName: preferredName.trim() || undefined,
          city: city.trim() || undefined,
          state: state.trim() || undefined,
          location: location.trim() || undefined,
          dueDate: dueDate || undefined,
        }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(payload?.error || "Unable to save changes.");
      }

      setStatusMessage("Changes saved — your mentor sees the updated info.");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to save changes.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <p className="text-[0.65rem] uppercase tracking-[0.4em] text-member-accent-secondary">About you</p>
        <p className="text-sm text-member-text-secondary">
          Life changes — this can too. Nothing here is permanent.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-1 text-[0.65rem] uppercase tracking-[0.4em] text-member-text-secondary">
          First name
          <input
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
            placeholder="First name"
            className={inputClass}
          />
        </label>
        <label className="space-y-1 text-[0.65rem] uppercase tracking-[0.4em] text-member-text-secondary">
          Last name
          <input
            value={lastName}
            onChange={(event) => setLastName(event.target.value)}
            placeholder="Last name (optional)"
            className={inputClass}
          />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-1 text-[0.65rem] uppercase tracking-[0.4em] text-member-text-secondary">
          Preferred name
          <input
            value={preferredName}
            onChange={(event) => setPreferredName(event.target.value)}
            placeholder="Preferred name (optional)"
            className={inputClass}
          />
        </label>
        <label className="space-y-1 text-[0.65rem] uppercase tracking-[0.4em] text-[#3E2F35]/70">
          Due date
          <input
            type="date"
            value={dueDate}
            onChange={(event) => setDueDate(event.target.value)}
          className={inputClass}
          />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-1 text-[0.65rem] uppercase tracking-[0.4em] text-member-text-secondary">
          City
          <input
            value={city}
            onChange={(event) => setCity(event.target.value)}
            placeholder="City"
            className={inputClass}
          />
        </label>
        <label className="space-y-1 text-[0.65rem] uppercase tracking-[0.4em] text-member-text-secondary">
          State / region
          <input
            value={state}
            onChange={(event) => setState(event.target.value)}
            placeholder="State or region"
            className={inputClass}
          />
        </label>
      </div>

      <div className="space-y-1 text-[0.65rem] uppercase tracking-[0.4em] text-member-text-secondary">
        <label className="space-y-1">
          Location description
          <input
            value={location}
            onChange={(event) => setLocation(event.target.value)}
            placeholder="City, metro, neighborhood..."
            className={inputClass}
          />
        </label>
        <p className="text-[0.6rem] text-member-text-secondary">
          You can update this anytime — nothing here locks you in.
        </p>
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-member-border-soft pt-4">
        <button
          type="submit"
          disabled={isSaving}
          className="rounded-full bg-member-accent-primary px-5 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-member-text-inverse transition hover:-translate-y-[1px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-member-state-focus/40 disabled:opacity-60"
        >
          {isSaving ? "Saving…" : "Save changes"}
        </button>
        <div className="text-sm text-member-text-secondary" aria-live="polite">
          {errorMessage ? errorMessage : statusMessage}
        </div>
      </div>
    </form>
  );
}
