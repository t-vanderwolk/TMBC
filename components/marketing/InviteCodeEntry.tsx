"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function InviteCodeEntry() {
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

  return (
    <div className="mx-auto mt-6 max-w-[360px] space-y-2 text-center text-[var(--tmbc-charcoal)] text-opacity-70">
      <p className="text-[0.65rem] uppercase tracking-[0.35em] text-[var(--tmbc-charcoal)] text-opacity-60">
        Have an invite code?
      </p>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          value={inviteCode}
          onChange={(event) => {
            setInviteCode(event.target.value);
            if (error) setError("");
          }}
          placeholder="Enter invite code"
          className="marketing-input w-full"
        />
        <button
          type="submit"
          className="marketing-btn marketing-btn-secondary uppercase tracking-[0.35em] w-full"
          disabled={submitting}
        >
          {submitting ? "Checking..." : "Enter"}
        </button>
      </form>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
