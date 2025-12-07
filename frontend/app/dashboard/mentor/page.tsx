"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { api } from "@/lib/api";
import { getClientUser } from "@/lib/auth";

type Mentee = {
  id: string;
  name: string;
  status: string;
};

export default function MentorPage() {
  const router = useRouter();
  const [mentees, setMentees] = useState<Mentee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const user = getClientUser();
    if (!user) {
      router.replace("/login");
      return;
    }
    if (user.role !== "MENTOR" && user.role !== "ADMIN") {
      router.replace("/dashboard");
      return;
    }

    api
      .get("/api/mentor/mentees")
      .then((response) => {
        setMentees(response.data);
      })
      .catch(() => {
        setError("Unable to load mentees.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center px-4 py-16">
        <p className="text-sm uppercase tracking-[0.4em] text-[#C8A1B4]">Loading your mentees…</p>
      </div>
    );
  }

  return (
    <main className="space-y-6 px-4 py-8 text-[#3E2F35] sm:px-6">
      <section className="rounded-[36px] border border-[#C8A1B4]/40 bg-white/80 p-6 shadow-[0_30px_90px_rgba(199,166,199,0.25)]">
        <p className="text-[0.65rem] uppercase tracking-[0.5em] text-[#3E2F35]/70">Mentor cuid</p>
        <h1 className="mt-2 font-serif text-3xl text-[#3E2F35]">Your mentee circle</h1>
        <p className="mt-2 text-sm text-[#3E2F35]/70">
          Nudge each mentee with notes, reminders, and warm encouragement.
        </p>
      </section>

      {error && (
        <div className="rounded-[28px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <section className="space-y-4">
        {mentees.map((mentee) => (
          <article
            key={mentee.id}
            className="flex flex-col gap-3 rounded-[28px] border border-[#3E2F35]/10 bg-white/90 p-6 shadow-[0_20px_60px_rgba(199,166,199,0.15)] sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="text-[0.65rem] uppercase tracking-[0.4em] text-[#3E2F35]/60">{mentee.status}</p>
              <h2 className="mt-1 text-2xl font-semibold text-[#3E2F35]">{mentee.name}</h2>
            </div>
            <div className="flex flex-wrap gap-3 text-[0.65rem] uppercase tracking-[0.35em] text-[#3E2F35]">
              <button className="rounded-full border border-[#C8A1B4] px-4 py-2 hover:border-[#3E2F35]">View notes</button>
              <button className="rounded-full border border-[#C8A1B4] px-4 py-2 hover:border-[#3E2F35]">Message</button>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
