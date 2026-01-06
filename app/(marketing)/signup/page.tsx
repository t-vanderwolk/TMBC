'use client';

import Link from "next/link";
import { FormEvent, Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { api } from "@/lib/api";
import { saveSession } from "@/lib/auth";
import { routeForRole } from "@/lib/auth/routeForRole";

const RegistryTypes = ["Baby", "Nursery", "Family", "Concierge"];

const resolveErrorMessage = (error: unknown, fallback: string) => {
  if (!error) return fallback;
  if (typeof error === "string") return error;
  if (error instanceof Error) return error.message;
  if (typeof error === "object" && error !== null) {
    const response = (error as Record<string, unknown>).response as Record<string, unknown> | undefined;
    const data = response?.data as Record<string, unknown> | undefined;
    const message = data?.message;
    if (typeof message === "string") return message;
  }
  return fallback;
};

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const inviteCode = searchParams.get("code")?.toUpperCase() || "";

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [registryType, setRegistryType] = useState(RegistryTypes[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!inviteCode) {
      setError("Invite code is required to complete signup.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const name = `${firstName} ${lastName}`.trim();

      const response = await api.post("/auth/register", {
        email,
        password,
        name,
        inviteCode,
        firstName,
        lastName,
        city,
        state,
        country,
        registryType,
      });

      const { token, user } = response.data;
      const normalizedRole = (user?.role || "MEMBER").toString().toUpperCase();
      const sessionUser = {
        ...user,
        role: normalizedRole,
        onboardingComplete: Boolean(user?.onboardingComplete),
        profileCompleted: Boolean(user?.profileCompleted),
        inviteCodeUsed: Boolean(user?.inviteCodeUsed),
      };
      await saveSession({
        token,
        user: sessionUser,
      });
      router.push(routeForRole(sessionUser.role));
    } catch (err: unknown) {
      setError(resolveErrorMessage(err, "Unable to signup right now."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="marketing-section">
      <div className="mx-auto max-w-[90%] md:max-w-xl rounded-[32px] border border-[var(--tmbc-mauve)]/30 bg-white/90 p-8 shadow-[0_25px_60px_rgba(199,166,199,0.25)] text-[var(--tmbc-charcoal)]">
        <p className="text-xs uppercase tracking-[0.4em] text-[var(--tmbc-charcoal)] text-opacity-60">Sign up</p>
        <h1 className="mt-2 font-serif text-2xl md:text-4xl">Create your TMBC + MyRegistry account</h1>
        <p className="text-base text-[var(--tmbc-charcoal)] text-opacity-70">
          Make sure you have your invite code handy. We&apos;ll create your TMBC user and sync with MyRegistry at once.
        </p>

        {!inviteCode && (
          <p className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
            No invite code detected. <Link className="underline" href="/request-invite">Request an invite</Link> or
            return to the invite page with a code.
          </p>
        )}

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <label className="flex flex-col gap-2">
              <span className="text-xs uppercase tracking-[0.3em] text-[var(--tmbc-charcoal)] text-opacity-70">First name</span>
              <input
                value={firstName}
                onChange={(event) => setFirstName(event.target.value)}
                placeholder="First name"
                required
                className="marketing-input"
              />
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-xs uppercase tracking-[0.3em] text-[var(--tmbc-charcoal)] text-opacity-70">Last name</span>
              <input
                value={lastName}
                onChange={(event) => setLastName(event.target.value)}
                placeholder="Last name"
                required
                className="marketing-input"
              />
            </label>
          </div>

          <label className="flex flex-col gap-2">
            <span className="text-xs uppercase tracking-[0.3em] text-[var(--tmbc-charcoal)] text-opacity-70">Email</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@email.com"
              required
              className="marketing-input"
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-xs uppercase tracking-[0.3em] text-[var(--tmbc-charcoal)] text-opacity-70">Password</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
              required
              className="marketing-input"
            />
          </label>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <label className="flex flex-col gap-2">
              <span className="text-xs uppercase tracking-[0.3em] text-[var(--tmbc-charcoal)] text-opacity-70">City</span>
              <input value={city} onChange={(event) => setCity(event.target.value)} placeholder="City" className="marketing-input" />
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-xs uppercase tracking-[0.3em] text-[var(--tmbc-charcoal)] text-opacity-70">State</span>
              <input value={state} onChange={(event) => setState(event.target.value)} placeholder="State" className="marketing-input" />
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-xs uppercase tracking-[0.3em] text-[var(--tmbc-charcoal)] text-opacity-70">Country</span>
              <input value={country} onChange={(event) => setCountry(event.target.value)} placeholder="Country" className="marketing-input" />
            </label>
          </div>

          <label className="flex flex-col gap-2">
            <span className="text-xs uppercase tracking-[0.3em] text-[var(--tmbc-charcoal)] text-opacity-70">Registry type</span>
            <select
              value={registryType}
              onChange={(event) => setRegistryType(event.target.value)}
              className="marketing-input"
            >
              {RegistryTypes.map((type) => (
                <option key={type} value={type}>
                  {type} registry
                </option>
              ))}
            </select>
          </label>

          {error && <p className="text-sm font-medium text-red-500">{error}</p>}

          <button type="submit" className="marketing-btn marketing-btn-primary uppercase tracking-[0.35em] disabled:opacity-60" disabled={loading}>
            {loading ? "Creating your account..." : "Create account"}
          </button>
        </form>
      </div>
    </section>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={null}>
      <SignupForm />
    </Suspense>
  );
}
