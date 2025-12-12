"use server";

import CommunityPost from "@/components/tmbc/CommunityPost";
import Poll from "@/components/tmbc/Poll";
import SectionHeader from "@/components/tmbc/SectionHeader";
import { fetchCommunityFeed, fetchUserTimeCapsules } from "@/lib/api/placeholders";

export default async function CommunityFeedPage() {
  const feed = await fetchCommunityFeed();
  const capsules = await fetchUserTimeCapsules();
  const poll = feed.polls[0] ?? { question: "Share your energy", options: ["Flowing", "Resting"] };
  const weeklyMemory = {
    title: "This time last month...",
    note: capsules[0]?.title
      ? `You captured ${capsules[0].title} with a soothing note.`
      : "You tucked away a dream for your little one.",
  };

  return (
    <div className="space-y-8">
      <SectionHeader title="Community" subtitle="Announcements, polls, and mentor love." />
      <div className="grid gap-6 lg:grid-cols-[1fr_0.6fr]">
        <section className="space-y-6">
          <div className="rounded-[2rem] border border-[#E3C6D4] bg-white/95 p-5 shadow-[0_18px_60px_rgba(180,143,164,0.2)]">
            <p className="text-xs uppercase tracking-[0.4em] text-[#C7A6C9]">Announcements</p>
            <ul className="mt-3 space-y-2 text-sm text-[#3E2F35]/75">
              {feed.announcements.map((announcement) => (
                <li key={announcement.id}>{announcement.message}</li>
              ))}
            </ul>
          </div>
          <div className="space-y-4">
            <Poll question={poll.question} options={poll.options} />
            <div className="rounded-[2rem] border border-[#E3C6D4] bg-white/95 p-5 shadow-[0_18px_60px_rgba(180,143,164,0.2)]">
              <p className="text-xs uppercase tracking-[0.4em] text-[#C7A6C9]">Mentor tips</p>
              <ul className="mt-3 space-y-2 text-sm text-[#3E2F35]/75">
                {feed.mentorTips.map((tip) => (
                  <li key={tip}>{tip}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className="space-y-4">
            {feed.posts.map((post) => (
              <CommunityPost
                key={post.id}
                author={post.author}
                content={post.content}
                timestamp={new Date(post.timestamp).toLocaleDateString()}
                tags={["community", "mentor"]}
              />
            ))}
          </div>
        </section>
        <aside className="space-y-5">
          <div className="rounded-[2rem] border border-[#E3C6D4] bg-white/95 p-5 shadow-[0_18px_60px_rgba(180,143,164,0.2)]">
            <p className="text-xs uppercase tracking-[0.4em] text-[#C7A6C9]">Weekly memory</p>
            <h3 className="mt-2 text-sm font-semibold text-[#3E2F35]">{weeklyMemory.title}</h3>
            <p className="text-xs text-[#3E2F35]/75">{weeklyMemory.note}</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
