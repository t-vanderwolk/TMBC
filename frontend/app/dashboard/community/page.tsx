'use client';

import { useEffect } from 'react';
import { Calendar, MessageCircle, Users } from 'lucide-react';

import { api } from '@/lib/api';

const topics = [
  { id: 1, title: 'Week 28 Nursery Sprint', replies: 42, mentor: 'Kara' },
  { id: 2, title: 'Feeding gear you actually used', replies: 30, mentor: 'Alex' },
  { id: 3, title: 'Postpartum boundaries that helped', replies: 18, mentor: 'Maya' },
];

const rooms = [
  { name: 'Austin Members', status: 'Live now' },
  { name: 'Mentor Office Hours', status: 'Thurs 3pm CST' },
  { name: 'Fourth Trimester Circle', status: 'Sun 8pm CST' },
];

const events = [
  { title: 'Registry Co-working', date: 'Wed · 12pm CST' },
  { title: 'Community Zoom', date: 'Thu · 3pm CST' },
  { title: 'Postpartum Pep Talk', date: 'Sun · 8pm CST' },
];

export default function CommunityPage() {
  useEffect(() => {
    const fetchCommunity = async () => {
      try {
        await api.get('/api/community/feed');
        // TODO: connect realtime chat + mentoring threads
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
          Dive into community prompts, mentor office hours, and the events calendar to stay supported.
        </p>
      </header>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4 rounded-2xl border border-tmBlush/40 bg-white/90 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.5em] text-tmMauve">Discussion Topics</p>
              <h2 className="text-2xl text-tmCharcoal">Mentor-led threads</h2>
            </div>
            <MessageCircle className="h-6 w-6 text-tmMauve" />
          </div>
          <div className="space-y-3">
            {topics.map((topic) => (
              <div key={topic.id} className="rounded-2xl border border-tmBlush/30 bg-tmIvory/70 p-4">
                <p className="text-base font-semibold text-tmCharcoal">{topic.title}</p>
                <p className="text-sm text-tmCharcoal/70">
                  {topic.replies} replies · Mentor {topic.mentor}
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-4 rounded-2xl border border-tmBlush/40 bg-white/90 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.5em] text-tmMauve">Group Rooms</p>
              <h2 className="text-2xl text-tmCharcoal">Pop in anytime</h2>
            </div>
            <Users className="h-6 w-6 text-tmMauve" />
          </div>
          <div className="space-y-3">
            {rooms.map((room) => (
              <div key={room.name} className="flex items-center justify-between rounded-2xl border border-tmBlush/30 bg-tmIvory/70 p-4">
                <p className="text-base text-tmCharcoal">{room.name}</p>
                <span className="text-sm font-semibold text-tmMauve">{room.status}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-tmBlush/40 bg-white/90 p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.5em] text-tmMauve">Upcoming Events</p>
            <h2 className="text-2xl text-tmCharcoal">Reserve your seat</h2>
          </div>
          <Calendar className="h-6 w-6 text-tmMauve" />
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {events.map((event) => (
            <div key={event.title} className="rounded-2xl border border-tmBlush/30 bg-tmIvory/80 p-4">
              <p className="text-sm uppercase tracking-[0.3em] text-tmMauve">{event.date}</p>
              <p className="mt-2 text-base font-semibold text-tmCharcoal">{event.title}</p>
              <button className="mt-4 w-full rounded-full border border-tmMauve px-3 py-2 text-sm font-semibold text-tmMauve">
                RSVP
              </button>
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs text-tmCharcoal/60">// TODO: realtime events + chat integration</p>
      </section>
    </div>
  );
}
