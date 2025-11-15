'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

import { Auth } from '@/lib/auth';

const dashboardLinks = [
  { label: 'Overview', href: '/dashboard' },
  { label: 'Academy', href: '/dashboard/academy' },
  { label: 'Registry', href: '/dashboard/registry' },
  { label: 'Community', href: '/dashboard/community' },
  { label: 'Mentor', href: '/dashboard/mentor' },
  { label: 'Admin', href: '/dashboard/admin' },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [checked, setChecked] = useState(false);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const token = Auth.get();
    if (!token) {
      router.replace('/login');
      return;
    }

    const payload = Auth.decode();
    if (!payload) {
      Auth.clear();
      router.replace('/login');
      return;
    }

    const userRole = String(payload.role).toLowerCase();
    setRole(userRole);

    if (pathname.startsWith('/dashboard/admin') && userRole !== 'admin') {
      router.replace('/dashboard');
      return;
    }

    if (pathname.startsWith('/dashboard/mentor') && userRole !== 'mentor' && userRole !== 'admin') {
      router.replace('/dashboard');
      return;
    }

    setChecked(true);
  }, [pathname, router]);

  const filteredLinks = useMemo(() => {
    if (!role) return [];
    return dashboardLinks.filter((link) => {
      if (link.label === 'Admin') return role === 'admin';
      if (link.label === 'Mentor') return role === 'mentor' || role === 'admin';
      return true;
    });
  }, [role]);

  if (!checked) return null;

  return (
    <div className="section-wrap space-y-8">
      <nav className="flex items-center gap-6 rounded-2xl border border-tmDust bg-white px-6 py-3 shadow-sm">
        {filteredLinks.map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`pb-1 text-sm tracking-wide ${
                active ? 'border-b-2 border-tmMauve font-semibold text-tmMauve' : 'text-tmCharcoal/70 hover:text-tmMauve'
              }`}
            >
              {link.label}
            </Link>
          );
        })}
        <button className="ml-auto btn-ghost text-xs" onClick={() => { Auth.clear(); router.replace('/login'); }}>
          Log out
        </button>
      </nav>
      {children}
    </div>
  );
}
