"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { authedFetch } from "@/lib/authedFetch";
import type { AdminBlogControlPost, AdminBlogControlSnapshot } from "@/lib/services/server/blogAdminControls.service";

const statusStyles: Record<string, string> = {
  DRAFT: "bg-[#F3E9F2] text-[#6D2E4D]",
  IN_REVIEW: "bg-[#FFF4D9] text-[#7A4B14]",
  PUBLISHED: "bg-[#D8F1E4] text-[#1F644B]",
  ARCHIVED: "bg-[#FDE7E3] text-[#9D3B2D]",
};

const statusLabels: Record<string, string> = {
  DRAFT: "Draft",
  IN_REVIEW: "In review",
  PUBLISHED: "Published",
  ARCHIVED: "Archived",
};

type BlogControlsProps = {
  data: AdminBlogControlSnapshot;
};

export default function BlogControls({ data }: BlogControlsProps) {
  const router = useRouter();
  const [publishingId, setPublishingId] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  const handlePublish = async (post: AdminBlogControlPost) => {
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
      { label: "Drafts", status: "DRAFT" },
      { label: "Awaiting Review", status: "IN_REVIEW", highlighted: true },
      { label: "Published", status: "PUBLISHED" },
      { label: "Archived", status: "ARCHIVED" },
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
        <p className="text-xs uppercase tracking-[0.4em] text-[#C8A1B4]">Admin · Blog controls</p>
        <h2 className="text-2xl font-serif text-[#3E2F35]">Blog activity snapshot</h2>
        <p className="text-sm text-[#3E2F35]/70">
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
              className={`rounded-[28px] border border-[#E5D4DB] bg-white/90 p-5 text-sm shadow-sm transition hover:border-tmDeepMauve ${
                card.highlighted ? "ring-2 ring-[#FDE7E3]" : ""
              }`}
            >
              <p className="text-[0.65rem] uppercase tracking-[0.35em] text-[#C8A1B4]">{card.label}</p>
              <p className="text-3xl font-semibold text-[#3E2F35]">{count}</p>
            </Link>
          );
        })}
      </div>

      <div className="space-y-3 rounded-[28px] border border-[#E3C6D4] bg-white/95 p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-[#C8A1B4]">Blog Controls</p>
            <h3 className="text-xl font-semibold text-[#3E2F35]">Recent blog submissions</h3>
          </div>
          <Link
            href="/dashboard/admin/blog"
            className="text-xs font-semibold uppercase tracking-[0.35em] text-[#A4556A]"
          >
            View all
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="text-[0.65rem] uppercase tracking-[0.45em] text-[#C8A1B4]">
              <tr>
                <th className="px-3 py-2 text-left">Title</th>
                <th className="px-3 py-2 text-left">Author</th>
                <th className="px-3 py-2 text-center">Status</th>
                <th className="px-3 py-2 text-left">Submitted at</th>
                <th className="px-3 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5D4DB]">
              {data.recentPosts.map((post) => {
                const canPublish =
                  ((post.status === "IN_REVIEW") ||
                    (post.status === "DRAFT" && post.authorRoleSnapshot === "ADMIN")) &&
                  post.isAffiliate &&
                  post.affiliateLinkCount > 0;
                const publishHelper =
                  !post.isAffiliate || post.affiliateLinkCount === 0
                    ? "Add END_CARD affiliate links before publishing"
                    : "Requires IN_REVIEW status";
                return (
                  <tr key={post.id} className="hover:bg-[#F9F6F7]">
                    <td className="px-3 py-3 text-[#3E2F35]">
                      <Link href={`/dashboard/admin/blog/${post.id}`} className="font-semibold text-[#3E2F35]">
                        {post.title}
                      </Link>
                    </td>
                    <td className="px-3 py-3 text-[#3E2F35]">
                      <p className="font-semibold">{post.authorName}</p>
                      <span className="rounded-full border border-[#E3D4DB] px-2 py-0.5 text-[0.55rem] uppercase tracking-[0.35em] text-[#A4556A]">
                        {post.authorRoleSnapshot === "ADMIN" ? "Admin" : "Mentor"}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-center">{renderStatusBadge(post.status)}</td>
                    <td className="px-3 py-3 text-[#3E2F35]/70">{formatDate(post.submittedAt)}</td>
                    <td className="px-3 py-3">
                      <div className="flex flex-wrap gap-2">
                        <Link
                          href={`/dashboard/admin/blog/${post.id}`}
                          className="rounded-full border border-[#E5D4DB] px-4 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-[#3E2F35]"
                        >
                          View
                        </Link>
                        {post.status === "IN_REVIEW" ? (
                          <Link
                            href={`/dashboard/admin/blog/${post.id}`}
                            className="rounded-full bg-[#C29EB3] px-4 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-white"
                          >
                            Review
                          </Link>
                        ) : null}
                        <Link
                          href={`/dashboard/admin/blog/${post.id}`}
                          className="rounded-full border border-[#E5D4DB] px-4 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-[#3E2F35]"
                        >
                          Edit
                        </Link>
                        <button
                          type="button"
                          onClick={() => handlePublish(post)}
                          disabled={!canPublish || publishingId === post.id}
                          className="rounded-full bg-[#2B7C6F] px-4 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-white disabled:opacity-60"
                        >
                          {publishingId === post.id ? "Publishing…" : "Publish"}
                        </button>
                      </div>
                      {!canPublish ? (
                        <p className="mt-1 text-[0.55rem] text-[#A4556A]">{publishHelper}</p>
                      ) : null}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {message ? <p className="text-xs text-[#9D3B2D]">{message}</p> : null}
      </div>
    </section>
  );
}
