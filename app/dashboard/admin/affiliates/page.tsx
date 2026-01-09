export const dynamic = "force-dynamic";
export const revalidate = 0;

import AdminAffiliatesPanel from "@/components/dashboard/admin/affiliates/AdminAffiliatesPanel";

export default function AdminAffiliatesPage() {
  return (
    <main className="space-y-6">
      <AdminAffiliatesPanel />
    </main>
  );
}
