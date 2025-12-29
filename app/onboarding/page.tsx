"use client";

import { Suspense, FormEvent, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import { saveSession } from "@/lib/auth";
import { routeForRole } from "@/lib/auth/routeForRole";

function OnboardingPageContent() {
  const params = useSearchParams();
  const code = params.get("code");
  const router = useRouter();

  const [inviteEmail, setInviteEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [validating, setValidating] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!code) {
      setError("Invite code missing. Please use your invite link.");
      return;
    }

    setValidating(true);
    setError("");

    api
      .post("/onboarding/validate", { code })
      .then((response) => {
        const email = response.data?.invite?.email;
        if (!email) {
          throw new Error("Invite missing email");
        }
        setInviteEmail(email);
      })
      .catch(() => {
        setError("Invalid or already used invite code.");
      })
      .finally(() => {
        setValidating(false);
      });
  }, [code]);

  const handleOnboard = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!code) {
      setError("Invite code missing. Please return to your invite link.");
      return;
    }

    if (!inviteEmail) {
      setError("Unable to verify invite email.");
      return;
    }

    if (!name.trim()) {
      setError("Please tell us your name.");
      return;
    }

    if (!password) {
      setError("Please create a password.");
      return;
    }

    setError("");
    setSubmitting(true);

    try {
      const response = await api.post("/onboarding/complete-invite", {
        code,
        name: name.trim(),
        password,
      });

      const payload = response.data;

      if (!payload?.token || !payload?.user) {
        throw new Error("Incomplete response");
      }

      await saveSession({
        token: payload.token,
        user: payload.user,
      });

      const destination =
        payload.redirect ?? routeForRole(payload?.user?.role);
      router.push(destination);
    } catch (err) {
      setError("Unable to complete onboarding.");
    } finally {
      setSubmitting(false);
    }
  };

  const isFormDisabled = Boolean(!code || validating || !inviteEmail);

  return (
    <div className="max-w-xl mx-auto p-10 space-y-6">
      <h1 className="text-3xl font-serif">Welcome! Let's set up your profile.</h1>

      <form onSubmit={handleOnboard} className="space-y-4">
        <div className="space-y-1">
          <label className="text-sm font-semibold text-[#3E2F35]">Email on file</label>
          <input
            value={inviteEmail}
            placeholder="Invite email"
            disabled
            className="w-full cursor-not-allowed border px-4 py-3 rounded-xl bg-[#F6F2F0] text-sm text-[#3E2F35]"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-semibold text-[#3E2F35]">Your name</label>
          <input
            value={name}
            placeholder="Enter your name"
            onChange={(event) => setName(event.target.value)}
            className="w-full border px-4 py-3 rounded-xl"
            disabled={validating}
          />
        </div>

        <input
          placeholder="Create password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="w-full border px-4 py-3 rounded-xl"
          disabled={validating}
        />

        <button
          type="submit"
          disabled={submitting || isFormDisabled}
          className="w-full bg-[var(--tmbc-mauve)] py-3 rounded-xl text-white disabled:opacity-70"
        >
          {submitting ? "Completing…" : validating ? "Validating invite…" : "Complete Onboarding"}
        </button>
      </form>

      {error && <p className="text-red-600">{error}</p>}
    </div>
  );
}

export default function OnboardingPage() {
  return (
    <Suspense fallback={null}>
      <OnboardingPageContent />
    </Suspense>
  );
}
