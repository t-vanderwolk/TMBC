import type { ReactNode } from "react";

export type SupportTileProps = {
  title: string;
  description: string;
  tag?: string;
  icon?: ReactNode;
};

export default function SupportTile({ title, description, tag, icon }: SupportTileProps) {
  return (
    <article className="flex flex-col justify-between rounded-[2rem] border border-[#E3C6D4] bg-gradient-to-br from-[#fff7f2] to-[#f6e9e6] p-5 text-sm text-[#3E2F35] shadow-[0_18px_60px_rgba(180,143,164,0.2)]">
      <div className="flex items-center justify-between text-xs uppercase tracking-[0.4em] text-[#C7A6C9]">
        <span>{title}</span>
        {icon}
      </div>
      <p className="mt-3 text-sm text-[#3E2F35]/80">{description}</p>
      {tag && <span className="mt-4 text-[0.65rem] text-[#B98AA5]">{tag}</span>}
    </article>
  );
}
