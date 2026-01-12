"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
        .transform((tags) => Array.from(new Set(tags.map((tag) => tag.toLowerCase()))))
        .default([]),
    content: zod_1.z.array(contentBlockSchema),
    highlights: zod_1.z.array(highlightSchema).optional().default([]),
    isAffiliate: zod_1.z.boolean().optional().default(true),
});
const templatePayload = {
    title: "TMBC Mentor Test",
    slug: "tm-test",
    excerpt: "A calm, low-pressure intro to test validation.",
    heroImage: null,
    tags: ["feeding"],
    content: [
        { type: "heading", text: "Why This Matters" },
        { type: "paragraph", text: "Parents deserve calm guidance." },
        { type: "heading", text: "What Actually Helps" },
        { type: "paragraph", text: "Keep it simple." },
        { type: "heading", text: "END_CARD" },
    ],
    highlights: [],
    isAffiliate: true,
};
(async () => {
    try {
        const validated = blogPayloadSchema.parse(templatePayload);
        console.log("payload valid", validated);
    }
    catch (error) {
        console.error("validation failed", error);
    }
})();
