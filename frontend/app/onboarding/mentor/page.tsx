"use client";

import { Suspense, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { getRoleRedirectPath } from "@/lib/auth/userStore";

type Mentor = {
  id: string;
  name?: string;
};

const OnboardingMentorContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = useMemo(() => searchParams.get("userId"), [searchParams]);
  const [mentor, setMentor] = useState<Mentor | null>(null);
  const [assigning, setAssigning] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [error, setError] = useState("");
  const [mentorError, setMentorError] = useState("");

  if (!userId) {
    return (
      <section className="rounded-[32px] border border-[#E3C6D4] bg-white/95 p-8 shadow-[0_30px_90px_rgba(189,147,189,0.18)]">
        <p className="text-sm font-semibold text-[#D0465F]">
          Missing onboarding context. Return to your invite link.
        </p>
      </section>
    );
  }

  const handleAssign = async () => {
    if (!userId) {
      setMentorError("Missing user identifier.");
      return;
    }
    setAssigning(true);
    setMentorError("");

    try {
      const response = await fetch("/api/onboarding/assign-mentor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(payload?.error || "Unable to find a mentor.");
      }
      setMentor(payload?.mentor ?? null);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to find a mentor.";
      setMentorError(message);
    } finally {
      setAssigning(false);
    }
  };

  const handleFinish = async () => {
    if (!userId) {
      setError("Missing user identifier.");
      return;
    }
    setCompleting(true);
    setError("");

    try {
      const response = await fetch("/api/onboarding/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(payload?.error || "Unable to complete onboarding.");
      }

      if (typeof window !== "undefined") {
        const stored = localStorage.getItem("tm_user");
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            localStorage.setItem(
              "tm_user",
              JSON.stringify({
                ...parsed,
                onboardingComplete: true,
              }),
            );
          } catch {
            /* ignore */
          }
        }
      }

      const role = (payload?.user?.role ?? "MEMBER").toString().toUpperCase();
      router.push(getRoleRedirectPath(role));
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to finish setup.";
      setError(message);
    } finally {
      setCompleting(false);
    }
  };

  return (
    <section className="rounded-[32px] border border-[#E3C6D4] bg-white/95 p-8 shadow-[0_30px_90px_rgba(189,147,189,0.18)]">
      <div className="space-y-3">
        <p className="text-[0.65rem] uppercase tracking-[0.6em] text-[#C8A1B4]">Step 3 · Mentor</p>
        <h2 className="font-serif text-3xl text-[#3E2F35]">Pair with your mentor</h2>
        <p className="text-sm text-[#3E2F35]/70">
          Assign a mentor who can guide your registry, goals, and calm so you can trust the process.
        </p>
      </div>
      <div className="mt-6 flex flex-col gap-4">
        <button
          type="button"
          onClick={handleAssign}
          disabled={assigning}
          className="rounded-[999px] bg-[#EED9E8] px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-[#3E2F35] shadow-[0_15px_40px_rgba(189,147,189,0.4)] transition hover:-translate-y-0.5 disabled:cursor-wait disabled:opacity-70"
        >
          {assigning ? "Assigning mentor…" : "Assign mentor"}
        </button>
        {mentor && (
          <div className="rounded-[24px] border border-[#C8A1B4]/60 bg-[#FFF8F4] px-5 py-4 text-sm text-[#3E2F35]">
            Mentor assigned · <span className="font-semibold">{mentor.name ?? "Your concierge mentor"}</span>
          </div>
        )}
        {mentorError && (
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[#D0465F]">{mentorError}</p>
        )}
        <button
          type="button"
          onClick={handleFinish}
          disabled={completing || !mentor}
          className="rounded-[999px] bg-gradient-to-r from-[#C8A1B4] to-[#EAC9DA] px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-[#FFF8F4] shadow-[0_15px_40px_rgba(189,147,189,0.6)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {completing ? "Finalizing…" : "Finish setup"}
        </button>
        {error && (
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[#D0465F]">{error}</p>
        )}
      </div>
    </section>
  );
};

export default function OnboardingMentorPage() {
  return (
    <Suspense fallback={null}>
      <OnboardingMentorContent />
    </Suspense>
  );
}
