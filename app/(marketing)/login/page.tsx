"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { saveSession } from "@/lib/auth";
import { login } from "@/lib/auth";
import { saveUser } from "@/lib/auth/userStore";
import { routeForRole } from "@/lib/auth/routeForRole";


export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;
    setError("");
    setLoading(true);

    try {
      const res = await login(email, password);
      if (!res?.token || !res?.user) {
        setError("Invalid credentials");
        return;
      }

      const normalizedRole = (res.user.role || "MEMBER").toUpperCase();
      const sessionUser = {
        ...res.user,
        role: normalizedRole,
        onboardingComplete: Boolean(res.user.onboardingComplete),
        profileCompleted: Boolean(res.user.profileCompleted),
        inviteCodeUsed: Boolean(res.user.inviteCodeUsed),
      };

      await saveSession({
        token: res.token,
        user: sessionUser,
      });
      saveUser(sessionUser);

      console.log("CLIENT LOGIN RESULT:", res);

      const dashboard =
        res?.dashboard ||
        routeForRole(res?.user?.role);

      await new Promise((resolve) => setTimeout(resolve, 15));
      router.replace(dashboard);
    } catch (err) {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-[#FFFAF8] px-4 py-12 text-[var(--tmbc-charcoal)] sm:px-6 sm:py-16">
      <div className="mx-auto max-w-md rounded-[2rem] border border-[#EAC9D1]/50 bg-white/80 backdrop-blur p-8 sm:p-10 shadow-[0_20px_48px_rgba(200,161,180,0.15)]">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.3em] text-[#C8A1B4]">
          Taylor-Made Baby Co.
        </p>

        <h1 className="mt-3 text-center font-serif text-3xl sm:text-4xl text-[#3E2F35]">
          Welcome back
        </h1>

        <p className="mt-2 text-center text-base text-[#3E2F35]/80">
          Log in to your dashboard, academy, and concierge experience.
        </p>

        <form onSubmit={handleLogin} className="marketing-form mt-10 w-full">
          {error && (
            <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-2 text-sm text-red-700 text-center">
              {error}
            </div>
          )}

          <label>
            <span>Email address</span>
            <input
              type="email"
              placeholder="Email address"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          <label>
            <span>Password</span>
            <input
              type="password"
              placeholder="Password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>

          <button
            type="submit"
            className="marketing-btn marketing-btn-primary uppercase tracking-[0.35em]"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <div className="flex flex-col gap-2 text-[0.75rem] uppercase tracking-[0.4em] text-[#3E2F35]/80 sm:flex-row sm:items-center sm:justify-between">
            <Link href="/request-invite" className="hover:text-[var(--tmbc-mauve)]">
              Request Invite
            </Link>

            <Link href="/" className="hover:text-[var(--tmbc-mauve)]">
              Return Home
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
