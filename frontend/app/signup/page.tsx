'use client';

import Link from "next/link";
import { FormEvent, Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { api } from "@/lib/api";
import { Auth } from "@/lib/auth";

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

      const response = await api.post("/api/auth/register", {
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
      Auth.save(token);

      const payload = Auth.decode();
      const role = (payload?.role || user?.role || "member").toString().toLowerCase();

      if (role === "admin") {
        router.push("/dashboard/admin");
      } else if (role === "mentor") {
        router.push("/dashboard/mentor");
      } else {
        router.push("/dashboard");
      }
    } catch (err: unknown) {
      setError(resolveErrorMessage(err, "Unable to signup right now."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section-wrap">
      <div className="card-surface mx-auto max-w-xl">
        <p className="text-xs uppercase tracking-[0.4em] text-tmMauve">Sign up</p>
        <h1 className="mt-2 text-4xl">Create your TMBC + MyRegistry account</h1>
        <p className="mt-2 text-sm text-tmCharcoal/80">
          Make sure you have your invite code handy. We&apos;ll create your TMBC user and sync with MyRegistry at once.
        </p>

        {!inviteCode && (
          <p className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
            No invite code detected. <Link className="underline" href="/request-invite">Request an invite</Link> or
            return to the invite page with a code.
          </p>
        )}

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex w-full flex-col gap-2">
              <label className="text-sm font-semibold text-tmCharcoal">First name</label>
              <input
                value={firstName}
                onChange={(event) => setFirstName(event.target.value)}
                placeholder="First name"
                required
                className="w-full"
              />
            </div>
            <div className="flex w-full flex-col gap-2">
              <label className="text-sm font-semibold text-tmCharcoal">Last name</label>
              <input
                value={lastName}
                onChange={(event) => setLastName(event.target.value)}
                placeholder="Last name"
                required
                className="w-full"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-tmCharcoal">Email</label>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@email.com"
              required
              className="w-full"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-tmCharcoal">Password</label>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
              required
              className="w-full"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-tmCharcoal">City</label>
              <input value={city} onChange={(event) => setCity(event.target.value)} placeholder="City" className="w-full" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-tmCharcoal">State</label>
              <input value={state} onChange={(event) => setState(event.target.value)} placeholder="State" className="w-full" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-tmCharcoal">Country</label>
              <input value={country} onChange={(event) => setCountry(event.target.value)} placeholder="Country" className="w-full" />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-tmCharcoal">Registry type</label>
            <select
              value={registryType}
              onChange={(event) => setRegistryType(event.target.value)}
              className="w-full"
            >
              {RegistryTypes.map((type) => (
                <option key={type} value={type}>
                  {type} registry
                </option>
              ))}
            </select>
          </div>

          {error && <p className="text-sm font-medium text-red-500">{error}</p>}

          <button type="submit" className="btn-primary w-full text-center disabled:opacity-60" disabled={loading}>
            {loading ? "Creating your account..." : "Create account"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={null}>
      <SignupForm />
    </Suspense>
  );
}
