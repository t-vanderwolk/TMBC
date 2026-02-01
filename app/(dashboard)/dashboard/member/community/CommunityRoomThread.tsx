"use client";

import Link from "next/link";
import type { WorkbookSection } from "@prisma/client";
import { useMemo, useState } from "react";

import { createCommunityPost, createCommunityReply } from "@/lib/api/community";
import type { CommunityRoomDetail } from "@/lib/services/server/community.service";
import type { Role } from "@prisma/client";

type CommunityRoomThreadProps = {
  initialRoom: CommunityRoomDetail;
  userRole: Role;
  contextLabel?: string;
};

const extractApiError = (error: unknown) => {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  if (typeof error === "object" && error !== null) {
    const typed = error as Record<string, unknown>;
    if (typeof typed.message === "string") return typed.message;
    if (typed.response && typeof typed.response === "object") {
      const nested = typed.response as Record<string, unknown>;
      if (nested.data && typeof nested.data === "object") {
        const data = nested.data as Record<string, unknown>;
        if (typeof data.error === "string") return data.error;
      }
    }
  }
  return "Something went wrong while updating the room.";
};

const isMentor = (role: Role) => role === "MENTOR" || role === "ADMIN";

const sectionLabels: Record<WorkbookSection, string> = {
  REFLECT: "Reflections",
  APPLY: "Applied changes",
  INTEGRATE: "Integration notes",
};

export default function CommunityRoomThread({ initialRoom, userRole, contextLabel }: CommunityRoomThreadProps) {
  const [posts, setPosts] = useState(initialRoom.posts);
  const [composerValue, setComposerValue] = useState("");
  const [composerError, setComposerError] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({});
  const [replyErrors, setReplyErrors] = useState<Record<string, string>>({});
  const [replyLoading, setReplyLoading] = useState<Record<string, boolean>>({});
  const [pinPost, setPinPost] = useState(false);
  const [announcePost, setAnnouncePost] = useState(false);

  const mentorPresence = useMemo(
    () =>
      posts.some(
        (post) =>
          post.authorRole !== "MEMBER" || post.replies.some((reply) => reply.authorRole !== "MEMBER"),
      ),
    [posts],
  );

  const pinnedPosts = posts.filter((post) => post.isMentorPrompt);
  const regularPosts = posts.filter((post) => !post.isMentorPrompt);
  const sectionOrder: WorkbookSection[] = ["REFLECT", "APPLY", "INTEGRATE"];
  const sectionGroups = sectionOrder.map((section) => ({
    section,
    label: sectionLabels[section],
    posts: regularPosts.filter((post) => post.sourceSection === section),
  }));
  const communityPosts = regularPosts.filter((post) => !post.sourceSection);

  const handlePost = async () => {
    const trimmed = composerValue.trim();
    if (!trimmed) {
      setComposerError("Share a kind, honest line before posting.");
      return;
    }

    setComposerError("");
    setIsPosting(true);
    try {
      const { data } = await createCommunityPost({
        roomId: initialRoom.id,
        content: trimmed,
        isPinned: pinPost,
        isAnnouncement: announcePost,
      });
      setPosts((prev) => [...prev, data.post]);
      setComposerValue("");
      setPinPost(false);
      setAnnouncePost(false);
    } catch (error) {
      setComposerError(extractApiError(error));
    } finally {
      setIsPosting(false);
    }
  };

  const handleReply = async (postId: string) => {
    const currentDraft = replyDrafts[postId]?.trim() ?? "";
    if (!currentDraft) {
      setReplyErrors((prev) => ({ ...prev, [postId]: "Write a reply before sending." }));
      return;
    }
    setReplyErrors((prev) => ({ ...prev, [postId]: "" }));
    setReplyLoading((prev) => ({ ...prev, [postId]: true }));

    try {
      const { data } = await createCommunityReply({
        postId,
        content: currentDraft,
      });
      setPosts((prev) =>
        prev.map((post) =>
          post.id === postId ? { ...post, replies: [...post.replies, data.reply] } : post,
        ),
      );
      setReplyDrafts((prev) => ({ ...prev, [postId]: "" }));
    } catch (error) {
      setReplyErrors((prev) => ({ ...prev, [postId]: extractApiError(error) }));
    } finally {
      setReplyLoading((prev) => ({ ...prev, [postId]: false }));
    }
  };

  const renderPostCard = (post: CommunityRoomDetail["posts"][number], label?: string) => {
    const timestamp = new Date(post.createdAt).toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    });
    const authorLabel = post.isAnonymous ? "Anonymous reflection" : post.authorName;

    return (
      <article
        key={post.id}
        className={`space-y-4 rounded-[2rem] border border-[#F3DEE5] p-5 shadow-[0_15px_50px_rgba(180,143,164,0.2)] ${
          post.isMentorPrompt ? "bg-[#F7E3E8]" : "bg-white/90"
        }`}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="space-y-1">
            <p className="text-[0.7rem] uppercase tracking-[0.4em] text-[#C8A1B4]">
              {label ?? (post.authorRole !== "MEMBER" ? "Mentor" : "Member")}
            </p>
            <p className="text-lg font-semibold text-[#3E2F35]">{authorLabel}</p>
          </div>
          <p className="text-[0.6rem] uppercase tracking-[0.3em] text-[#3E2F35]/60">{timestamp}</p>
        </div>
        <p className="text-sm text-[#3E2F35]/80">{post.content}</p>
        {post.sourcePrompt && (
          <p className="text-xs uppercase tracking-[0.3em] text-[#3E2F35]/60">{post.sourcePrompt}</p>
        )}

        <div className="space-y-3 rounded-2xl border border-[#E3C6D4] bg-[#FFFAF8]/80 p-4">
          <p className="text-[0.65rem] uppercase tracking-[0.4em] text-[#C8A1B4]">Replies</p>
          {post.replies.length === 0 ? (
            <p className="text-xs italic text-[#3E2F35]/60">No replies yet.</p>
          ) : (
            <div className="space-y-3">
              {post.replies.map((reply) => (
                <div key={reply.id} className="rounded-xl bg-white/80 px-3 py-2 text-sm shadow-sm">
                  <p className="text-[0.6rem] uppercase tracking-[0.3em] text-[#C8A1B4]">
                    {reply.authorRole !== "MEMBER" ? "Mentor" : "Member"} ·{" "}
                    {new Date(reply.createdAt).toLocaleTimeString(undefined, {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                  <p className="text-[#3E2F35]/80">{reply.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <textarea
            value={replyDrafts[post.id] ?? ""}
            onChange={(event) =>
              setReplyDrafts((prev) => ({ ...prev, [post.id]: event.target.value }))
            }
            className="w-full rounded-[1.35rem] border border-[#E3C6D4] bg-[#FFFAF8]/80 px-3 py-2 text-sm text-[#3E2F35] focus:border-[#C8A1B4] focus:outline-none focus:ring-2 focus:ring-[#EAC9D1]"
            rows={2}
            placeholder="Leave a supportive reply."
          />
          {replyErrors[post.id] && (
            <p className="text-xs text-red-600">{replyErrors[post.id]}</p>
          )}
          <div className="flex justify-end">
            <button
              type="button"
              disabled={replyLoading[post.id]}
              onClick={() => handleReply(post.id)}
              className="inline-flex items-center justify-center rounded-full bg-[#C8A1B4] px-4 py-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.4em] text-white transition hover:bg-[#B98AA5] disabled:opacity-60"
            >
              {replyLoading[post.id] ? "Sending…" : "Reply"}
            </button>
          </div>
        </div>
      </article>
    );
  };

  return (
    <section className="space-y-8">
      <header className="space-y-3 rounded-[2.5rem] border border-[#EAD4D8] bg-gradient-to-br from-[#FFF8F6] via-[#FBE9EE] to-[#F0D4D9]/70 p-6 shadow-[0_25px_70px_rgba(192,153,170,0.3)]">
        <div className="flex flex-col gap-2">
          <p className="text-[0.65rem] uppercase tracking-[0.5em] text-[#3E2F35]/70">
            Community · Calm circle
          </p>
          <h1 className="font-serif text-3xl text-[#3E2F35]">{initialRoom.name}</h1>
          {initialRoom.description ? (
            <p className="text-sm text-[#3E2F35]/70">{initialRoom.description}</p>
          ) : null}
          {contextLabel ? (
            <p className="text-[0.65rem] uppercase tracking-[0.4em] text-[#A4556A]">{contextLabel}</p>
          ) : null}
        </div>
        <div className="flex flex-wrap gap-3 text-[0.65rem] uppercase tracking-[0.4em] text-[#3E2F35]/70">
          <span>Mentor presence · {mentorPresence ? "Present" : "Quiet watchers"}</span>
          <span>Chronological only</span>
          <Link href="/dashboard/member/community" className="text-[#A4556A] underline decoration-dashed">
            Return to rooms
          </Link>
        </div>
      </header>

      <section className="space-y-3 rounded-[2.5rem] border border-[#E3C6D4] bg-white/90 p-5 shadow-[0_18px_60px_rgba(180,143,164,0.25)]">
        <p className="text-[0.65rem] uppercase tracking-[0.35em] text-[#C8A1B4]">Start a thread</p>
        <textarea
          value={composerValue}
          onChange={(event) => setComposerValue(event.target.value)}
          className="mt-3 w-full rounded-[1.5rem] border border-[#E3C6D4] bg-[#FFFAF8]/80 px-4 py-3 text-sm text-[#3E2F35] focus:border-[#C8A1B4] focus:outline-none focus:ring-2 focus:ring-[#EAC9D1]"
          rows={4}
          placeholder="Share what you are feeling, noticing, or planning."
        />
        {composerError ? <p className="text-xs text-red-600">{composerError}</p> : null}

        {isMentor(userRole) ? (
          <div className="flex flex-wrap gap-4 text-[0.65rem] uppercase tracking-[0.4em] text-[#3E2F35]/70">
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={announcePost}
                onChange={(event) => setAnnouncePost(event.target.checked)}
                className="h-4 w-4 rounded border border-[#E3C6D4] text-[#A4556A]"
              />
              announce
            </label>
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={pinPost}
                onChange={(event) => setPinPost(event.target.checked)}
                className="h-4 w-4 rounded border border-[#E3C6D4] text-[#A4556A]"
              />
              pin post
            </label>
          </div>
        ) : null}

        <div className="mt-4 flex justify-end">
          <button
            type="button"
            disabled={isPosting}
            onClick={handlePost}
            className="inline-flex items-center justify-center rounded-full bg-[#C8A1B4] px-5 py-2 text-xs font-semibold uppercase tracking-[0.4em] text-white transition hover:bg-[#B98AA5] disabled:opacity-60"
          >
            {isPosting ? "Posting…" : "Post into the room"}
          </button>
        </div>
      </section>

      {pinnedPosts.length > 0 ? (
        <section className="space-y-4">
          <p className="text-[0.65rem] uppercase tracking-[0.4em] text-[#C8A1B4]">Pinned prompts</p>
          <div className="space-y-4">
            {pinnedPosts.map((post) => renderPostCard(post, "Mentor prompt"))}
          </div>
        </section>
      ) : null}

      {sectionGroups.some((group) => group.posts.length > 0) && (
        <section className="space-y-6">
          {sectionGroups.map(
            (group) =>
              group.posts.length > 0 && (
                <div key={group.section} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[0.65rem] uppercase tracking-[0.4em] text-[#C8A1B4]">
                        {group.label}
                      </p>
                      <h3 className="text-lg font-semibold text-[#3E2F35]">{group.label}</h3>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {group.posts.map((post) => renderPostCard(post, group.label))}
                  </div>
                </div>
              ),
          )}
        </section>
      )}

      {communityPosts.length > 0 ? (
        <section className="space-y-3">
          <p className="text-[0.65rem] uppercase tracking-[0.4em] text-[#C8A1B4]">Community space</p>
          <div className="space-y-4">
            {communityPosts.map((post) =>
              renderPostCard(post, post.isAnnouncement ? "Announcement" : "Member note"),
            )}
          </div>
        </section>
      ) : null}
    </section>
  );
}
