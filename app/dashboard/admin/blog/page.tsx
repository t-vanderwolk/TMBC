"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { authedFetch } from "@/lib/authedFetch";
import { useRequireRole } from "@/lib/auth/useRequireRole";
import StatusBadge from "@/components/blog-admin/StatusBadge";
import AuthorBadge from "@/components/blog-admin/AuthorBadge";

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
  isAffiliate: boolean;
};

type StatsPayload = {
  total: number;
  statusCounts: Record<string, number>;
};

const STATUS_OPTIONS = ["ALL", "DRAFT", "IN_REVIEW", "PUBLISHED", "ARCHIVED"];
const AUTHOR_OPTIONS = ["ALL", "ADMIN", "MENTOR"];
const AFFILIATE_OPTIONS = [
  { label: "All", value: "ALL" },
  { label: "Affiliate", value: "true" },
  { label: "Non-affiliate", value: "false" },
];

const formatDate = (value: string | null) =>
  value
    ? new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : "Not published";

export default function AdminBlogReviewPage() {
  useRequireRole(["ADMIN"]);
  const [posts, setPosts] = useState<AdminBlogPost[]>([]);
  const [stats, setStats] = useState<StatsPayload>({ total: 0, statusCounts: {} });
  const [filters, setFilters] = useState({
    status: "ALL",
    authorRole: "ALL",
    isAffiliate: "ALL",
    search: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [blogDbReady, setBlogDbReady] = useState(true);

  const loadPosts = async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (filters.status !== "ALL") {
        params.set("status", filters.status);
      }
      if (filters.authorRole !== "ALL") {
        params.set("authorRole", filters.authorRole);
      }
      if (filters.isAffiliate !== "ALL") {
        params.set("isAffiliate", filters.isAffiliate);
      }
      if (filters.search.trim()) {
        params.set("search", filters.search.trim());
      }
      const response = await authedFetch(`/api/admin/blog?${params.toString()}`, { cache: "no-store" });
      const payload = await response.json();
      setBlogDbReady(payload?.meta?.blogDbReady ?? true);
      if (!response.ok) {
        throw new Error(payload?.error ?? "Unable to load posts.");
      }
      setPosts(payload?.data?.posts ?? []);
      setStats(payload?.data?.stats ?? { total: 0, statusCounts: {} });
    } catch (err) {
      setBlogDbReady(false);
      setError(err instanceof Error ? err.message : "Unable to load posts.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadPosts();
  }, [filters]);

  return (
    <main className="space-y-6 px-4 pb-20 pt-6 text-[#3E2F35] sm:px-6">
      <header className="space-y-2 rounded-[28px] bg-[#FFF9F5] p-5 shadow-sm">
        <p className="text-xs uppercase tracking-[0.4em] text-[#C8A1B4]">Admin blog</p>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="font-serif text-3xl text-[#3E2F35]">Review & publish</h1>
          <Link
            href="/dashboard/admin/blog/new"
            className="rounded-full bg-[#C8A1B4] px-5 py-3 text-xs font-semibold uppercase tracking-[0.35em] text-white"
          >
            New post
          </Link>
        </div>
        <p className="text-sm text-[#3E2F35]/70">
          Approve mentor work, then publish the stories that deserve the spotlight.
        </p>
      </header>

      <section className="space-y-4 rounded-[28px] bg-white/95 p-5 shadow-sm">
        <p className="text-xs uppercase tracking-[0.35em] text-[#A4556A]">Filters</p>
        <div className="grid gap-3 md:grid-cols-4">
          <select
            value={filters.status}
            onChange={(event) => setFilters((prev) => ({ ...prev, status: event.target.value }))}
            className="rounded-2xl border border-[#E3C6D4] bg-white/90 px-3 py-2 text-sm text-[#3E2F35]"
          >
            {STATUS_OPTIONS.map((statusOption) => (
              <option key={statusOption} value={statusOption}>
                {statusOption.replace("_", " ")}
              </option>
            ))}
          </select>
          <select
            value={filters.authorRole}
            onChange={(event) => setFilters((prev) => ({ ...prev, authorRole: event.target.value }))}
            className="rounded-2xl border border-[#E3C6D4] bg-white/90 px-3 py-2 text-sm text-[#3E2F35]"
          >
            {AUTHOR_OPTIONS.map((roleOption) => (
              <option key={roleOption} value={roleOption}>
                {roleOption === "ALL" ? "Any author" : roleOption}
              </option>
            ))}
          </select>
          <select
            value={filters.isAffiliate}
            onChange={(event) => setFilters((prev) => ({ ...prev, isAffiliate: event.target.value }))}
            className="rounded-2xl border border-[#E3C6D4] bg-white/90 px-3 py-2 text-sm text-[#3E2F35]"
          >
            {AFFILIATE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <input
            value={filters.search}
            onChange={(event) => setFilters((prev) => ({ ...prev, search: event.target.value }))}
            placeholder="Search title or slug"
            className="rounded-2xl border border-[#E3C6D4] bg-white/90 px-3 py-2 text-sm text-[#3E2F35]"
          />
        </div>
        <div className="flex flex-wrap gap-3 text-[0.75rem] text-[#3E2F35]/60">
          <p>Total posts: {stats.total}</p>
          {Object.entries(stats.statusCounts).map(([status, count]) => (
            <span key={status} className="rounded-full border border-[#E3C6D4] px-3 py-1 text-xs uppercase tracking-[0.35em]">
              {status}: {count}
            </span>
          ))}
        </div>
      </section>

      {!blogDbReady ? (
        <div className="space-y-2 rounded-[28px] border border-[#E3C6D4] bg-[#FFF8F7] p-5 shadow-sm">
          <p className="text-lg font-semibold text-[#6D2E4D]">Blog database tables not ready</p>
          <p className="text-sm text-[#3E2F35]/80">
            The blog tables (e.g., BlogAffiliateLink) are missing on the production database.
            Drafts and approvals are temporarily disabled until migrations are repaired.
          </p>
        </div>
      ) : null}

      {error ? (
        <div className="rounded-[28px] border border-[#F0CCD7] bg-[#FFF4FA] px-5 py-3 text-sm text-[#8B4A61]">
          {error}
        </div>
      ) : null}

      <section className="space-y-3 rounded-[28px] bg-white/95 p-5 shadow-sm">
        {loading ? (
          <p className="text-sm text-[#3E2F35]/70">Loading posts...</p>
        ) : posts.length ? (
          <div className="space-y-3">
            {posts.map((post) => (
              <div key={post.id} className="rounded-2xl border border-[#E3C6D4] bg-[#FFF9F5] p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="space-y-1">
                    <p className="text-base font-semibold text-[#3E2F35]">{post.title}</p>
                    <p className="text-xs text-[#3E2F35]/60">{post.slug}</p>
                    <p className="text-[0.65rem] text-[#3E2F35]/70">
                      Updated {formatDate(post.updatedAt)}
                    </p>
                    <p className="text-[0.65rem] text-[#3E2F35]/70">
                      Published {formatDate(post.publishedAt)}
                    </p>
                    <p className="text-[0.65rem] text-[#3E2F35]/70">
                      {post.isAffiliate ? "Affiliate eligible" : "Non-affiliate"}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2 text-right">
                    <StatusBadge status={post.status} />
                    <AuthorBadge authorName={post.authorName} authorRole={post.authorRoleSnapshot} />
                    <Link
                      href={`/dashboard/admin/blog/${post.id}`}
                      className="rounded-full border border-[#C8A1B4] px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-[#A4556A]"
                    >
                      Review
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-[#3E2F35]/70">No posts yet.</p>
        )}
      </section>
    </main>
  );
}
