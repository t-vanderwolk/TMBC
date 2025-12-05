"use client";

import { useEffect, useState } from "react";

type Invite = {
  email: string;
  status: string;
  code: string;
};

export default function AdminInvites() {
  const [invites, setInvites] = useState<Invite[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("tm_user");
    if (!stored) return (window.location.href = "/login");

    const parsed = JSON.parse(stored);
    const role = String(parsed.role ?? "").toLowerCase();
    if (role !== "admin") return (window.location.href = "/dashboard");

    setInvites([
      { email: "test@example.com", status: "Pending", code: "TMB-1A2B3C" },
      { email: "hello@mail.com", status: "Approved", code: "TMB-9X9Y9Z" },
    ]);
  }, []);

  return (
    <div className="space-y-8">
      <h1 className="font-serif text-3xl text-[#3E2F35]">Invite Requests</h1>

      <div className="rounded-2xl bg-white p-6 border border-[#E6D4D8] shadow">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[#C8A1B4] uppercase tracking-[0.2em]">
              <th className="py-2">Email</th>
              <th>Status</th>
              <th>Code</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {invites.map((i) => (
              <tr key={i.email} className="border-t border-[#f1e6ea]">
                <td className="py-3">{i.email}</td>
                <td>{i.status}</td>
                <td>{i.code}</td>
                <td>
                  <button className="text-[#C8A1B4] hover:underline">Approve →</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
