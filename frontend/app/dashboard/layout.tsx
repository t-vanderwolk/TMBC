"use client";

import { ReactNode, useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import ProtectedRoute from '@/components/ProtectedRoute';
import { clearSession, getStoredUser } from '@/lib/auth';
import type { StoredUser } from '@/lib/auth';
import { getRoleRedirectPath } from '@/lib/auth/userStore';

const navItems = [
  { label: 'Overview', href: '/dashboard' },
  { label: 'Learn', href: '/dashboard/learn' },
  { label: 'Registry', href: '/dashboard/registry' },
  { label: 'Community', href: '/dashboard/community' },
  { label: 'Journal', href: '/dashboard/journal' },
  { label: 'Settings', href: '/dashboard/settings' },
];

type DashboardLayoutProps = {
  children: ReactNode;
};

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<StoredUser | null>(null);

  useEffect(() => {
    const stored = getStoredUser();
    if (stored) {
      setUser(stored);
    }
  }, []);

  const handleLogout = () => {
    clearSession();
    router.push('/login');
  };

  useEffect(() => {
    if (!user) return;
    if (user.role === 'ADMIN' && !pathname?.startsWith('/dashboard/admin')) {
      router.replace(getRoleRedirectPath('ADMIN'));
      return;
    }
    if (user.role === 'MENTOR' && !pathname?.startsWith('/mentor/dashboard')) {
      router.replace(getRoleRedirectPath('MENTOR'));
    }
  }, [pathname, router, user]);

  return (
    <ProtectedRoute allowedRoles={['MEMBER', 'MENTOR', 'ADMIN']}>
      <div className="min-h-screen bg-[#FFFAF8] text-[#3E2F35]">
        <div className="min-h-screen grid gap-6 px-4 py-6 lg:grid-cols-[280px_1fr] lg:px-8">
          <aside className="rounded-[32px] border border-[#C8A1B4]/30 bg-white/80 p-6 shadow-[0_20px_70px_rgba(199,166,199,0.15)] backdrop-blur">
            <p className="text-[0.6rem] uppercase tracking-[0.6em] text-[#C8A1B4]/80">Taylor-Made Baby Co.</p>
            <h1 className="mt-2 font-serif text-2xl text-[#3E2F35]">Dashboard</h1>
            <p className="mt-1 text-xs text-[#3E2F35]/70">
              {user?.name ? `Hey ${user.name}` : 'Nurturing your journey'}
            </p>
            <nav className="mt-8 space-y-2">
              {navItems.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`block rounded-[20px] px-4 py-3 text-sm font-semibold transition ${
                      active
                        ? 'bg-[#C8A1B4] text-white shadow-[0_10px_40px_rgba(200,161,180,0.35)]'
                        : 'text-[#3E2F35]/80 hover:text-[#C8A1B4]'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            <button
              onClick={handleLogout}
              className="mt-8 w-full rounded-full border border-[#3E2F35]/30 px-4 py-3 text-xs font-semibold uppercase tracking-[0.5em] text-[#3E2F35] transition hover:border-[#C8A1B4]"
            >
              Sign out
            </button>
          </aside>
          <section className="flex flex-col gap-6 rounded-[32px] border border-[#C8A1B4]/20 bg-gradient-to-b from-white to-[#FFFAF8] p-6 shadow-[0_40px_120px_rgba(199,166,199,0.18)]">
            <header className="flex items-center justify-between">
              <div>
                <p className="text-[0.65rem] uppercase tracking-[0.45em] text-[#3E2F35]/70">Welcome back</p>
                <h2 className="font-serif text-3xl text-[#3E2F35]">{user?.name ?? 'Taylor-Made Family'}</h2>
              </div>
              <div className="rounded-full bg-[#F7E3E8] px-4 py-2 text-sm font-semibold text-[#3E2F35]">
                {user?.role ?? 'Member'}
              </div>
            </header>
            <div className="flex-1">{children}</div>
          </section>
        </div>
      </div>
    </ProtectedRoute>
  );
}
