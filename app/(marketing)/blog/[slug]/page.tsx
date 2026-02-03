import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import BlogContentRenderer, {
  createHeadingId,
  type BlogContentBlock,
} from "@/components/blog/BlogContentRenderer";
import BlogAffiliateEndCard from "@/components/blog/BlogAffiliateEndCard";
import BlogHighlightSection from "@/components/blog/BlogHighlightSection";
import { MarketingHeading } from "@/components/marketing/Typography";

// Marketing background cadence is intentional.
// Do not reorder or recolor section backgrounds.
// Pattern: white → ivory → white → blush
import type { AffiliatePolicy } from "@/lib/blog/affiliatePolicy";
import { SectionBand, textCage, cardBase } from "@/components/marketing/MarketingCadence";

// Marketing visual guardrails:
// - All cards/panels use canonical marketing-card / marketing-panel styles
// - No borders, transforms, or hover animations
// - Elevation is soft and consistent across pages


const API_BASE_URL =
  process.env.NEXT_PUBLIC_APP_URL ||
  process.env.NEXT_PUBLIC_SITE_URL ||
  "http://localhost:3000";
const SHOULD_SKIP_PUBLIC_BLOG_FETCH =
  process.env.npm_lifecycle_event === "build";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.taylormadebaby.co";

type PublicAffiliateLink = {
  id: string;
  partnerName: string;
  label: string;
  position: "INLINE" | "CALLOUT" | "END_CARD";
  isPrimary: boolean;
  policy?: AffiliatePolicy;
};

type PublicBlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: BlogContentBlock[];
  heroImage: string | null;
  publishedAt: string | null;
  authorName: string;
  authorRoleSnapshot: "ADMIN" | "MENTOR";
  tags: string[];
  highlights: Array<{
    id: string;
    productId: string | null;
    brandName: string | null;
    note: string;
    product: {
      id: string;
      name: string;
      brand: string | null;
      category: string | null;
      imageUrl: string | null;
    } | null;
  }>;
  affiliateLinks: PublicAffiliateLink[];
};

type Params = {
  slug: string;
};

type PublicBlogPostResult = {
  post: PublicBlogPost | null;
  unavailable: boolean;
};

const fetchPublicPosts = async () => {
  if (SHOULD_SKIP_PUBLIC_BLOG_FETCH) {
    return [] as Array<{ slug: string }>;
  }

  try {
    const response = await fetch(new URL("/api/blog/public", API_BASE_URL), {
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      return [] as Array<{ slug: string }>;
    }

    const payload = await response.json();
    return Array.isArray(payload?.posts) ? payload.posts : [];
  } catch {
    return [] as Array<{ slug: string }>;
  }
};

const fetchPublicPost = async (slug: string): Promise<PublicBlogPostResult> => {
  if (SHOULD_SKIP_PUBLIC_BLOG_FETCH) {
    return { post: null, unavailable: false };
  }

  try {
    const response = await fetch(new URL(`/api/blog/public/${slug}`, API_BASE_URL), {
      next: { revalidate: 300 },
    });

    if (response.status === 503) {
      return { post: null, unavailable: true };
    }

    if (response.status === 404) {
      return { post: null, unavailable: false };
    }

    if (!response.ok) {
      return { post: null, unavailable: false };
    }

    const payload = await response.json();
    return { post: payload, unavailable: Boolean(payload?.unavailable) };
  } catch {
    return { post: null, unavailable: false };
  }
};

const splitContentBlocks = (blocks: BlogContentBlock[]) => {
  const mainBlocks: BlogContentBlock[] = [];

  for (const block of blocks) {
    if (block.type === "heading" && block.text.trim().toUpperCase() === "END_CARD") {
      break;
    }
    mainBlocks.push(block);
  }

  return mainBlocks;
};

const isHeadingBlock = (
  block: BlogContentBlock
): block is Extract<BlogContentBlock, { type: "heading" }> => block.type === "heading";

const getTableOfContents = (blocks: BlogContentBlock[]) =>
  blocks.filter(isHeadingBlock).map((block) => ({
    heading: block.text,
    id: createHeadingId(block.text),
  }));

const formatAuthorRole = (role: PublicBlogPost["authorRoleSnapshot"]) =>
  role === "ADMIN" ? "Admin" : "Mentor";

export const generateStaticParams = async () => {
  const posts = await fetchPublicPosts();
  return posts.map((post: { slug: string }) => ({ slug: post.slug }));
};

export const generateMetadata = async ({ params }: { params: Params }): Promise<Metadata> => {
  const { post } = await fetchPublicPost(params.slug);
  if (!post) return {};

  const url = `${siteUrl}/blog/${post.slug}`;

  const openGraph: Metadata["openGraph"] = {
    title: post.title,
    description: post.excerpt ?? "",
    url,
    siteName: "Taylor-Made Baby Co.",
    type: "article",
    publishedTime: post.publishedAt ?? undefined,
    authors: [post.authorName],
    ...(post.heroImage ? { images: [{ url: post.heroImage }] } : {}),
  };

  const twitter: Metadata["twitter"] = {
    card: "summary_large_image",
    title: post.title,
    description: post.excerpt ?? "",
    ...(post.heroImage ? { images: [post.heroImage] } : {}),
  };

  return {
    title: `${post.title} | Taylor-Made Baby Co.`,
    description: post.excerpt ?? "",
    alternates: {
      canonical: url,
    },
    openGraph,
    twitter,
  };
};

const BlogArticlePage = async ({ params }: { params: Params }) => {
  const { post, unavailable } = await fetchPublicPost(params.slug);
  if (unavailable) {
    return (
      <SectionBand bg="white">
        <div className={`${textCage("intro")} text-center`}>
          <p className="mkt-body text-[var(--tmbc-charcoal)] text-opacity-70">Our editorial library is being refreshed. Check back soon.</p>
        </div>
      </SectionBand>
    );
  }

  if (!post) notFound();

  const contentBlocks = Array.isArray(post.content) ? post.content : [];
  const mainBlocks = splitContentBlocks(contentBlocks);
  const toc = getTableOfContents(mainBlocks);
  const shareUrl = encodeURIComponent(`${siteUrl}/blog/${post.slug}`);
  const shareText = encodeURIComponent(post.title);
  const publishedLabel = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "Coming soon";

  return (
    <>
      <SectionBand bg="white">
        <div className="relative overflow-hidden rounded-[40px] border border-tmMauve/40 bg-white/90 p-10 shadow-editorial">
          <div className="relative mx-auto mt-8 max-w-3xl space-y-4">
            <div className="absolute -right-2 -top-6 hidden text-[140px] font-playfair uppercase tracking-[0.2em] text-tmGold/20 lg:block">
              Journal
            </div>
            <div className={textCage("intro")}>
              <p className="text-xs uppercase tracking-[0.6em] text-tmCharcoal/60">Taylor-Made Journal</p>
              <MarketingHeading level="h1" className="text-tmCharcoal">
                {post.title}
              </MarketingHeading>
              {post.excerpt && <p className="text-base italic text-tmCharcoal/70">{post.excerpt}</p>}
              <p className="text-xs uppercase tracking-[0.45em] text-tmCharcoal/60">
                Calm context from mentors who've been here.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 text-[0.65rem] uppercase tracking-[0.4em] text-tmCharcoal/65">
              {post.tags.map((tag) => (
                <span key={tag} className="rounded-full border border-tmMauve/40 px-3 py-1 text-[0.55rem] font-semibold text-tmCharcoal">
                  {tag}
                </span>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.35em] text-tmCharcoal/60">
              <span>{publishedLabel}</span>
              <span>•</span>
              <span>{post.authorName}</span>
              <span>•</span>
              <span>{formatAuthorRole(post.authorRoleSnapshot)}</span>
            </div>
          </div>
        </div>
      </SectionBand>
      <SectionBand bg="ivory">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,240px)_1fr]">
          <aside className={`${cardBase("space-y-6")} tm-print-hide`}>
            <div>
              <p className="text-xs uppercase tracking-[0.5em] text-tmCharcoal/70">Table of Contents</p>
              <ul className="mt-4 space-y-3 text-sm text-tmCharcoal/80">
                {toc.map((item) => (
                  <li key={item.id}>
                    <a href={`#${item.id}`} className="transition hover:text-tmDeepMauve">
                      {item.heading}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-4 border-t border-tmMauve/40 pt-4">
              <p className="text-xs uppercase tracking-[0.5em] text-tmCharcoal/70">Share</p>
              <div className="flex flex-wrap gap-3">
                <a
                  href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareText}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-tmMauve px-3 py-1 text-xs font-semibold text-tmCharcoal transition hover:border-tmDeepMauve hover:text-tmDeepMauve"
                >
                  Twitter
                </a>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-tmMauve px-3 py-1 text-xs font-semibold text-tmCharcoal transition hover:border-tmDeepMauve hover:text-tmDeepMauve"
                >
                  Facebook
                </a>
                <a
                  href={`mailto:?subject=${shareText}&body=${shareUrl}`}
                  className="rounded-full border border-tmMauve px-3 py-1 text-xs font-semibold text-tmCharcoal transition hover:border-tmDeepMauve hover:text-tmDeepMauve"
                >
                  Email
                </a>
              </div>
            </div>
          </aside>
          <div className={`${cardBase("space-y-8")} tm-print-wrapper`}>
            <div className="tm-print-brand-mark tm-print-only">
              <p className="text-[0.7rem] uppercase tracking-[0.4em] text-tmCharcoal/60">Taylor-Made Baby Co.</p>
              <div className="tm-print-divider" />
            </div>
            <BlogContentRenderer blocks={mainBlocks} />
            <p className="subtle-note">
              Every family is different. Your mentor can help you decide what actually fits your life.
            </p>
          </div>
        </div>
      </SectionBand>
      <SectionBand bg="blush">
        <div className={`${textCage("standard")} space-y-8`}>
          <BlogHighlightSection highlights={post.highlights ?? []} />
          <BlogAffiliateEndCard links={post.affiliateLinks} />
          <div className="rounded-3xl border-l-4 border-tmGold/60 bg-tmIvory/80 px-6 py-6">
            <p className="font-playfair text-2xl uppercase tracking-[0.3em] text-tmCharcoal">
              "Mentor-led planning turns preparation into something steady and kind."
            </p>
          </div>
        </div>
      </SectionBand>
      <SectionBand bg="white">
        <div className="space-y-6">
          <div className={cardBase("space-y-4 text-[var(--tmbc-charcoal)]")}>
            <p className="text-xs uppercase tracking-[0.6em] text-[var(--tmbc-charcoal)]">Need a steady guide?</p>
            <MarketingHeading level="h2" className="mt-3 text-[var(--tmbc-charcoal)]">
              If this raised questions for you, that's normal.
            </MarketingHeading>
            <p className="mt-2 text-sm text-[var(--tmbc-charcoal)]/85">That's what mentors are for.</p>
            <Link href="/request-invite" className="mkt-btn-primary">
              Request an Invite
            </Link>
          </div>
          <div className="tm-print-hide border-t border-tmMauve/30 pt-6 text-base text-tmCharcoal/70">
            <Link href="/blog" className="inline-flex items-center gap-2 text-[0.65rem] uppercase tracking-[0.5em] text-tmCharcoal">
              ← Back to Journal
            </Link>
            <p className="mt-2 max-w-3xl leading-relaxed text-base">
              If you want a mentor to walk through this with you, we're here.
              <br />
              <Link href="/contact" className="text-[0.65rem] uppercase tracking-[0.35em] text-tmCharcoal underline">
                Share where to send calm updates
              </Link>
            </p>
          </div>
        </div>
      </SectionBand>
    </>
  );
};

export default BlogArticlePage;
