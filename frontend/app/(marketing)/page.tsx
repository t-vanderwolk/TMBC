import Link from "next/link";
import type { Route } from "next";
import PlaceholderImageCard from "@/components/PlaceholderImageCard";

const PRIMARY =
  "inline-flex items-center justify-center rounded-full bg-[#C8A1B4] px-7 py-3 text-sm font-semibold text-white tracking-[0.25em] hover:bg-[#b88ca3] transition";

const SECONDARY =
  "inline-flex items-center justify-center rounded-full border border-[#C8A1B4] px-7 py-3 text-sm font-semibold text-[#3E2F35] tracking-[0.25em] hover:bg-[#F8EEF1] transition";
const TERTIARY =
  "inline-flex items-center justify-center rounded-full border border-transparent px-7 py-3 text-sm font-semibold text-[#3E2F35]/70 tracking-[0.25em] hover:text-[#3E2F35] transition";

export const metadata = {
  title: "Taylor-Made Baby Co. — Concierge Birth & Baby Planning",
};

export default function HomePage() {
  return (
    <div className="bg-[#FFFAF8]">
      {/* HERO */}
      <section className="border-b border-[#D9C48E]/30 py-20">
        <div className="mx-auto grid max-w-screen-xl gap-10 px-6 md:grid-cols-[0.55fr,0.45fr] md:items-center">
          {/* Editorial text (center mobile, left desktop) */}
          <div className="space-y-6 text-center md:text-left">
            <p className="text-xs uppercase tracking-[0.3em] text-[#C8A1B4]">
              Taylor-Made Baby Co.
            </p>

            <h1 className="font-serif text-[2.1rem] md:text-[2.8rem] leading-tight">
              Concierge birth & baby planning for the intentional family.
            </h1>

            <p className="text-sm text-[#3E2F35]/70 max-w-[36rem] mx-auto md:mx-0">
              Learn · Plan · Connect · Reflect inside a beautifully edited, concierge-guided
              experience shaped around your family’s season.
            </p>

            <div className="flex flex-wrap justify-center md:justify-start gap-3">
              <Link href={"/request-invite" as Route} className={PRIMARY}>
                Request Invite
              </Link>
              <Link href={"/membership" as Route} className={SECONDARY}>
                View Membership
              </Link>
              <Link href={"/login" as Route} className={TERTIARY}>
                Login to dashboard
              </Link>
            </div>
          </div>

          {/* Desktop right-side form block */}
          <div className="hidden md:block">
            <PlaceholderImageCard />
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20 border-b border-[#D9C48E]/25">
        <div className="mx-auto max-w-screen-xl space-y-10 px-6">
          <h2 className="font-serif text-3xl text-center">A calm, concierge-led journey</h2>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                title: "Concierge Intake",
                desc: "Share your story. We map milestones and set your personal concierge rhythm.",
              },
              {
                title: "Tailored Planning",
                desc: "Registry, nursery, etiquette & trimester roadmaps that evolve with you.",
              },
              {
                title: "Community & Mentors",
                desc: "Small salons, curated forums & seasonal gatherings for every family.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-[2rem] border border-[#C8A1B4]/25 bg-white p-6 shadow"
              >
                <h3 className="font-serif text-xl">{item.title}</h3>
                <p className="mt-3 text-sm text-[#3E2F35]/70">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
