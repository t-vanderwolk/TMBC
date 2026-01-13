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

type AdminBlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  status: "DRAFT" | "IN_REVIEW" | "PUBLISHED" | "ARCHIVED";
  updatedAt: string;
  submittedAt: string | null;
  publishedAt: string | null;
  authorName: string;
  authorRoleSnapshot: "ADMIN" | "MENTOR";
  isAffiliate: boolean;
};

type StatsPayload = {
  total: number;
  statusCounts: Record<string, number>;
};

type TabId = "drafts" | "submitted" | "published";

type TabDefinition = {
  id: TabId;
  label: string;
  statuses: AdminBlogPost["status"][];
};

const TAB_DEFINITIONS: TabDefinition[] = [
  { id: "drafts", label: "Drafts", statuses: ["DRAFT"] },
  { id: "submitted", label: "Submitted (mentor queue)", statuses: ["IN_REVIEW", "ARCHIVED"] },
  { id: "published", label: "Published", statuses: ["PUBLISHED"] },
];

const TAB_DESCRIPTIONS: Record<TabId, string> = {
  drafts: "Mentor drafts waiting for submission.",
  submitted: "Mentor submissions that need approval or publishing.",
  published: "Stories that are live on /blog.",
};

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
  const [filters, setFilters] = useState({ authorRole: "ALL", isAffiliate: "ALL", search: "" });
  const defaultTabId = TAB_DEFINITIONS[1]?.id ?? TAB_DEFINITIONS[0]?.id ?? "submitted";
  const [activeTab, setActiveTab] = useState(defaultTabId);
  const fallbackTab: TabDefinition = TAB_DEFINITIONS[0] ?? {
    id: "drafts",
    label: "Drafts",
    statuses: ["DRAFT"],
  };
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

  const activeTabDefinition = TAB_DEFINITIONS.find((tab) => tab.id === activeTab) ?? fallbackTab;

  const tabPosts = useMemo(
    () =>
      posts
        .filter((post) => activeTabDefinition.statuses.includes(post.status))
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
      await loadPosts();
    } catch (err) {
      setActionMessage(err instanceof Error ? err.message : `Unable to ${actionType}.`);
    } finally {
      setBusyAction(null);
    }
  };

  const handleApprove = (postId: string) => runAction("approve", "approve", postId);
  const handleReject = (postId: string) => runAction("reject", "reject", postId);
  const handlePublish = (post: AdminBlogPost) =>
    runAction("publish", "publish", post.id, {
      authorName: post.authorName,
      authorRoleSnapshot: post.authorRoleSnapshot,
    });
  const handleUnpublish = (postId: string) => runAction("unpublish", "unpublish", postId);

  const isBusy = (type: string, postId: string) => busyAction === `${type}:${postId}`;

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
        <p className="text-sm text-[#3E2F35]/70">Approve mentor work, then publish the stories that deserve the spotlight.</p>
      </header>

      <section className="space-y-4 rounded-[28px] bg-white/95 p-5 shadow-sm">
        <div>
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
          <p className="mt-3 text-sm text-[#3E2F35]/70">
            {TAB_DESCRIPTIONS[activeTabDefinition.id]}
          </p>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
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
            <span
              key={status}
              className="rounded-full border border-[#E3C6D4] px-3 py-1 text-xs uppercase tracking-[0.35em]"
            >
              {status}: {count}
            </span>
          ))}
        </div>
      </section>

      {!blogDbReady && (
        <div className="space-y-2 rounded-[28px] border border-[#E3C6D4] bg-[#FFF8F7] p-5 shadow-sm">
          <p className="text-lg font-semibold text-[#6D2E4D]">{BLOG_DB_UNAVAILABLE_HEADING}</p>
          {BLOG_DB_UNAVAILABLE_DETAILS.map((detail) => (
            <p key={detail} className="text-sm text-[#3E2F35]/80">
              {detail}
            </p>
          ))}
        </div>
      )}

      {error && (
        <div className="rounded-[28px] border border-[#F0CCD7] bg-[#FFF4FA] px-5 py-3 text-sm text-[#8B4A61]">
          {error}
        </div>
      )}

      <section className="space-y-3 rounded-[28px] bg-white/95 p-5 shadow-sm">
        {actionMessage && (
          <p className="text-sm text-[#8B4A61]">{actionMessage}</p>
        )}
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="text-[0.65rem] uppercase tracking-[0.45em] text-[#C8A1B4]">
              <tr>
                <th className="px-3 py-2 text-left">Title</th>
                <th className="px-3 py-2 text-left">Author</th>
                <th className="px-3 py-2 text-center">Status</th>
                <th className="px-3 py-2 text-left">Timeline</th>
                <th className="px-3 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5D4DB]">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-3 py-5 text-center text-sm text-[#3E2F35]/70">
                    Loading posts...
                  </td>
                </tr>
              ) : tabPosts.length ? (
                tabPosts.map((post) => {
                  const canPublish =
                    post.status === "ARCHIVED" || (post.status === "DRAFT" && post.authorRoleSnapshot === "ADMIN");
                  return (
                    <tr key={post.id} className="hover:bg-[#F9F6F7]">
                      <td className="px-3 py-3 text-[#3E2F35]">
                        <p className="font-semibold text-[#3E2F35]">{post.title}</p>
                        <p className="text-xs text-[#3E2F35]/60">{post.slug}</p>
                        <p className="text-[0.65rem] text-[#3E2F35]/70">
                          Updated {formatDate(post.updatedAt)}
                        </p>
                        <p className="text-[0.65rem] text-[#3E2F35]/70">
                          {post.isAffiliate ? "Affiliate eligible" : "Non-affiliate"}
                        </p>
                      </td>
                      <td className="px-3 py-3">
                        <AuthorBadge authorName={post.authorName} authorRole={post.authorRoleSnapshot} />
                      </td>
                      <td className="px-3 py-3 text-center">
                        <StatusBadge status={post.status} />
                      </td>
                      <td className="px-3 py-3 text-[#3E2F35]/70">
                        <p className="text-[0.65rem]">Submitted: {post.submittedAt ? formatDate(post.submittedAt) : "Not submitted"}</p>
                        <p className="text-[0.65rem]">Published: {post.publishedAt ? formatDate(post.publishedAt) : "Not published"}</p>
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex flex-wrap gap-2">
                          <Link
                            href={`/dashboard/admin/blog/${post.id}`}
                            className="rounded-full border border-[#E5D4DB] px-4 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-[#3E2F35]"
                          >
                            View
                          </Link>
                          <Link
                            href={`/dashboard/admin/blog/${post.id}?mode=edit`}
                            className="rounded-full border border-[#E5D4DB] px-4 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-[#3E2F35]"
                          >
                            Edit
                          </Link>
                          {post.status === "IN_REVIEW" && (
                            <>
                              <button
                                type="button"
                                onClick={() => handleApprove(post.id)}
                                disabled={!blogDbReady || isBusy("approve", post.id)}
                                className="rounded-full bg-[#C29EB3] px-4 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-white disabled:opacity-60"
                              >
                                {isBusy("approve", post.id) ? "Approving..." : "Approve"}
                              </button>
                              <button
                                type="button"
                                onClick={() => handleReject(post.id)}
                                disabled={!blogDbReady || isBusy("reject", post.id)}
                                className="rounded-full border border-[#E5D4DB] px-4 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-[#3E2F35] disabled:opacity-60"
                              >
                                {isBusy("reject", post.id) ? "Rejecting..." : "Reject"}
                              </button>
                            </>
                          )}
                          {canPublish && (
                            <button
                              type="button"
                              onClick={() => handlePublish(post)}
                              disabled={!blogDbReady || isBusy("publish", post.id)}
                              className="rounded-full bg-[#2B7C6F] px-4 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-white disabled:opacity-60"
                            >
                              {isBusy("publish", post.id) ? "Publishing..." : "Publish"}
                            </button>
                          )}
                          {post.status === "PUBLISHED" && (
                            <button
                              type="button"
                              onClick={() => handleUnpublish(post.id)}
                              disabled={!blogDbReady || isBusy("unpublish", post.id)}
                              className="rounded-full border border-[#E5D4DB] px-4 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-[#3E2F35] disabled:opacity-60"
                            >
                              {isBusy("unpublish", post.id) ? "Unpublishing..." : "Unpublish"}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="px-3 py-5 text-center text-sm text-[#3E2F35]/70">
                    No posts to show in this tab.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
