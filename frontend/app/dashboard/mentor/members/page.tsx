"use client";

import { useEffect, useState } from "react";

type Member = {
  name: string;
  trimester: string;
  progress: string;
};

export default function MentorMembers() {
  const [members, setMembers] = useState<Member[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("tm_user");
    if (!stored) return (window.location.href = "/login");
    const parsed = JSON.parse(stored);
    const role = String(parsed.role ?? "").toLowerCase();
    if (role !== "mentor") return (window.location.href = "/dashboard");

    setMembers([
      { name: "Ava Hart", trimester: "2nd", progress: "43%" },
      { name: "Lily Chen", trimester: "3rd", progress: "71%" },
    ]);
  }, []);

  return (
    <div className="space-y-8">
      <h1 className="font-serif text-3xl text-[#3E2F35]">My Members</h1>

      <div className="rounded-2xl bg-white p-6 border border-[#E6D4D8] shadow">
        {members.map((m) => (
          <div key={m.name} className="py-4 border-b border-[#f0e4e7]">
            <p className="font-semibold text-[#3E2F35]">{m.name}</p>
            <p className="text-sm text-[#3E2F35]/70">{m.trimester} trimester</p>
            <p className="text-sm text-[#C8A1B4]">Progress: {m.progress}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
