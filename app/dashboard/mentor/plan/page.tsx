"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { authedFetch } from "@/lib/authedFetch";
import { useRequireRole } from "@/lib/auth/useRequireRole";

type Mentee = {
  id: string;
  name: string | null;
  email: string;
  onboardedAt: string;
  mentorCollabConfirmedAt: string | null;
};

export default function MentorPlanIndexPage() {
  useRequireRole(["MENTOR", "ADMIN"]);
  const [mentees, setMentees] = useState<Mentee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadMentees = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await authedFetch("/api/mentor/mentees", { cache: "no-store" });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data?.error || "Unable to load members.");
        }
        setMentees(data?.data ?? []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to load members.");
      } finally {
        setLoading(false);
      }
    };

    void loadMentees();
  }, []);

  return (
    <main className="space-y-6 px-4 pb-20 pt-6 text-[#3E2F35] sm:px-6">
      <header className="space-y-2 rounded-[28px] bg-[#FFF9F5] p-5 shadow-sm">
        <p className="text-xs uppercase tracking-[0.4em] text-[#C8A1B4]">Mentee plans</p>
        <h1 className="font-serif text-3xl text-[#3E2F35]">Plan access</h1>
        <p className="text-sm text-[#3E2F35]/70">
          This list is a shortcut to plans. Start from the mentee directory for the full context.
        </p>
        <Link
          href="/dashboard/mentor/mentees"
          className="inline-flex rounded-full border border-[#C8A1B4] px-4 py-2 text-[0.55rem] font-semibold uppercase tracking-[0.35em] text-[#A4556A] hover:bg-[#F7E9EF]"
        >
          View mentees
        </Link>
      </header>

      {error ? (
        <div className="rounded-[28px] border border-[#F0CCD7] bg-[#FFF4FA] px-5 py-3 text-sm text-[#8B4A61]">
          {error}
        </div>
      ) : null}

      {loading ? (
        <section className="rounded-[28px] bg-white/95 p-5 shadow-sm">
          <p className="text-sm text-[#3E2F35]/70">Loading members...</p>
        </section>
      ) : null}

      {!loading ? (
        <section className="space-y-3 rounded-[28px] bg-white/95 p-5 shadow-sm">
          {mentees.length ? (
            <div className="space-y-3">
              {mentees.map((mentee) => (
                <div key={mentee.id} className="rounded-2xl bg-[#FFF9F5] p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-base font-semibold text-[#3E2F35]">
                        {mentee.name || mentee.email}
                      </p>
                      <p className="text-xs text-[#3E2F35]/60">{mentee.email}</p>
                      <p className="mt-2 text-xs text-[#3E2F35]/70">
                        Joined: {new Date(mentee.onboardedAt).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-[#3E2F35]/70">
                        Collaboration:{" "}
                        {mentee.mentorCollabConfirmedAt
                          ? `Confirmed · ${new Date(mentee.mentorCollabConfirmedAt).toLocaleDateString()}`
                          : "Pending"}
                      </p>
                    </div>
                    <Link
                      href={`/dashboard/mentor/plan/${mentee.id}`}
                      className="rounded-full border border-[#C8A1B4] px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-[#A4556A] hover:bg-[#F7E9EF]"
                    >
                      Open plan
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-[#3E2F35]/70">
              No mentees available yet. This section will populate as mentors engage.
            </p>
          )}
        </section>
      ) : null}
    </main>
  );
}
