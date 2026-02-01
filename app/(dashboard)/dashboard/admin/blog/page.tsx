"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { authedFetch } from "@/lib/authedFetch";
import { useRequireRole } from "@/lib/auth/useRequireRole";
import StatusBadge from "@/components/blog-admin/StatusBadge";
import AuthorBadge from "@/components/blog-admin/AuthorBadge";
import {
  BLOG_DB_UNAVAILABLE_DETAILS,
  BLOG_DB_UNAVAILABLE_HEADING,
} from "@/lib/blog/blogReadiness";
import type { BlogStatusLabel } from "@/types/blogStatus";

type AdminBlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  status: BlogStatusLabel;
  updatedAt: string;
  submittedAt: string | null;
  publishedAt: string | null;
  authorName: string;
  authorRoleSnapshot: "ADMIN" | "MENTOR";
  isAffiliate: boolean;
  rejectionNote?: string | null;
};

type StatsPayload = {
  total: number;
  statusCounts: Record<string, number>;
};

type FilterState = {
  authorRole: "ALL" | "ADMIN" | "MENTOR";
  isAffiliate: "ALL" | "true" | "false";
  search: string;
};

type TabDefinition = {
  id: "inReview" | "approved" | "published";
  label: string;
  statuses: AdminBlogPost["status"][];
};

const TAB_DEFINITIONS: TabDefinition[] = [
  { id: "inReview", label: "In Review", statuses: ["IN_REVIEW"] },
  { id: "approved", label: "Approved", statuses: ["APPROVED"] },
  { id: "published", label: "Published", statuses: ["PUBLISHED", "ARCHIVED"] },
];

const TAB_DESCRIPTIONS: Record<TabDefinition["id"], string> = {
  inReview: "Mentor drafts waiting for admin approval.",
  approved: "Ready-to-publish posts that need a final send-off.",
  published: "Stories that are live on /blog or archived for reference.",
};

const formatDate = (value: string | null) =>
  value
    ? new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : "Not published";

export default function AdminBlogReviewPage() {
  useRequireRole(["ADMIN"]);
  const [posts, setPosts] = useState<AdminBlogPost[]>([]);
  const [stats, setStats] = useState<StatsPayload>({ total: 0, statusCounts: {} });
  const [filters, setFilters] = useState<FilterState>({ authorRole: "ALL", isAffiliate: "ALL", search: "" });
  const defaultTabId = TAB_DEFINITIONS[0]?.id ?? "inReview";
  const [activeTab, setActiveTab] = useState<TabDefinition["id"]>(defaultTabId);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionMessage, setActionMessage] = useState("");
  const [busyAction, setBusyAction] = useState<string | null>(null);
  const [blogDbReady, setBlogDbReady] = useState(true);

  const loadPosts = async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (filters.authorRole !== "ALL") {
        params.set("authorRole", filters.authorRole);
      }
      if (filters.isAffiliate !== "ALL") {
        params.set("isAffiliate", filters.isAffiliate);
      }
      if (filters.search.trim()) {
        params.set("search", filters.search.trim());
      }
      const query = params.toString() ? `?${params.toString()}` : "";
      const response = await authedFetch(`/api/admin/blog${query}`, { cache: "no-store" });
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

  const activeTabDefinition = useMemo(
    () => TAB_DEFINITIONS.find((tab) => tab.id === activeTab) ?? TAB_DEFINITIONS[0],
    [activeTab],
  );

  const tabPosts = useMemo(
    () =>
      posts
        .filter((post) => activeTabDefinition?.statuses.includes(post.status))
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()),
    [posts, activeTabDefinition],
  );

  const runAction = async (
    endpoint: string,
    actionType: string,
    postId: string,
    payload?: Record<string, unknown>,
  ) => {
    setBusyAction(`${actionType}:${postId}`);
    setActionMessage("");
    try {
      const requestInit: RequestInit = { method: "POST" };
      if (payload) {
        requestInit.body = JSON.stringify(payload);
      }
      const response = await authedFetch(`/api/admin/blog/${postId}/${endpoint}`, requestInit);
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result?.error ?? `Unable to ${actionType}.`);
      }
      const actionVerb =
        actionType === "approve"
          ? "approved"
          : actionType === "reject"
            ? "rejected"
            : actionType === "publish"
              ? "published"
              : `${actionType}ed`;
      setActionMessage(`Post ${actionVerb}.`);
      await loadPosts();
    } catch (err) {
      setActionMessage(err instanceof Error ? err.message : `Unable to ${actionType}.`);
    } finally {
      setBusyAction(null);
    }
  };

  const handleApprove = (postId: string) => runAction("approve", "approve", postId);
  const handlePublish = (post: AdminBlogPost) =>
    runAction("publish", "publish", post.id, {
      authorName: post.authorName,
      authorRoleSnapshot: post.authorRoleSnapshot,
    });
  const handleReject = (postId: string) => {
    const note = window.prompt("Add a note for the mentor before rejecting this draft.");
    if (!note?.trim()) {
      return;
    }
    runAction("reject", "reject", postId, { note: note.trim() });
  };

  const isBusy = (type: string, postId: string) => busyAction === `${type}:${postId}`;

  return (
    <main className="space-y-6 px-4 pb-20 pt-6 text-[#3E2F35] sm:px-6">
      <header className="space-y-3 rounded-[28px] bg-[#FFF9F5] p-5 shadow-sm">
        <p className="text-xs uppercase tracking-[0.4em] text-[#C8A1B4]">Admin blog</p>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="font-serif text-3xl text-[#3E2F35]">Review & publish</h1>
          <Link
            href="/dashboard/admin/blog/new"
            className="rounded-full bg-[#A4556A] px-5 py-3 text-xs font-semibold uppercase tracking-[0.35em] text-white"
          >
            Draft a post
          </Link>
        </div>
        <p className="text-sm text-[#3E2F35]/70">Approve mentor work, then publish the stories that deserve the spotlight.</p>
      </header>

      <section className="space-y-4 rounded-[28px] border border-[#E3C6D4] bg-white/95 p-5 shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          {TAB_DEFINITIONS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] transition ${
                activeTab === tab.id
                  ? "bg-[#C8A1B4] text-white"
                  : "border border-[#E3C6D4] text-[#3E2F35]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <p className="text-sm text-[#3E2F35]/70">{TAB_DESCRIPTIONS[activeTabDefinition?.id ?? "inReview"]}</p>
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="space-y-1 rounded-2xl border border-[#E3C6D4] p-4">
            <p className="text-[0.65rem] uppercase tracking-[0.35em] text-[#A4556A]">Total posts</p>
            <p className="text-3xl font-semibold text-[#3E2F35]">{stats.total}</p>
          </div>
          {Object.entries(stats.statusCounts).map(([status, count]) => (
            <div key={status} className="space-y-1 rounded-2xl border border-[#E3C6D4] p-4">
              <p className="text-[0.65rem] uppercase tracking-[0.35em] text-[#A4556A]">{status}</p>
              <p className="text-3xl font-semibold text-[#3E2F35]">{count}</p>
            </div>
          ))}
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          <select
            value={filters.authorRole}
            onChange={(event) => setFilters((prev) => ({ ...prev, authorRole: event.target.value as FilterState["authorRole"] }))}
            className="rounded-2xl border border-[#E3C6D4] bg-white/90 px-3 py-2 text-sm text-[#3E2F35]"
          >
            <option value="ALL">Any author</option>
            <option value="ADMIN">Admin</option>
            <option value="MENTOR">Mentor</option>
          </select>
          <select
            value={filters.isAffiliate}
            onChange={(event) => setFilters((prev) => ({ ...prev, isAffiliate: event.target.value as FilterState["isAffiliate"] }))}
            className="rounded-2xl border border-[#E3C6D4] bg-white/90 px-3 py-2 text-sm text-[#3E2F35]"
          >
            <option value="ALL">Any affiliate state</option>
            <option value="true">Affiliate</option>
            <option value="false">Non-affiliate</option>
          </select>
          <input
            value={filters.search}
            onChange={(event) => setFilters((prev) => ({ ...prev, search: event.target.value }))}
            placeholder="Search title or slug"
            className="rounded-2xl border border-[#E3C6D4] bg-white/90 px-3 py-2 text-sm text-[#3E2F35]"
          />
        </div>
      </section>

      {actionMessage ? (
        <div className="rounded-[28px] border border-[#E3C6D4] bg-[#FFF8F7] px-5 py-3 text-sm text-[#3E2F35]/80">
          {actionMessage}
        </div>
      ) : null}

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
          <p className="text-sm text-[#3E2F35]/70">Loading posts...</p>
        </section>
      ) : (
        <section className="space-y-3">
          {tabPosts.length ? (
            <div className="grid gap-4 md:grid-cols-2">
              {tabPosts.map((post) => (
                <article key={post.id} className="space-y-3 rounded-[28px] border border-[#E3C6D4] bg-white/95 p-5 shadow-sm">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="space-y-1">
                      <p className="text-xl font-semibold text-[#3E2F35]">{post.title}</p>
                      <p className="text-xs text-[#3E2F35]/60">{post.slug}</p>
                      <p className="text-[0.65rem] text-[#3E2F35]/70">Updated {formatDate(post.updatedAt)}</p>
                      <p className="text-[0.65rem] text-[#3E2F35]/70">
                        Submitted: {post.submittedAt ? formatDate(post.submittedAt) : "Not submitted"}
                      </p>
                      <p className="text-[0.65rem] text-[#3E2F35]/70">
                        Published: {post.publishedAt ? formatDate(post.publishedAt) : "Not published"}
                      </p>
                      {post.rejectionNote ? (
                        <p className="text-[0.75rem] text-[#B33A3A]">{post.rejectionNote}</p>
                      ) : null}
                    </div>
                    <StatusBadge status={post.status} />
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <AuthorBadge authorName={post.authorName} authorRole={post.authorRoleSnapshot} />
                    <div className="flex flex-wrap gap-2">
                      <Link
                        href={`/dashboard/admin/blog/${post.id}`}
                        className="rounded-full border border-[#E3C6D4] px-4 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-[#3E2F35]"
                      >
                        View
                      </Link>
                      <Link
                        href={`/dashboard/admin/blog/${post.id}?mode=edit`}
                        className="rounded-full border border-[#E3C6D4] px-4 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-[#3E2F35]"
                      >
                        Edit
                      </Link>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {post.status === "IN_REVIEW" ? (
                      <>
                        <button
                          type="button"
                          onClick={() => handleApprove(post.id)}
                          disabled={!blogDbReady || isBusy("approve", post.id)}
                          className="rounded-full bg-[#C29EB3] px-4 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-white disabled:opacity-60"
                        >
                          {isBusy("approve", post.id) ? "Approving…" : "Approve"}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleReject(post.id)}
                          disabled={!blogDbReady || isBusy("reject", post.id)}
                          className="rounded-full border border-[#E3C6D4] px-4 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-[#3E2F35] disabled:opacity-60"
                        >
                          {isBusy("reject", post.id) ? "Rejecting…" : "Reject"}
                        </button>
                      </>
                    ) : null}
                    {post.status === "APPROVED" ? (
                      <button
                        type="button"
                        onClick={() => handlePublish(post)}
                        disabled={!blogDbReady || isBusy("publish", post.id)}
                        className="rounded-full bg-[#2B7C6F] px-4 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-white disabled:opacity-60"
                      >
                        {isBusy("publish", post.id) ? "Publishing…" : "Publish"}
                      </button>
                    ) : null}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="rounded-[28px] border border-[#E3C6D4] bg-[#FFF8F7] p-5 text-sm text-[#3E2F35]/70">
              No posts to show in this tab.
            </p>
          )}
        </section>
      )}
    </main>
  );
}
