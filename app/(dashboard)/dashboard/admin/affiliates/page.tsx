import AdminAffiliateWorkspace from "@/components/dashboard/admin/affiliates/AdminAffiliateWorkspace";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function AdminAffiliatesPage() {
  return (
    <main className="space-y-6">
      <AdminAffiliateWorkspace />
    </main>
  );
}
