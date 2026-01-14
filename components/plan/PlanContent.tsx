type Section = {
  key: string;
  title: string;
  summary: string;
};

type PlanContentProps = {
  section: Section | undefined;
};

const placeholderDecision = [
  "Decision state placeholder — this section awaits mentor attention.",
  "No flags yet — the plan stays calm until you are ready.",
];

export default function PlanContent({ section }: PlanContentProps) {
  const decisionCopy = section ? placeholderDecision[0] : placeholderDecision[1];
  return (
    <article className="space-y-6 rounded-[32px] border border-[#E3C6D4] bg-white/90 p-6 shadow-sm">
      <header className="space-y-2">
        <p className="text-[0.65rem] uppercase tracking-[0.35em] text-[#C8A1B4]">Section</p>
        <h2 className="text-2xl font-semibold text-[#3E2F35]">{section?.title ?? "Plan section"}</h2>
        <p className="text-sm text-[#3E2F35]/70">{section?.summary ?? "TODO: Describe this section"}</p>
      </header>
      <div className="space-y-4 rounded-[24px] border border-[#EAE2E8] bg-[#FFF9F5] p-4 text-sm text-[#3E2F35]/80">
        <p className="text-[0.65rem] uppercase tracking-[0.3em] text-[#C8A1B4]">Member notes</p>
        <p>This is a placeholder note area — nothing is saved yet. TODO: Persist notes per section.</p>
      </div>
      <div className="space-y-4 rounded-[24px] border border-[#EAE2E8] bg-[#FFF9F5] p-4 text-sm text-[#3E2F35]/80">
        <p className="text-[0.65rem] uppercase tracking-[0.3em] text-[#C8A1B4]">Mentor notes</p>
        <p>The mentor chair is empty for now. TODO: Support mentor comments (read-only here).</p>
      </div>
      <div className="space-y-2 rounded-[24px] border border-[#EAE2E8] bg-white/95 p-4 text-sm text-[#3E2F35]/80">
        <p className="text-[0.65rem] uppercase tracking-[0.3em] text-[#C8A1B4]">Decision state</p>
        <p>{decisionCopy}</p>
        <p className="text-[0.6rem] uppercase tracking-[0.3em] text-[#C8A1B4]">TODO: Bind to PlanSection model</p>
      </div>
      <p className="text-xs uppercase tracking-[0.4em] text-[#C8A1B4]">
        This is a guide — not a checklist you must complete. You don’t need everything. Timing matters more than buying.
      </p>
      {/* TODO: Centralize this copy when the plan copy system is ready */}
    </article>
  );
}
