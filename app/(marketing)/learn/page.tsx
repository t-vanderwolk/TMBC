import Link from "next/link";
import type { Route } from "next";
import PageSection from "@/components/PageSection";

const PRIMARY_BUTTON_CLASSES =
  "inline-flex items-center justify-center gap-2 rounded-full bg-[#C8A1B4] px-7 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-[#3E2F35] shadow-[0_8px_30px_rgba(200,161,180,0.15)] hover:scale-105 transition-all";
const SECONDARY_BUTTON_CLASSES =
  "inline-flex items-center justify-center gap-2 rounded-full border border-[#C8A1B4] px-7 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-[#3E2F35] hover:scale-105 transition-all";

const topics = [
  {
    title: "Boutique Curriculum",
    description: "Short, soulful lessons pair written insights, workbook prompts, and recorded mentor wisdom.",
  },
  {
    title: "Living Workbook",
    description: "Capture rituals, ask bold questions, and archive each milestone inside your private journal.",
  },
  {
    title: "Mentor Letters",
    description: "Mentors send seasonal letters that feel personal, poetic, and practical.",
  },
];

export default function LearnPage() {
  return (
    <div className="bg-[#FFFAF8]">
      <PageSection className="border-b border-[#D9C48E]/25">
        <div className="mx-auto max-w-screen-xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#C8A1B4]">Boutique academy</p>
          <h1 className="font-serif text-4xl text-[#3E2F35] md:text-5xl">Learn with intention</h1>
          <p className="mt-4 text-sm text-[#3E2F35]/80">
            Modules unfold over leisurely weeks. Each lesson combines quiet reflection, cultural context, and tactical next steps.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href={"/request-invite" as Route} className={PRIMARY_BUTTON_CLASSES}>
              Request Invite
            </Link>
            <Link href={"/membership" as Route} className={SECONDARY_BUTTON_CLASSES}>
              View Membership
            </Link>
          </div>
        </div>
      </PageSection>

      <PageSection>
        <div className="mx-auto max-w-screen-xl space-y-8">
          <header className="text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-[#C8A1B4]">Modules & rituals</p>
            <h2 className="font-serif text-3xl text-[#3E2F35]">Lessons that feel like letters</h2>
          </header>
          <div className="grid gap-6 md:grid-cols-3">
            {topics.map((topic) => (
              <article
                key={topic.title}
                className="rounded-[2.25rem] border border-[#D9C48E]/30 bg-white p-6 shadow-[0_12px_35px_rgba(62,47,53,0.12)]"
              >
                <h3 className="font-serif text-xl text-[#3E2F35]">{topic.title}</h3>
                <p className="mt-3 text-sm text-[#3E2F35]/80">{topic.description}</p>
              </article>
            ))}
          </div>
        </div>
      </PageSection>

      <PageSection className="border-t border-[#D9C48E]/25">
        <div className="mx-auto max-w-screen-xl">
          <div className="space-y-4 rounded-[2.5rem] border border-[#D9C48E]/40 bg-white p-8 shadow-[0_15px_40px_rgba(62,47,53,0.16)]">
            <p className="text-xs uppercase tracking-[0.3em] text-[#C8A1B4]">Ready for more?</p>
            <h3 className="font-serif text-3xl text-[#3E2F35]">Modules & mentorship, curated</h3>
            <p className="text-sm text-[#3E2F35]/80">
              The Academy lives inside our registry, Slack community, and weekly salons—always paced for calm.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href={"/experience" as Route} className={SECONDARY_BUTTON_CLASSES}>
                Experience TMBC
              </Link>
              <Link href={"/request-invite" as Route} className={PRIMARY_BUTTON_CLASSES}>
                Request Invite
              </Link>
            </div>
          </div>
        </div>
      </PageSection>
    </div>
  );
}
