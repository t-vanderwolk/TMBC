"use client";

import { useState } from "react";
import type { CommunityReplyDetail } from "@/lib/services/server/community.service";
import { createCommunityReplyAction } from "@/app/(dashboard)/dashboard/member/community/actions";

type CommunityReplyThreadProps = {
  postId: string;
  replies: CommunityReplyDetail[];
  onReply: (reply: CommunityReplyDetail) => void;
};

export default function CommunityReplyThread({ postId, replies, onReply }: CommunityReplyThreadProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleReplies = () => {
    setIsExpanded((prev) => !prev);
  };

  const handleSubmit = async () => {
    const trimmed = draft.trim();
    if (!trimmed) {
      setError("Add something thoughtful before sending.");
      return;
    }

    setIsSubmitting(true);
    setError("");
    try {
      const reply = await createCommunityReplyAction({ postId, content: trimmed });
      onReply(reply);
      setDraft("");
      setIsExpanded(true);
    } catch (submissionError) {
      const message =
        submissionError instanceof Error
          ? submissionError.message
          : "Unable to submit your reply. Please try again.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-3 rounded-[1.75rem] border border-[#E3C6D4] bg-[#FFFAF8]/80 px-4 py-3 text-sm text-[#3E2F35] shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-[0.65rem] uppercase tracking-[0.35em] text-[#C8A1B4]">
          {replies.length ? `${replies.length} replies` : "No replies yet"}
        </p>
        <button
          type="button"
          onClick={toggleReplies}
          className="text-[0.65rem] uppercase tracking-[0.4em] text-[#A4556A] transition hover:text-[#7c4564]"
        >
          {isExpanded ? "Hide" : "View"}
        </button>
      </div>

      {isExpanded && (
        <div className="space-y-3 pl-3">
          {replies.length === 0 ? (
            <p className="text-xs italic text-[#3E2F35]/70">Be the first to cheer on this post.</p>
          ) : (
            replies.map((reply) => (
              <div
                key={reply.id}
                className="space-y-1 rounded-2xl border border-[#F1D5DA] bg-white/90 p-3"
              >
                <p className="text-[0.6rem] uppercase tracking-[0.4em] text-[#C8A1B4]">
                  {reply.authorRole !== "MEMBER" ? "Mentor" : "Member"} ·{" "}
                  {new Date(reply.createdAt).toLocaleTimeString(undefined, {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
                <p className="text-sm text-[#3E2F35]/80">{reply.content}</p>
              </div>
            ))
          )}

          <div className="space-y-2">
            <textarea
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              rows={2}
              placeholder="Leave a kind reply."
              className="w-full rounded-[1.35rem] border border-[#E3C6D4] bg-[#FFF8F6]/80 px-3 py-2 text-sm text-[#3E2F35] focus:border-[#C8A1B4] focus:outline-none focus:ring-2 focus:ring-[#EAC9D1]"
            />
            {error && <p className="text-xs text-red-600">{error}</p>}
            <div className="flex justify-end">
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleSubmit}
                className="inline-flex items-center justify-center rounded-full bg-[#C8A1B4] px-4 py-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.4em] text-white transition hover:bg-[#B98AA5] disabled:opacity-60"
              >
                {isSubmitting ? "Sending…" : "Reply"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
