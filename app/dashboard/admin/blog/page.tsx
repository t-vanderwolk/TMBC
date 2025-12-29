"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { useRequireRole } from "@/lib/auth/useRequireRole";

type AdminBlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  status: "DRAFT" | "IN_REVIEW" | "PUBLISHED" | "ARCHIVED";
  updatedAt: string;
  publishedAt: string | null;
  authorName: string;
  authorRoleSnapshot: "ADMIN" | "MENTOR";
};

const formatDate = (value: string | null) =>
  value
    ? new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : "Not published";

export default function AdminBlogReviewPage() {
  useRequireRole(["ADMIN"]);
  const [posts, setPosts] = useState<AdminBlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadPosts = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await fetch("/api/admin/blog", { cache: "no-store" });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data?.error || "Unable to load blog drafts.");
        }
        setPosts(data?.data ?? []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to load blog drafts.");
      } finally {
        setLoading(false);
      }
    };

    void loadPosts();
  }, []);

  return (
    <main className="space-y-6 px-4 pb-20 pt-6 text-[#3E2F35] sm:px-6">
      <header className="space-y-2 rounded-[28px] bg-[#FFF9F5] p-5 shadow-sm">
        <p className="text-xs uppercase tracking-[0.4em] text-[#C8A1B4]">Admin blog review</p>
        <h1 className="font-serif text-3xl text-[#3E2F35]">Review & publish</h1>
        <p className="text-sm text-[#3E2F35]/70">
          Approve mentor drafts before they go live.
        </p>
      </header>

      {error ? (
        <div className="rounded-[28px] border border-[#F0CCD7] bg-[#FFF4FA] px-5 py-3 text-sm text-[#8B4A61]">
          {error}
        </div>
      ) : null}

      {loading ? (
        <section className="rounded-[28px] bg-white/95 p-5 shadow-sm">
          <p className="text-sm text-[#3E2F35]/70">Loading drafts...</p>
        </section>
      ) : null}

      {!loading ? (
        <section className="space-y-3 rounded-[28px] bg-white/95 p-5 shadow-sm">
          {posts.length ? (
            <div className="space-y-3">
              {posts.map((post) => (
                <div key={post.id} className="rounded-2xl bg-[#FFF9F5] p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-base font-semibold text-[#3E2F35]">{post.title}</p>
                      <p className="text-xs text-[#3E2F35]/60">{post.slug}</p>
                      <p className="mt-2 text-xs text-[#3E2F35]/70">
                        Status: {post.status.replace("_", " ").toLowerCase()}
                      </p>
                      <p className="text-xs text-[#3E2F35]/60">Updated: {formatDate(post.updatedAt)}</p>
                      <p className="text-xs text-[#3E2F35]/60">
                        Author: {post.authorName} · {post.authorRoleSnapshot.toLowerCase()}
                      </p>
                    </div>
                    <div className="space-y-2 text-right">
                      <p className="text-xs text-[#3E2F35]/60">Published: {formatDate(post.publishedAt)}</p>
                      <Link
                        href={`/dashboard/admin/blog/${post.id}`}
                        className="inline-flex items-center justify-center rounded-full border border-[#C8A1B4] px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-[#A4556A]"
                      >
                        Review draft
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-[#3E2F35]/70">No drafts awaiting review.</p>
          )}
        </section>
      ) : null}
    </main>
  );
}
