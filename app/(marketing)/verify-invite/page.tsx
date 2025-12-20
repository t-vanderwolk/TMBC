"use client";

import { FormEvent, Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { inviteFlowApi } from "@/lib/api";

const VerifyContent = () => {
  const router = useRouter();
  const params = useSearchParams();

  const [email, setEmail] = useState("");
  const [code, setCode] = useState(params.get("code") || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    try {
      setLoading(true);
      const response = await inviteFlowApi.verifyInvite({ email, code });
      const token = response.data?.token;
      if (!token) throw new Error("Invite verification failed");
      router.push(`/create-profile?token=${encodeURIComponent(token)}`);
    } catch (err: any) {
      const message = err?.response?.data?.error || "Invalid email or invite code";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10 text-[var(--tmbc-charcoal)]">
      <section className="marketing-section">
        <div className="mx-auto max-w-md rounded-[32px] border border-[var(--tmbc-mauve)]/30 bg-white/90 p-8 shadow-[0_25px_60px_rgba(199,166,199,0.25)]">
          <h1 className="font-serif text-3xl sm:text-4xl">Verify your invitation</h1>
          <p className="text-base text-[var(--tmbc-charcoal)] text-opacity-70">
            Enter the email and invite code from your concierge note to continue creating your profile.
          </p>
          <form onSubmit={submit} className="marketing-form mt-6">
            <label>
              <span>Email</span>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </label>
            <label>
              <span>Invite code</span>
              <input
                placeholder="Invite code"
                value={code}
                onChange={(event) => setCode(event.target.value)}
                required
              />
            </label>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button
              className="marketing-btn marketing-btn-primary uppercase tracking-[0.35em]"
              type="submit"
              disabled={loading}
            >
              {loading ? "Verifying..." : "Continue"}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default function VerifyInvitePage() {
  return (
    <Suspense fallback={null}>
      <VerifyContent />
    </Suspense>
  );
}
