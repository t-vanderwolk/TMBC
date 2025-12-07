"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { getCommunityRooms } from "@/lib/api/community";

type CommunityRoom = {
  id: string;
  name: string;
  description?: string | null;
  recentPostSnippet?: string | null;
  recentPostAuthor?: string | null;
  recentPostAt?: string | null;
};

export default function CommunityPage() {
  const router = useRouter();
  const [rooms, setRooms] = useState<CommunityRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
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
    getCommunityRooms(token)
      .then((response) => {
        setRooms(response.data);
      })
      .catch(() => {
        setError("Unable to load rooms at the moment.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [token]);

  if (!authChecked) {
    return (
      <div className="flex flex-1 items-center justify-center px-4 py-20 text-sm uppercase tracking-[0.5em] text-[#C8A1B4]">
        Gathering circles…
      </div>
    );
  }

  return (
    <main className="space-y-8 px-4 py-8 text-[#3E2F35] sm:px-6">
      <section className="rounded-[2.5rem] border border-[#EAD4D8] bg-gradient-to-br from-[#FFF8F6] via-[#FBE9EE] to-[#F0D4D9]/70 p-6 shadow-[0_25px_70px_rgba(192,153,170,0.3)]">
        <p className="text-[0.65rem] uppercase tracking-[0.5em] text-[#3E2F35]/70">Community · Gather</p>
        <h1 className="mt-2 font-serif text-3xl text-[#3E2F35]">Your invite-only rooms</h1>
        <p className="mt-2 text-sm text-[#3E2F35]/70">
          Each room is curated for stories, mentor support, and the hush of a calm community.
        </p>
      </section>

      {loading && (
        <div className="flex flex-1 items-center justify-center rounded-[2rem] border border-[#E3C6D4] bg-white/90 p-6 text-sm uppercase tracking-[0.5em] text-[#C8A1B4] shadow-[0_20px_60px_rgba(180,143,164,0.25)]">
          Loading your rooms…
        </div>
      )}

      {error && (
        <div className="rounded-[1.75rem] border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <section className="grid gap-6 sm:grid-cols-2">
        {rooms.map((room) => (
          <article
            key={room.id}
            className="flex h-full flex-col justify-between rounded-[2.25rem] border border-[#E3C6D4] bg-white/90 p-6 shadow-[0_20px_60px_rgba(180,143,164,0.25)] transition hover:-translate-y-1 hover:shadow-[0_25px_80px_rgba(180,143,164,0.35)]"
          >
            <div className="space-y-3">
              <h2 className="text-2xl font-semibold text-[#3E2F35]">{room.name}</h2>
              <p className="text-sm text-[#3E2F35]/70">{room.description ?? "This circle is a calm sanctuary."}</p>
              {room.recentPostSnippet && (
                <div className="rounded-2xl bg-[#FFFAF8] p-4 text-sm text-[#3E2F35]/80">
                  <p className="text-[0.65rem] uppercase tracking-[0.3em] text-[#C8A1B4]">
                    Latest whisper
                  </p>
                  <p className="mt-1 leading-snug">
                    {room.recentPostSnippet}
                  </p>
                  <p className="mt-2 text-[0.65rem] uppercase tracking-[0.3em] text-[#3E2F35]/50">
                    {room.recentPostAuthor ?? "Member"} ·{" "}
                    {room.recentPostAt
                      ? new Date(room.recentPostAt).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                        })
                      : "recently"}
                  </p>
                </div>
              )}
            </div>
            <Link
              href={`/dashboard/community/${room.id}`}
              className="mt-4 inline-flex items-center justify-center rounded-full border border-[#C8A1B4] px-4 py-2 text-xs font-semibold uppercase tracking-[0.4em] text-[#3E2F35] transition hover:border-[#B98AA5] hover:text-[#B98AA5]"
            >
              Enter room →
            </Link>
          </article>
        ))}
      </section>
    </main>
  );
}
