"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

import { useRequireRole } from "@/lib/auth/useRequireRole";

type ContentBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string; level?: number }
  | { type: "list"; items: string[] };

type CanonProduct = {
  id: string;
  name: string;
  brand: string | null;
  category: string | null;
  imageUrl: string | null;
};

type HighlightDraft = {
  productId?: string | null;
  brandName?: string | null;
  note: string;
  product?: CanonProduct | null;
};

type MentorBlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  heroImage: string | null;
  content: ContentBlock[];
  tags: string[];
  status: "DRAFT" | "IN_REVIEW" | "PUBLISHED" | "ARCHIVED";
  highlights: Array<{
    id: string;
    productId: string | null;
    brandName: string | null;
    note: string;
    product: CanonProduct | null;
  }>;
};

const blocksToText = (blocks: ContentBlock[]) =>
  blocks
    .map((block) => {
      if (block.type === "heading") {
        return `## ${block.text}`;
      }
      if (block.type === "list") {
        return block.items.map((item) => `- ${item}`).join("\n");
      }
      return block.text;
    })
    .join("\n\n");

const textToBlocks = (text: string): ContentBlock[] => {
  const lines = text.split("\n");
  const blocks: ContentBlock[] = [];
  let listBuffer: string[] = [];

  const flushList = () => {
    if (listBuffer.length) {
      blocks.push({ type: "list", items: listBuffer });
      listBuffer = [];
    }
  };

  lines.forEach((raw) => {
    const line = raw.trim();
    if (!line) {
      flushList();
      return;
    }

    if (line.startsWith("- ")) {
      listBuffer.push(line.replace(/^- /, ""));
      return;
    }

    flushList();
    if (line.startsWith("## ")) {
      blocks.push({ type: "heading", text: line.replace(/^## /, ""), level: 2 });
      return;
    }

    blocks.push({ type: "paragraph", text: line });
  });

  flushList();

  return blocks;
};

export default function MentorBlogEditor() {
  useRequireRole(["MENTOR", "ADMIN"]);
  const params = useParams<{ postId: string }>();
  const router = useRouter();
  const postId = params?.postId ?? "";

  const [post, setPost] = useState<MentorBlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [heroImage, setHeroImage] = useState("");
  const [tags, setTags] = useState("");
  const [contentText, setContentText] = useState("");
  const [highlights, setHighlights] = useState<HighlightDraft[]>([]);

  const [query, setQuery] = useState("");
  const [canonProducts, setCanonProducts] = useState<CanonProduct[]>([]);
  const [canonBrands, setCanonBrands] = useState<string[]>([]);
  const [searching, setSearching] = useState(false);

  const canEdit = post?.status !== "PUBLISHED";

  const loadPost = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`/api/mentor/blog/${postId}`, { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || "Unable to load draft.");
      }
      const payload = data?.data as MentorBlogPost;
      setPost(payload);
      setTitle(payload.title);
      setSlug(payload.slug);
      setExcerpt(payload.excerpt ?? "");
      setHeroImage(payload.heroImage ?? "");
      setTags(payload.tags.join(", "));
      setContentText(blocksToText(payload.content ?? []));
      setHighlights(
        payload.highlights.map((highlight) => ({
          productId: highlight.productId,
          brandName: highlight.brandName,
          note: highlight.note,
          product: highlight.product,
        })),
      );
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

  useEffect(() => {
    if (!query.trim()) {
      setCanonProducts([]);
      setCanonBrands([]);
      return;
    }

    const fetchCanon = async () => {
      setSearching(true);
      try {
        const response = await fetch(`/api/mentor/blog/canon?q=${encodeURIComponent(query)}`, {
          cache: "no-store",
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data?.error || "Unable to search canon.");
        }
        setCanonProducts(data?.products ?? []);
        setCanonBrands(data?.brands ?? []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to search canon.");
      } finally {
        setSearching(false);
      }
    };

    void fetchCanon();
  }, [query]);

  const hasHighlight = useMemo(
    () =>
      new Set(
        highlights.map((highlight) => highlight.productId ?? highlight.brandName ?? "").filter(Boolean),
      ),
    [highlights],
  );

  const handleSave = async (event: FormEvent) => {
    event.preventDefault();
    setError("");

    try {
      setSaving(true);
      const response = await fetch(`/api/mentor/blog/${postId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          slug,
          excerpt: excerpt || null,
          heroImage: heroImage || null,
          tags: tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean),
          content: textToBlocks(contentText),
          highlights,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || "Unable to save draft.");
      }
      setPost(data?.data ?? post);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save draft.");
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async () => {
    setError("");
    try {
      setSubmitting(true);
      const response = await fetch(`/api/mentor/blog/${postId}/submit`, { method: "POST" });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || "Unable to submit draft.");
      }
      setPost(data?.data ?? post);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to submit draft.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="space-y-6 px-4 pb-20 pt-6 text-[#3E2F35] sm:px-6">
      <header className="space-y-2 rounded-[28px] bg-[#FFF9F5] p-5 shadow-sm">
        <p className="text-xs uppercase tracking-[0.4em] text-[#C8A1B4]">Mentor blog editor</p>
        <h1 className="font-serif text-3xl text-[#3E2F35]">Draft workspace</h1>
        <p className="text-sm text-[#3E2F35]/70">
          Drafts stay private until an admin reviews and publishes.
        </p>
      </header>

      <div className="flex flex-wrap items-center justify-between gap-3 text-xs uppercase tracking-[0.35em] text-[#A4556A]">
        <span>Status: {post?.status.replace("_", " ").toLowerCase() ?? "loading"}</span>
        <Link href="/dashboard/mentor/blog" className="text-[#A4556A] hover:text-[#7C3B53]">
          Back to drafts
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
          <form onSubmit={handleSave} className="space-y-6 rounded-[28px] bg-white/95 p-5 shadow-sm">
            <div className="space-y-3">
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-[0.35em] text-[#A4556A]">Title</label>
                <input
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  className="w-full rounded-2xl border border-[#E3C6D4] bg-white/90 p-3 text-sm text-[#3E2F35]"
                  disabled={!canEdit}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-[0.35em] text-[#A4556A]">Slug</label>
                <input
                  value={slug}
                  onChange={(event) => setSlug(event.target.value)}
                  className="w-full rounded-2xl border border-[#E3C6D4] bg-white/90 p-3 text-sm text-[#3E2F35]"
                  disabled={!canEdit}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-[0.35em] text-[#A4556A]">Excerpt</label>
                <textarea
                  value={excerpt}
                  onChange={(event) => setExcerpt(event.target.value)}
                  rows={3}
                  className="w-full rounded-2xl border border-[#E3C6D4] bg-white/90 p-3 text-sm text-[#3E2F35]"
                  disabled={!canEdit}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-[0.35em] text-[#A4556A]">Hero image URL</label>
                <input
                  value={heroImage}
                  onChange={(event) => setHeroImage(event.target.value)}
                  placeholder="Optional"
                  className="w-full rounded-2xl border border-[#E3C6D4] bg-white/90 p-3 text-sm text-[#3E2F35]"
                  disabled={!canEdit}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-[0.35em] text-[#A4556A]">Tags</label>
                <input
                  value={tags}
                  onChange={(event) => setTags(event.target.value)}
                  placeholder="comma-separated"
                  className="w-full rounded-2xl border border-[#E3C6D4] bg-white/90 p-3 text-sm text-[#3E2F35]"
                  disabled={!canEdit}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-[0.35em] text-[#A4556A]">Content</label>
                <textarea
                  value={contentText}
                  onChange={(event) => setContentText(event.target.value)}
                  rows={12}
                  placeholder="Use blank lines between paragraphs. Prefix headings with ## and lists with -."
                  className="w-full rounded-2xl border border-[#E3C6D4] bg-white/90 p-3 text-sm text-[#3E2F35]"
                  disabled={!canEdit}
                />
              </div>
            </div>

            <div className="space-y-4 border-t border-[#E3C6D4] pt-5">
              <div className="space-y-1">
                <h2 className="text-xs font-semibold uppercase tracking-[0.35em] text-[#A4556A]">
                  Product and brand highlights
                </h2>
                <p className="text-sm text-[#3E2F35]/70">
                  Highlights must come from the canon and include a contextual note.
                </p>
              </div>
              <div className="space-y-2">
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search canon products or brands"
                  className="w-full rounded-2xl border border-[#E3C6D4] bg-white/90 p-3 text-sm text-[#3E2F35]"
                  disabled={!canEdit}
                />
                {searching ? <p className="text-xs text-[#3E2F35]/60">Searching...</p> : null}
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-[0.35em] text-[#A4556A]">Products</p>
                  <div className="space-y-2">
                    {canonProducts.length ? (
                      canonProducts.map((product) => (
                        <button
                          key={product.id}
                          type="button"
                          disabled={!canEdit || hasHighlight.has(product.id)}
                          onClick={() =>
                            setHighlights((prev) => [
                              ...prev,
                              { productId: product.id, note: "", product },
                            ])
                          }
                          className="w-full rounded-2xl border border-[#E3C6D4] bg-white/80 p-3 text-left text-sm text-[#3E2F35] disabled:opacity-50"
                        >
                          <p className="font-semibold">{product.name}</p>
                          <p className="text-xs text-[#3E2F35]/60">{product.brand}</p>
                        </button>
                      ))
                    ) : (
                      <p className="text-xs text-[#3E2F35]/60">Search to see canon products.</p>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-[0.35em] text-[#A4556A]">Brands</p>
                  <div className="space-y-2">
                    {canonBrands.length ? (
                      canonBrands.map((brand) => (
                        <button
                          key={brand}
                          type="button"
                          disabled={!canEdit || hasHighlight.has(brand)}
                          onClick={() =>
                            setHighlights((prev) => [...prev, { brandName: brand, note: "" }])
                          }
                          className="w-full rounded-2xl border border-[#E3C6D4] bg-white/80 p-3 text-left text-sm text-[#3E2F35] disabled:opacity-50"
                        >
                          {brand}
                        </button>
                      ))
                    ) : (
                      <p className="text-xs text-[#3E2F35]/60">Search to see canon brands.</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {highlights.length ? (
                  highlights.map((highlight, index) => (
                    <div key={`${highlight.productId ?? highlight.brandName}-${index}`} className="rounded-2xl bg-[#FFF9F5] p-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <p className="text-sm font-semibold text-[#3E2F35]">
                            {highlight.product?.name || highlight.brandName}
                          </p>
                          <p className="text-xs text-[#3E2F35]/60">
                            {highlight.product?.brand || highlight.brandName || "Canon highlight"}
                          </p>
                        </div>
                        {canEdit ? (
                          <button
                            type="button"
                            onClick={() =>
                              setHighlights((prev) => prev.filter((_, i) => i !== index))
                            }
                            className="text-xs uppercase tracking-[0.35em] text-[#A4556A]"
                          >
                            Remove
                          </button>
                        ) : null}
                      </div>
                      <textarea
                        value={highlight.note}
                        onChange={(event) => {
                          const value = event.target.value;
                          setHighlights((prev) =>
                            prev.map((entry, idx) =>
                              idx === index ? { ...entry, note: value } : entry,
                            ),
                          );
                        }}
                        rows={3}
                        placeholder="Add mentor context for this highlight."
                        className="mt-3 w-full rounded-2xl border border-[#E3C6D4] bg-white/90 p-3 text-sm text-[#3E2F35]"
                        disabled={!canEdit}
                      />
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-[#3E2F35]/70">No highlights added yet.</p>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={saving || !canEdit}
                className="rounded-full bg-[#C8A1B4] px-5 py-3 text-xs font-semibold uppercase tracking-[0.4em] text-white disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save draft"}
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting || !canEdit}
                className="rounded-full border border-[#C8A1B4] px-5 py-3 text-xs font-semibold uppercase tracking-[0.35em] text-[#A4556A] disabled:opacity-60"
              >
                {submitting ? "Submitting..." : "Submit for review"}
              </button>
            </div>
          </form>
        </>
      ) : null}
    </main>
  );
}
