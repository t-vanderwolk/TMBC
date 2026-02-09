import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import BlogContentRenderer, {
  createHeadingId,
  type BlogContentBlock,
} from "@/components/blog/BlogContentRenderer";
import BlogAffiliateEndCard from "@/components/blog/BlogAffiliateEndCard";
import BlogAnalyticsTracker from "@/components/blog/BlogAnalyticsTracker";
import BlogHighlightSection from "@/components/blog/BlogHighlightSection";
import EndRibbonBow from "@/components/blog/EndRibbonBow";
import defaultBlogOgImage from "@/assets/images/hero-marketing-signature.png";
import tmbcSeal from "@/assets/images/tmbc-seal.png";
import { MarketingHeading } from "@/components/marketing/Typography";
import { BLOG_IMPACT_SLUG } from "@/lib/constants/blogAnalytics";
import { caveat } from "@/lib/fonts";

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
const DEFAULT_BLOG_OG_IMAGE = `${siteUrl}${defaultBlogOgImage.src}`;

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

type BlogPageProps = {
  params: Params;
  searchParams?: { sourceContext?: string };
};

const ART_OF_REGISTRY_FALLBACK: PublicBlogPost = {
  id: "fallback-art-of-the-registry",
  slug: BLOG_IMPACT_SLUG,
  title: "The Art of the Registry",
  excerpt:
    "How to prepare for baby without overbuying — or feeling like you’re doing it wrong.",
  content: [
    {
      type: "paragraph",
      text: "There’s a moment in early pregnancy (or adoption planning) when it hits you:",
    },
    {
      type: "paragraph",
      text: "Everyone is telling you to buy something — and none of them agree.",
    },
    {
      type: "paragraph",
      text: "One person swears you must have a wipe warmer. Another says they never used half their registry. Instagram shows perfectly styled nurseries. Your group chat is sending Amazon links at 11pm. And suddenly, preparing for your baby feels less like care… and more like consumer overwhelm.",
    },
    {
      type: "paragraph",
      text: "At Taylor-Made Baby Co., we believe baby prep isn’t about buying more. It’s about choosing intentionally — with support from someone who’s already been exactly where you are.",
    },
    {
      type: "paragraph",
      text: "This is the art of the registry.",
    },
    {
      type: "heading",
      level: 2,
      text: "Why registries get overwhelming (and why it’s not your fault)",
    },
    {
      type: "paragraph",
      text: "Modern baby prep happens at the intersection of marketing algorithms, well-meaning advice, and a very real desire to “get it right.”",
    },
    {
      type: "paragraph",
      text: "Most registries fail not because parents don’t care — but because no one explains what products actually do, when you’ll need them, or whether your life even calls for them.",
    },
    {
      type: "paragraph",
      text: "So parents default to “just in case,” “everyone else has this,” or “I don’t want to forget something.”",
    },
    {
      type: "paragraph",
      text: "That’s not overbuying because you’re careless. That’s overbuying because you’re unsupported.",
    },
    {
      type: "heading",
      level: 2,
      text: "The Taylor-Made approach: Learn · Plan · Connect · Reflect",
    },
    {
      type: "paragraph",
      text: "We built TMBC around a simple belief: you deserve clarity before you purchase.",
    },
    {
      type: "paragraph",
      text: "Here’s how our process works — in real, human terms.",
    },
    { type: "heading", level: 3, text: "Learn" },
    {
      type: "paragraph",
      text: "What does this actually do — and do I need it?",
    },
    {
      type: "paragraph",
      text: "Before anything touches your registry, you learn what each product is designed to solve, when it’s typically used, and which features actually matter for your home, lifestyle, and baby.",
    },
    {
      type: "paragraph",
      text: "No pressure. No brand bias. Just calm explanation.",
    },
    {
      type: "paragraph",
      text: "Because it’s a lot easier to say “no” to something once you actually understand it.",
    },
    { type: "heading", level: 3, text: "Plan" },
    {
      type: "paragraph",
      text: "Build your registry while you learn — with a mentor who’s done this before.",
    },
    {
      type: "paragraph",
      text: "Instead of building a registry all at once, you plan in layers: essentials versus nice-to-haves, buy now versus wait and see, borrow, rent, secondhand, or skip entirely.",
    },
    {
      type: "paragraph",
      text: "You don’t do this alone. You plan alongside a trusted mentor — someone who’s been through babyhood, gear decisions, and the emotional side of it all.",
    },
    {
      type: "paragraph",
      text: "This is where overbuying quietly disappears.",
    },
    { type: "heading", level: 3, text: "Connect" },
    {
      type: "paragraph",
      text: "You’re not the only one asking these questions.",
    },
    {
      type: "paragraph",
      text: "Inside TMBC, you connect with other parents at the same stage, mentors who guide conversations, and people asking the same things you’re wondering at 2am.",
    },
    {
      type: "paragraph",
      text: "“Do I really need this?” “Did anyone else skip this?” “What actually mattered in the first month?”",
    },
    {
      type: "paragraph",
      text: "You’re not crowdsourcing chaos — you’re sharing clarity.",
    },
    { type: "heading", level: 3, text: "Reflect" },
    {
      type: "paragraph",
      text: "Turn preparation into something you’ll actually want to keep.",
    },
    {
      type: "paragraph",
      text: "Most baby prep disappears into receipts and boxes. We believe it should become a keepsake.",
    },
    {
      type: "paragraph",
      text: "Inside TMBC, you can reflect as you go: what you learned, what you chose (and why), and how your confidence grew.",
    },
    {
      type: "paragraph",
      text: "So one day, you can look back — not at how much you bought — but at how thoughtfully you prepared for your baby.",
    },
    {
      type: "heading",
      level: 2,
      text: "The member-to-mentor path (because wisdom compounds)",
    },
    {
      type: "paragraph",
      text: "Some members eventually become mentors.",
    },
    {
      type: "paragraph",
      text: "Parents who once asked the questions become the ones helping others navigate them. It’s a cycle of lived experience passed forward — and it keeps the platform grounded, human, and real.",
    },
    {
      type: "paragraph",
      text: "Preparing without overbuying isn’t about restraint — it’s about trust.",
    },
    {
      type: "paragraph",
      text: "Trust in yourself, your ability to learn, and the idea that you don’t need everything to be a great parent.",
    },
    {
      type: "paragraph",
      text: "You just need the right things — chosen with care.",
    },
    {
      type: "paragraph",
      text: "That’s the art of the registry.",
    },
    {
      type: "heading",
      level: 2,
      text: "END_CARD",
    },
    {
      type: "paragraph",
      text: "If this raised questions, that’s normal. A mentor can help you decide what fits your life.",
    },
  ],
  heroImage: null,
  publishedAt: "2024-10-28T00:00:00.000Z",
  authorName: "Taylor-Made Baby Co.",
  authorRoleSnapshot: "MENTOR",
  tags: ["registry", "planning", "clarity"],
  highlights: [],
  affiliateLinks: [],
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

const fetchPublicPost = async (slug: string, sourceContext?: string): Promise<PublicBlogPostResult> => {
  if (SHOULD_SKIP_PUBLIC_BLOG_FETCH) {
    return { post: null, unavailable: false };
  }

  try {
    const endpoint = new URL(`/api/blog/public/${slug}`, API_BASE_URL);
    if (sourceContext) {
      endpoint.searchParams.set("sourceContext", sourceContext);
    }
    const response = await fetch(endpoint, {
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
  const resolvedPost = post ?? (params.slug === BLOG_IMPACT_SLUG ? ART_OF_REGISTRY_FALLBACK : null);
  if (!resolvedPost) return {};

  const url = `${siteUrl}/blog/${resolvedPost.slug}`;

  const openGraph: Metadata["openGraph"] = {
    title: resolvedPost.title,
    description: resolvedPost.excerpt ?? "",
    url,
    siteName: "Taylor-Made Baby Co.",
    type: "article",
    publishedTime: resolvedPost.publishedAt ?? undefined,
    authors: [resolvedPost.authorName],
    images: [{ url: resolvedPost.heroImage ?? DEFAULT_BLOG_OG_IMAGE }],
  };

  const twitter: Metadata["twitter"] = {
    card: "summary_large_image",
    title: resolvedPost.title,
    description: resolvedPost.excerpt ?? "",
    images: [resolvedPost.heroImage ?? DEFAULT_BLOG_OG_IMAGE],
  };

  return {
    title: `${resolvedPost.title} | Taylor-Made Baby Co.`,
    description: resolvedPost.excerpt ?? "",
    alternates: {
      canonical: url,
    },
    openGraph,
    twitter,
  };
};

const BlogArticlePage = async ({ params, searchParams }: BlogPageProps) => {
  const { post, unavailable } = await fetchPublicPost(params.slug, searchParams?.sourceContext);
  const resolvedPost = post ?? (params.slug === BLOG_IMPACT_SLUG ? ART_OF_REGISTRY_FALLBACK : null);
  if (unavailable) {
    return (
      <SectionBand bg="white">
        <div className={`${textCage("intro")} text-center`}>
          <p className="mkt-body text-[var(--tmbc-charcoal)] text-opacity-70">Our editorial library is being refreshed. Check back soon.</p>
        </div>
      </SectionBand>
    );
  }

  if (!resolvedPost) notFound();

  const contentBlocks = Array.isArray(resolvedPost.content) ? resolvedPost.content : [];
  const mainBlocks = splitContentBlocks(contentBlocks);
  const toc = getTableOfContents(mainBlocks);
  const shareUrl = encodeURIComponent(`${siteUrl}/blog/${resolvedPost.slug}`);
  const shareText = encodeURIComponent(resolvedPost.title);
  const publishedLabel = resolvedPost.publishedAt
    ? new Date(resolvedPost.publishedAt).toLocaleDateString("en-US", {
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
                {resolvedPost.title}
              </MarketingHeading>
              {resolvedPost.excerpt && <p className="text-base italic text-tmCharcoal/70">{resolvedPost.excerpt}</p>}
              <p className="text-xs uppercase tracking-[0.45em] text-tmCharcoal/60">
                Calm context from mentors who've been here.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 text-[0.65rem] uppercase tracking-[0.4em] text-tmCharcoal/65">
              {resolvedPost.tags.map((tag) => (
                <span key={tag} className="rounded-full border border-tmMauve/40 px-3 py-1 text-[0.55rem] font-semibold text-tmCharcoal">
                  {tag}
                </span>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.35em] text-tmCharcoal/60">
              <span>{publishedLabel}</span>
              <span>•</span>
              <span>{resolvedPost.authorName}</span>
              <span>•</span>
              <span>{formatAuthorRole(resolvedPost.authorRoleSnapshot)}</span>
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
          <article
            className="
              tm-print-wrapper
              blog-editorial
              prose prose-neutral
              max-w-[720px]
              mx-auto
              px-6 sm:px-8
              pt-16 sm:pt-20
              pb-32
              prose-p:leading-relaxed
              prose-p:text-[17px]
              prose-p:text-neutral-700
              prose-h2:font-playfair
              prose-h2:text-[26px]
              prose-h2:mt-20
              prose-h2:mb-6
              prose-h3:text-[20px]
              prose-h3:mt-12
              prose-strong:font-medium
              prose-strong:text-neutral-900
              prose-em:text-neutral-700
              relative
              space-y-8
              w-full
            "
          >
            <div className="tm-print-brand-mark tm-print-only">
              <p className="text-[0.7rem] uppercase tracking-[0.4em] text-tmCharcoal/60">Taylor-Made Baby Co.</p>
              <div className="tm-print-divider" />
            </div>
            <BlogContentRenderer blocks={mainBlocks} />
            <p className="subtle-note">
              Every family is different. Your mentor can help you decide what actually fits your life.
            </p>
            <div className="mt-24" />
            <EndRibbonBow />
            <div className="mt-4 flex justify-start">
              <div
                className={`${caveat.className} text-neutral-600 text-lg`}
                style={{ transform: "rotate(-6deg) scale(3) translateY(6px)" }}
              >
                <div>XOXO</div>
                <div className="-mt-1">— T</div>
              </div>
            </div>
            <div className="relative mt-32 flex justify-end">
              <div className="opacity-75 rotate-[-8deg] pointer-events-none">
                <Image
                  src={tmbcSeal}
                  alt=""
                  aria-hidden="true"
                  width={120}
                  height={120}
                  className="w-[100px] sm:w-[120px]"
                  priority={false}
                />
              </div>
            </div>
            <div className="mt-10 sm:mt-14" />
          </article>
        </div>
      </SectionBand>
      <SectionBand bg="blush">
        <div className={`${textCage("standard")} space-y-8`}>
          <BlogHighlightSection highlights={resolvedPost.highlights ?? []} />
          <BlogAffiliateEndCard links={resolvedPost.affiliateLinks} />
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
      {resolvedPost.slug === BLOG_IMPACT_SLUG && (
        <BlogAnalyticsTracker slug={resolvedPost.slug} sourceContext={searchParams?.sourceContext ?? null} />
      )}
    </>
  );
};

export default BlogArticlePage;
