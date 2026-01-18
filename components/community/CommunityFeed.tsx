"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { Role } from "@prisma/client";
import type {
  CommunityPostDetail,
  CommunityReplyDetail,
  CommunityRoomDetail,
} from "@/lib/services/server/community.service";
import CommunityPostCard from "@/components/community/CommunityPostCard";
import CreatePostComposer from "@/components/community/CreatePostComposer";

type CommunityFeedProps = {
  room: CommunityRoomDetail;
  userRole: Role;
  isLoading?: boolean;
  error?: string | null;
};

export default function CommunityFeed({ room, userRole, isLoading, error }: CommunityFeedProps) {
  const [posts, setPosts] = useState<CommunityPostDetail[]>(room.posts);

  useEffect(() => {
    setPosts(room.posts);
  }, [room.id, room.posts]);

  const pinnedPosts = useMemo(
    () => posts.filter((post) => post.isPinned || post.isAnnouncement),
    [posts],
  );
  const regularPosts = useMemo(
    () => posts.filter((post) => !post.isPinned && !post.isAnnouncement),
    [posts],
  );

  const handlePostSuccess = useCallback((post: CommunityPostDetail) => {
    setPosts((previous) => [...previous, post]);
  }, []);

  const handleReplySuccess = useCallback(
    (postId: string, reply: CommunityReplyDetail) => {
      setPosts((previous) =>
        previous.map((post) =>
          post.id === postId ? { ...post, replies: [...post.replies, reply] } : post,
        ),
      );
    },
    [],
  );

  return (
    <section className="space-y-6">
      <header className="space-y-2 rounded-[2.5rem] border border-[#EAD4D8] bg-gradient-to-br from-[#FFF8F6] via-[#FBE9EE] to-[#F0D4D9]/70 p-6 shadow-[0_25px_70px_rgba(192,153,170,0.3)]">
        <div className="space-y-1">
          <p className="text-[0.65rem] uppercase tracking-[0.5em] text-[#3E2F35]/70">
            Community · Calm circle
          </p>
          <h2 className="text-3xl font-serif text-[#3E2F35]">{room.name}</h2>
          {room.description && (
            <p className="text-sm text-[#3E2F35]/70">{room.description}</p>
          )}
        </div>
        <p className="text-[0.65rem] uppercase tracking-[0.35em] text-[#A4556A]">
          {room.moduleTitle ? `${room.moduleTitle} · Module discussion` : "Shared room for members"}
        </p>
      </header>

      {isLoading ? (
        <div className="rounded-[2rem] border border-[#E3C6D4] bg-white/90 px-5 py-6 text-sm text-[#3E2F35]/70 shadow-[0_18px_60px_rgba(180,143,164,0.2)]">
          <p>Opening the room…</p>
        </div>
      ) : error ? (
        <div className="rounded-[2rem] border border-[#E3C6D4] bg-white/90 px-5 py-4 text-sm text-[#C1273E] shadow-sm">
          <p>{error}</p>
        </div>
      ) : (
        <>
          <CreatePostComposer
            roomId={room.id}
            userRole={userRole}
            onSuccess={handlePostSuccess}
          />

          {pinnedPosts.length > 0 && (
            <section className="space-y-4">
              <p className="text-[0.65rem] uppercase tracking-[0.35em] text-[#C8A1B4]">
                Highlights
              </p>
              <div className="space-y-4">
                {pinnedPosts.map((post) => (
                  <CommunityPostCard key={post.id} post={post} onReply={handleReplySuccess} />
                ))}
              </div>
            </section>
          )}

          {regularPosts.length > 0 ? (
            <section className="space-y-4">
              <p className="text-[0.65rem] uppercase tracking-[0.35em] text-[#C8A1B4]">
                Community space
              </p>
              <div className="space-y-4">
                {regularPosts.map((post) => (
                  <CommunityPostCard key={post.id} post={post} onReply={handleReplySuccess} />
                ))}
              </div>
            </section>
          ) : (
            <section className="rounded-[2rem] border border-[#E3C6D4] bg-white/90 px-5 py-8 text-sm text-[#3E2F35]/70 shadow-sm">
              <p>This room is quiet right now. Hold space, read through reflections, or add your first note.</p>
            </section>
          )}
        </>
      )}
    </section>
  );
}
