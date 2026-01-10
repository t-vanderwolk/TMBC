"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function InviteSection() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [inviteCode, setInviteCode] = useState("");
  const [inviteError, setInviteError] = useState("");
  const [inviteSubmitting, setInviteSubmitting] = useState(false);

  useEffect(() => {
    const code = searchParams.get("invite");
    if (code) {
      setInviteCode(code.trim().toUpperCase());
    }
    if (searchParams.get("invite_error")) {
      setInviteError("That code did not match—double-check the invite we sent.");
    }
  }, [searchParams]);

  const handleInviteSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalized = inviteCode.trim().toUpperCase();
    if (!normalized) {
      setInviteError("Please enter your invite code before we can check it.");
      return;
    }

    setInviteSubmitting(true);
    setInviteError("");

    try {
      const response = await fetch("/api/invite/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: normalized }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        setInviteError(payload?.error || "That code isn't valid or it already had a dance with us.");
        return;
      }

      router.push("/onboarding/start");
    } catch {
      setInviteError("Something went sideways validating that code—try again in a moment.");
    } finally {
      setInviteSubmitting(false);
    }
  };

  return (
    <section className="marketing-section marketing-card bg-white/80 px-8 pt-20 pb-16 text-[var(--tmbc-charcoal)] md:pt-24 md:pb-18 motion-hidden">
      <div className="space-y-4 text-center">
        <p className="text-xs uppercase tracking-[0.4em] text-[var(--tmbc-charcoal)] text-opacity-60">
          Returning with an invite?
        </p>
        <h2 className="font-serif text-2xl sm:text-3xl">
          Drop the code we sent and we'll keep the door open while you hold the baby.
        </h2>
      </div>
      <form
        className="mt-8 flex flex-col gap-4 md:flex-row md:items-end"
        onSubmit={handleInviteSubmit}
      >
        <input
          value={inviteCode}
          onChange={(event) => {
            setInviteCode(event.target.value);
            if (inviteError) setInviteError("");
          }}
          placeholder="YOUR CODE"
          className="marketing-input w-full"
        />
        <button
          type="submit"
          className="marketing-btn marketing-btn-secondary uppercase tracking-[0.35em] w-full md:w-auto"
          disabled={inviteSubmitting}
        >
          {inviteSubmitting ? "Checking..." : "Submit code"}
        </button>
      </form>
      {inviteError && <p className="mt-2 text-xs text-red-600">{inviteError}</p>}
    </section>
  );
}
