import DashboardTile from "@/components/tmbc/DashboardTile";
import SectionHeader from "@/components/tmbc/SectionHeader";
import StyledButton from "@/components/tmbc/StyledButton";

export default function DashboardHome() {
  const tiles = [
    { title: "Registry rhythms", description: "Keep your favorites synchronized.", href: "/dashboard/member/registry" },
    { title: "Time capsule", description: "Lock away love notes and dreams.", href: "/dashboard/timecapsule" },
    { title: "Support", description: "Concierge, styling, and gear lab.", href: "/dashboard/support" },
    { title: "Community", description: "Announcements, polls, and memories.", href: "/dashboard/member/community" },
  ];

  return (
    <div className="space-y-10">
      <SectionHeader
        title="Dashboard"
        subtitle="Your concierge space for every intentional moment."
        actions={<StyledButton variant="ghost">Share a note</StyledButton>}
      />
      <div className="grid gap-6 md:grid-cols-2">
        {tiles.map((tile) => (
          <DashboardTile key={tile.title} title={tile.title} description={tile.description} href={tile.href} />
        ))}
      </div>
    </div>
  );
}
