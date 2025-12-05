"use client";

import { useState } from "react";

type Post = {
  id: number;
  author: string;
  timestamp: string;
  text: string;
  tags: string[];
};

type Poll = {
  question: string;
  options: { label: string; votes: number }[];
};

const posts: Post[] = [
  {
    id: 1,
    author: "Lena · Third Trimester",
    timestamp: "2h ago",
    text: "Sustainable crib bedding with washable layers, plus a mentor note that says it can stay curated even after the baby sleeps in the fam bed.",
    tags: ["nursery", "mentor note"],
  },
  {
    id: 2,
    author: "Marisol · Early Mom",
    timestamp: "4h ago",
    text: "Do we really need a wipe warmer? I’m leaning no but would love a quick poll from folks who use theirs daily.",
    tags: ["poll", "gear"],
  },
  {
    id: 3,
    author: "Avery · MMBC Mentor",
    timestamp: "Yesterday",
    text: "Remember: the registry is a living document. Swap in your calm items and archive the noise—I'll drop moodboard pins later today.",
    tags: ["mentor highlight", "registry"],
  },
];

const polls: Poll[] = [
  {
    question: "Which evening ritual helps you breathe before bed?",
    options: [
      { label: "Slow tea + gratitude list", votes: 84 },
      { label: "Gentle stretching + breathwork", votes: 62 },
      { label: "Voice note recap with mentor", votes: 49 },
    ],
  },
];

const upcomingCircles = [
  { title: "Mentor Circle · Postpartum Glow", time: "Friday · 6p PT" },
  { title: "Registry Styling Salon", time: "Tuesday · 10a PT" },
  { title: "Partner Planning Pop-up", time: "Monthly · 3p PT" },
];

const trendingTopics = ["Moodboard magic", "Postpartum playlist", "Minimalist registry", "Mentor Q&A"];

const mentorSpotlight = {
  name: "Ellie Ramos",
  bio: "Taylor-Made mentor + birth educator with a soft spot for heirloom registries.",
  hero: "Ellie answers late-night questions with warmth, honesty, and a sprinkle of gold.",
};

export default function CommunityPage() {
  const [likes, setLikes] = useState<Record<number, boolean>>({});
  const [bookmarks, setBookmarks] = useState<Record<number, boolean>>({});
  const [votes, setVotes] = useState<Record<string, string>>({});

  const toggleLike = (postId: number) => {
    setLikes((prev) => ({ ...prev, [postId]: !prev[postId] }));
  };

  const toggleBookmark = (postId: number) => {
    setBookmarks((prev) => ({ ...prev, [postId]: !prev[postId] }));
  };

  const vote = (question: string, option: string) => {
    setVotes((prev) => ({ ...prev, [question]: option }));
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr,0.38fr]">
      <section className="space-y-6 rounded-[36px] border border-[var(--tmbc-mauve)]/40 bg-[var(--tmbc-ivory)]/80 p-6 shadow-[0_30px_80px_rgba(199,166,199,0.2)]">
        <div className="flex items-center justify-between">
          <h1 className="font-serif text-3xl text-[var(--tmbc-charcoal)]">Community Feed</h1>
          <span className="text-xs uppercase tracking-[0.4em] text-[var(--tmbc-charcoal)]/60">Invite-only</span>
        </div>
        <div className="space-y-4">
          {posts.map((post) => (
            <article
              key={post.id}
              className="space-y-3 rounded-[28px] border border-[var(--tmbc-mauve)]/30 bg-white/90 p-5 shadow-[0_18px_50px_rgba(199,166,199,0.2)]"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-[var(--tmbc-charcoal)]">{post.author}</p>
                <p className="text-[0.65rem] uppercase tracking-[0.3em] text-[var(--tmbc-charcoal)]/60">
                  {post.timestamp}
                </p>
              </div>
              <p className="text-sm leading-relaxed text-[var(--tmbc-charcoal)]">{post.text}</p>
              <div className="flex flex-wrap gap-2 text-[0.65rem] uppercase tracking-[0.25em] text-[var(--tmbc-charcoal)]/70">
                {post.tags.map((tag) => (
                  <span
                    key={`${post.id}-${tag}`}
                    className="rounded-full border border-[var(--tmbc-mauve)]/40 px-3 py-1"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-4 text-[0.65rem] uppercase tracking-[0.35em] text-[var(--tmbc-charcoal)]/70">
                <button
                  onClick={() => toggleLike(post.id)}
                  className={`rounded-full border px-3 py-2 transition ${
                    likes[post.id] ? "border-[var(--tmbc-mauve)] bg-[var(--tmbc-mauve)]/10" : "border-[var(--tmbc-charcoal)]/20"
                  }`}
                >
                  {likes[post.id] ? "Liked" : "Like"}
                </button>
                <button
                  onClick={() => toggleBookmark(post.id)}
                  className={`rounded-full border px-3 py-2 transition ${
                    bookmarks[post.id]
                      ? "border-[var(--tmbc-gold)] bg-[var(--tmbc-gold)]/10"
                      : "border-[var(--tmbc-charcoal)]/20"
                  }`}
                >
                  {bookmarks[post.id] ? "Saved" : "Bookmark"}
                </button>
                <button className="rounded-full border border-[var(--tmbc-charcoal)]/20 px-3 py-2">
                  Reply
                </button>
              </div>
            </article>
          ))}
        </div>

        <div className="space-y-4">
          <p className="text-xs uppercase tracking-[0.4em] text-[var(--tmbc-charcoal)]/60">Polls</p>
          {polls.map((poll) => (
            <div
              key={poll.question}
              className="space-y-3 rounded-[28px] border border-[var(--tmbc-mauve)]/30 bg-white/90 p-5 shadow-[0_12px_40px_rgba(199,166,199,0.15)]"
            >
              <p className="text-sm font-semibold text-[var(--tmbc-charcoal)]">{poll.question}</p>
              <div className="space-y-2">
                {poll.options.map((option) => (
                  <button
                    key={option.label}
                    onClick={() => vote(poll.question, option.label)}
                    className={`flex w-full items-center justify-between rounded-[24px] border px-4 py-2 text-sm text-[var(--tmbc-charcoal)] transition ${
                      votes[poll.question] === option.label
                        ? "border-[var(--tmbc-mauve)] bg-[var(--tmbc-mauve)]/10"
                        : "border-[var(--tmbc-charcoal)]/20 hover:border-[var(--tmbc-mauve)]"
                    }`}
                  >
                    <span>{option.label}</span>
                    <span className="text-[0.65rem] uppercase tracking-[0.3em] text-[var(--tmbc-charcoal)]/60">
                      {option.votes + (votes[poll.question] === option.label ? 1 : 0)} votes
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <aside className="space-y-6 rounded-[36px] border border-[var(--tmbc-mauve)]/40 bg-white/90 p-5 shadow-[0_25px_70px_rgba(199,166,199,0.2)]">
        <div className="space-y-3">
          <h2 className="text-xs uppercase tracking-[0.4em] text-[var(--tmbc-charcoal)]/50">Upcoming Circles</h2>
          <div className="space-y-3">
            {upcomingCircles.map((circle) => (
              <div key={circle.title} className="rounded-[24px] border border-[var(--tmbc-charcoal)]/10 bg-[var(--tmbc-ivory)]/90 px-4 py-3">
                <p className="text-sm font-semibold text-[var(--tmbc-charcoal)]">{circle.title}</p>
                <p className="text-[0.65rem] uppercase tracking-[0.3em] text-[var(--tmbc-charcoal)]/60">{circle.time}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="text-xs uppercase tracking-[0.4em] text-[var(--tmbc-charcoal)]/50">Trending Topics</h2>
          <div className="flex flex-wrap gap-2">
            {trendingTopics.map((topic) => (
              <span
                key={topic}
                className="rounded-full border border-[var(--tmbc-mauve)]/40 px-3 py-1 text-[0.65rem] uppercase tracking-[0.3em] text-[var(--tmbc-charcoal)]/70"
              >
                {topic}
              </span>
            ))}
          </div>
        </div>

        <div className="space-y-3 rounded-[30px] border border-[var(--tmbc-mauve)]/30 bg-[var(--tmbc-blush)]/60 p-4">
          <p className="text-xs uppercase tracking-[0.4em] text-[var(--tmbc-charcoal)]/60">Mentor Spotlight</p>
          <h3 className="text-lg font-semibold text-[var(--tmbc-charcoal)]">{mentorSpotlight.name}</h3>
          <p className="text-sm text-[var(--tmbc-charcoal)]/80">{mentorSpotlight.bio}</p>
          <p className="text-[0.75rem] uppercase tracking-[0.3em] text-[var(--tmbc-charcoal)]/60">{mentorSpotlight.hero}</p>
          <button className="mt-2 w-full rounded-full border border-[var(--tmbc-charcoal)]/20 px-4 py-2 text-[0.7rem] uppercase tracking-[0.3em] text-[var(--tmbc-charcoal)] transition hover:border-[var(--tmbc-mauve)]">
            View Mentor Notes
          </button>
        </div>
      </aside>
    </div>
  );
}
