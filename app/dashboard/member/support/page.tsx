"use client";

import SectionWrapper from "@/components/dashboard/member/ui/SectionWrapper";
import PageHeader from "@/components/dashboard/member/ui/PageHeader";
import CTAButton from "@/components/dashboard/member/ui/CTAButton";
import SupportTile from "@/components/tmbc/SupportTile";
import Link from "next/link";

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
    <main className="space-y-6 px-4 py-8 sm:px-6">
      <PageHeader
        title="Support hub"
        subtitle="Concierge care"
        description="Plain-language entry points help you ask for what you need. Nothing feels transactional—just reassuring access."
        cta={{ label: "Request a concierge", href: "/dashboard/support/request" }}
      />

      <SectionWrapper
        title="Concierge offerings"
        description="Browse the white-glove possibilities in quiet, editorial cards."
        action={{ label: "View request form", href: "/dashboard/support/request", subtle: true }}
      >
        <div className="grid gap-4 md:grid-cols-2">
          {TILES.map((tile) => (
            <SupportTile key={tile.title} title={tile.title} description={tile.description} tag={tile.tag} />
          ))}
        </div>
      </SectionWrapper>

      <section className="rounded-[28px] border border-[#E3C6D4] bg-[#FFF8F6] p-5 shadow-sm">
        <p className="text-xs uppercase tracking-[0.4em] text-[#C8A1B4]">Need a soft landing?</p>
        <h2 className="mt-1 text-lg font-serif text-[#3E2F35]">You can start small</h2>
        <p className="mt-2 text-sm text-[#3E2F35]/70">
          Drop a note about the feeling that's surfaced today. We’ll translate it into a gentle action plan.
        </p>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
          <CTAButton label="Message concierge" href="/dashboard/support/request" fullWidth={false} />
          <Link
            href="/dashboard/member/support"
            className="text-xs font-semibold uppercase tracking-[0.35em] text-[#B98AA5]"
          >
            See how it works
          </Link>
        </div>
      </section>
    </main>
  );
}
