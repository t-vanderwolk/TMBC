import { prisma } from "@/lib/prisma";

type BlogContentBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string; level?: number }
  | { type: "list"; items: string[] };

type HighlightInput = {
  productId?: string | null;
  brandName?: string | null;
  note: string;
};

const URL_PATTERN = /(https?:\/\/|www\.)/i;
const TRACKING_PATTERN = /(utm_[a-z]+|gclid|fbclid)=/i;

const hasDisallowedUrl = (value: string) => URL_PATTERN.test(value) || TRACKING_PATTERN.test(value);

const assertNoUrls = (label: string, value: string) => {
  if (hasDisallowedUrl(value)) {
    throw new Error(`${label} cannot include URLs or tracking parameters.`);
  }
};

const normalizeSlug = (slug: string) =>
  slug
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-|-$/g, "");

const ensureContentBlocks = (content: unknown) => {
  if (!Array.isArray(content)) {
    throw new Error("Content must be a list of blocks.");
  }

  const blocks: BlogContentBlock[] = [];

  for (const block of content) {
    if (!block || typeof block !== "object") {
      throw new Error("Content blocks are malformed.");
    }

    const record = block as Record<string, unknown>;
    const type = record.type;
    if (type === "paragraph" && typeof record.text === "string") {
      const text = record.text.trim();
      assertNoUrls("Content", text);
      blocks.push({ type, text });
      continue;
    }

    if (type === "heading" && typeof record.text === "string") {
      const text = record.text.trim();
      assertNoUrls("Content", text);
      const level = record.level;
      blocks.push({ type, text, level: level ? Number(level) : undefined });
      continue;
    }

    if (type === "list" && Array.isArray(record.items)) {
      const items = record.items.map((item) => {
        const trimmed = String(item).trim();
        assertNoUrls("Content", trimmed);
        return trimmed;
      });
      blocks.push({ type, items });
      continue;
    }

    throw new Error("Content blocks are malformed.");
  }

  return blocks;
};

const normalizeTags = (input: unknown) => {
  if (!Array.isArray(input)) {
    return [] as string[];
  }
  return input
    .map((tag) => String(tag).trim())
    .filter(Boolean)
    .slice(0, 12);
};

export const validateMentorBlogPayload = async (payload: any) => {
  if (!payload || typeof payload !== "object") {
    throw new Error("Missing blog payload.");
  }

  const title = String(payload.title ?? "").trim();
  const slugInput = String(payload.slug ?? "").trim();
  const excerpt = payload.excerpt ? String(payload.excerpt).trim() : null;
  const heroImage = payload.heroImage ? String(payload.heroImage).trim() : null;

  if (!title) {
    throw new Error("Title is required.");
  }
  assertNoUrls("Title", title);

  if (!slugInput) {
    throw new Error("Slug is required.");
  }
  const slug = normalizeSlug(slugInput);
  if (!slug) {
    throw new Error("Slug is invalid.");
  }

  if (excerpt) {
    assertNoUrls("Excerpt", excerpt);
  }

  const content = ensureContentBlocks(payload.content ?? []);
  const tags = normalizeTags(payload.tags);

  const highlights = Array.isArray(payload.highlights) ? (payload.highlights as HighlightInput[]) : [];
  for (const highlight of highlights) {
    const note = String(highlight.note ?? "").trim();
    if (!note) {
      throw new Error("Highlights require contextual notes.");
    }
    assertNoUrls("Highlight notes", note);

    const hasProduct = Boolean(highlight.productId);
    const hasBrand = Boolean(highlight.brandName);
    if (hasProduct === hasBrand) {
      throw new Error("Highlights must reference a single product or a single brand.");
    }
  }

  const productIds = highlights.map((highlight) => highlight.productId).filter(Boolean) as string[];
  if (productIds.length) {
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true },
    });
    const found = new Set(products.map((product) => product.id));
    const missing = productIds.filter((id) => !found.has(id));
    if (missing.length) {
      throw new Error("One or more highlighted products were not found in the canon.");
    }
  }

  const brandNames = highlights
    .map((highlight) => highlight.brandName?.trim())
    .filter(Boolean) as string[];
  if (brandNames.length) {
    const brands = await prisma.product.findMany({
      where: { brand: { in: brandNames } },
      select: { brand: true },
    });
    const known = new Set(brands.map((brand) => brand.brand).filter(Boolean) as string[]);
    const missing = brandNames.filter((brand) => !known.has(brand));
    if (missing.length) {
      throw new Error("One or more highlighted brands were not found in the canon.");
    }
  }

  return {
    title,
    slug,
    excerpt,
    heroImage,
    tags,
    content,
    highlights: highlights.map((highlight) => ({
      productId: highlight.productId ?? null,
      brandName: highlight.brandName ? String(highlight.brandName).trim() : null,
      note: String(highlight.note).trim(),
    })),
  };
};

export const upsertBlogHighlights = async (blogPostId: string, highlights: HighlightInput[]) => {
  await prisma.blogHighlight.deleteMany({ where: { blogPostId } });
  if (!highlights.length) return;

  await prisma.blogHighlight.createMany({
    data: highlights.map((highlight) => ({
      blogPostId,
      productId: highlight.productId ?? null,
      brandName: highlight.brandName ?? null,
      note: highlight.note,
    })),
  });
};
