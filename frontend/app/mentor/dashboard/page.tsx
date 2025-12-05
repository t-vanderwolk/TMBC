"use client";

import { useEffect, useState } from "react";
import MentorHero, { MentorOverviewPayload } from "@/components/mentor/MentorHero";
import JournalNeedsList, {
  JournalEntryPreview,
} from "@/components/mentor/JournalNeedsList";
import MentorTaskBoard, { MentorTaskItem } from "@/components/mentor/MentorTaskBoard";
import MenteeRosterPreview, {
  MenteeRosterEntry,
} from "@/components/mentor/MenteeRosterPreview";
import UpcomingCircles, { CircleEvent } from "@/components/mentor/UpcomingCircles";
import { api } from "@/lib/api";

const DEFAULT_OVERVIEW: MentorOverviewPayload = {
  mentees: 0,
  journalsAwaiting: 0,
  pendingTasks: 0,
};

export default function MentorDashboardPage() {
  const [userName, setUserName] = useState<string>("Mentor");
  const [overview, setOverview] = useState<MentorOverviewPayload>(DEFAULT_OVERVIEW);
  const [mentees, setMentees] = useState<MenteeRosterEntry[]>([]);
  const [tasks, setTasks] = useState<MentorTaskItem[]>([]);
  const [journals, setJournals] = useState<JournalEntryPreview[]>([]);
  const [events, setEvents] = useState<CircleEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("tm_user");
    if (stored) {
      const parsed = JSON.parse(stored);
      setUserName(parsed.name || parsed.firstName || "Mentor");
    }

    const fetchData = async () => {
      try {
        const [overviewRes, tasksRes, journalRes, upcomingRes, menteesRes] = await Promise.all([
          api.get("/api/mentor/overview"),
          api.get("/api/mentor/tasks"),
          api.get("/api/mentor/journal-needs"),
          api.get("/api/mentor/upcoming-events"),
          api.get("/api/mentor/mentees"),
        ]);

        if (overviewRes?.data) {
          setOverview(overviewRes.data);
        }
        if (tasksRes?.data) {
          setTasks(tasksRes.data);
        }
        if (journalRes?.data) {
          setJournals(journalRes.data);
        }
        if (upcomingRes?.data) {
          setEvents(upcomingRes.data);
        }
        if (menteesRes?.data) {
          setMentees(menteesRes.data);
        }
      } catch (error) {
        console.error("mentor dashboard fetch failed", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="p-10 text-[#3E2F35]">Loading your concierge dashboard…</div>;
  }

  return (
    <div className="p-10 space-y-10 text-[#3E2F35]">
      <MentorHero name={userName} overview={overview} />

      <section className="space-y-4">
        <h2 className="font-serif text-2xl">Active Roster</h2>
        <MenteeRosterPreview mentees={mentees} />
      </section>

      <section className="space-y-4">
        <h2 className="font-serif text-2xl">Concierge Task Board</h2>
        <MentorTaskBoard tasks={tasks} />
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <h2 className="font-serif text-2xl">Journal Replies</h2>
          <JournalNeedsList journals={journals} />
        </div>
        <div className="space-y-4">
          <h2 className="font-serif text-2xl">Upcoming Circles</h2>
          <UpcomingCircles events={events} />
        </div>
      </section>
    </div>
  );
}
