"use client";

import { useEffect, useState } from "react";

type MentorInfo = {
  name: string;
  members: number;
  status: string;
};

export default function AdminMentors() {
  const [mentors, setMentors] = useState<MentorInfo[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("tm_user");
    if (!stored) return (window.location.href = "/login");

    const parsed = JSON.parse(stored);
    const role = String(parsed.role ?? "").toLowerCase();
    if (role !== "admin") return (window.location.href = "/dashboard");

    setMentors([
      { name: "Mia Collins", members: 18, status: "Active" },
      { name: "Jordan Price", members: 16, status: "Active" },
      { name: "Lola Mercado", members: 14, status: "Circle Lead" },
    ]);
  }, []);

  return (
    <div className="space-y-8">
      <h1 className="font-serif text-3xl text-[#3E2F35]">Mentor Team</h1>

      <div className="grid md:grid-cols-2 gap-6">
        {mentors.map((m) => (
          <div
            key={m.name}
            className="rounded-2xl bg-white border border-[#E6D4D8] p-6 shadow"
          >
            <h2 className="font-serif text-xl text-[#3E2F35]">{m.name}</h2>
            <p className="text-sm text-[#3E2F35]/70">{m.status}</p>

            <p className="mt-4 text-3xl font-semibold text-[#3E2F35]">
              {m.members}
            </p>
            <p className="text-sm text-[#C8A1B4] uppercase tracking-[0.2em]">
              Assigned Members
            </p>

            <button className="mt-4 rounded-xl border border-[#C8A1B4] px-4 py-2 text-sm hover:bg-[#FFF3F7]">
              View Profile →
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
