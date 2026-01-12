import { prisma } from "@/lib/prisma";
import { z } from "zod";

const normalizeSlug = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-|-$/g, "");

const slugSchema = z
  .string()
  .trim()
  .min(1)
  .transform((value: string) => normalizeSlug(value))
  .refine((value: string) => value.length > 0, { message: "Slug is invalid." });

const paragraphBlockSchema = z.object({
  type: z.literal("paragraph"),
  text: z.string(),
});

const headingBlockSchema = z.object({
  type: z.literal("heading"),
  text: z.string(),
  level: z.number().int().optional(),
});

const listBlockSchema = z.object({
  type: z.literal("list"),
  items: z.array(z.string()),
});

const contentBlockSchema = z.union([paragraphBlockSchema, headingBlockSchema, listBlockSchema]);

const highlightSchema = z.object({
  productId: z.string().trim().min(1).nullable().optional(),
  brandName: z.string().trim().min(1).nullable().optional(),
  note: z.string().trim().min(1),
});

const blogPayloadSchema = z.object({
  title: z.string().trim().min(1).max(250),
  slug: slugSchema,
  excerpt: z.string().trim().min(1).max(160),
  heroImage: z.string().trim().url().optional().nullable(),
  tags: z
    .array(z.string().trim().min(1))
    .optional()
    .transform((tags: string[]) => {
      const uniqueTags = Array.from(new Set(tags.map((tag) => tag.toLowerCase())));
      return uniqueTags;
    })
    .default([]),
  content: z.array(contentBlockSchema),
  highlights: z.array(highlightSchema).optional().default([]),
  isAffiliate: z.boolean().optional().default(true),
});

type ContentBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string; level?: number }
  | { type: "list"; items: string[] };

export type HighlightInput = {
  productId?: string | null;
  brandName?: string | null;
  note: string;
};

export type BlogPayload = {
  title: string;
  slug: string;
  excerpt: string;
  heroImage: string | null;
  tags: string[];
  content: ContentBlock[];
  highlights: HighlightInput[];
  isAffiliate: boolean;
};

export async function validateBlogPayload(payload: unknown): Promise<BlogPayload> {
  const parsed = blogPayloadSchema.parse(payload);
  const highlightEntries = (parsed.highlights ?? []) as HighlightInput[];
  return {
    ...parsed,
    heroImage: parsed.heroImage || null,
    tags: parsed.tags ?? [],
    highlights: highlightEntries.map((highlight) => ({
      productId: highlight.productId || null,
      brandName: highlight.brandName || null,
      note: highlight.note.trim(),
    })),
  };
}

export async function ensureUniqueBlogSlug(slug: string, excludeId?: string) {
  const baseSlug = normalizeSlug(slug);
  if (!baseSlug) {
    throw new Error("Slug is invalid.");
  }

  let candidate = baseSlug;
  let counter = 2;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const existing = await prisma.blogPost.findFirst({
      where: {
        slug: candidate,
        ...(excludeId ? { id: { not: excludeId } } : {}),
      },
    });
    if (!existing) {
      return candidate;
    }
    candidate = `${baseSlug}-${counter}`;
    counter += 1;
  }
}

export async function upsertBlogHighlights(blogPostId: string, highlights: HighlightInput[]) {
  await prisma.blogHighlight.deleteMany({ where: { blogPostId } });
  if (!highlights.length) {
    return;
  }
  const sanitized = highlights.map((highlight) => ({
    blogPostId,
    productId: highlight.productId ?? null,
    brandName: highlight.brandName ?? null,
    note: highlight.note.trim(),
  }));
  await prisma.blogHighlight.createMany({ data: sanitized });
}
