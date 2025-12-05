import { ReactNode } from 'react';

import '@/styles/dashboard.css';
import DashboardNavbar from '@/components/dashboard/DashboardNavbar';
import Sidebar from '@/components/dashboard/Sidebar';
import { requireUser } from '@/lib/auth';

type DashboardLayoutProps = {
  children: ReactNode;
};

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  const user = await requireUser();

  return (
    <div className="dashboard-shell bg-[#FFFAF8] text-[#3E2F35]">
      <DashboardNavbar user={user} />
      <div className="dashboard-layout">
        <Sidebar user={user} />
        <main className="dashboard-main p-10">{children}</main>
      </div>
    </div>
  );
}
