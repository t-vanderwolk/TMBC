"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { authedFetch } from "@/lib/authedFetch";
import BlogEditorForm, {
  type BlogEditorFormPayload,
} from "@/components/blog-admin/BlogEditorForm";
import { useRequireRole } from "@/lib/auth/useRequireRole";

export default function MentorBlogNewPage() {
  useRequireRole(["MENTOR", "ADMIN"]);
  const router = useRouter();
  const [creating, setCreating] = useState(false);

  const handleCreate = async (payload: BlogEditorFormPayload) => {
    setCreating(true);
    try {
      const response = await authedFetch("/api/mentor/blog", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result?.error ?? "Unable to create draft.");
      }
      const newId = result?.data?.id;
      if (newId) {
        router.push(`/dashboard/mentor/blog/${newId}`);
      }
    } finally {
      setCreating(false);
    }
  };

  return (
    <main className="space-y-6 px-4 pb-20 pt-6 text-[#3E2F35] sm:px-6">
      <header className="space-y-2 rounded-[28px] bg-[#FFF9F5] p-5 shadow-sm">
        <p className="text-xs uppercase tracking-[0.4em] text-[#C8A1B4]">Mentor blog</p>
        <h1 className="font-serif text-3xl text-[#3E2F35]">New draft</h1>
        <p className="text-sm text-[#3E2F35]/70">
          Draft your best thinking—admins review before publishing.
        </p>
      </header>

      <BlogEditorForm
        onSubmit={handleCreate}
        submitLabel="Create draft"
        saving={creating}
        showMentorTemplatePicker
      />
    </main>
  );
}
