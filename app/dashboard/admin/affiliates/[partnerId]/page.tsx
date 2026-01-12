import AdminAffiliateWorkspace from "@/components/dashboard/admin/affiliates/AdminAffiliateWorkspace";

type Props = {
  params: {
    partnerId: string;
  };
};

export default function AdminAffiliateDetailPage({ params }: Props) {
  return (
    <main className="space-y-6">
      <AdminAffiliateWorkspace activePartnerId={params.partnerId} />
    </main>
  );
}
