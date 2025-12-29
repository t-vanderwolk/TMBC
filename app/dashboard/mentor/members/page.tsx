"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRequireRole } from "@/lib/auth/useRequireRole";

type Member = {
  id: string;
  name: string | null;
  email: string;
  onboardedAt: string;
  mentorCollabConfirmedAt: string | null;
};

export default function MentorMembers() {
  useRequireRole(["MENTOR", "ADMIN"]);
  const [members, setMembers] = useState<Member[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadMembers = async () => {
      setError("");
      try {
        const response = await fetch("/api/mentor/mentees", { cache: "no-store" });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data?.error || "Unable to load members.");
        }
        setMembers(data?.data ?? []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to load members.");
      }
    };

    void loadMembers();
  }, []);

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="font-serif text-3xl text-[#3E2F35]">Mentee Directory</h1>
        <p className="text-sm text-[#3E2F35]/70">
          Start with a person, then choose an action: plan, message, journal, or modules.
        </p>
      </div>

      {error ? <p className="text-sm text-[#8B4A61]">{error}</p> : null}

      <div className="rounded-2xl bg-white p-6 border border-[#E6D4D8] shadow">
        {members.length ? (
          members.map((member) => (
            <div
              key={member.id}
              className="flex flex-wrap items-start justify-between gap-4 border-b border-[#f0e4e7] py-4"
            >
              <div>
                <p className="font-semibold text-[#3E2F35]">{member.name || member.email}</p>
                <p className="text-sm text-[#3E2F35]/70">{member.email}</p>
                <p className="text-xs text-[#3E2F35]/60">
                  Joined: {new Date(member.onboardedAt).toLocaleDateString()}
                </p>
                <p className="text-xs text-[#3E2F35]/60">
                  Collaboration:{" "}
                  {member.mentorCollabConfirmedAt
                    ? `Confirmed · ${new Date(member.mentorCollabConfirmedAt).toLocaleDateString()}`
                    : "Pending"}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Link
                    href={`/dashboard/mentor/plan/${member.id}`}
                    className="rounded-full border border-[#E6D4D8] px-3 py-1 text-[0.55rem] font-semibold uppercase tracking-[0.3em] text-[#A4556A] hover:bg-[#F7E9EF]"
                  >
                    Open plan
                  </Link>
                  <Link
                    href="/dashboard/mentor/messages"
                    className="rounded-full border border-[#E6D4D8] px-3 py-1 text-[0.55rem] font-semibold uppercase tracking-[0.3em] text-[#A4556A] hover:bg-[#F7E9EF]"
                  >
                    Message
                  </Link>
                  <Link
                    href={`/dashboard/mentor/journal/${member.id}`}
                    className="rounded-full border border-[#E6D4D8] px-3 py-1 text-[0.55rem] font-semibold uppercase tracking-[0.3em] text-[#A4556A] hover:bg-[#F7E9EF]"
                  >
                    Review journal
                  </Link>
                  <Link
                    href="/dashboard/mentor/tasks"
                    className="rounded-full border border-[#E6D4D8] px-3 py-1 text-[0.55rem] font-semibold uppercase tracking-[0.3em] text-[#A4556A] hover:bg-[#F7E9EF]"
                  >
                    Review modules
                  </Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-[#3E2F35]/70">
            No mentees assigned yet. This section will populate as mentors engage.
          </p>
        )}
      </div>
    </div>
  );
}
