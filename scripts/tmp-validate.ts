import { validateBlogPayload } from "../lib/services/server/blog.service";

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
    const validated = await validateBlogPayload(templatePayload);
    console.log("validated payload", validated);
  } catch (error) {
    console.error("validation failed", error);
  }
})();
