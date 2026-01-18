import { prisma } from "@/lib/prisma";
import { BlogAuthorRole, BlogStatus } from "@prisma/client";
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

const createBasePostData = async (payload: BlogPayload, excludeId?: string) => {
  const slug = await ensureUniqueBlogSlug(payload.slug, excludeId);
  return {
    slug,
    title: payload.title,
    excerpt: payload.excerpt,
    heroImage: payload.heroImage,
    content: payload.content,
    tags: payload.tags,
    isAffiliate: payload.isAffiliate,
  };
};

export async function createMentorDraft(authorId: string, authorName: string | null, payload: BlogPayload) {
  const base = await createBasePostData(payload);
  const post = await prisma.blogPost.create({
    data: {
      ...base,
      status: BlogStatus.DRAFT,
      authorId,
      authorName: authorName ?? "",
      authorRoleSnapshot: BlogAuthorRole.MENTOR,
    },
  });
  await upsertBlogHighlights(post.id, payload.highlights);
  return post;
}

export async function updateMentorDraft(postId: string, payload: BlogPayload) {
  const post = await prisma.blogPost.findUnique({ where: { id: postId } });
  if (!post) {
    throw new Error("Draft not found.");
  }
  const mentorEditableStatuses = [BlogStatus.DRAFT, BlogStatus.REJECTED] as const;
  if (!mentorEditableStatuses.includes(post.status as typeof mentorEditableStatuses[number])) {
    throw new Error("Mentor drafts can only be updated while still a draft or after revisions.");
  }
  const base = await createBasePostData(payload, post.id);
  const updated = await prisma.blogPost.update({
    where: { id: post.id },
    data: {
      ...base,
    },
  });
  await upsertBlogHighlights(updated.id, payload.highlights);
  return updated;
}

export async function submitForReview(postId: string, mentorId: string) {
  const post = await prisma.blogPost.findUnique({ where: { id: postId } });
  if (!post || post.authorId !== mentorId) {
    throw new Error("Draft not found.");
  }
  const submittableStatuses = [BlogStatus.DRAFT, BlogStatus.REJECTED] as const;
  if (!submittableStatuses.includes(post.status as typeof submittableStatuses[number])) {
    throw new Error("Only drafts may be submitted for review.");
  }
  return prisma.blogPost.update({
    where: { id: post.id },
    data: {
      status: BlogStatus.IN_REVIEW,
      submittedAt: new Date(),
      rejectionNote: null,
    },
  });
}

export async function approvePost(postId: string, adminId: string) {
  const post = await prisma.blogPost.findUnique({ where: { id: postId } });
  if (!post) {
    throw new Error("Post not found.");
  }
  if (post.status !== BlogStatus.IN_REVIEW) {
    throw new Error("Only submitted posts can be approved.");
  }
  return prisma.blogPost.update({
    where: { id: post.id },
    data: {
      status: BlogStatus.APPROVED,
      reviewerId: adminId,
      rejectionNote: null,
    },
  });
}

export async function rejectPost(postId: string, adminId: string, note: string) {
  const post = await prisma.blogPost.findUnique({ where: { id: postId } });
  if (!post) {
    throw new Error("Post not found.");
  }
  if (post.status !== BlogStatus.IN_REVIEW) {
    throw new Error("Only submitted posts can be rejected.");
  }
  return prisma.blogPost.update({
    where: { id: post.id },
    data: {
      status: BlogStatus.REJECTED,
      reviewerId: adminId,
      rejectionNote: note.trim(),
    },
  });
}

export async function publishPost(
  postId: string,
  adminId: string,
  overrides?: { authorName?: string; authorRoleSnapshot?: BlogAuthorRole },
) {
  const post = await prisma.blogPost.findUnique({ where: { id: postId } });
  if (!post) {
    throw new Error("Post not found.");
  }
  const allowedStatuses = [BlogStatus.APPROVED, BlogStatus.ARCHIVED] as const;
  if (
    !allowedStatuses.includes(post.status as typeof allowedStatuses[number]) &&
    post.authorRoleSnapshot !== BlogAuthorRole.ADMIN
  ) {
    throw new Error("Only approved posts may be published.");
  }
  const normalizedAuthorName =
    typeof overrides?.authorName === "string" && overrides.authorName.trim()
      ? overrides.authorName.trim()
      : post.authorName;
  const normalizedAuthorRole =
    overrides?.authorRoleSnapshot ?? post.authorRoleSnapshot;
  return prisma.blogPost.update({
    where: { id: post.id },
    data: {
      status: BlogStatus.PUBLISHED,
      publishedAt: new Date(),
      reviewerId: adminId,
      submittedAt: post.submittedAt ?? new Date(),
      authorName: normalizedAuthorName,
      authorRoleSnapshot: normalizedAuthorRole,
    },
  });
}

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
