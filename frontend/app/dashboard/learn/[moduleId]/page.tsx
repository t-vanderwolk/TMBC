import { notFound } from 'next/navigation';
import {
  BookOpen,
  PenLine,
  Sparkles,
  HeartHandshake,
  CheckCircle2,
} from 'lucide-react';

import ModuleLayout from '../components/ModuleLayout';
import { academyModules, findModuleById } from '../modules';

type ModulePageProps = {
  params: {
    moduleId: string;
  };
};

const ModulePage = ({ params }: ModulePageProps) => {
  const module = findModuleById(params.moduleId) ?? notFound();

  return (
    <ModuleLayout module={module}>
      <section className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-soft">
        <div className="flex items-center gap-3">
          <BookOpen className="h-6 w-6 text-tmMauve" />
          <h2 className="text-2xl text-tmCharcoal">Concierge Lecture</h2>
        </div>
        <div className="mt-4 space-y-3 text-sm text-tmCharcoal/80">
          <p>
            This Taylor-Made lecture distills the signature approach to{' '}
            <span className="font-semibold text-tmCharcoal">{module.title}</span>,
            helping you translate inspiration into an actionable plan. Expect a
                mix of evidence-backed research, soulful storytelling, and prompts that keep overwhelm low.
          </p>
          <p>
            Press play on the guided video inside your member portal, then skim
            the notes below for links, mentor quotes, and brand favorites that
            pair beautifully with this track.
          </p>
        </div>
      </section>

      <section className="rounded-3xl border border-tmBlush/70 bg-tmIvory p-6 shadow-inner">
        <div className="flex items-center gap-3">
          <PenLine className="h-6 w-6 text-tmMauve" />
          <h2 className="text-2xl text-tmCharcoal">Workbook Studio</h2>
        </div>
        <div className="mt-4 grid gap-4 text-sm text-tmCharcoal/80 lg:grid-cols-2">
          <div className="rounded-2xl border border-white/60 bg-white/70 p-4">
            <p className="font-semibold text-tmCharcoal">Milestone Prompts</p>
            <ul className="mt-3 space-y-2 list-outside list-disc pl-5">
              <li>Capture your top three priorities for this module.</li>
              <li>Note anything to discuss with your mentor or pediatric team.</li>
              <li>Bookmark brands, inspo links, or local vendors to explore.</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-white/60 bg-white/70 p-4">
            <p className="font-semibold text-tmCharcoal">Action Board</p>
            <ul className="mt-3 space-y-2 list-outside list-disc pl-5">
              <li>Clarify your budget or timeline for this topic.</li>
              <li>Assign supporting tasks to your partner, doula, or village.</li>
              <li>Drop screenshots or PDFs into the shared TMBC folder.</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-soft">
        <div className="flex items-center gap-3">
          <Sparkles className="h-6 w-6 text-tmMauve" />
          <h2 className="text-2xl text-tmCharcoal">Reflection Prompts</h2>
        </div>
        <p className="mt-4 text-sm text-tmCharcoal/80">
          Use these warm prompts to capture how this lesson aligns with your
          family’s values. Share any aha! moments with your mentor so they can
          keep tailoring your roadmap.
        </p>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {[
            'What feeling do you want this module to evoke for your family?',
            'Where do you still feel friction, and who can relieve it?',
            'What would success look like 4 weeks after completing this lesson?',
          ].map((prompt) => (
            <div
              key={prompt}
              className="rounded-2xl border border-tmBlush/60 bg-tmIvory/80 p-4 text-sm text-tmCharcoal"
            >
              {prompt}
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-white/70 bg-white/90 p-6 shadow-soft">
        <div className="flex items-center gap-3">
          <HeartHandshake className="h-6 w-6 text-tmMauve" />
          <h2 className="text-2xl text-tmCharcoal">Mentor Tips</h2>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-white/60 bg-tmIvory/60 p-4 text-sm text-tmCharcoal/80">
            Assign a quick check-in with your mentor after completing the
            workbook. They’ll help vet purchases, book services, or reset the
            plan if your timeline shifts.
          </div>
          <div className="rounded-2xl border border-white/60 bg-tmIvory/60 p-4 text-sm text-tmCharcoal/80">
            Tag any urgent blockers as “concierge priority” in messages so the
            team can jump in with templates, vendor intros, or calming pep talks.
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-tmMauve/30 bg-gradient-to-r from-tmMauve to-tmBlush px-6 py-8 text-white shadow-soft">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.5em]">
              Progress checkpoint
            </p>
            <h3 className="mt-2 text-2xl">
              Ready to mark “{module.title}” complete?
            </h3>
            <p className="mt-2 text-sm text-white/90">
              Log your status, share your workbook notes, and we’ll unlock the
              next suggested module in your {module.track.toLowerCase()} track.
            </p>
          </div>
          <div className="flex flex-col items-start gap-3 md:items-end">
            <button className="inline-flex items-center gap-2 rounded-full bg-white/90 px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-tmMauve transition hover:bg-white">
              <CheckCircle2 className="h-4 w-4" />
              Mark Complete
            </button>
            <button className="text-sm font-semibold text-white/90 underline">
              Message my mentor
            </button>
          </div>
        </div>
      </section>
    </ModuleLayout>
  );
};

export const generateStaticParams = () =>
  academyModules.map((module) => ({ moduleId: module.id }));

export default ModulePage;
