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
import type { BlogStatusLabel } from "@/types/blogStatus";

type MentorPost = {
  id: string;
  slug: string;
  title: string;
  status: BlogStatusLabel;
  updatedAt: string;
  publishedAt: string | null;
  submittedAt: string | null;
  isAffiliate: boolean;
  rejectionNote?: string | null;
};

type SectionDefinition = {
  title: string;
  description: string;
  items: MentorPost[];
  emptyMessage: string;
  allowSubmit: boolean;
};

const formatDate = (value: string | null) =>
  value
    ? new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : "Not available";

export default function MentorBlogDashboard() {
  useRequireRole(["MENTOR", "ADMIN"]);
  const [posts, setPosts] = useState<MentorPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [blogDbReady, setBlogDbReady] = useState(true);
  const [actionMessage, setActionMessage] = useState("");
  const [busyAction, setBusyAction] = useState<string | null>(null);

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

  const drafts = posts.filter((post) => post.status === "DRAFT");
  const submitted = posts.filter((post) => post.status === "IN_REVIEW");
  const rejected = posts.filter((post) => post.status === "REJECTED");
  const approved = posts.filter((post) => post.status === "APPROVED");
  const published = posts.filter((post) => ["PUBLISHED", "ARCHIVED"].includes(post.status));

  const sections: SectionDefinition[] = [
    {
      title: "Drafts",
      description: "Update your drafts before submitting for admin review.",
      items: drafts,
      emptyMessage: "No drafts yet.",
      allowSubmit: true,
    },
    {
      title: "Submitted",
      description: "Mentor drafts awaiting admin feedback.",
      items: submitted,
      emptyMessage: "No submissions at the moment.",
      allowSubmit: false,
    },
    {
      title: "Revision requests",
      description: "Admin feedback is saved here so you can revisit the draft.",
      items: rejected,
      emptyMessage: "No revision requests right now.",
      allowSubmit: true,
    },
    {
      title: "Approved",
      description: "Admin has approved these stories—now they are in publishing hands.",
      items: approved,
      emptyMessage: "No approved content yet.",
      allowSubmit: false,
    },
    {
      title: "Published stories",
      description: "Live and archived pieces you can read whenever you like.",
      items: published,
      emptyMessage: "No live stories yet.",
      allowSubmit: false,
    },
  ];

  const handleSubmit = async (postId: string) => {
    setBusyAction(postId);
    setActionMessage("");
    try {
      const response = await authedFetch(`/api/mentor/blog/${postId}/submit`, { method: "POST" });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload?.error ?? "Unable to submit draft.");
      }
      setActionMessage("Submitted for review. Admin notified.");
      await loadPosts();
    } catch (err) {
      setActionMessage(err instanceof Error ? err.message : "Unable to submit draft.");
    } finally {
      setBusyAction(null);
    }
  };

  const renderCard = (post: MentorPost, showSubmit: boolean) => {
    const isEditable = post.status === "DRAFT" || post.status === "REJECTED";
    const buttonLabel = isEditable ? "Edit" : "View";
    return (
      <article key={post.id} className="rounded-2xl border border-member-border-default bg-member-background-card p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-1">
            <p className="text-base font-semibold text-member-text-primary">{post.title}</p>
            <p className="text-xs text-member-text-secondary/70">{post.slug}</p>
            <p className="text-[0.65rem] text-member-text-secondary">
              Updated {formatDate(post.updatedAt)}
            </p>
            {post.submittedAt ? (
              <p className="text-[0.65rem] text-member-text-secondary">
                Submitted {formatDate(post.submittedAt)}
              </p>
            ) : null}
            {post.publishedAt ? (
              <p className="text-[0.65rem] text-member-text-secondary">
                Published {formatDate(post.publishedAt)}
              </p>
            ) : null}
            {post.rejectionNote ? (
              <p className="text-[0.75rem] text-member-semantic-error">Admin note: {post.rejectionNote}</p>
            ) : null}
            <p className="text-[0.65rem] text-member-text-secondary">
              {post.isAffiliate ? "Affiliate eligible" : "Non-affiliate draft"}
            </p>
          </div>
          <StatusBadge status={post.status} />
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Link
            href={`/dashboard/mentor/blog/${post.id}`}
            className="rounded-full border border-member-border-default px-4 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-member-accent-primary"
          >
            {buttonLabel}
          </Link>
          {showSubmit && (
            <button
              type="button"
              onClick={() => handleSubmit(post.id)}
              disabled={busyAction === post.id || !blogDbReady}
              className="rounded-full bg-member-accent-primary px-4 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-member-text-inverse disabled:opacity-60"
            >
              {busyAction === post.id ? "Submitting…" : "Submit for review"}
            </button>
          )}
        </div>
      </article>
    );
  };

  const renderSection = (section: SectionDefinition) => (
    <section
      key={section.title}
      className="space-y-4 rounded-[28px] border border-member-border-default bg-member-background-card p-5 shadow-soft"
    >
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[0.65rem] uppercase tracking-[0.4em] text-member-accent-secondary">{section.title}</p>
          <p className="text-sm text-member-text-secondary">{section.description}</p>
        </div>
        <p className="text-xs text-member-text-secondary">{section.items.length} posts</p>
      </div>
      {section.items.length ? (
        <div className="space-y-3">
          {section.items.map((post) => renderCard(post, section.allowSubmit))}
        </div>
      ) : (
        <p className="text-sm text-member-text-secondary">{section.emptyMessage}</p>
      )}
    </section>
  );

  return (
    <main className="space-y-6 px-4 pb-20 pt-6 text-member-text-primary sm:px-6">
      <header className="space-y-2 rounded-[28px] border border-member-border-default bg-member-background-card p-5 shadow-soft">
        <p className="text-xs uppercase tracking-[0.4em] text-member-accent-secondary">Mentor blog</p>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="font-serif text-3xl text-member-text-primary">Draft workspace</h1>
          <Link
            href="/dashboard/mentor/blog/new"
            className="rounded-full bg-member-accent-primary px-5 py-3 text-xs font-semibold uppercase tracking-[0.35em] text-member-text-inverse"
          >
            Draft a post
          </Link>
        </div>
          <p className="text-sm text-member-text-secondary">
          Keep your draft private until it&apos;s ready for admin review.
        </p>
      </header>

      {actionMessage ? (
        <div className="rounded-[28px] border border-member-border-default bg-member-background-soft px-5 py-3 text-sm text-member-text-secondary">
          {actionMessage}
        </div>
      ) : null}

      {!blogDbReady ? (
        <div className="space-y-2 rounded-[28px] border border-member-border-default bg-member-background-soft p-5 shadow-soft">
          <p className="text-sm font-semibold text-member-text-primary">{BLOG_DB_UNAVAILABLE_HEADING}</p>
          {BLOG_DB_UNAVAILABLE_DETAILS.map((detail) => (
            <p key={detail} className="text-sm text-member-text-secondary">
              {detail}
            </p>
          ))}
        </div>
      ) : null}

      {error ? (
        <div className="rounded-[28px] border border-member-border-soft bg-member-background-soft px-5 py-3 text-sm text-member-text-secondary">
          {error}
        </div>
      ) : null}

      {loading ? (
        <section className="rounded-[28px] border border-member-border-default bg-member-background-card p-5 shadow-soft">
          <p className="text-sm text-member-text-secondary">Loading drafts...</p>
        </section>
      ) : (
        <>{sections.map((section) => renderSection(section))}</>
      )}
    </main>
  );
}
