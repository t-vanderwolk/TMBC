'use client';

type WorkbookTemplate = {
  id: string;
  title: string;
  notes: string;
  checklist: string[];
};

type WorkbookTemplatesProps = {
  onApply: (template: WorkbookTemplate) => void;
};

const templates: WorkbookTemplate[] = [
  {
    id: 'cozy-nursery',
    title: 'Cozy Nursery Ritual',
    notes: 'Soft textiles, gentle lighting, and a touch of blush to welcome calm.',
    checklist: ['Soft light', 'Fabric swatch', 'Sound machine placement'],
  },
  {
    id: 'modern-minimal',
    title: 'Modern Minimal Calm',
    notes: 'Clean lines, quiet palettes, and curated storage for daily flow.',
    checklist: ['Hidden storage', 'Declutter décor', 'Tape lighting plan'],
  },
  {
    id: 'postpartum-rest',
    title: 'Postpartum Rest Set',
    notes: 'Layered textures, scent ritual, and daily micro-rest prompts.',
    checklist: ['Scent ritual', 'Nest hydration station', 'Micro-rest reminder'],
  },
];

export default function WorkbookTemplates({ onApply }: WorkbookTemplatesProps) {
  return (
    <div className="space-y-3 rounded-[32px] border border-[var(--tm-blush)] bg-white/90 p-5 shadow-[0_30px_60px_rgba(134,75,95,0.12)]">
      <div className="flex items-center justify-between">
        <p className="text-[0.65rem] uppercase tracking-[0.45em] text-[var(--tm-mauve)]">Templates</p>
        <span className="text-xs text-[var(--tm-deep-mauve)]">Curated by TMBC</span>
      </div>
      <div className="space-y-4">
        {templates.map((template) => (
          <article
            key={template.id}
            className="tm-scale rounded-2xl border border-[var(--tm-blush)] bg-[var(--tm-ivory)]/80 p-4 shadow-lg transition hover:border-[var(--tm-gold)]"
          >
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold uppercase tracking-[0.4em] text-[var(--tm-deep-mauve)]">
                {template.title}
              </h4>
              <button
                type="button"
                onClick={() => onApply(template)}
                className="tm-btn-primary text-[0.6rem] tracking-[0.35em]"
              >
                Apply template
              </button>
            </div>
            <p className="mt-2 text-sm text-[var(--tm-charcoal)]/80">{template.notes}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
