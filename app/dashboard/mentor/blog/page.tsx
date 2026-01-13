"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { authedFetch } from "@/lib/authedFetch";
import { useRequireRole } from "@/lib/auth/useRequireRole";
import StatusBadge from "@/components/blog-admin/StatusBadge";
import {
  BLOG_DB_UNAVAILABLE_DETAILS,
  BLOG_DB_UNAVAILABLE_HEADING,
} from "@/lib/blog/blogReadiness";

type MentorPost = {
  id: string;
  slug: string;
  title: string;
  status: "DRAFT" | "IN_REVIEW" | "PUBLISHED" | "ARCHIVED";
  updatedAt: string;
  publishedAt: string | null;
  submittedAt: string | null;
  isAffiliate: boolean;
};

const formatDate = (value: string | null) =>
  value
    ? new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : "Not published";

export default function MentorBlogDashboard() {
  useRequireRole(["MENTOR", "ADMIN"]);
  const [posts, setPosts] = useState<MentorPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [blogDbReady, setBlogDbReady] = useState(true);

  const loadPosts = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await authedFetch("/api/mentor/blog", { cache: "no-store" });
      const payload = await response.json();
      setBlogDbReady(payload?.meta?.blogDbReady ?? true);
      if (!response.ok) {
        throw new Error(payload?.error ?? "Unable to load drafts.");
      }
      setPosts(payload?.data ?? []);
    } catch (err) {
      setBlogDbReady(false);
      setError(err instanceof Error ? err.message : "Unable to load drafts.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadPosts();
  }, []);

  const draftPosts = posts.filter((post) => post.status === "DRAFT");
  const submittedPosts = posts.filter((post) => post.status === "IN_REVIEW");
  const livePosts = posts.filter((post) => post.status === "PUBLISHED" || post.status === "ARCHIVED");

  const renderSection = (
    title: string,
    description: string,
    items: MentorPost[],
    emptyMessage: string,
  ) => (
    <section className="space-y-4 rounded-[28px] bg-white/95 p-5 shadow-sm">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[0.65rem] uppercase tracking-[0.4em] text-[#A4556A]">{title}</p>
          <p className="text-sm text-[#3E2F35]/70">{description}</p>
        </div>
        <p className="text-xs text-[#3E2F35]/60">{items.length} posts</p>
      </div>
      {items.length ? (
        <div className="space-y-3">
          {items.map((post) => (
            <div key={post.id} className="rounded-2xl bg-[#FFF9F5] p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="space-y-1">
                  <p className="text-base font-semibold text-[#3E2F35]">{post.title}</p>
                  <p className="text-xs text-[#3E2F35]/60">{post.slug}</p>
                  <p className="text-[0.65rem] text-[#3E2F35]/70">
                    Updated {formatDate(post.updatedAt)}
                  </p>
                  {post.submittedAt ? (
                    <p className="text-[0.65rem] text-[#3E2F35]/70">
                      Submitted {formatDate(post.submittedAt)}
                    </p>
                  ) : null}
                  {post.publishedAt ? (
                    <p className="text-[0.65rem] text-[#3E2F35]/70">
                      Published {formatDate(post.publishedAt)}
                    </p>
                  ) : null}
                  <p className="text-[0.65rem] text-[#3E2F35]/70">
                    {post.isAffiliate ? "Affiliate eligible" : "Non-affiliate draft"}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2 text-right">
                  <StatusBadge status={post.status} />
                  <Link
                    href={`/dashboard/mentor/blog/${post.id}`}
                    className="inline-flex items-center justify-center rounded-full border border-[#C8A1B4] px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-[#A4556A]"
                  >
                    Edit
                  </Link>
                  <p className="text-[0.6rem] text-[#3E2F35]/60">
                    Published: {formatDate(post.publishedAt)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-[#3E2F35]/70">{emptyMessage}</p>
      )}
    </section>
  );

  return (
    <main className="space-y-6 px-4 pb-20 pt-6 text-[#3E2F35] sm:px-6">
      <header className="space-y-2 rounded-[28px] bg-[#FFF9F5] p-5 shadow-sm">
        <p className="text-xs uppercase tracking-[0.4em] text-[#C8A1B4]">Mentor blog</p>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="font-serif text-3xl text-[#3E2F35]">Draft workspace</h1>
          <Link
            href="/dashboard/mentor/blog/new"
            className="rounded-full bg-[#C8A1B4] px-5 py-3 text-xs font-semibold uppercase tracking-[0.35em] text-white"
          >
            New draft
          </Link>
        </div>
        <p className="text-sm text-[#3E2F35]/70">
          Keep your draft private until it&apos;s ready for admin review.
        </p>
      </header>

      {!blogDbReady ? (
        <div className="space-y-2 rounded-[28px] border border-[#E3C6D4] bg-[#FFF8F7] p-5 shadow-sm">
          <p className="text-sm font-semibold text-[#6D2E4D]">{BLOG_DB_UNAVAILABLE_HEADING}</p>
          {BLOG_DB_UNAVAILABLE_DETAILS.map((detail) => (
            <p key={detail} className="text-sm text-[#3E2F35]/80">
              {detail}
            </p>
          ))}
        </div>
      ) : null}

      {error ? (
        <div className="rounded-[28px] border border-[#F0CCD7] bg-[#FFF4FA] px-5 py-3 text-sm text-[#8B4A61]">
          {error}
        </div>
      ) : null}

      {loading ? (
        <section className="rounded-[28px] bg-white/95 p-5 shadow-sm">
          <p className="text-sm text-[#3E2F35]/70">Loading drafts...</p>
        </section>
      ) : (
        <>
          {renderSection(
            "Drafts",
            "Update your drafts before submitting for admin review.",
            draftPosts,
            "No drafts yet.",
          )}
          {renderSection(
            "Submitted",
            "Mentor drafts awaiting admin feedback.",
            submittedPosts,
            "No submissions at the moment.",
          )}
          {livePosts.length
            ? renderSection(
                "Published stories",
                "Live content and admin-approved posts.",
                livePosts,
                "No live stories yet.",
              )
            : null}
        </>
      )}
    </main>
  );
}
