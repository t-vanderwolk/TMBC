"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { authedFetch } from "@/lib/authedFetch";
import type { AdminBlogControlPost, AdminBlogControlSnapshotPayload } from "@/lib/services/server/blogAdminControls.service";
import { BlogStatus } from "@prisma/client";
import {
  BLOG_DB_UNAVAILABLE_DETAILS,
  BLOG_DB_UNAVAILABLE_HEADING,
} from "@/lib/blog/blogReadiness";

const statusStyles: Record<string, string> = {
  DRAFT: "bg-member-background-muted text-member-accent-secondary",
  IN_REVIEW: "bg-member-background-soft text-member-accent-primary",
  APPROVED: "bg-member-background-muted text-member-text-secondary",
  PUBLISHED: "bg-member-semantic-success/20 text-member-semantic-success",
  REJECTED: "bg-[#FFE8E8] text-[#B33A3A]",
  ARCHIVED: "bg-member-background-muted text-member-text-secondary",
};

const statusLabels: Record<string, string> = {
  DRAFT: "Draft",
  IN_REVIEW: "Submitted",
  APPROVED: "Approved",
  PUBLISHED: "Published",
  REJECTED: "Needs revision",
  ARCHIVED: "Archived",
};

type BlogControlsProps = {
  data: AdminBlogControlSnapshotPayload;
};

export default function BlogControls({ data }: BlogControlsProps) {
  const router = useRouter();
  const [publishingId, setPublishingId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const blogDbReady = data.blogDbReady;

  const handlePublish = async (post: AdminBlogControlPost) => {
    if (!blogDbReady) {
      setMessage("Blog tables are temporarily unavailable.");
      return;
    }
    if (!window.confirm("Publish this post?")) {
      return;
    }
    setPublishingId(post.id);
    setMessage("");
    try {
      const response = await authedFetch(`/api/admin/blog/${post.id}/publish`, { method: "POST" });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload?.error ?? "Unable to publish.");
      }
      router.refresh();
    } catch (error) {
      setMessage((error as Error).message);
    } finally {
      setPublishingId(null);
    }
  };

  const summaryCards = useMemo(
    () => [
      { label: "Drafts", status: BlogStatus.DRAFT },
      { label: "Submitted", status: BlogStatus.IN_REVIEW, highlighted: true },
      { label: "Approved", status: BlogStatus.APPROVED },
      { label: "Published", status: BlogStatus.PUBLISHED },
    ],
    [],
  );

  const renderStatusBadge = (status: string) => (
    <span className={`inline-flex items-center justify-center rounded-full px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.3em] ${statusStyles[status]}`}>
      {statusLabels[status] ?? status}
    </span>
  );

  const formatDate = (value: Date | null) =>
    value
      ? new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
      : "Not submitted";

  return (
    <section id="blog-controls" className="space-y-6">
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.4em] text-member-accent-secondary">Admin · Blog controls</p>
        <h2 className="text-2xl font-serif text-member-text-primary">Blog activity snapshot</h2>
        <p className="text-sm text-member-text-secondary">
          Keep mentor submissions in view—jump straight into review, editing, and publishing.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {summaryCards.map((card) => {
          const count = data.counts[card.status] ?? 0;
          return (
        <Link
          key={card.status}
          href={`/dashboard/admin/blog?status=${card.status}`}
          className={`rounded-[28px] border border-member-border-soft bg-member-background-card p-5 text-sm shadow-sm transition hover:border-member-accent-secondary ${
            card.highlighted ? "ring-2 ring-member-accent-subtle" : ""
          }`}
        >
          <p className="text-[0.65rem] uppercase tracking-[0.35em] text-member-accent-secondary">
            {card.label}
          </p>
          <p className="text-3xl font-semibold text-member-text-primary">{count}</p>
        </Link>
          );
        })}
      </div>

      {!blogDbReady ? (
        <div className="space-y-2 rounded-[28px] border border-member-border-soft bg-member-background-soft p-5 shadow-sm">
          <p className="text-sm font-semibold text-member-text-primary">{BLOG_DB_UNAVAILABLE_HEADING}</p>
          {BLOG_DB_UNAVAILABLE_DETAILS.map((detail) => (
            <p key={detail} className="text-sm text-member-text-secondary">
              {detail}
            </p>
          ))}
        </div>
      ) : null}

      <div className="space-y-3 rounded-[28px] border border-member-border-default/70 bg-member-background-card p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-member-accent-secondary">Blog Controls</p>
            <h3 className="text-xl font-semibold text-member-text-primary">Recent blog submissions</h3>
          </div>
          <Link
            href="/dashboard/admin/blog"
            className="text-xs font-semibold uppercase tracking-[0.35em] text-member-accent-secondary"
          >
            View all
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="text-[0.65rem] uppercase tracking-[0.45em] text-member-accent-secondary">
              <tr>
                <th className="px-3 py-2 text-left">Title</th>
                <th className="px-3 py-2 text-left">Author</th>
                <th className="px-3 py-2 text-center">Status</th>
                <th className="px-3 py-2 text-left">Submitted at</th>
                <th className="px-3 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-member-border-default">
              {data.recentPosts.map((post) => {
                const publishableStatus =
                  post.status === "APPROVED" ||
                  post.status === "ARCHIVED" ||
                  (post.status === "DRAFT" && post.authorRoleSnapshot === "ADMIN");
                const canPublish = publishableStatus && post.isAffiliate && post.affiliateLinkCount > 0;
                const publishHelper =
                  !post.isAffiliate || post.affiliateLinkCount === 0
                    ? "Add END_CARD affiliate links before publishing"
                    : "Requires approved status";
                return (
                  <tr key={post.id} className="hover:bg-member-background-soft">
                    <td className="px-3 py-3 text-member-text-primary">
                      <Link
                        href={`/dashboard/admin/blog/${post.id}`}
                        className="font-semibold text-member-text-primary"
                      >
                        {post.title}
                      </Link>
                    </td>
                    <td className="px-3 py-3 text-member-text-primary">
                      <p className="font-semibold">{post.authorName}</p>
                      <span className="rounded-full border border-member-border-soft px-2 py-0.5 text-[0.55rem] uppercase tracking-[0.35em] text-member-text-secondary">
                        {post.authorRoleSnapshot === "ADMIN" ? "Admin" : "Mentor"}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-center">{renderStatusBadge(post.status)}</td>
                    <td className="px-3 py-3 text-member-text-secondary">{formatDate(post.submittedAt)}</td>
                    <td className="px-3 py-3">
                      <div className="flex flex-wrap gap-2">
                        <Link
                          href={`/dashboard/admin/blog/${post.id}`}
                          className="rounded-full border border-member-border-soft px-4 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-member-text-primary"
                        >
                          View
                        </Link>
                        {post.status === "IN_REVIEW" ? (
                          <Link
                            href={`/dashboard/admin/blog/${post.id}`}
                            className="rounded-full bg-member-accent-primary px-4 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-member-text-inverse"
                          >
                            Review
                          </Link>
                        ) : null}
                        <Link
                          href={`/dashboard/admin/blog/${post.id}`}
                          className="rounded-full border border-member-border-soft px-4 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-member-text-primary"
                        >
                          Edit
                        </Link>
                        <button
                          type="button"
                          onClick={() => handlePublish(post)}
                          disabled={!canPublish || publishingId === post.id || !blogDbReady}
                          className="rounded-full bg-member-semantic-success px-4 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-member-text-inverse disabled:opacity-60 disabled:bg-member-state-disabled"
                        >
                          {publishingId === post.id ? "Publishing…" : "Publish"}
                        </button>
                      </div>
                      {!canPublish ? (
                        <p className="mt-1 text-[0.55rem] text-member-text-secondary">{publishHelper}</p>
                      ) : null}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {message ? (
          <p className="text-xs text-member-semantic-error">{message}</p>
        ) : null}
      </div>
    </section>
  );
}
