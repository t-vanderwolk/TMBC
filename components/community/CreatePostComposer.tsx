"use client";

import { useState } from "react";
import type { Role } from "@prisma/client";
import type { CommunityPostDetail } from "@/lib/services/server/community.service";
import { createCommunityPostAction } from "@/app/dashboard/member/community/actions";

type CreatePostComposerProps = {
  roomId: string;
  userRole: Role;
  onSuccess: (post: CommunityPostDetail) => void;
};

export default function CreatePostComposer({ roomId, userRole, onSuccess }: CreatePostComposerProps) {
  const [content, setContent] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePost = async () => {
    const trimmed = content.trim();
    if (!trimmed) {
      setError("Softly share a thought before posting.");
      return;
    }

    setIsSubmitting(true);
    setError("");
    try {
      const post = await createCommunityPostAction({
        roomId,
        content: trimmed,
        anonymous: isAnonymous,
      });
      onSuccess(post);
      setContent("");
      setIsAnonymous(false);
    } catch (submissionError) {
      const message =
        submissionError instanceof Error
          ? submissionError.message
          : "Something interrupted your post. Try again soon.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="space-y-4 rounded-[2rem] border border-[#E3C6D4] bg-white/90 px-5 py-6 shadow-[0_18px_60px_rgba(180,143,164,0.25)]">
      <div className="space-y-2">
        <p className="text-[0.65rem] uppercase tracking-[0.35em] text-[#C8A1B4]">Start a thread</p>
        <p className="text-sm text-[#3E2F35]/70">
          {userRole === "MEMBER"
            ? "Keep it gentle — take a moment, then share what you are noticing."
            : "Model a calm presence, or simply show up to listen."}
        </p>
      </div>

      <textarea
        value={content}
        onChange={(event) => setContent(event.target.value)}
        rows={4}
        placeholder="Share a gentle observation, question, or small win."
        className="w-full rounded-[1.5rem] border border-[#E3C6D4] bg-[#FFFAF8]/80 px-4 py-3 text-sm text-[#3E2F35] focus:border-[#C8A1B4] focus:outline-none focus:ring-2 focus:ring-[#EAC9D1]"
      />

      <div className="flex flex-wrap items-center justify-between gap-3 text-[0.7rem] uppercase tracking-[0.4em] text-[#A4556A]">
        <label className="inline-flex items-center gap-2 text-[0.65rem] tracking-[0.35em] text-[#3E2F35]/70">
          <input
            type="checkbox"
            checked={isAnonymous}
            onChange={(event) => setIsAnonymous(event.target.checked)}
            className="h-4 w-4 rounded border border-[#E3C6D4] text-[#A4556A]"
          />
          Post anonymously
        </label>
        {error && <span className="text-xs text-red-600">{error}</span>}
        <button
          type="button"
          disabled={isSubmitting}
          onClick={handlePost}
          className="inline-flex items-center justify-center rounded-full bg-[#C8A1B4] px-5 py-2 text-xs font-semibold uppercase tracking-[0.4em] text-white transition hover:bg-[#B98AA5] disabled:opacity-60"
        >
          {isSubmitting ? "Posting…" : "Post into the room"}
        </button>
      </div>
    </section>
  );
}
