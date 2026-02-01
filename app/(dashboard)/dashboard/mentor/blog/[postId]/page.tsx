"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import { authedFetch } from "@/lib/authedFetch";
import { useRequireRole } from "@/lib/auth/useRequireRole";
import BlogEditorForm, {
  type BlogContentBlock,
  type BlogEditorFormPayload,
} from "@/components/blog-admin/BlogEditorForm";
import AnalyticsMiniCards from "@/components/blog-admin/AnalyticsMiniCards";
import StatusBadge from "@/components/blog-admin/StatusBadge";
import type { BlogStatusLabel } from "@/types/blogStatus";

type MentorPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  heroImage: string | null;
  content: Array<{ type: string; [key: string]: unknown }>;
  tags: string[];
  status: BlogStatusLabel;
  isAffiliate: boolean;
  submittedAt: string | null;
  publishedAt: string | null;
  highlights: Array<{ id: string; note: string; productId: string | null; brandName: string | null }>;
  rejectionNote?: string | null;
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

export default function MentorBlogEditorPage() {
  useRequireRole(["MENTOR", "ADMIN"]);
  const params = useParams<{ postId: string }>();
  const postId = params?.postId ?? "";

  const [post, setPost] = useState<MentorPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [analytics, setAnalytics] = useState<AnalyticsPayload | null>(null);

  const loadPost = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await authedFetch(`/api/mentor/blog/${postId}`, { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error ?? "Unable to load draft.");
      }
      setPost(data?.data ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load draft.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!postId) return;
    void loadPost();
  }, [postId]);

  const loadAnalytics = async () => {
    if (!postId) return;
    try {
      const response = await authedFetch(`/api/mentor/blog/analytics?postId=${postId}`, { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error ?? "Unable to load analytics.");
      }
      setAnalytics(data?.data?.metrics ?? null);
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
      const response = await authedFetch(`/api/mentor/blog/${postId}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result?.error ?? "Unable to save draft.");
      }
      await loadPost();
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError("");
    try {
      const response = await authedFetch(`/api/mentor/blog/${postId}/submit`, { method: "POST" });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result?.error ?? "Unable to submit for review.");
      }
      void loadPost();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unable to submit draft.");
    } finally {
      setSubmitting(false);
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
            <p className="text-xs uppercase tracking-[0.4em] text-[#C8A1B4]">Mentor blog editor</p>
            <h1 className="font-serif text-3xl text-[#3E2F35]">Draft settings</h1>
          </div>
          {post ? <StatusBadge status={post.status} /> : null}
        </div>
        <p className="text-sm text-[#3E2F35]/70">
          Save drafts, then submit for admin review once you&apos;re ready.
        </p>
      </header>

      {post?.rejectionNote ? (
        <div className="rounded-[28px] border border-[#E3C6D4] bg-[#FFF8F7] px-5 py-3 text-sm text-[#3E2F35]/80">
          <p className="text-xs uppercase tracking-[0.35em] text-[#A4556A]">Revision requested</p>
          <p>{post.rejectionNote}</p>
        </div>
      ) : null}

      {error ? (
        <div className="rounded-[28px] border border-[#F0CCD7] bg-[#FFF4FA] px-5 py-3 text-sm text-[#8B4A61]">
          {error}
        </div>
      ) : null}

      {loading || !post ? (
        <section className="rounded-[28px] bg-white/95 p-5 shadow-sm">
          <p className="text-sm text-[#3E2F35]/70">Loading draft...</p>
        </section>
      ) : (
        <>
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
            disabled={post.status !== "DRAFT" && post.status !== "REJECTED"}
            submitLabel="Save changes"
          >
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting || (post.status !== "DRAFT" && post.status !== "REJECTED")}
              className="rounded-full border border-[#C8A1B4] px-5 py-3 text-xs font-semibold uppercase tracking-[0.35em] text-[#A4556A] disabled:opacity-60"
            >
              {submitting ? "Submitting..." : "Submit for review"}
            </button>
          </BlogEditorForm>
          <section className="space-y-3 rounded-[28px] border border-[#E3C6D4] bg-white/95 p-5 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-[0.55rem] uppercase tracking-[0.35em] text-[#A4556A]">Analytics</p>
              <p className="text-[0.65rem] text-[#3E2F35]/70">{`Status: ${post.status}`}</p>
            </div>
            {analytics ? (
              <AnalyticsMiniCards metrics={analytics} />
            ) : (
              <p className="text-xs text-[#3E2F35]/60">Analytics will populate after views are recorded.</p>
            )}
          </section>
          {post.highlights?.length ? (
            <section className="space-y-3 rounded-[28px] border border-[#E3C6D4] bg-white/95 p-5 shadow-sm">
              <p className="text-[0.55rem] uppercase tracking-[0.35em] text-[#A4556A]">Highlights</p>
              <div className="space-y-2">
                {post.highlights.map((highlight) => (
                  <div key={highlight.id} className="rounded-2xl bg-[#FFF9F5] p-3 text-sm text-[#3E2F35]">
                    <p className="font-semibold">{highlight.productId ?? highlight.brandName ?? "Canon highlight"}</p>
                    <p className="text-xs">{highlight.note}</p>
                  </div>
                ))}
              </div>
            </section>
          ) : null}
        </>
      )}
    </main>
  );
}
