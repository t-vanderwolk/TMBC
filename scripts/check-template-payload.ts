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
  .transform((value) => normalizeSlug(value))
  .refine((value) => value.length > 0, { message: "Slug is invalid." });

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
    .transform((tags: string[]) => Array.from(new Set(tags.map((tag) => tag.toLowerCase()))))
    .default([]),
  content: z.array(contentBlockSchema),
  highlights: z.array(highlightSchema).optional().default([]),
  isAffiliate: z.boolean().optional().default(true),
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
  } catch (error) {
    console.error("validation failed", error);
  }
})();
