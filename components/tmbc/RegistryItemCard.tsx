import StyledButton from "@/components/tmbc/StyledButton";
import MentorNoteDrawer from "@/components/tmbc/MentorNoteDrawer";

export type RegistryItemCardProps = {
  image: string;
  title: string;
  price: string;
  reason: string;
  affiliateUrl?: string;
  notes?: string;
};

export default function RegistryItemCard({
  image,
  title,
  price,
  reason,
  affiliateUrl,
  notes,
}: RegistryItemCardProps) {
  return (
    <article className="grid gap-3 rounded-[2rem] border border-[#E3C6D4] bg-white/90 p-4 shadow-[0_20px_60px_rgba(199,166,199,0.2)] md:grid-cols-[150px,1fr]">
      <div className="h-32 w-full overflow-hidden rounded-[1.5rem] bg-[#F8E8EF]">
        <img src={image} alt={title} className="h-full w-full object-cover" />
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-[#3E2F35]">{title}</h3>
          <span className="text-sm font-semibold text-[#B98AA5]">{price}</span>
        </div>
        <p className="text-xs uppercase tracking-[0.35em] text-[#C7A6C9]">Why you’re seeing this</p>
        <p className="text-sm text-[#3E2F35]/75">{reason}</p>
        <div className="flex flex-wrap gap-3 pt-2">
          <StyledButton variant="ghost">Mentor notes</StyledButton>
          {affiliateUrl && (
            <a
              href={affiliateUrl}
              target="_blank"
              rel="noreferrer"
              className="text-xs font-semibold uppercase tracking-[0.4em] text-[#C7A6C9]"
            >
              Add to Registry
            </a>
          )}
        </div>
        {notes && <MentorNoteDrawer notes={notes} />}
      </div>
    </article>
  );
}
