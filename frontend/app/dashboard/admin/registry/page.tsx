"use client";

import { useEffect, useState } from "react";

type RegistryStat = {
  label: string;
  value: string;
};

export default function AdminRegistry() {
  const [stats, setStats] = useState<RegistryStat[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("tm_user");
    if (!stored) return (window.location.href = "/login");

    const parsed = JSON.parse(stored);
    const role = String(parsed.role ?? "").toLowerCase();
    if (role !== "admin") return (window.location.href = "/dashboard");

    setStats([
      { label: "Items Tracked", value: "1,248" },
      { label: "MacroBaby Conversions", value: "68%" },
      { label: "Alerts", value: "5" },
    ]);
  }, []);

  return (
    <div className="space-y-10">
      <h1 className="font-serif text-3xl text-[#3E2F35]">Registry Overview</h1>

      <div className="grid md:grid-cols-3 gap-6">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-2xl bg-white p-6 border border-[#E6D4D8] shadow"
          >
            <p className="text-[#C8A1B4] uppercase tracking-[0.2em] text-sm">
              {s.label}
            </p>
            <p className="text-3xl mt-2 text-[#3E2F35] font-semibold">{s.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
