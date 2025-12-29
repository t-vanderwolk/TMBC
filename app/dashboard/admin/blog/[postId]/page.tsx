"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

import { useRequireRole } from "@/lib/auth/useRequireRole";
import BlogContentRenderer, { type BlogContentBlock } from "@/components/blog/BlogContentRenderer";
import BlogHighlightSection from "@/components/blog/BlogHighlightSection";

type AdminReviewPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: BlogContentBlock[];
  heroImage: string | null;
  status: "DRAFT" | "IN_REVIEW" | "PUBLISHED" | "ARCHIVED";
  authorName: string;
  authorRoleSnapshot: "ADMIN" | "MENTOR";
  highlights: Array<{
    id: string;
    productId: string | null;
    brandName: string | null;
    note: string;
    product: {
      id: string;
      name: string;
      brand: string | null;
      category: string | null;
      imageUrl: string | null;
    } | null;
  }>;
};

export default function AdminBlogReviewDetail() {
  useRequireRole(["ADMIN"]);
  const params = useParams<{ postId: string }>();
  const postId = params?.postId ?? "";

  const [post, setPost] = useState<AdminReviewPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadPost = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`/api/admin/blog/${postId}`, { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || "Unable to load blog draft.");
      }
      setPost(data?.data ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load blog draft.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!postId) return;
    void loadPost();
  }, [postId]);

  const handleAction = async (action: "publish" | "return") => {
    setError("");
    try {
      setSaving(true);
      const response = await fetch(`/api/admin/blog/${postId}/${action}`, { method: "POST" });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || "Unable to update draft.");
      }
      setPost(data?.data ?? post);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update draft.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="space-y-6 px-4 pb-20 pt-6 text-[#3E2F35] sm:px-6">
      <header className="space-y-2 rounded-[28px] bg-[#FFF9F5] p-5 shadow-sm">
        <p className="text-xs uppercase tracking-[0.4em] text-[#C8A1B4]">Blog review</p>
        <h1 className="font-serif text-3xl text-[#3E2F35]">Approve mentor draft</h1>
        <p className="text-sm text-[#3E2F35]/70">
          Confirm tone, highlights, and disclosure alignment before publishing.
        </p>
      </header>

      <div className="flex flex-wrap items-center justify-between gap-3 text-xs uppercase tracking-[0.35em] text-[#A4556A]">
        <span>Status: {post?.status.replace("_", " ").toLowerCase() ?? "loading"}</span>
        <Link href="/dashboard/admin/blog" className="text-[#A4556A] hover:text-[#7C3B53]">
          Back to review list
        </Link>
      </div>

      {error ? (
        <div className="rounded-[28px] border border-[#F0CCD7] bg-[#FFF4FA] px-5 py-3 text-sm text-[#8B4A61]">
          {error}
        </div>
      ) : null}

      {loading ? (
        <section className="rounded-[28px] bg-white/95 p-5 shadow-sm">
          <p className="text-sm text-[#3E2F35]/70">Loading draft...</p>
        </section>
      ) : null}

      {!loading && post ? (
        <>
          <section className="space-y-4 rounded-[28px] bg-white/95 p-5 shadow-sm">
            <div>
              <h2 className="text-2xl font-serif text-[#3E2F35]">{post.title}</h2>
              <p className="text-xs uppercase tracking-[0.35em] text-[#A4556A]">{post.slug}</p>
              <p className="text-sm text-[#3E2F35]/70">
                {post.authorName} · {post.authorRoleSnapshot.toLowerCase()}
              </p>
            </div>
            {post.excerpt ? <p className="text-sm text-[#3E2F35]/80">{post.excerpt}</p> : null}
          </section>

          <section className="space-y-6 rounded-[28px] bg-white/95 p-5 shadow-sm">
            <BlogContentRenderer blocks={post.content ?? []} />
            <BlogHighlightSection highlights={post.highlights ?? []} />
          </section>

          <section className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => handleAction("publish")}
              disabled={saving}
              className="rounded-full bg-[#C8A1B4] px-5 py-3 text-xs font-semibold uppercase tracking-[0.4em] text-white disabled:opacity-60"
            >
              {saving ? "Publishing..." : "Publish"}
            </button>
            <button
              type="button"
              onClick={() => handleAction("return")}
              disabled={saving}
              className="rounded-full border border-[#C8A1B4] px-5 py-3 text-xs font-semibold uppercase tracking-[0.35em] text-[#A4556A] disabled:opacity-60"
            >
              Return to draft
            </button>
          </section>
        </>
      ) : null}
    </main>
  );
}
