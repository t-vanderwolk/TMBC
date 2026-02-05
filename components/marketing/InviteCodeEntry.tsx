"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type InviteCodeEntryProps = {
  className?: string;
  rowClassName?: string;
};

export default function InviteCodeEntry({ className = "", rowClassName = "" }: InviteCodeEntryProps) {
  const router = useRouter();
  const [inviteCode, setInviteCode] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalized = inviteCode.trim().toUpperCase();

    if (!normalized) {
      setError("Please enter your invite code to continue.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/invite/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: normalized }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        setError(payload?.error || "That code isn't matching the door—we'll keep checking.");
        return;
      }

      router.push("/onboarding/start");
    } catch {
      setError("Something felt off validating that code—try again in a moment.");
    } finally {
      setSubmitting(false);
    }
  };

  const defaultRowClasses = "mt-4 flex flex-col gap-3 sm:flex-row sm:items-center";
  const rowClasses = `${defaultRowClasses} ${rowClassName}`.trim();

  return (
    <form
      onSubmit={handleSubmit}
      className={`flex w-full flex-col gap-3 text-[var(--tmbc-charcoal)] text-opacity-70 ${className}`.trim()}
    >
      <label
        htmlFor="invite-code"
        className="text-[11px] tracking-[0.34em] uppercase text-neutral-500"
      >
        Have an invite code?
      </label>
      <div className={rowClasses}>
        <input
          id="invite-code"
          value={inviteCode}
          onChange={(event) => {
            setInviteCode(event.target.value);
            if (error) setError("");
          }}
          placeholder="Enter invite code"
          className="h-12 w-full rounded-full border border-neutral-200 bg-white/80 px-5 text-sm outline-none focus:ring-2 focus:ring-black/10 sm:max-w-sm"
        />
        <button
          type="submit"
          className="min-h-[48px] h-12 rounded-full px-6 text-sm font-semibold border border-neutral-300 bg-white/60 hover:bg-white/80 transition"
          disabled={submitting}
        >
          {submitting ? "Checking..." : "Unlock"}
        </button>
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </form>
  );
}
