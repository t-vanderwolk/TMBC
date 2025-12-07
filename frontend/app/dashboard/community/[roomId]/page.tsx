"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { createCommunityPost, getCommunityRoom } from "@/lib/api/community";

type CommunityPost = {
  id: string;
  author: string;
  content: string;
  createdAt: string;
  isMentor?: boolean;
};

type CommunityRoomDetail = {
  id: string;
  name: string;
  description?: string;
  posts: CommunityPost[];
  topics?: string[];
};

type RoomPageProps = {
  params: {
    roomId: string;
  };
};

export default function CommunityRoomPage({ params }: RoomPageProps) {
  const router = useRouter();
  const [room, setRoom] = useState<CommunityRoomDetail | null>(null);
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [composerError, setComposerError] = useState("");
  const [composerValue, setComposerValue] = useState("");
  const [posting, setPosting] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("tm_user");
    if (!stored) {
      router.replace("/login");
      setAuthChecked(true);
      return;
    }

    try {
      const parsed = JSON.parse(stored);
      setToken(parsed?.token ?? null);
    } catch {
      localStorage.removeItem("tm_user");
      router.replace("/login");
    } finally {
      setAuthChecked(true);
    }
  }, [router]);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    setError("");
    getCommunityRoom(params.roomId, token)
      .then((response) => {
        setRoom(response.data);
        setPosts(response.data.posts || []);
      })
      .catch(() => {
        setError("Unable to open this room right now.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [params.roomId, token]);

  const renderPosts = useMemo(() => {
    return [...posts].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [posts]);

  const handlePost = async () => {
    if (!composerValue.trim()) {
      setComposerError("Share a thought before sending.");
      return;
    }
    if (!token) {
      router.replace("/login");
      return;
    }

    setComposerError("");
    setPosting(true);
    const tempId = `temp-${Date.now()}`;
    const optimistic: CommunityPost = {
      id: tempId,
      author: "You",
      content: composerValue.trim(),
      createdAt: new Date().toISOString(),
    };
    setPosts((prev) => [optimistic, ...prev]);
    setComposerValue("");

    try {
      const res = await createCommunityPost(params.roomId, optimistic.content, token);
      setPosts((prev) => [res.data, ...prev.filter((post) => post.id !== tempId)]);
    } catch {
      setComposerError("Unable to post right now. Try again soon.");
      setPosts((prev) => prev.filter((post) => post.id !== tempId));
    } finally {
      setPosting(false);
    }
  };

  if (!authChecked) {
    return (
      <div className="flex flex-1 items-center justify-center px-4 py-20 text-sm uppercase tracking-[0.5em] text-[#C8A1B4]">
        Opening the circle…
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center px-4 py-20 text-sm uppercase tracking-[0.5em] text-[#C8A1B4]">
        Refreshing the lounge…
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4 py-10 text-sm text-[#C8A1B4]">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <main className="space-y-8 px-4 py-8 text-[#3E2F35] sm:px-6">
      <section className="rounded-[2.5rem] border border-[#EAD4D8] bg-gradient-to-br from-[#FFF8F6] via-[#FBE9EE] to-[#F0D4D9]/70 p-6 shadow-[0_25px_70px_rgba(192,153,170,0.3)]">
        <p className="text-[0.65rem] uppercase tracking-[0.5em] text-[#3E2F35]/70">Community · Room</p>
        <h1 className="mt-2 font-serif text-3xl text-[#3E2F35]">{room?.name}</h1>
        <p className="mt-2 text-sm text-[#3E2F35]/70">{room?.description}</p>
        {room?.topics?.length ? (
          <div className="mt-4 flex flex-wrap gap-2 text-[0.65rem] uppercase tracking-[0.3em] text-[#3E2F35]/60">
            {room.topics.map((topic) => (
              <span key={topic} className="rounded-full border border-[#E3C6D4] px-3 py-1 bg-white/70">
                {topic}
              </span>
            ))}
          </div>
        ) : null}
      </section>

      <section className="space-y-4">
        <div className="rounded-[2rem] border border-[#E3C6D4] bg-white/90 p-5 shadow-[0_18px_60px_rgba(180,143,164,0.2)]">
          <p className="text-[0.65rem] uppercase tracking-[0.3em] text-[#C8A1B4]">Start a thread</p>
          <textarea
            value={composerValue}
            onChange={(event) => setComposerValue(event.target.value)}
            className="mt-3 w-full rounded-[1.5rem] border border-[#E3C6D4] bg-[#FFFAF8]/80 px-4 py-3 text-sm text-[#3E2F35] focus:border-[#C8A1B4] focus:outline-none focus:ring-2 focus:ring-[#EAC9D1]"
            rows={4}
            placeholder="Share what’s on your heart."
          />
          {composerError && <p className="mt-2 text-xs text-red-600">{composerError}</p>}
          <button
            type="button"
            onClick={handlePost}
            disabled={posting}
            className="mt-4 inline-flex items-center justify-center rounded-full bg-[#C8A1B4] px-5 py-2 text-xs font-semibold uppercase tracking-[0.4em] text-white transition hover:bg-[#b98aa5] disabled:opacity-60"
          >
            {posting ? "Posting…" : "Post into the room"}
          </button>
        </div>

        <div className="space-y-4">
          {renderPosts.map((post) => (
            <article
              key={post.id}
              className={`rounded-[2rem] border border-transparent p-4 text-sm shadow-[0_15px_50px_rgba(180,143,164,0.2)] ${
                post.isMentor ? "bg-[#F7E3E8] border-[#E3C6D4]" : "bg-white/90 border-[#F3DEE5]"
              }`}
            >
              <div className="flex items-center justify-between">
                <p className="text-xs uppercase tracking-[0.3em] text-[#C8A1B4]">
                  {post.author}
                </p>
                <p className="text-[0.6rem] uppercase tracking-[0.3em] text-[#3E2F35]/50">
                  {new Date(post.createdAt).toLocaleTimeString(undefined, {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              <p className="mt-2 text-[#3E2F35]/80">{post.content}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
