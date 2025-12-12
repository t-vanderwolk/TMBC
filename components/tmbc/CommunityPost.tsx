import type { ReactNode } from "react";

export type CommunityPostProps = {
  author: string;
  content: string;
  timestamp: string;
  tags?: string[];
  highlight?: ReactNode;
};

export default function CommunityPost({ author, content, timestamp, tags, highlight }: CommunityPostProps) {
  return (
    <article className="space-y-2 rounded-[2rem] border border-[#E3C6D4] bg-gradient-to-br from-[#fff7f2] to-[#f6e9e6] p-5 shadow-[0_18px_60px_rgba(180,143,164,0.2)]">
      <div className="flex items-center justify-between text-xs uppercase tracking-[0.4em] text-[#C7A6C9]">
        <span>{author}</span>
        <span>{timestamp}</span>
      </div>
      <p className="text-sm text-[#3E2F35]/80">{content}</p>
      {tags && (
        <div className="flex flex-wrap gap-2 text-[0.6rem] uppercase tracking-[0.3em] text-[#3E2F35]/60">
          {tags.map((tag) => (
            <span key={tag} className="rounded-full border border-[#E3C6D4] px-3 py-1 bg-white/70">
              {tag}
            </span>
          ))}
        </div>
      )}
      {highlight}
    </article>
  );
}
