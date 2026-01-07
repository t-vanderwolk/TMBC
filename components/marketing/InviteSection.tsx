"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import PartnerLogoCarousel from "@/components/marketing/PartnerLogoCarousel";

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
      setInviteError("Invite code missing or invalid. Please enter the approved invite code.");
    }
  }, [searchParams]);

  const handleInviteSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalized = inviteCode.trim().toUpperCase();
    if (!normalized) {
      setInviteError("Please enter your invite code.");
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
        setInviteError(payload?.error || "Invalid or already used invite code.");
        return;
      }

      router.push("/onboarding/start");
    } catch {
      setInviteError("Unable to validate invite code.");
    } finally {
      setInviteSubmitting(false);
    }
  };

  return (
    <section className="marketing-section marketing-card bg-white/80 px-8 py-20 md:py-28 text-[var(--tmbc-charcoal)]">
      <div className="space-y-4 text-center">
        <p className="text-xs uppercase tracking-[0.4em] text-[var(--tmbc-charcoal)] text-opacity-60">
          Already have an invite?
        </p>
        <h2 className="font-serif text-2xl sm:text-3xl">Enter the code we sent you.</h2>
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
          placeholder="INVITE CODE"
          className="w-full rounded-full border border-[var(--tmbc-mauve)]/40 bg-white px-4 py-3 text-sm text-[var(--tmbc-charcoal)] shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--tmbc-mauve)]/40"
        />
        <button
          type="submit"
          className="marketing-btn marketing-btn-secondary uppercase tracking-[0.35em] w-full md:w-auto"
          disabled={inviteSubmitting}
        >
          {inviteSubmitting ? "Checking..." : "Continue"}
        </button>
      </form>
      {inviteError && <p className="mt-2 text-xs text-red-600">{inviteError}</p>}
      <div className="mt-12">
        <PartnerLogoCarousel />
      </div>
    </section>
  );
}
