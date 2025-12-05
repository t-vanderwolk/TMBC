"use client";

type FlowNavProps = {
  sections: { id: string; label: string }[];
  activeId: string;
  onSectionChange: (id: string) => void;
};

const FlowNav = ({ sections, activeId, onSectionChange }: FlowNavProps) => {
  return (
    <nav className="flex flex-wrap items-center gap-3 rounded-[32px] border border-[var(--tmbc-mauve)]/40 bg-white/80 p-3 shadow-[0_15px_40px_rgba(199,166,199,0.2)]">
      {sections.map((section) => (
        <button
          key={section.id}
          onClick={() => onSectionChange(section.id)}
          className={`rounded-full px-4 py-2 text-[0.6rem] uppercase tracking-[0.35em] transition ${
            activeId === section.id
              ? "border border-[var(--tmbc-mauve)] bg-[var(--tmbc-mauve)]/10 text-[var(--tmbc-mauve)]"
              : "border border-[var(--tmbc-charcoal)]/15 text-[var(--tmbc-charcoal)]/70"
          }`}
        >
          {section.label}
        </button>
      ))}
    </nav>
  );
};

export default FlowNav;
