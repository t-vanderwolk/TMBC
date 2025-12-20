"use client";

import { useEffect, useState } from "react";

type SettingsTab = {
  id: string;
  label: string;
  description?: string;
};

type SettingsTabsProps = {
  tabs: SettingsTab[];
};

export default function SettingsTabs({ tabs }: SettingsTabsProps) {
  const [active, setActive] = useState(tabs[0]?.id ?? "");

  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace("#", "");
      setActive(hash || (tabs[0]?.id ?? ""));
    };

    handleHash();
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, [tabs]);

  return (
    <div className="grid gap-3 rounded-3xl border border-[#E3D0D7] bg-white/90 p-4 text-sm md:grid-cols-4">
      {tabs.map((tab) => {
        const isActive = tab.id === active;
        return (
          <a
            key={tab.id}
            href={`#${tab.id}`}
            className={`flex flex-col gap-1 rounded-2xl px-4 py-3 transition ${isActive ? "bg-[#F7EBF1] shadow-[0_10px_30px_rgba(200,161,180,0.25)]" : "hover:bg-[#F5F0F3]"}`}
            aria-current={isActive ? "page" : undefined}
          >
            <span className="text-[0.65rem] uppercase tracking-[0.4em] text-[#C8A1B4]">{tab.label}</span>
            {tab.description && (
              <span className="text-xs text-[#3E2F35]/70">{tab.description}</span>
            )}
          </a>
        );
      })}
    </div>
  );
}
