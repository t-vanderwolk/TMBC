import type { BlogStatusLabel } from "@/types/blogStatus";

const STATUS_STYLES: Record<BlogStatusLabel, { label: string; className: string }> = {
  DRAFT: { label: "Draft", className: "bg-[#F8EFF3] text-[#A4556A]" },
  IN_REVIEW: { label: "Submitted", className: "bg-[#F2F0FF] text-[#6B4EAA]" },
  APPROVED: { label: "Approved", className: "bg-[#F4F3F4] text-[#5A5A66]" },
  PUBLISHED: { label: "Published", className: "bg-[#E6F6F2] text-[#1A6C54]" },
  REJECTED: { label: "Needs revision", className: "bg-[#FFE8E8] text-[#B33A3A]" },
  ARCHIVED: { label: "Archived", className: "bg-[#F0F0F0] text-[#5A5A66]" },
};

type StatusBadgeProps = {
  status: BlogStatusLabel;
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const config = STATUS_STYLES[status] ?? STATUS_STYLES.DRAFT;
  return (
    <span
      className={`inline-flex items-center justify-center rounded-full px-3 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.3em] ${config.className}`}
    >
      {config.label}
    </span>
  );
}
