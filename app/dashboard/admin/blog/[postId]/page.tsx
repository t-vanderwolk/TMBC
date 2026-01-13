"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import type { BlogAuthorRole } from "@prisma/client";

import { authedFetch } from "@/lib/authedFetch";
import { useRequireRole } from "@/lib/auth/useRequireRole";
import BlogEditorForm, {
  type BlogContentBlock,
  type BlogEditorFormPayload,
} from "@/components/blog-admin/BlogEditorForm";
import StatusBadge from "@/components/blog-admin/StatusBadge";
import AuthorBadge from "@/components/blog-admin/AuthorBadge";
import AnalyticsMiniCards from "@/components/blog-admin/AnalyticsMiniCards";
import AffiliateLinksEditor, {
  type AffiliateLinkSummary,
} from "@/components/blog-admin/AffiliateLinksEditor";

type AdminPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  heroImage: string | null;
  content: Array<{ type: string; [key: string]: unknown }>;
  tags: string[];
  status: "DRAFT" | "IN_REVIEW" | "PUBLISHED" | "ARCHIVED";
  isAffiliate: boolean;
  publishedAt: string | null;
  submittedAt: string | null;
  authorName: string;
  authorRoleSnapshot: "ADMIN" | "MENTOR";
  highlights: Array<{ id: string; note: string; productId: string | null; brandName: string | null }>;
  affiliateLinks: AffiliateLinkSummary[];
};

type AnalyticsPayload = {
  views: number;
  read75: number;
  shares: number;
  clicks: number;
};

const formatDate = (value: string | null) =>
  value
    ? new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : "Not available";

export default function AdminBlogPostPage() {
  useRequireRole(["ADMIN"]);
  const params = useParams<{ postId: string }>();
  const postId = params?.postId ?? "";

  const [post, setPost] = useState<AdminPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [archiving, setArchiving] = useState(false);
  const [returning, setReturning] = useState(false);
  const [analytics, setAnalytics] = useState<AnalyticsPayload | null>(null);
  const [error, setError] = useState("");
  const [overrideAuthorName, setOverrideAuthorName] = useState("");
  const [overrideAuthorRole, setOverrideAuthorRole] = useState<BlogAuthorRole>("ADMIN");

  const loadPost = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await authedFetch(`/api/admin/blog/${postId}`, { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error ?? "Unable to load post.");
      }
      setPost(data?.data ?? null);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Unable to load post.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!postId) return;
    void loadPost();
  }, [postId]);

  useEffect(() => {
    if (!post) return;
    setOverrideAuthorName(post.authorName);
    setOverrideAuthorRole(post.authorRoleSnapshot);
  }, [post]);

  const loadAnalytics = async () => {
    if (!postId) {
      return;
    }
    try {
      const response = await authedFetch(`/api/admin/blog/analytics?postId=${postId}`, { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error ?? "Unable to load analytics.");
      }
      const metrics = data?.data?.posts?.[0]?.metrics;
      setAnalytics(metrics ?? null);
    } catch {
      setAnalytics(null);
    }
  };

  useEffect(() => {
    void loadAnalytics();
  }, [postId]);

  const handleSave = async (payload: BlogEditorFormPayload) => {
    setSaving(true);
    setError("");
    try {
      const response = await authedFetch(`/api/admin/blog/${postId}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result?.error ?? "Unable to save post.");
      }
      await loadPost();
    } finally {
      setSaving(false);
    }
  };

  const handleAction = async (action: "publish" | "archive" | "return") => {
    setError("");
    if (action === "publish" && !overrideAuthorName.trim()) {
      setError("Please provide an author name before publishing.");
      return;
    }

    setPublishing(action === "publish");
    setArchiving(action === "archive");
    setReturning(action === "return");

    try {
      const endpoint =
        action === "publish"
          ? `/api/admin/blog/${postId}/publish`
          : action === "archive"
          ? `/api/admin/blog/${postId}/archive`
          : `/api/admin/blog/${postId}/return`;
      const requestInit: RequestInit = { method: "POST" };
      if (action === "publish") {
        requestInit.body = JSON.stringify({
          authorName: overrideAuthorName.trim(),
          authorRoleSnapshot: overrideAuthorRole,
        });
      }
      const response = await authedFetch(endpoint, requestInit);
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result?.error ?? "Unable to update status.");
      }
      await loadPost();
    } catch (statusError) {
      setError(statusError instanceof Error ? statusError.message : "Unable to update status.");
    } finally {
      setPublishing(false);
      setArchiving(false);
      setReturning(false);
    }
  };

  if (!postId) {
    return <p className="text-sm text-[#3E2F35]/70">Post not found.</p>;
  }

  return (
    <main className="space-y-6 px-4 pb-20 pt-6 text-[#3E2F35] sm:px-6">
      <header className="space-y-2 rounded-[28px] bg-[#FFF9F5] p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-[#C8A1B4]">Admin blog</p>
            <h1 className="font-serif text-3xl text-[#3E2F35]">Review post</h1>
          </div>
          {post ? <StatusBadge status={post.status} /> : null}
        </div>
        <p className="text-sm text-[#3E2F35]/70">
          Tip the tone, affiliate strategy, and status before the story goes live.
        </p>
      </header>

      {error ? (
        <div className="rounded-[28px] border border-[#F0CCD7] bg-[#FFF4FA] px-5 py-3 text-sm text-[#8B4A61]">
          {error}
        </div>
      ) : null}

      {loading || !post ? (
        <section className="rounded-[28px] bg-white/95 p-5 shadow-sm">
          <p className="text-sm text-[#3E2F35]/70">Loading post...</p>
        </section>
      ) : (
        <>
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs uppercase tracking-[0.35em] text-[#A4556A]">
            <span>Status: {post.status.replace("_", " ").toLowerCase()}</span>
            <span>
              Submitted: {formatDate(post.submittedAt)} · Published: {formatDate(post.publishedAt)}
            </span>
          </div>

          <BlogEditorForm
            initialValue={{
              title: post.title,
              slug: post.slug,
              excerpt: post.excerpt,
              heroImage: post.heroImage,
              tags: post.tags,
              content: post.content as BlogContentBlock[],
              isAffiliate: post.isAffiliate,
            }}
            status={post.status}
            onSubmit={handleSave}
            saving={saving}
            submitLabel="Save updates"
          >
            <div className="space-y-4">
              <div className="rounded-2xl border border-[#E3C6D4] bg-white/90 p-4 shadow-sm">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="text-[0.55rem] uppercase tracking-[0.35em] text-[#A4556A]">
                    Author attribution
                  </p>
                  <p className="text-[0.65rem] text-[#3E2F35]/70">
                    Admins may override the public name before publishing.
                  </p>
                </div>
                <div className="mt-3 grid gap-3 md:grid-cols-2">
                  <label className="space-y-1 text-xs uppercase tracking-[0.35em] text-[#3E2F35]/70">
                    <span className="text-[0.6rem] text-[#A4556A]">Name</span>
                    <input
                      value={overrideAuthorName}
                      onChange={(event) => setOverrideAuthorName(event.target.value)}
                      disabled={publishing}
                      className="w-full rounded-xl border border-[#E3C6D4] px-3 py-2 text-sm text-[#3E2F35]"
                      placeholder="Author name"
                    />
                  </label>
                  <label className="space-y-1 text-xs uppercase tracking-[0.35em] text-[#3E2F35]/70">
                    <span className="text-[0.6rem] text-[#A4556A]">Role</span>
                    <select
                      value={overrideAuthorRole}
                      onChange={(event) =>
                        setOverrideAuthorRole(event.target.value as BlogAuthorRole)
                      }
                      disabled={publishing}
                      className="w-full rounded-xl border border-[#E3C6D4] bg-white px-3 py-2 text-sm text-[#3E2F35]"
                    >
                      <option value="ADMIN">Admin</option>
                      <option value="MENTOR">Mentor</option>
                    </select>
                  </label>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => void handleAction("publish")}
                  disabled={publishing || post.status === "PUBLISHED"}
                  className="rounded-full bg-[#2B7C6F] px-5 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-white disabled:opacity-60"
                >
                  {publishing ? "Publishing..." : "Approve & publish"}
                </button>
                <button
                  type="button"
                  onClick={() => void handleAction("archive")}
                  disabled={archiving || post.status === "ARCHIVED"}
                  className="rounded-full border border-[#C8A1B4] px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-[#A4556A] disabled:opacity-60"
                >
                  {archiving ? "Archiving..." : "Archive"}
                </button>
                <button
                  type="button"
                  onClick={() => void handleAction("return")}
                  disabled={returning || post.status === "DRAFT"}
                  className="rounded-full border border-[#C8A1B4] px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-[#A4556A] disabled:opacity-60"
                >
                  {returning ? "Returning..." : "Return to draft"}
                </button>
              </div>
            </div>
          </BlogEditorForm>

          <section className="space-y-3 rounded-[28px] border border-[#E3C6D4] bg-white/95 p-5 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-[0.55rem] uppercase tracking-[0.35em] text-[#A4556A]">Analytics</p>
              <AuthorBadge authorName={post.authorName} authorRole={post.authorRoleSnapshot} />
            </div>
            {analytics ? (
              <AnalyticsMiniCards metrics={analytics} />
            ) : (
              <p className="text-xs text-[#3E2F35]/60">Analytics will show once data is available.</p>
            )}
          </section>

          <AffiliateLinksEditor postId={post.id} initialLinks={post.affiliateLinks} />
        </>
      )}
    </main>
  );
}
