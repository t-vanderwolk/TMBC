"use client";

import type { Role } from "@prisma/client";
import type {
  CommunityPostDetail,
  CommunityReplyDetail,
} from "@/lib/services/server/community.service";
import CommunityReplyThread from "@/components/community/CommunityReplyThread";

type CommunityPostCardProps = {
  post: CommunityPostDetail;
  onReply: (postId: string, reply: CommunityReplyDetail) => void;
};

const roleBadgeLabel = (role: Role) => {
  if (role === "MENTOR") return "Mentor";
  if (role === "ADMIN") return "Admin";
  return "Member";
};

export default function CommunityPostCard({ post, onReply }: CommunityPostCardProps) {
  const highlightLabel = post.isPinned
    ? "Pinned"
    : post.isAnnouncement
      ? "Announcement"
      : post.isMentorPrompt
        ? "Mentor prompt"
        : undefined;
  const author = post.isAnonymous ? "Anonymous" : post.authorName;
  const timestamp = new Date(post.createdAt).toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });
  const backgroundClass = post.isPinned
    ? "border-[#E3C6D4] bg-[#F7E3E8]"
    : "border-[#F3DEE5] bg-white/90";

  const handleReply = (reply: CommunityReplyDetail) => {
    onReply(post.id, reply);
  };

  return (
    <article
      className={`space-y-4 rounded-[2rem] border px-5 py-4 shadow-[0_15px_50px_rgba(180,143,164,0.2)] ${backgroundClass}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <p className="text-[0.65rem] uppercase tracking-[0.4em] text-[#C8A1B4]">
              {highlightLabel ?? (post.authorRole !== "MEMBER" ? "Mentor" : "Member")}
            </p>
            {post.authorRole !== "MEMBER" && (
              <span className="rounded-full border border-[#E3C6D4] px-3 py-1 text-[0.55rem] uppercase tracking-[0.4em] text-[#A4556A]">
                {roleBadgeLabel(post.authorRole)}
              </span>
            )}
          </div>
          <p className="text-lg font-semibold text-[#3E2F35]">{author}</p>
        </div>
        <p className="text-[0.6rem] uppercase tracking-[0.3em] text-[#3E2F35]/60">{timestamp}</p>
      </div>

      <p className="text-sm text-[#3E2F35]/80 leading-relaxed">{post.content}</p>

      <CommunityReplyThread postId={post.id} replies={post.replies} onReply={handleReply} />
    </article>
  );
}
