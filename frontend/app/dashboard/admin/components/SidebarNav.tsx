"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';

const navItems = [
  { label: 'Overview', href: '/dashboard/admin', detail: 'Concierge pulse' },
  { label: 'Metrics', href: '#metrics', detail: 'Performance cards' },
  { label: 'Activity', href: '#activity', detail: 'Live feed' },
  { label: 'Users', href: '#users', detail: 'Preview roster' },
  { label: 'Registry', href: '#registry', detail: 'Monitor entries' },
  { label: 'Modules', href: '#modules', detail: 'Editor snapshots' },
  { label: 'Settings', href: '#settings', detail: 'System insight' },
];

export default function SidebarNav() {
  const [currentHash, setCurrentHash] = useState('');

  useEffect(() => {
    const syncHash = () => {
      setCurrentHash(window.location.hash);
    };

    syncHash();
    window.addEventListener('hashchange', syncHash);
    return () => window.removeEventListener('hashchange', syncHash);
  }, []);

  const isActive = (href: string) => {
    if (href === '/dashboard/admin') {
      return !currentHash || currentHash === '#metrics';
    }

    return currentHash === href;
  };

  return (
    <div className="flex h-full flex-col justify-between rounded-[32px] border border-white/70 bg-gradient-to-b from-tmBlush/80 via-white to-tmIvory p-6 text-tmCharcoal shadow-soft">
      <div>
        <div className="space-y-1">
          <p className="font-script text-3xl text-tmDeepMauve">Taylor-Made</p>
          <p className="text-xs uppercase tracking-[0.4em] text-tmCharcoal/80">Admin Portal</p>
        </div>
        <nav className="mt-8 flex flex-col gap-3">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center justify-between rounded-2xl border border-transparent px-4 py-3 text-sm font-semibold uppercase tracking-[0.35em] transition ${
                isActive(item.href)
                  ? 'border-tmDeepMauve bg-white/90 text-tmDeepMauve shadow-inner'
                  : 'hover:border-tmBlush/60 hover:bg-white/70'
              }`}
            >
              <span>{item.label}</span>
              <span className="text-[10px] font-normal tracking-[0.4em] text-tmCharcoal/40">
                {item.detail}
              </span>
            </Link>
          ))}
        </nav>
      </div>
      <p className="text-xs uppercase tracking-[0.4em] text-tmCharcoal/40">Quiet cockpit</p>
    </div>
  );
}
