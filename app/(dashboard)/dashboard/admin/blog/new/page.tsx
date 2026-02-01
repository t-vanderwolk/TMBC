"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { authedFetch } from "@/lib/authedFetch";
import { useRequireRole } from "@/lib/auth/useRequireRole";
import BlogEditorForm, {
  type BlogEditorFormPayload,
} from "@/components/blog-admin/BlogEditorForm";

export default function AdminBlogNewPage() {
  useRequireRole(["ADMIN"]);
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const handleCreate = async (payload: BlogEditorFormPayload) => {
    setSaving(true);
    try {
      const response = await authedFetch("/api/admin/blog", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result?.error ?? "Unable to create post.");
      }
      const newId = result?.data?.id;
      if (newId) {
        router.push(`/dashboard/admin/blog/${newId}`);
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="space-y-6 px-4 pb-20 pt-6 text-[#3E2F35] sm:px-6">
      <header className="space-y-2 rounded-[28px] bg-[#FFF9F5] p-5 shadow-sm">
        <p className="text-xs uppercase tracking-[0.4em] text-[#C8A1B4]">Admin blog</p>
        <h1 className="font-serif text-3xl text-[#3E2F35]">Create post</h1>
        <p className="text-sm text-[#3E2F35]/70">Publish thoughtful stories for the public marketing site.</p>
      </header>

      <BlogEditorForm onSubmit={handleCreate} submitLabel="Create post" saving={saving} />
    </main>
  );
}
