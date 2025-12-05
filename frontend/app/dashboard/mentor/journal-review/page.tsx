"use client";

import { useEffect, useState } from "react";

type Entry = {
  member: string;
  preview: string;
};

export default function JournalReview() {
  const [entries, setEntries] = useState<Entry[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("tm_user");
    if (!stored) return (window.location.href = "/login");
    const parsed = JSON.parse(stored);
    const role = String(parsed.role ?? "").toLowerCase();
    if (role !== "mentor") return (window.location.href = "/dashboard");

    setEntries([
      { member: "Ava Hart", preview: "Feeling a bit anxious about..." },
      { member: "Lily Chen", preview: "Baby was so active today..." },
    ]);
  }, []);

  return (
    <div className="space-y-8">
      <h1 className="font-serif text-3xl text-[#3E2F35]">Journal Review</h1>

      <div className="rounded-2xl bg-white p-6 border border-[#E6D4D8] shadow">
        {entries.map((e, i) => (
          <div key={i} className="border-b py-3 border-[#f0e4e7]">
            <p className="font-semibold text-[#3E2F35]">{e.member}</p>
            <p className="text-sm text-[#3E2F35]/70 italic">{e.preview}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
