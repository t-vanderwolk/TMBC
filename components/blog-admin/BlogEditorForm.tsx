"use client";

import { useCallback, useEffect, useMemo, useState, type KeyboardEvent } from "react";

import StatusBadge from "./StatusBadge";
import type { BlogStatusLabel } from "@/types/blogStatus";

export type BlogContentBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string; level?: number }
  | { type: "list"; items: string[] };

type HighlightEntry = {
  productId?: string | null;
  brandName?: string | null;
  note: string;
  product?: {
    id: string;
    name: string;
    brand: string | null;
  } | null;
};

type BlogFormInitial = {
  title?: string;
  slug?: string;
  excerpt?: string | null;
  heroImage?: string | null;
  tags?: string[];
  content?: BlogContentBlock[];
  isAffiliate?: boolean;
  highlights?: HighlightEntry[];
};

export type BlogEditorFormPayload = {
  title: string;
  slug: string;
  excerpt: string | null;
  heroImage: string | null;
  tags: string[];
  content: BlogContentBlock[];
  highlights: HighlightEntry[];
  isAffiliate: boolean;
};

type BlogEditorFormProps = {
  initialValue?: BlogFormInitial;
  status?: BlogStatusLabel;
  onSubmit: (payload: BlogEditorFormPayload) => Promise<void>;
  submitLabel?: string;
  disabled?: boolean;
  saving?: boolean;
  showAffiliateToggle?: boolean;
  showMentorTemplatePicker?: boolean;
  children?: React.ReactNode;
};

type TemplateBlockType = "intro" | "section" | "optional" | "end_card";

type TemplateBlockDefinition = {
  id: string;
  type: TemplateBlockType;
  title?: string;
  hint: string;
  optional?: boolean;
};

type TemplateBlock = TemplateBlockDefinition & {
  text: string;
};

const normalizeSlug = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-|-$/g, "");

const slugify = (value: string) => normalizeSlug(value);
const PRODUCT_SEARCH_ENDPOINT = "/api/mentor/blog/canon";
const SUGGESTED_TAGS = ["feeding", "sleep", "registry", "postpartum", "safety", "routines", "transitions"];
const CTA_PATTERNS = ["<button", "button>", "click here", "buy now", "shop now", "cta", "see more"];
const emojiRegex = /[\u{1F300}-\u{1F6FF}\u{1F900}-\u{1F9FF}\u{1F1E6}-\u{1F1FF}]/u;

const TMBC_TEMPLATE_STRUCTURE: TemplateBlockDefinition[] = [
  {
    id: "intro",
    type: "intro",
    hint: "Open with reassurance, relatability, or a quiet truth parents feel but don’t always say.",
  },
  {
    id: "why-this-matters",
    type: "section",
    title: "Why This Matters",
    hint: "Explain why this topic affects real daily life. Keep it human, not instructional.",
  },
  {
    id: "what-parents-worry",
    type: "section",
    title: "What Parents Usually Worry About",
    hint: "Normalize common fears or confusion without amplifying anxiety.",
  },
  {
    id: "what-helps",
    type: "section",
    title: "What Actually Helps",
    hint: "Offer calm, practical guidance. No urgency. No absolutes.",
  },
  {
    id: "mentor-notes",
    type: "optional",
    title: "Mentor Notes",
    hint: "Optional lived-experience insight or professional framing.",
    optional: true,
  },
  {
    id: "things-no-one-tells-you",
    type: "optional",
    title: "Things No One Tells You (But We Will)",
    hint: "Gentle honesty. Light humor welcome.",
    optional: true,
  },
  {
    id: "end-card",
    type: "end_card",
    title: "Helpful Tools & Trusted Picks",
    hint: "Affiliate items are added later by Admin. Do not insert links here.",
  },
];

const createDefaultTemplateBlocks = () =>
  TMBC_TEMPLATE_STRUCTURE.map((block) => ({
    ...block,
    text: "",
  }));

const optionalTemplateDefs = TMBC_TEMPLATE_STRUCTURE.filter((block) => block.optional);

const isAllCaps = (value: string) => {
  const hasLetters = /[A-Z]/.test(value);
  return hasLetters && value === value.toUpperCase();
};

const containsEmoji = (value: string) => emojiRegex.test(value);

const containsCtaLanguage = (value: string) =>
  CTA_PATTERNS.some((pattern) => value.toLowerCase().includes(pattern));

const buildContentFromTemplate = (blocks: TemplateBlock[]): BlogContentBlock[] => {
  const output: BlogContentBlock[] = [];
  for (const block of blocks) {
    if (block.type === "intro") {
      if (block.text.trim()) {
        output.push({ type: "paragraph", text: block.text.trim() });
      }
      continue;
    }

    if (block.type === "section" || block.type === "optional") {
      if (block.title) {
        output.push({ type: "heading", text: block.title });
      }
      if (block.text.trim()) {
        output.push({ type: "paragraph", text: block.text.trim() });
      }
      continue;
    }

    if (block.type === "end_card") {
      output.push({ type: "heading", text: "END_CARD" });
    }
  }
  return output;
};

const findTemplateGuardrailErrors = (title: string, blocks: TemplateBlock[]) => {
  const errors: string[] = [];
  if (title.includes("!")) {
    errors.push("Titles should avoid exclamation points.");
  }
  if (title && isAllCaps(title)) {
    errors.push("Titles should not be written in all caps.");
  }
  if (title && containsEmoji(title)) {
    errors.push("Titles should not include emojis.");
  }
  const blockText = blocks.map((block) => block.text).join(" ");
  if (containsEmoji(blockText)) {
    errors.push("Body copy should avoid emojis.");
  }
  if (containsCtaLanguage(blockText)) {
    errors.push("Keep CTA button language out of the body copy.");
  }
  return errors;
};

export default function BlogEditorForm({
  initialValue,
  status,
  onSubmit,
  submitLabel = "Save draft",
  disabled,
  saving,
  showAffiliateToggle = true,
  showMentorTemplatePicker = false,
  children,
}: BlogEditorFormProps) {
  const [title, setTitle] = useState(initialValue?.title ?? "");
  const [slug, setSlug] = useState(initialValue?.slug ?? "");
  const [excerpt, setExcerpt] = useState(initialValue?.excerpt ?? "");
  const [heroImage, setHeroImage] = useState(initialValue?.heroImage ?? "");
  const [tags, setTags] = useState(initialValue?.tags ?? []);
  const [tagInput, setTagInput] = useState("");
  const [contentText, setContentText] = useState(
    JSON.stringify(initialValue?.content ?? [], null, 2),
  );
  const [isAffiliate, setIsAffiliate] = useState(initialValue?.isAffiliate ?? true);
  const [autoSlug, setAutoSlug] = useState(!initialValue?.slug);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [highlightQuery, setHighlightQuery] = useState("");
  const [canonProducts, setCanonProducts] = useState<
    Array<{ id: string; name: string; brand: string | null }>
  >([]);
  const [canonBrands, setCanonBrands] = useState<string[]>([]);
  const [searchingCanon, setSearchingCanon] = useState(false);
  const [canonError, setCanonError] = useState("");
  const [highlights, setHighlights] = useState<HighlightEntry[]>(initialValue?.highlights ?? []);
  const [mentorTemplateChoice, setMentorTemplateChoice] = useState<"blank" | "template">("blank");
  const [templateBlocks, setTemplateBlocks] = useState<TemplateBlock[]>(() => createDefaultTemplateBlocks());

  useEffect(() => {
    if (initialValue) {
      setTitle(initialValue.title ?? "");
      setSlug(initialValue.slug ?? "");
      setExcerpt(initialValue.excerpt ?? "");
      setHeroImage(initialValue.heroImage ?? "");
      setTags(initialValue.tags ?? []);
      setContentText(JSON.stringify(initialValue.content ?? [], null, 2));
      setIsAffiliate(initialValue.isAffiliate ?? true);
      setAutoSlug(!initialValue.slug);
    }
  }, [initialValue]);

  useEffect(() => {
    if (autoSlug) {
      setSlug(slugify(title));
    }
  }, [title, autoSlug]);

  const normalizeHighlights = useCallback(
    (value: HighlightEntry[] | undefined) =>
      (value ?? []).map((entry) => ({
        ...entry,
        note: entry.note ?? "",
      })),
    [],
  );

  useEffect(() => {
    setHighlights(normalizeHighlights(initialValue?.highlights));
  }, [initialValue, normalizeHighlights]);

  const contentIsValidJson = useMemo(() => {
    try {
      const parsed = JSON.parse(contentText);
      return Array.isArray(parsed);
    } catch {
      return false;
    }
  }, [contentText]);

  useEffect(() => {
    if (!highlightQuery.trim()) {
      setCanonProducts([]);
      setCanonBrands([]);
      setSearchingCanon(false);
      return;
    }

    setSearchingCanon(true);
    setCanonError("");
    const controller = new AbortController();
    const timer = setTimeout(() => {
      fetch(`${PRODUCT_SEARCH_ENDPOINT}?q=${encodeURIComponent(highlightQuery)}`, {
        cache: "no-store",
        signal: controller.signal,
      })
        .then(async (response) => {
          const data = await response.json();
          if (!response.ok) {
            throw new Error(data?.error ?? "Unable to search canon.");
          }
          setCanonProducts(data?.products ?? []);
          setCanonBrands(data?.brands ?? []);
        })
        .catch((err) => {
          if (err.name === "AbortError") return;
          setCanonError(err instanceof Error ? err.message : "Unable to search canon.");
        })
        .finally(() => {
          setSearchingCanon(false);
        });
    }, 300);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [highlightQuery]);

  const handleSlugChange = (value: string) => {
    setSlug(value);
    setAutoSlug(false);
  };

  const addTag = useCallback(
    (value: string) => {
      const normalized = value.trim().toLowerCase();
      if (!normalized) return;
      setTags((prev) => (prev.includes(normalized) ? prev : [...prev, normalized]));
    },
    [setTags],
  );

  const removeTag = useCallback(
    (value: string) => {
      setTags((prev) => prev.filter((tag) => tag !== value));
    },
    [setTags],
  );

  const handleTagKeyDown = (event: KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      if (tagInput.trim()) {
        addTag(tagInput);
        setTagInput("");
      }
    }
  };

  const addHighlightEntry = useCallback(
    (entry: HighlightEntry) => {
      const key = entry.productId ?? entry.brandName ?? "";
      if (!key) return;
      setHighlights((prev) => {
        if (prev.some((existing) => (existing.productId ?? existing.brandName ?? "") === key)) {
          return prev;
        }
        return [...prev, { ...entry, note: entry.note ?? "" }];
      });
    },
    [],
  );

  const moveTemplateBlock = (index: number, direction: "up" | "down") => {
    setTemplateBlocks((prev) => {
      const targetIndex = index + (direction === "up" ? -1 : 1);
      if (targetIndex < 0 || targetIndex >= prev.length) return prev;
      const source = prev[index];
      const destination = prev[targetIndex];
      if (!source || !destination) return prev;
      if (source.type === "intro" || source.type === "end_card") return prev;
      if (destination.type === "intro" || destination.type === "end_card") return prev;
      const next = [...prev];
      next[index] = destination;
      next[targetIndex] = source;
      return next;
    });
  };

  const removeTemplateBlock = (blockId: string) => {
    setTemplateBlocks((prev) => prev.filter((block) => block.id !== blockId));
  };

  const addOptionalBlock = (blockId: string) => {
    const definition = optionalTemplateDefs.find((block) => block.id === blockId);
    if (!definition) return;
    setTemplateBlocks((prev) => {
      const endCardIndex = prev.findIndex((block) => block.type === "end_card");
      const next = [...prev];
      const insertionIndex = endCardIndex >= 0 ? endCardIndex : prev.length;
      next.splice(insertionIndex, 0, { ...definition, text: "" });
      return next;
    });
  };

  const templateLocked = showMentorTemplatePicker && !!status && status !== "DRAFT";
  const usingMentorTemplate = showMentorTemplatePicker && mentorTemplateChoice === "template";
  const templateGuardrailErrors = useMemo(
    () => (usingMentorTemplate ? findTemplateGuardrailErrors(title, templateBlocks) : []),
    [title, templateBlocks, usingMentorTemplate],
  );
  const missingOptionalBlocks = optionalTemplateDefs.filter(
    (block) => !templateBlocks.some((current) => current.id === block.id),
  );

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    const normalizedTitle = title.trim();
    if (!normalizedTitle) {
      setError("Title is required.");
      return;
    }
    const normalizedExcerpt = excerpt?.trim() ?? "";
    if (!normalizedExcerpt) {
      setError("Excerpt is required.");
      return;
    }
    if (normalizedExcerpt.length > 160) {
      setError("Excerpt must be 160 characters or less.");
      return;
    }

    const slugCandidate = slug.trim() || normalizedTitle;
    const normalizedSlug = slugify(slugCandidate);
    if (!normalizedSlug) {
      setError("Slug is invalid.");
      return;
    }

    if (usingMentorTemplate && templateGuardrailErrors.length) {
      setError(templateGuardrailErrors[0] ?? "Template guardrails not met.");
      return;
    }

    let finalContent: BlogContentBlock[] = [];
    if (usingMentorTemplate) {
      finalContent = buildContentFromTemplate(templateBlocks);
      if (!finalContent.length) {
        setError("Add content to the template before saving.");
        return;
      }
    } else {
      try {
        const parsed = JSON.parse(contentText);
        if (!Array.isArray(parsed)) {
          throw new Error("Content must be an array.");
        }
        finalContent = parsed;
      } catch {
        setError("Content must be valid JSON.");
        return;
      }
    }

    if (highlights.some((highlight) => !highlight.note.trim())) {
      setError("Each highlight requires a contextual note.");
      return;
    }

    const payload: BlogEditorFormPayload = {
      title: normalizedTitle,
      slug: normalizedSlug,
      excerpt: normalizedExcerpt || null,
      heroImage: heroImage?.trim() || null,
      tags,
      content: finalContent,
      highlights: highlights.map((highlight) => ({
        productId: highlight.productId ?? null,
        brandName: highlight.brandName ?? null,
        note: highlight.note.trim(),
      })),
      isAffiliate,
    };

    setSubmitting(true);
    try {
      await onSubmit(payload);
    } catch (submissionError) {
      const message =
        submissionError instanceof Error ? submissionError.message : "Unable to save blog post.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const isBusy = submitting || Boolean(saving);
  const submitDisabled = disabled || isBusy || (!usingMentorTemplate && !contentIsValidJson);

  return (
    <form onSubmit={handleSubmit} className="space-y-5 rounded-[28px] bg-white/95 p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-1">
          <p className="text-[0.55rem] uppercase tracking-[0.4em] text-[#C8A1B4]">Blog editor</p>
          <p className="text-xl font-serif text-[#3E2F35]">Craft your post</p>
        </div>
        {status ? <StatusBadge status={status} /> : null}
      </div>

      {error ? (
        <div className="rounded-[28px] border border-[#F0CCD7] bg-[#FFF4FA] px-5 py-3 text-sm text-[#8B4A61]">
          {error}
        </div>
      ) : null}

      {showMentorTemplatePicker ? (
        <>
          <section className="space-y-2 rounded-[28px] border border-[#E3C6D4] bg-[#FFF9F5] p-4 text-[#3E2F35]">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-[0.6rem] uppercase tracking-[0.35em] text-[#A4556A]">
                TMBC Writing Guide
              </p>
            </div>
            <p className="text-sm">
              Write like you’re talking to a calm friend at the kitchen counter. No fear-based
              language. No “must-haves.” No urgency. Humor is allowed. Pressure is not.
            </p>
            <div className="flex flex-wrap gap-4 text-[0.65rem] text-[#3E2F35]/80">
              <span>No exclamation points</span>
              <span>No ALL CAPS</span>
              <span>No emojis</span>
              <span>No CTA buttons in copy</span>
            </div>
          </section>

          <section className="space-y-3 rounded-[28px] border border-[#E3C6D4] bg-white/95 p-4">
            <p className="text-[0.6rem] uppercase tracking-[0.35em] text-[#A4556A]">Mentor template</p>
            <div className="grid gap-3 md:grid-cols-2">
              <button
                type="button"
                className={`rounded-[20px] border p-4 text-left text-sm ${
                  mentorTemplateChoice === "blank"
                    ? "border-[#C8A1B4] bg-[#FFF4FA]"
                    : "border-[#E3C6D4] bg-white"
                }`}
                onClick={() => setMentorTemplateChoice("blank")}
              >
                <p className="font-semibold text-[#3E2F35]">Start from blank</p>
                <p className="text-xs text-[#3E2F35]/60">
                  Paste your JSON or craft blocks manually.
                </p>
              </button>
              <button
                type="button"
                className={`rounded-[20px] border p-4 text-left text-sm ${
                  mentorTemplateChoice === "template"
                    ? "border-[#C8A1B4] bg-[#FFF4FA]"
                    : "border-[#E3C6D4] bg-white"
                }`}
                onClick={() => setMentorTemplateChoice("template")}
              >
                <p className="font-semibold text-[#3E2F35]">Use TMBC blog template</p>
                <p className="text-xs text-[#3E2F35]/60">
                  Guided structure, calm tone, admin reviews before publish.
                </p>
              </button>
            </div>
          </section>
        </>
      ) : null}

      <div className="space-y-4">
        <div>
          <label className="text-[0.6rem] uppercase tracking-[0.35em] text-[#A4556A]">Title</label>
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            disabled={disabled}
            className="mt-1 w-full rounded-2xl border border-[#E3C6D4] bg-white/90 p-3 text-sm text-[#3E2F35]"
          />
        </div>
        <div>
          <label className="text-[0.6rem] uppercase tracking-[0.35em] text-[#A4556A]">Slug</label>
          <input
            value={slug}
            onChange={(event) => handleSlugChange(event.target.value)}
            disabled={disabled}
            className="mt-1 w-full rounded-2xl border border-[#E3C6D4] bg-white/90 p-3 text-sm text-[#3E2F35]"
          />
        </div>
        <div>
          <label className="text-[0.6rem] uppercase tracking-[0.35em] text-[#A4556A]">Excerpt</label>
          <textarea
            value={excerpt}
            onChange={(event) => setExcerpt(event.target.value)}
            rows={2}
            maxLength={160}
            disabled={disabled}
            className="mt-1 w-full rounded-2xl border border-[#E3C6D4] bg-white/90 p-3 text-sm text-[#3E2F35]"
          />
          <p className="mt-1 text-[0.65rem] text-[#3E2F35]/60">{`${excerpt?.trim().length ?? 0}/160 characters`}</p>
        </div>
        <div>
          <label className="text-[0.6rem] uppercase tracking-[0.35em] text-[#A4556A]">Hero image URL</label>
          <input
            value={heroImage}
            onChange={(event) => setHeroImage(event.target.value)}
            disabled={disabled}
            className="mt-1 w-full rounded-2xl border border-[#E3C6D4] bg-white/90 p-3 text-sm text-[#3E2F35]"
          />
        </div>
        <div className="space-y-2">
          <label className="text-[0.6rem] uppercase tracking-[0.35em] text-[#A4556A]">Tags</label>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => removeTag(tag)}
                className="inline-flex items-center gap-2 rounded-full border border-[#E3C6D4] bg-white/90 px-3 py-1 text-[0.65rem] font-semibold text-[#3E2F35]"
              >
                {tag}
                <span className="text-xs text-[#A4556A]">remove</span>
              </button>
            ))}
            <input
              value={tagInput}
              onChange={(event) => setTagInput(event.target.value)}
              onKeyDown={handleTagKeyDown}
              disabled={disabled}
              placeholder="Add tag"
              className="rounded-full border border-[#E3C6D4] bg-white/90 px-3 py-1 text-sm text-[#3E2F35]"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {SUGGESTED_TAGS.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => addTag(tag)}
                disabled={tags.includes(tag)}
                className="rounded-full border border-[#E3C6D4] bg-white/90 px-3 py-1 text-[0.7rem] uppercase tracking-[0.3em] text-[#3E2F35] disabled:opacity-40"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
        {!usingMentorTemplate ? (
          <div>
            <label className="text-[0.6rem] uppercase tracking-[0.35em] text-[#A4556A]">Content JSON</label>
            <textarea
              value={contentText}
              onChange={(event) => setContentText(event.target.value)}
              rows={10}
              disabled={disabled}
              className={`mt-1 w-full rounded-2xl border ${
                contentIsValidJson ? "border-[#E3C6D4]" : "border-[#F28AA5]"
              } bg-white/90 p-3 text-sm text-[#3E2F35]`}
            />
            {!contentIsValidJson ? (
              <p className="mt-1 text-[0.65rem] text-[#F28AA5]">Valid JSON array is required.</p>
            ) : (
              <p className="mt-1 text-[0.65rem] text-[#3E2F35]/60">
                Paste the content blocks JSON array (paragraphs/headings/lists).
              </p>
            )}
          </div>
        ) : null}
      </div>

      {usingMentorTemplate ? (
        <section className="space-y-4 rounded-[28px] border border-[#E3C6D4] bg-[#FFF4FA] p-4">
          {templateLocked ? (
            <div className="rounded-[28px] border border-[#C8A1B4] bg-white/80 px-4 py-3 text-sm text-[#3E2F35]">
              Submitted for review. An admin will finalize links and publish.
            </div>
          ) : null}
          <div className="space-y-4">
            {templateBlocks.map((block, index) => (
              <div
                key={block.id}
                className="space-y-2 rounded-[28px] border border-[#E3C6D4] bg-white/90 p-4 shadow-sm"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-[#3E2F35]">
                      {block.title ?? "intro"}
                    </p>
                    <p className="text-[0.65rem] text-[#3E2F35]/60">{block.hint}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => moveTemplateBlock(index, "up")}
                      disabled={templateLocked || block.type === "intro" || index === 0}
                      className="text-xs font-semibold uppercase tracking-[0.35em] text-[#A4556A] disabled:opacity-40"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      onClick={() => moveTemplateBlock(index, "down")}
                      disabled={
                        templateLocked || block.type === "end_card" || index === templateBlocks.length - 1
                      }
                      className="text-xs font-semibold uppercase tracking-[0.35em] text-[#A4556A] disabled:opacity-40"
                    >
                      ↓
                    </button>
                  </div>
                </div>
                {block.type !== "end_card" ? (
                  <textarea
                    value={block.text}
                    onChange={(event) =>
                      setTemplateBlocks((prev) =>
                        prev.map((entry) =>
                          entry.id === block.id ? { ...entry, text: event.target.value } : entry,
                        ),
                      )
                    }
                    rows={4}
                    disabled={templateLocked}
                    className="w-full rounded-2xl border border-[#E3C6D4] bg-white/90 p-3 text-sm text-[#3E2F35]"
                  />
                ) : (
                  <p className="text-xs text-[#3E2F35]/70">Admin adds affiliate links here.</p>
                )}
                {block.optional && !templateLocked ? (
                  <button
                    type="button"
                    onClick={() => removeTemplateBlock(block.id)}
                    className="text-[0.6rem] uppercase tracking-[0.35em] text-[#A4556A]"
                  >
                    Remove section
                  </button>
                ) : null}
              </div>
            ))}
          </div>
          {!templateLocked && missingOptionalBlocks.length ? (
            <div className="space-y-2 rounded-[20px] border border-dashed border-[#E3C6D4] bg-white/60 p-3 text-xs text-[#3E2F35]/70">
              <p className="text-[0.65rem] text-[#3E2F35]">Add optional sections</p>
              <div className="flex flex-wrap gap-2">
                {missingOptionalBlocks.map((block) => (
                  <button
                    key={block.id}
                    type="button"
                    onClick={() => addOptionalBlock(block.id)}
                    className="rounded-full border border-[#A4556A] px-3 py-1 text-[0.65rem] text-[#A4556A]"
                  >
                    {block.title}
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </section>
      ) : null}

      <section className="space-y-4 rounded-[28px] border border-[#E3C6D4] bg-white/95 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-[0.6rem] uppercase tracking-[0.35em] text-[#A4556A]">Highlights</p>
          <p className="text-xs text-[#3E2F35]/60">Search canon products or brands</p>
        </div>
        <div className="space-y-3">
          <input
            value={highlightQuery}
            onChange={(event) => setHighlightQuery(event.target.value)}
            placeholder="Search canon product or brand"
            disabled={disabled}
            className="w-full rounded-2xl border border-[#E3C6D4] bg-white/90 px-3 py-2 text-sm text-[#3E2F35]"
          />
          {searchingCanon ? (
            <p className="text-xs text-[#3E2F35]/60">Searching canon...</p>
          ) : canonError ? (
            <p className="text-xs text-[#8B4A61]">{canonError}</p>
          ) : null}
          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-2">
              <p className="text-[0.55rem] uppercase tracking-[0.35em] text-[#A4556A]">Products</p>
              <div className="space-y-2">
                {canonProducts.length ? (
                  canonProducts.map((product) => (
                    <button
                      key={product.id}
                      type="button"
                    onClick={() =>
                      addHighlightEntry({
                        productId: product.id,
                        brandName: product.brand ?? null,
                        product,
                        note: "",
                      })
                    }
                      disabled={disabled || highlights.some((h) => h.productId === product.id)}
                      className="w-full rounded-2xl border border-[#E3C6D4] bg-white/90 text-left text-sm text-[#3E2F35] disabled:opacity-50"
                    >
                      <p className="font-semibold">{product.name}</p>
                      {product.brand ? (
                        <p className="text-xs text-[#3E2F35]/60">{product.brand}</p>
                      ) : null}
                    </button>
                  ))
                ) : (
                  <p className="text-xs text-[#3E2F35]/60">Search to see canon products.</p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-[0.55rem] uppercase tracking-[0.35em] text-[#A4556A]">Brands</p>
              <div className="space-y-2">
                {canonBrands.length ? (
                  canonBrands.map((brand) => (
                    <button
                      key={brand}
                      type="button"
                    onClick={() => addHighlightEntry({ brandName: brand, note: "" })}
                      disabled={disabled || highlights.some((h) => h.brandName === brand)}
                      className="w-full rounded-2xl border border-[#E3C6D4] bg-white/90 text-left text-sm text-[#3E2F35] disabled:opacity-50"
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
                <div key={`${highlight.productId ?? highlight.brandName}-${index}`} className="space-y-2 rounded-2xl border border-[#F0CCD7] bg-[#FFF4FA] p-3">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-[#3E2F35]">
                        {highlight.product?.name ?? highlight.brandName ?? "Canon highlight"}
                      </p>
                      <p className="text-[0.65rem] text-[#3E2F35]/60">
                        {highlight.product?.brand ?? highlight.brandName ?? "Canon source"}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setHighlights((prev) => prev.filter((_, idx) => idx !== index))}
                      className="text-[0.7rem] uppercase tracking-[0.35em] text-[#A4556A]"
                    >
                      Remove
                    </button>
                  </div>
                  <textarea
                    value={highlight.note}
                    onChange={(event) =>
                      setHighlights((prev) =>
                        prev.map((entry, idx) =>
                          idx === index ? { ...entry, note: event.target.value } : entry,
                        ),
                      )
                    }
                    rows={3}
                    placeholder="Add contextual note for this highlight."
                    className="w-full rounded-2xl border border-[#E3C6D4] bg-white/90 p-3 text-sm text-[#3E2F35]"
                  />
                </div>
              ))
            ) : (
              <p className="text-xs text-[#3E2F35]/60">No highlights added yet.</p>
            )}
          </div>
        </div>
      </section>

      {showAffiliateToggle ? (
        <label className="inline-flex items-center gap-3 text-sm text-[#3E2F35]">
          <input
            type="checkbox"
            checked={isAffiliate}
            onChange={(event) => setIsAffiliate(event.target.checked)}
            disabled={disabled}
            className="h-4 w-4 rounded border border-[#E3C6D4] text-[#A4556A]"
          />
          Mark this post as affiliate
        </label>
      ) : null}

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={submitDisabled}
          className="rounded-full bg-[#C8A1B4] px-6 py-3 text-xs font-semibold uppercase tracking-[0.4em] text-white disabled:opacity-60"
        >
          {isBusy ? "Saving..." : submitLabel}
        </button>
        {children}
      </div>
    </form>
  );
}
