'use client';

import { useEffect, useState } from 'react';
import { CalendarDays, Megaphone, Star, Users } from 'lucide-react';

import { api } from '@/lib/api';

type CommunityTopic = {
  id: string;
  title: string;
  replies: number;
  mentor: string;
};

type Announcement = {
  id: string;
  title: string;
  body: string;
  author: string;
  createdAt: string;
};

type CommunityFeed = {
  topics: CommunityTopic[];
  announcements: Announcement[];
  mentorSpotlights: { name: string; highlight: string }[];
  featuredModule: { title: string; summary: string };
  upcomingEvents: { id: string; title: string; startTime: string; type: string }[];
  weeklyPoll: { question: string; options: string[] };
};

export default function CommunityPage() {
  const [feed, setFeed] = useState<CommunityFeed | null>(null);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  useEffect(() => {
    const fetchCommunity = async () => {
      try {
        const response = await api.get('/api/community/feed');
        setFeed(response.data);
        setAnnouncements(response.data?.announcements ?? []);
      } catch (error) {
        console.error('Community placeholder error', error);
      }
    };

    fetchCommunity();
  }, []);

  return (
    <div className="space-y-8">
      <header className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-soft">
        <p className="text-sm uppercase tracking-[0.5em] text-tmMauve">Community Hub</p>
        <h1 className="text-4xl text-tmCharcoal">Warm rooms, real talk, weekly rituals.</h1>
        <p className="mt-2 text-sm text-tmCharcoal/70">
          Dive into community prompts, mentor office hours, and the cohort calendar to stay supported.
        </p>
      </header>

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4 rounded-2xl border border-tmBlush/40 bg-white/95 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.5em] text-tmMauve">Announcements</p>
              <h2 className="text-2xl text-tmCharcoal">Weekly drop from mentors</h2>
            </div>
            <Megaphone className="h-6 w-6 text-tmMauve" />
          </div>
          <div className="space-y-4">
            {announcements.map((announcement) => (
              <div key={announcement.id} className="rounded-2xl border border-tmBlush/30 bg-tmIvory/70 p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-tmMauve">{announcement.author}</p>
                <h3 className="text-lg font-semibold text-tmCharcoal">{announcement.title}</h3>
                <p className="mt-2 text-sm text-tmCharcoal/70">{announcement.body}</p>
              </div>
            ))}
            {!announcements.length && <p className="text-sm text-tmCharcoal/60">// TODO: add empty-state UX</p>}
          </div>
        </div>
        <div className="space-y-4 rounded-2xl border border-tmBlush/40 bg-white/95 p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <Star className="h-6 w-6 text-tmMauve" />
            <div>
              <p className="text-xs uppercase tracking-[0.5em] text-tmMauve">Mentor Spotlight</p>
              <h2 className="text-xl text-tmCharcoal">Featured leaders</h2>
            </div>
          </div>
          <div className="space-y-3 text-sm text-tmCharcoal/70">
            {feed?.mentorSpotlights?.map((spotlight) => (
              <div key={spotlight.name} className="rounded-2xl border border-tmBlush/30 bg-tmIvory/70 p-3">
                <p className="font-semibold text-tmCharcoal">{spotlight.name}</p>
                <p>{spotlight.highlight}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-tmCharcoal/60">// TODO: add mentor Q&A highlights + recordings</p>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-tmBlush/40 bg-white/95 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.5em] text-tmMauve">Upcoming Events</p>
              <h2 className="text-2xl text-tmCharcoal">Reserve your seat</h2>
            </div>
            <CalendarDays className="h-6 w-6 text-tmMauve" />
          </div>
          <div className="mt-4 space-y-4">
            {feed?.upcomingEvents?.slice(0, 4).map((event) => (
              <div key={event.id} className="rounded-2xl border border-tmBlush/30 bg-tmIvory/70 p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-tmMauve">{event.type}</p>
                <h3 className="text-base font-semibold text-tmCharcoal">{event.title}</h3>
                <p className="text-sm text-tmCharcoal/70">{new Date(event.startTime).toLocaleString()}</p>
                <button className="mt-3 rounded-full border border-tmMauve px-4 py-2 text-sm font-semibold text-tmMauve">
                  RSVP
                </button>
              </div>
            ))}
            {!feed?.upcomingEvents?.length && <p className="text-sm text-tmCharcoal/60">Mentors are lining up the next sprint.</p>}
          </div>
        </div>
        <div className="rounded-2xl border border-tmBlush/40 bg-white/95 p-6 shadow-sm">
          <p className="text-xs uppercase tracking-[0.5em] text-tmMauve">Featured Academy Module</p>
          <h2 className="mt-2 text-2xl text-tmCharcoal">{feed?.featuredModule?.title ?? 'Module spotlight coming soon'}</h2>
          <p className="mt-3 text-sm text-tmCharcoal/70">{feed?.featuredModule?.summary}</p>
          <button className="mt-4 rounded-full bg-tmMauve px-5 py-3 text-sm font-semibold text-white">
            Continue module
          </button>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-tmBlush/40 bg-white/95 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.5em] text-tmMauve">Weekly Poll</p>
              <h2 className="text-xl text-tmCharcoal">{feed?.weeklyPoll?.question ?? 'Poll drops Monday'}</h2>
            </div>
            <Users className="h-6 w-6 text-tmMauve" />
          </div>
          <div className="mt-4 space-y-3">
            {feed?.weeklyPoll?.options?.map((option) => (
              <button key={option} className="w-full rounded-2xl border border-tmBlush/30 bg-tmIvory/70 p-3 text-left text-sm font-semibold text-tmCharcoal">
                {option}
              </button>
            ))}
            {!feed?.weeklyPoll?.options?.length && <p className="text-sm text-tmCharcoal/60">// TODO: add poll choices + submissions</p>}
          </div>
        </div>
        <div className="rounded-2xl border border-dashed border-tmBlush/40 bg-white/80 p-6 text-sm text-tmCharcoal/60">
          <p className="text-xs uppercase tracking-[0.5em] text-tmMauve">Member discussions</p>
          <h2 className="mt-2 text-xl text-tmCharcoal">Threads we’re tracking</h2>
          <div className="mt-4 space-y-3">
            {feed?.topics?.map((topic) => (
              <div key={topic.id} className="rounded-2xl border border-tmBlush/20 bg-white/80 p-3">
                <p className="text-sm font-semibold text-tmCharcoal">{topic.title}</p>
                <p className="text-xs text-tmCharcoal/70">{topic.replies} replies · Mentor {topic.mentor}</p>
              </div>
            ))}
            {!feed?.topics?.length && <p>Threads refresh each morning—hang tight.</p>}
          </div>
          <p className="mt-3 text-xs">// TODO: ingest member posts + reactions from community service</p>
        </div>
      </section>
    </div>
  );
}
