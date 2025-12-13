"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { getModulesWithProgress } from "@/lib/api/academy";
import SectionNav from "@/components/dashboard/SectionNav";
import { PUBLIC_LOGIN_ROUTE } from "@/lib/auth/routeForRole";

type AcademyModule = {
  id: string;
  title: string;
  description?: string;
  journey?: string;
  summary?: string;
  stage?: string;
  completed?: boolean;
  progress?: number;
};

const JOURNEYS = ["All", "Nursery", "Gear", "Postpartum"];

export default function LearnPage() {
  const router = useRouter();
  const [modules, setModules] = useState<AcademyModule[]>([]);
  const [activeJourney, setActiveJourney] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("tm_user");
    if (!stored) {
      router.replace(PUBLIC_LOGIN_ROUTE);
      setAuthChecked(true);
      return;
    }

    try {
      const parsed = JSON.parse(stored);
      setToken(parsed?.token ?? null);
    } catch {
      localStorage.removeItem("tm_user");
      router.replace(PUBLIC_LOGIN_ROUTE);
    } finally {
      setAuthChecked(true);
    }
  }, [router]);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    setError("");
    getModulesWithProgress(token)
      .then((response) => {
        setModules(response.data);
      })
      .catch(() => {
        setError("Unable to fetch academy journeys right now.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [token]);

  const filteredModules = useMemo(() => {
    if (activeJourney === "All") return modules;
    return modules.filter((module) => {
      const journey = (module.journey ?? module.stage ?? "").toLowerCase();
      return journey.includes(activeJourney.toLowerCase());
    });
  }, [activeJourney, modules]);

  const progressValue = (module: AcademyModule) => {
    if (typeof module.progress === "number") return Math.min(100, Math.max(0, module.progress));
    if (module.completed) return 100;
    return module.stage?.toLowerCase().includes("complete") ? 100 : 0;
  };

  if (!authChecked) {
    return (
      <div className="flex flex-1 items-center justify-center px-4 py-20 text-sm uppercase tracking-[0.6em] text-[#C8A1B4]">
        Gathering your journey…
      </div>
    );
  }

  return (
    <main className="space-y-10 px-4 py-8 text-[#3E2F35] sm:px-6">
      <section className="rounded-[2.5rem] border border-[#EAD4D8] bg-gradient-to-br from-[#FFF8F6] via-[#FBE9EE] to-[#F0D4D9]/70 p-6 shadow-[0_25px_70px_rgba(192,153,170,0.3)]">
        <p className="text-[0.65rem] uppercase tracking-[0.4em] text-[#3E2F35]/70">Academy journal</p>
        <h1 className="mt-3 font-serif text-3xl text-[#3E2F35]">Your curated studio for learning</h1>
        <p className="mt-2 text-sm text-[#3E2F35]/70">
          Journey through Nursery, Gear, and Postpartum at a calm pace. Tap into sections that match your
          mood and stage.
        </p>
      </section>
      <SectionNav />

      <section className="space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          {JOURNEYS.map((journey) => {
            const isActive = journey === activeJourney;
            return (
              <button
                key={journey}
                type="button"
                onClick={() => setActiveJourney(journey)}
                className={`rounded-full border px-5 py-2 text-xs font-semibold uppercase tracking-[0.4em] transition ${
                  isActive
                    ? "border-[#C8A1B4] bg-[#C8A1B4]/10 text-[#3E2F35]"
                    : "border-transparent bg-[#FFFAF8]/80 text-[#3E2F35]/60 hover:border-[#EAC9D1]"
                }`}
              >
                {journey}
              </button>
            );
          })}
        </div>
        <p className="text-xs uppercase tracking-[0.3em] text-[#3E2F35]/60">
          {filteredModules.length} modules · {activeJourney} focus
        </p>
      </section>

      {loading && (
        <div className="flex flex-1 items-center justify-center rounded-[2rem] border border-[#E3C6D4] bg-white/80 p-6 text-sm uppercase tracking-[0.6em] text-[#C8A1B4] shadow-[0_20px_70px_rgba(180,143,164,0.25)]">
          Loading modules…
        </div>
      )}

      {error && (
        <div className="rounded-[1.75rem] border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {!loading &&
          !error &&
          filteredModules.map((module) => {
            const progress = progressValue(module);
            return (
              <article
                key={module.id}
                className="flex h-full flex-col justify-between rounded-[2.25rem] border border-[#E3C6D4] bg-white/90 p-6 shadow-[0_20px_60px_rgba(180,143,164,0.25)] transition hover:-translate-y-1 hover:shadow-[0_25px_80px_rgba(180,143,164,0.35)]"
              >
                <div className="space-y-3">
                  <p className="text-[0.65rem] uppercase tracking-[0.4em] text-[#C8A1B4]">
                    {(module.journey ?? module.stage ?? "Journey").toUpperCase()}
                  </p>
                  <h2 className="text-xl font-semibold text-[#3E2F35]">{module.title}</h2>
                  <p className="text-sm leading-relaxed text-[#3E2F35]/70">
                    {module.description ?? module.summary ?? "A calm chapter created for you."}
                  </p>
                </div>
                <div className="mt-6 space-y-3">
                  <div className="h-1.5 overflow-hidden rounded-full bg-[#FFEAF0]">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#C8A1B4] to-[#B98AA5]"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-[#3E2F35]/60">
                    <span>{progress}% progress</span>
                    <span>{module.stage ?? "Studio ritual"}</span>
                  </div>
                  <Link
                    href={`/dashboard/member/learn/${module.id}`}
                    className="text-xs font-semibold uppercase tracking-[0.4em] text-[#3E2F35] transition hover:text-[#C8A1B4]"
                  >
                    View module →
                  </Link>
                </div>
              </article>
            );
          })}
      </section>
    </main>
  );
}
