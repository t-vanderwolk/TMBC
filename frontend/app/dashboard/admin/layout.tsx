"use client";

import { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import SidebarNav from './components/SidebarNav';
import TopBar from './components/TopBar';
import { Auth, loadSession } from '@/lib/auth';

type AdminLayoutProps = {
  children: ReactNode;
};

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const [verifying, setVerifying] = useState(true);
  const [firstName, setFirstName] = useState<string>('');

  useEffect(() => {
    const verifyAdmin = () => {
      const session = loadSession();
      if (!session) {
        router.replace('/login');
        return;
      }

      const role = String(session.payload?.role ?? '').toLowerCase();
      if (role !== 'admin') {
        Auth.clear();
        router.replace('/login');
        return;
      }

      setFirstName(session.payload?.firstName || session.payload?.name || '');
      setVerifying(false);
    };

    verifyAdmin();
  }, [router]);

  const handleLogout = () => {
    Auth.clear();
    router.replace('/login');
  };

  if (verifying) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-tmIvory via-white to-tmBlush px-6 py-8 text-center">
        <div className="rounded-[32px] border border-white/70 bg-white/80 px-10 py-12 shadow-soft">
          <p className="font-script text-4xl text-tmDeepMauve">Taylor-Made Admin</p>
          <p className="text-xs uppercase tracking-[0.6em] text-tmCharcoal/50">Gatekeeping the concierge</p>
          <p className="mt-4 text-sm text-tmCharcoal/70">Verifying your credentials…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-tmIvory via-tmBlush/60 to-tmBlush px-4 py-6">
      <div className="mx-auto flex flex-col gap-6 lg:flex-row lg:max-w-7xl">
        <aside className="w-full max-w-[260px]">
          <SidebarNav />
        </aside>
        <div className="flex w-full flex-1 flex-col gap-6">
          <TopBar firstName={firstName} onLogout={handleLogout} />
          <div className="flex-1 rounded-[36px] border border-white/70 bg-white/80 p-6 shadow-soft backdrop-blur">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
