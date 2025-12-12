"use client";

export default function AdminSettings() {
  return (
    <div className="space-y-8">
      <h1 className="font-serif text-3xl text-[#3E2F35]">Settings</h1>

      <div className="rounded-2xl bg-white p-6 border border-[#E6D4D8] shadow">
        <p className="text-sm text-[#3E2F35]/75">This page will allow configuration of:</p>

        <ul className="list-disc ml-6 mt-3 text-sm text-[#3E2F35]/75">
          <li>Branding & Typography</li>
          <li>Notifications</li>
          <li>Roles & Permissions</li>
          <li>Automation Rules</li>
        </ul>
      </div>
    </div>
  );
}
