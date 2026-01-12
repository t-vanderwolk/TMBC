"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.upsertBlogHighlights = exports.ensureUniqueBlogSlug = exports.validateBlogPayload = void 0;
const prisma_1 = require("@/lib/prisma");
const zod_1 = require("zod");
const normalizeSlug = (value) => value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-|-$/g, "");
const slugSchema = zod_1.z
    .string()
    .trim()
    .min(1)
    .transform((value) => normalizeSlug(value))
    .refine((value) => value.length > 0, { message: "Slug is invalid." });
const paragraphBlockSchema = zod_1.z.object({
    type: zod_1.z.literal("paragraph"),
    text: zod_1.z.string(),
});
const headingBlockSchema = zod_1.z.object({
    type: zod_1.z.literal("heading"),
    text: zod_1.z.string(),
    level: zod_1.z.number().int().optional(),
});
const listBlockSchema = zod_1.z.object({
    type: zod_1.z.literal("list"),
    items: zod_1.z.array(zod_1.z.string()),
});
const contentBlockSchema = zod_1.z.union([paragraphBlockSchema, headingBlockSchema, listBlockSchema]);
const highlightSchema = zod_1.z.object({
    productId: zod_1.z.string().trim().min(1).nullable().optional(),
    brandName: zod_1.z.string().trim().min(1).nullable().optional(),
    note: zod_1.z.string().trim().min(1),
});
const blogPayloadSchema = zod_1.z.object({
    title: zod_1.z.string().trim().min(1).max(250),
    slug: slugSchema,
    excerpt: zod_1.z.string().trim().min(1).max(160),
    heroImage: zod_1.z.string().trim().url().optional().nullable(),
    tags: zod_1.z
        .array(zod_1.z.string().trim().min(1))
        .optional()
        .transform((tags) => {
        const uniqueTags = Array.from(new Set(tags.map((tag) => tag.toLowerCase())));
        return uniqueTags;
    })
        .default([]),
    content: zod_1.z.array(contentBlockSchema),
    highlights: zod_1.z.array(highlightSchema).optional().default([]),
    isAffiliate: zod_1.z.boolean().optional().default(true),
});
async function validateBlogPayload(payload) {
    const parsed = blogPayloadSchema.parse(payload);
    const highlightEntries = (parsed.highlights ?? []);
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
exports.validateBlogPayload = validateBlogPayload;
async function ensureUniqueBlogSlug(slug, excludeId) {
    const baseSlug = normalizeSlug(slug);
    if (!baseSlug) {
        throw new Error("Slug is invalid.");
    }
    let candidate = baseSlug;
    let counter = 2;
    // eslint-disable-next-line no-constant-condition
    while (true) {
        const existing = await prisma_1.prisma.blogPost.findFirst({
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
exports.ensureUniqueBlogSlug = ensureUniqueBlogSlug;
async function upsertBlogHighlights(blogPostId, highlights) {
    await prisma_1.prisma.blogHighlight.deleteMany({ where: { blogPostId } });
    if (!highlights.length) {
        return;
    }
    const sanitized = highlights.map((highlight) => ({
        blogPostId,
        productId: highlight.productId ?? null,
        brandName: highlight.brandName ?? null,
        note: highlight.note.trim(),
    }));
    await prisma_1.prisma.blogHighlight.createMany({ data: sanitized });
}
exports.upsertBlogHighlights = upsertBlogHighlights;
