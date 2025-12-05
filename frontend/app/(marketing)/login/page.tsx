"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import Link from "next/link";
import { Auth } from "@/lib/auth.client";

const INPUT =
  "w-full rounded-full border border-[#C8A1B4]/40 bg-white px-5 py-3 text-sm text-[#3E2F35] placeholder-[#3E2F35]/40 focus:border-[#C8A1B4] focus:outline-none focus:ring-2 focus:ring-[#EAC9D1] transition";
const BUTTON =
  "w-full rounded-full bg-[#C8A1B4] py-3 text-sm font-semibold tracking-[0.25em] text-white hover:bg-[#b88ca3] transition";
const LINK =
  "text-[#C8A1B4] font-medium hover:text-[#b88ca3] transition";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/api/auth/login", { email, password });

      if (!res?.data?.user || !res?.data?.token) {
        setError("Invalid credentials");
        return;
      }

      Auth.save(res.data.token);
      const user = res.data.user;
      const role = (user.role || "").toUpperCase();

      if (!role) {
        setError("Unable to determine role. Please try again.");
        return;
      }

      localStorage.setItem("tm_user", JSON.stringify({ ...user, role }));

      if (role === "ADMIN") {
        router.push("/dashboard/admin");
      } else if (role === "MENTOR") {
        router.push("/dashboard/mentor");
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      setError("Invalid email or password");
    }
  }

  return (
    <div className="bg-[#FFFAF8] px-6 py-20">
      <div className="mx-auto max-w-md rounded-[2rem] border border-[#EAC9D1]/50 bg-white/80 backdrop-blur p-10 shadow-[0_20px_48px_rgba(200,161,180,0.15)]">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.3em] text-[#C8A1B4]">
          Taylor-Made Baby Co.
        </p>

        <h1 className="mt-3 text-center font-serif text-3xl text-[#3E2F35]">
          Welcome back
        </h1>

        <p className="mt-2 text-center text-sm text-[#3E2F35]/70">
          Log in to your dashboard, academy, and concierge experience.
        </p>

        <form onSubmit={handleLogin} className="mt-10 grid gap-6">
          {error && (
            <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-2 text-sm text-red-700 text-center">
              {error}
            </div>
          )}

          <input
            type="email"
            className={INPUT}
            placeholder="Email address"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            className={INPUT}
            placeholder="Password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" className={BUTTON}>
            Login
          </button>

          <div className="flex items-center justify-between text-xs mt-1 text-[#3E2F35]/60">
            <Link href="/request-invite" className={LINK}>
              Request Invite
            </Link>

            <Link href="/" className={LINK}>
              Return Home
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
