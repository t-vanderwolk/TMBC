'use client';

import { ReactNode, useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import { Auth, loadSession } from '@/lib/auth';

type DashboardLayoutProps = {
  children: ReactNode;
};

const roleRedirects: Record<string, string> = {
  mentor: '/dashboard/mentor',
  admin: '/dashboard/admin',
};

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [verifying, setVerifying] = useState(true);
  const [sessionRole, setSessionRole] = useState<string | null>(null);
  const [firstName, setFirstName] = useState<string>('');

  useEffect(() => {
    const verifySession = () => {
      const session = loadSession();
      if (!session) {
        router.replace('/login');
        return;
      }

      const role = String(session.payload?.role ?? '').toLowerCase();
      if (!role || role === 'mentor' || role === 'admin') {
        const destination = roleRedirects[role] ?? '/login';
        if (!role) Auth.clear();
        router.replace(destination);
        return;
      }

      if (role !== 'member') {
        router.replace('/login');
        return;
      }

      const payloadName = session.payload?.firstName || session.payload?.name || '';
      setFirstName(payloadName);
      setSessionRole('member');
      setVerifying(false);
    };

    verifySession();
  }, [router]);

  const handleLogout = () => {
    Auth.clear();
    router.replace('/login');
  };

  if (verifying) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-tmIvory via-white to-tmBlush/50 px-6 text-center">
        <div className="rounded-3xl bg-white/80 px-12 py-12 shadow-soft ring-1 ring-white/60">
          <p className="font-script text-4xl text-tmMauve">Taylor-Made</p>
          <p className="font-serif text-xs uppercase tracking-[0.6em] text-tmCharcoal">
            Baby Co.
          </p>
          <p className="mt-6 text-lg text-tmCharcoal/80">One sec—just fluffing the pillows…</p>
        </div>
      </div>
    );
  }

  if (sessionRole !== 'member') {
    return null;
  }

  return (
    <div className="min-h-screen bg-tmIvory px-6 py-6">
      <div className="mx-auto flex max-w-7xl gap-6">
        <DashboardSidebar activePath={pathname ?? '/dashboard'} />
        <div className="flex flex-1 flex-col rounded-[32px] bg-white/70 p-6 shadow-soft ring-1 ring-white/60 backdrop-blur">
          <DashboardHeader firstName={firstName} onLogout={handleLogout} />
          <main className="mt-6 flex-1 rounded-3xl bg-tmIvory p-6 text-tmCharcoal shadow-inner">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
