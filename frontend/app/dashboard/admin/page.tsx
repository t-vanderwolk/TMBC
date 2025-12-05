import { requireAdmin } from '@/lib/auth';

import AdminDashboardContent from './components/AdminDashboardContent';

export default async function AdminDashboard() {
  const admin = await requireAdmin();
  return <AdminDashboardContent admin={admin} />;
}
