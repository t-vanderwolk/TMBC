import CommunityHighlightsPanel from "./components/CommunityHighlightsPanel";
import MemberWelcomeHeader from "@/components/dashboard/member/MemberWelcomeHeader";
import PageHeader from "@/components/dashboard/member/ui/PageHeader";
import SectionWrapper from "@/components/dashboard/member/ui/SectionWrapper";
import CTAButton from "@/components/dashboard/member/ui/CTAButton";
import EmptyState from "@/components/dashboard/member/ui/EmptyState";

const UPCOMING_EVENTS = [
  {
    title: "Community Fireside",
    date: "Mar 29 · 7:00 PM ET",
    detail: "Cozy chat with other invite-only members & mentors.",
  },
  {
    title: "Mentor Q&A",
    date: "Apr 4 · 10:30 AM ET",
    detail: "Drop in for focused guidance on nesting and rhythms.",
  },
];

const MENTOR_NOTES = [
  {
    tag: "Mentor note",
    snippet: "I've added a rhythm prompt to Module 7—revisit before Friday so we can reflect together.",
    author: "Jordan Ellis",
    time: "Yesterday",
  },
];

const REGISTRY_ITEMS = [
  { name: "Heirloom swaddle trio", status: "Awaiting mentor blessing", detail: "New suggestion" },
  { name: "Slow simmer kettle", status: "Saved", detail: "Arriving April 2" },
  { name: "Curated nursery scent", status: "Pinned", detail: "Shared with mentor" },
];

const JOURNEY_SNAPSHOT = [
  { title: "Nursery Journey", status: "In progress", message: "Module 4 · Nesting & Rhythm" },
  { title: "Gear Journey", status: "Coming up", message: "Certificate on curated essentials" },
  { title: "Postpartum Journey", status: "Waiting", message: "Gentle check-ins launch soon" },
];

export default async function MemberDashboard() {
  const userName = null;

  return (
    <main className="space-y-8 px-4 py-8 text-[#3E2F35] sm:px-6">
      <PageHeader
        title="Member dashboard"
        subtitle="Daily check-in"
        description="You’re doing exactly what you should be doing. Let’s take this one step at a time."
        cta={{ label: "Visit the Academy", href: "/dashboard/member/learn" }}
      />

      <MemberWelcomeHeader
        userName={userName}
        tone="A calm check-in, not a productivity sprint."
        intention="Nurture the rituals that keep you centered today."
        highlight="We are holding space for your bloom."
      />

      <SectionWrapper
        title="Focus for the next few moments"
        description="Softly curated so you always know what to safely prioritize."
        action={{ label: "View all prompts", href: "/dashboard/member/journal", subtle: true }}
      >
        <div className="rounded-[32px] bg-gradient-to-br from-[#FDEEE7] via-[#FFF8F6] to-[#FFF9F8] p-6 shadow-[0_20px_60px_rgba(199,166,199,0.35)]">
          <p className="text-xs uppercase tracking-[0.4em] text-[#C8A1B4]">Next step</p>
          <h3 className="mt-2 font-serif text-2xl text-[#3E2F35]">Currents & Calm · Module 7</h3>
          <p className="mt-2 text-sm text-[#3E2F35]/70">
            Revisit the breathing ritual, note what feels steady, and then join the Community Fireside for reflective voices.
          </p>
          <div className="mt-4 flex flex-col gap-3">
            <CTAButton label="Continue Module 7" href="/dashboard/member/learn" />
            <CTAButton variant="ghost" label="View the next event" href="/dashboard/member/events" />
          </div>
        </div>
      </SectionWrapper>

      <SectionWrapper
        title="Journey snapshot"
        description="Where you are, what’s next, and what can safely rest."
      >
        <div className="space-y-4">
          {JOURNEY_SNAPSHOT.map((journey) => (
            <div
              key={journey.title}
              className="flex flex-col gap-2 rounded-2xl border border-[#E3C6D4] bg-white/90 p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-[#3E2F35]/60">{journey.title}</p>
                <p className="text-sm font-semibold text-[#3E2F35]">{journey.message}</p>
              </div>
              <span className="rounded-full border border-[#E3C6D4] px-3 py-1 text-[0.65rem] uppercase tracking-[0.3em] text-[#A4556A]">
                {journey.status}
              </span>
            </div>
          ))}
        </div>
      </SectionWrapper>

      <SectionWrapper
        title="Upcoming gatherings"
        description="Soft spaces, gentle voices, zero pressure."
        action={{ label: "Browse all events", href: "/dashboard/member/events" }}
      >
        <div className="space-y-4">
          {UPCOMING_EVENTS.map((event) => (
            <article key={event.title} className="space-y-2 rounded-2xl border border-[#E3C6D4] bg-white/90 p-4 shadow-sm">
              <p className="text-xs uppercase tracking-[0.4em] text-[#3E2F35]/60">{event.date}</p>
              <h3 className="text-lg font-serif text-[#3E2F35]">{event.title}</h3>
              <p className="text-sm text-[#3E2F35]/70">{event.detail}</p>
            </article>
          ))}
          {!UPCOMING_EVENTS.length && (
            <EmptyState
              title="Calendar is calm"
              message="Nothing new today—that’s okay. Rest is part of preparation."
            />
          )}
        </div>
      </SectionWrapper>

      <SectionWrapper title="Mentor notes" description="Gentle feedback from Jordan">
        <div className="space-y-3">
          {MENTOR_NOTES.map((note) => (
            <article key={note.snippet} className="rounded-2xl border border-[#E3C6D4] bg-[#FFF8F6] p-4 shadow-sm">
              <p className="text-[0.65rem] uppercase tracking-[0.35em] text-[#C8A1B4]">{note.tag}</p>
              <p className="mt-2 text-sm text-[#3E2F35]/80">{note.snippet}</p>
              <div className="mt-3 flex items-center justify-between text-xs uppercase tracking-[0.3em] text-[#3E2F35]/60">
                <span>{note.author}</span>
                <span>{note.time}</span>
              </div>
            </article>
          ))}
        </div>
      </SectionWrapper>

      <SectionWrapper
        title="Registry rhythm"
        description="Curated notes from your planning studio"
        action={{ label: "View full registry", href: "/dashboard/member/registry", subtle: true }}
      >
        <div className="space-y-3">
          {REGISTRY_ITEMS.map((item) => (
            <div
              key={item.name}
              className="grid gap-2 rounded-2xl border border-[#E3C6D4] bg-white/90 p-4 shadow-sm sm:grid-cols-[1fr_auto]"
            >
              <div>
                <p className="text-sm font-semibold text-[#3E2F35]">{item.name}</p>
                <p className="text-xs uppercase tracking-[0.35em] text-[#C8A1B4]">{item.detail}</p>
              </div>
              <span className="rounded-full border border-[#E3C6D4] px-3 py-1 text-[0.65rem] uppercase tracking-[0.3em] text-[#3E2F35]/70">
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </SectionWrapper>

      <CommunityHighlightsPanel />
    </main>
  );
}
