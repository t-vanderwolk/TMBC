"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

import { useRequireRole } from "@/lib/auth/useRequireRole";

type MentorPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  status: "DRAFT" | "IN_REVIEW" | "PUBLISHED" | "ARCHIVED";
  updatedAt: string;
  publishedAt: string | null;
};

const formatDate = (value: string | null) =>
  value
    ? new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : "Not published";

const slugify = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-|-$/g, "");

export default function MentorBlogDashboard() {
  useRequireRole(["MENTOR", "ADMIN"]);
  const router = useRouter();
  const [posts, setPosts] = useState<MentorPost[]>([]);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const suggestedSlug = useMemo(() => slugify(title), [title]);

  useEffect(() => {
    if (!slug) {
      setSlug(suggestedSlug);
    }
  }, [suggestedSlug, slug]);

  const loadPosts = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/mentor/blog", { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || "Unable to load drafts.");
      }
      setPosts(data?.data ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load drafts.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadPosts();
  }, []);

  const handleCreate = async (event: FormEvent) => {
    event.preventDefault();
    if (!title.trim() || !slug.trim()) {
      setError("Add a title and slug before creating a draft.");
      return;
    }
    try {
      setSaving(true);
      setError("");
      const response = await fetch("/api/mentor/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          slug,
          excerpt: null,
          heroImage: null,
          tags: [],
          content: [],
          highlights: [],
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || "Unable to create draft.");
      }
      const id = data?.data?.id as string | undefined;
      if (id) {
        router.push(`/dashboard/mentor/blog/${id}`);
      } else {
        await loadPosts();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to create draft.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="space-y-6 px-4 pb-20 pt-6 text-[#3E2F35] sm:px-6">
      <header className="space-y-2 rounded-[28px] bg-[#FFF9F5] p-5 shadow-sm">
        <p className="text-xs uppercase tracking-[0.4em] text-[#C8A1B4]">Mentor blog</p>
        <h1 className="font-serif text-3xl text-[#3E2F35]">Mentor drafts</h1>
        <p className="text-sm text-[#3E2F35]/70">
          Draft, submit, and iterate. Admins publish after review.
        </p>
      </header>

      {error ? (
        <div className="rounded-[28px] border border-[#F0CCD7] bg-[#FFF4FA] px-5 py-3 text-sm text-[#8B4A61]">
          {error}
        </div>
      ) : null}

      <section className="space-y-4 rounded-[28px] bg-white/95 p-5 shadow-sm">
        <div className="space-y-1">
          <h2 className="text-xs font-semibold uppercase tracking-[0.35em] text-[#A4556A]">
            Start a new draft
          </h2>
          <p className="text-sm text-[#3E2F35]/70">Short, calm guidance goes furthest.</p>
        </div>
        <form onSubmit={handleCreate} className="space-y-3">
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-[0.35em] text-[#A4556A]">Title</label>
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="A steady guide to choosing the stroller"
              className="w-full rounded-2xl border border-[#E3C6D4] bg-white/90 p-3 text-sm text-[#3E2F35]"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-[0.35em] text-[#A4556A]">Slug</label>
            <input
              value={slug}
              onChange={(event) => setSlug(event.target.value)}
              placeholder="steady-stroller-guide"
              className="w-full rounded-2xl border border-[#E3C6D4] bg-white/90 p-3 text-sm text-[#3E2F35]"
            />
          </div>
          <button
            type="submit"
            disabled={saving}
            className="rounded-full bg-[#C8A1B4] px-5 py-3 text-xs font-semibold uppercase tracking-[0.4em] text-white disabled:opacity-60"
          >
            {saving ? "Creating..." : "Create draft"}
          </button>
        </form>
      </section>

      <section className="space-y-3 rounded-[28px] bg-white/95 p-5 shadow-sm">
        <div className="space-y-1">
          <h2 className="text-xs font-semibold uppercase tracking-[0.35em] text-[#A4556A]">
            Drafts and reviews
          </h2>
          <p className="text-sm text-[#3E2F35]/70">Open a draft to refine, then submit for review.</p>
        </div>
        {loading ? (
          <p className="text-sm text-[#3E2F35]/70">Loading drafts...</p>
        ) : posts.length ? (
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
                  </div>
                  <div className="space-y-2 text-right">
                    <p className="text-xs text-[#3E2F35]/60">Published: {formatDate(post.publishedAt)}</p>
                    <Link
                      href={`/dashboard/mentor/blog/${post.id}`}
                      className="inline-flex items-center justify-center rounded-full border border-[#C8A1B4] px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-[#A4556A]"
                    >
                      Open draft
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-[#3E2F35]/70">No drafts yet.</p>
        )}
      </section>
    </main>
  );
}
