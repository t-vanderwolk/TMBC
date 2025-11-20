'use client';

type WorkbookPromptProps = {
  prompts: { label: string; text: string }[];
};

const WorkbookPrompt = ({ prompts }: WorkbookPromptProps) => (
  <section className="tm-editorial-card tm-paper-texture space-y-4">
    <div className="flex items-center justify-between gap-3">
      <p className="text-[0.65rem] uppercase tracking-[0.4em] text-[var(--tm-deep-mauve)]">Guided prompts</p>
      <span className="text-[0.65rem] uppercase tracking-[0.4em] text-[var(--tm-mauve)]">Auto-save on</span>
    </div>
    <div className="space-y-4">
      {prompts.map((prompt, index) => (
        <article
          key={`${prompt.label}-${index}`}
          className="rounded-[28px] border border-[var(--tm-blush)] bg-white/80 p-4 text-sm text-[var(--tm-charcoal)]/80 shadow-[0_18px_40px_rgba(134,75,95,0.12)]"
        >
          <p className="text-[0.65rem] uppercase tracking-[0.35em] text-[var(--tm-mauve)]">{prompt.label}</p>
          <p className="mt-2 text-[0.95rem] text-[var(--tm-deep-mauve)] leading-relaxed">{prompt.text}</p>
        </article>
      ))}
    </div>
  </section>
);

export default WorkbookPrompt;
