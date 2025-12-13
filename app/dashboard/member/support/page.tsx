import Link from "next/link";
import SectionHeader from "@/components/tmbc/SectionHeader";
import SupportTile from "@/components/tmbc/SupportTile";
import StyledButton from "@/components/tmbc/StyledButton";

const TILES = [
  { title: "Essentials Concierge", description: "Gifted help with registry basics.", tag: "Ready to go" },
  { title: "Signature Styling", description: "Studio-curated looks & styling sessions.", tag: "Limited" },
  { title: "Bespoke Retainer", description: "Mentor on speed dial for the season.", tag: "Elite" },
  { title: "Gear Lab", description: "Try-before-you-buy across nursery gear.", tag: "In-stock" },
  { title: "Registry Refresh", description: "Monthly refresh with mentor notes.", tag: "Monthly" },
  { title: "Arrival Prep Intensive", description: "3-day immersion for final weeks.", tag: "Soon" },
  { title: "Downloadable Lookbooks", description: "Trend-led inspiration PDF to pin.", tag: "Now live" },
  { title: "Weekly Perks", description: "Curated vendors + gentle surprises.", tag: "New" },
];

export default function SupportHubPage() {
  return (
    <div className="space-y-8">
      <SectionHeader
        title="Support hub"
        subtitle="Concierge and styling because you deserve grace."
        actions={
          <Link href="/dashboard/support/request">
            <StyledButton variant="ghost">Request a concierge</StyledButton>
          </Link>
        }
      />
      <div className="grid gap-4 md:grid-cols-2">
        {TILES.map((tile) => (
          <SupportTile key={tile.title} title={tile.title} description={tile.description} tag={tile.tag} />
        ))}
      </div>
    </div>
  );
}
