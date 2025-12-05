"use client";

import { useEffect, useState } from "react";

type LoginEvent = {
  email: string;
  success: boolean;
  time: string;
  ip: string;
};

export default function LoginEvents() {
  const [events, setEvents] = useState<LoginEvent[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("tm_user");
    if (!stored) return (window.location.href = "/login");

    const parsed = JSON.parse(stored);
    const role = String(parsed.role ?? "").toLowerCase();
    if (role !== "admin") return (window.location.href = "/dashboard");

    setEvents([
      {
        email: "member@me.com",
        success: true,
        time: "2 min ago",
        ip: "71.92.33.10",
      },
      {
        email: "mentor@me.com",
        success: false,
        time: "8 min ago",
        ip: "71.92.33.10",
      },
    ]);
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-3xl text-[#3E2F35]">Login Events</h1>

      <div className="rounded-2xl bg-white p-6 border border-[#E6D4D8] shadow">
        {events.map((e, idx) => (
          <div
            key={idx}
            className="border-b border-[#F2E7EA] py-3 flex items-center justify-between"
          >
            <div>
              <p className="font-semibold text-[#3E2F35]">{e.email}</p>
              <p className="text-sm text-[#3E2F35]/60">{e.ip}</p>
            </div>

            <p
              className={`text-sm ${e.success ? "text-green-600" : "text-red-500"}`}
            >
              {e.success ? "Success" : "Failed"}
            </p>

            <p className="text-sm text-[#3E2F35]/70">{e.time}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
