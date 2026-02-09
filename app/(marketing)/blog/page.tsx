import Image from "next/image";
import Link from "next/link";
import MarketingHero from "@/components/marketing/MarketingHero";
import { MarketingHeading } from "@/components/marketing/Typography";
import { SectionBand, textCage, cardBase } from "@/components/marketing/MarketingCadence";

// Marketing visual guardrails:
// - All cards/panels use canonical marketing-card / marketing-panel styles
// - No borders, transforms, or hover animations
// - Elevation is soft and consistent across pages

import { HERO_IMAGE_REGISTRY } from "@/lib/heroImages";

export const dynamic = "force-dynamic";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_APP_URL ||
  process.env.NEXT_PUBLIC_SITE_URL ||
  "http://localhost:3000";
const SHOULD_SKIP_PUBLIC_BLOG_FETCH =
  process.env.npm_lifecycle_event === "build";

type PublicBlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  heroImage: string | null;
  publishedAt: string | null;
  authorName: string;
  authorRoleSnapshot: "ADMIN" | "MENTOR";
  tags: string[];
};

type PublicBlogFetchResult = {
  posts: PublicBlogPost[];
  unavailable: boolean;
};

const fetchPublicPosts = async (): Promise<PublicBlogFetchResult> => {
  if (SHOULD_SKIP_PUBLIC_BLOG_FETCH) {
    return { posts: [], unavailable: false };
  }

  try {
    const response = await fetch(new URL("/api/blog/public", API_BASE_URL), {
      next: { revalidate: 300 },
    });

    const payload = await response.json().catch(() => null);
    const posts = Array.isArray(payload?.posts) ? payload.posts : [];
    const unavailable = Boolean(payload?.unavailable) || response.status === 503;
    return { posts, unavailable };
  } catch {
    return { posts: [], unavailable: false };
  }
};

const categories = ["All", "Planning", "Registry", "Reflection", "Postpartum"];

const formatDate = (value?: string | null) => {
  if (!value) return "Coming soon";
  return new Date(value).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

const PRIORITIZED_SECOND_SLUG = "baby-and-pet-safety-guidelines";

const ensureSecondPosition = (posts: PublicBlogPost[]) => {
  const ordered = [...posts];
  const targetIndex = ordered.findIndex((post) => post.slug === PRIORITIZED_SECOND_SLUG);
  if (targetIndex > 1) {
    const [targetPost] = ordered.splice(targetIndex, 1);
    if (targetPost) {
      ordered.splice(1, 0, targetPost);
    }
  }
  return ordered;
};

const marketingHeroBlock = (
  <>
    {/* Hero must render instantly and avoid additional entrance wrappers. */}
      <MarketingHero
        eyebrow="Journal"
        headline="Thoughtful guidance, shared gently."
        lead="Reflections, planning support, and calm perspectives for modern parents."
        primaryCta={{ label: "Request an Invite", href: "/request-invite" }}
        secondaryCta={{ label: "Learn about membership", href: "/membership" }}
        heroImage={HERO_IMAGE_REGISTRY.heroMarketingSignature}
      />
  </>
);

function FeaturedPost({ post }: { post: PublicBlogPost }) {
  const primaryCategory = post.tags.at(0) ?? "Journal";

  return (
    <section className="space-y-6 lg:space-y-0">
      <div className="grid gap-8 lg:grid-cols-[1.05fr_1fr]">
        <div className="relative h-72 w-full overflow-hidden rounded-[28px] border border-[var(--tmbc-ivory)] bg-white/60">
          {post.heroImage ? (
            <Image
              src={post.heroImage}
              alt={post.title}
              fill
              sizes="(min-width: 1024px) 520px, 100vw"
              className="object-cover"
            />
          ) : (
            <div aria-hidden className="absolute inset-0 bg-[var(--tmbc-ivory)]" />
          )}
        </div>
        <div className="space-y-5">
          <p className="text-xs uppercase tracking-[0.4em] text-[var(--tmbc-charcoal)]/60">
            {primaryCategory} · {formatDate(post.publishedAt)}
          </p>
          <MarketingHeading level="h2">
            {post.title}
          </MarketingHeading>
          <p className="mkt-body text-[var(--tmbc-charcoal)] text-opacity-80">{post.excerpt ?? ""}</p>
          <Link
            href={`/blog/${post.slug}`}
            className="text-sm font-semibold uppercase tracking-[0.3em] text-[var(--tmbc-charcoal)] transition hover:text-[var(--tmbc-mauve)]"
          >
            Read more
          </Link>
        </div>
      </div>
    </section>
  );
}

function SecondaryPostPreview({ post }: { post: PublicBlogPost }) {
  const primaryCategory = post.tags.at(0) ?? "Journal";

  return (
    <section className={cardBase("bg-[var(--tmbc-ivory)]/80 border border-[var(--tmbc-ivory)]")}>
      <div className="grid gap-6 lg:grid-cols-[1fr_1fr] items-center">
        <div className="relative h-48 w-full overflow-hidden rounded-[20px] bg-white/80 border border-[var(--tmbc-ivory)]">
          {post.heroImage ? (
            <Image
              src={post.heroImage}
              alt={post.title}
              fill
              sizes="(min-width: 1024px) 420px, 100vw"
              className="object-cover"
            />
          ) : (
            <div aria-hidden className="absolute inset-0 bg-[var(--tmbc-ivory)]" />
          )}
        </div>
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.35em] text-[var(--tmbc-charcoal)]/60">
            {primaryCategory} · {formatDate(post.publishedAt)}
          </p>
          <MarketingHeading level="h3" className="text-[var(--tmbc-charcoal)]">
            {post.title}
          </MarketingHeading>
          <p className="mkt-body text-[var(--tmbc-charcoal)] text-opacity-80">{post.excerpt ?? ""}</p>
          <Link
            href={`/blog/${post.slug}`}
            className="text-sm font-semibold uppercase tracking-[0.3em] text-[var(--tmbc-charcoal)] transition hover:text-[var(--tmbc-mauve)]"
          >
            Read the preview
          </Link>
        </div>
      </div>
    </section>
  );
}

function CategoryFilter() {
  return (
    <div className="flex flex-wrap gap-4 border-y border-[var(--tmbc-ivory)]/80 py-6 text-sm uppercase tracking-[0.3em] text-[var(--tmbc-charcoal)]/70">
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <span
            key={category}
            className="rounded-full bg-[var(--tmbc-ivory)]/75 px-3 py-1 text-sm font-semibold uppercase tracking-[0.35em] text-[var(--tmbc-charcoal)]/70"
          >
            {category}
          </span>
        ))}
      </div>
    </div>
  );
}

function PostGrid({ posts }: { posts: PublicBlogPost[] }) {
  if (!posts.length) {
    return (
      <p className="mkt-body text-[var(--tmbc-charcoal)] text-opacity-70">
        New conversations arrive modestly—check back soon.
      </p>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {posts.map((post) => (
        <article key={post.slug} className={cardBase("flex flex-col gap-5")}>
          <div className="relative h-48 w-full overflow-hidden rounded-[20px] bg-[var(--tmbc-ivory)]">
            {post.heroImage ? (
              <Image
                src={post.heroImage}
                alt={post.title}
                fill
                sizes="(min-width: 1024px) 480px, 100vw"
                className="object-cover"
              />
            ) : (
              <div aria-hidden className="absolute inset-0 bg-[var(--tmbc-ivory)]" />
            )}
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-xs uppercase tracking-[0.35em] text-[var(--tmbc-charcoal)]/60">
              <span>{post.tags.at(0) ?? "Journal"}</span>
              <span>•</span>
              <span>{formatDate(post.publishedAt)}</span>
            </div>
            <MarketingHeading level="h3" className="text-[var(--tmbc-charcoal)]">
              {post.title}
            </MarketingHeading>
            <p className="mkt-body text-[var(--tmbc-charcoal)] text-opacity-75">{post.excerpt ?? ""}</p>
          </div>
          <Link
            href={`/blog/${post.slug}`}
            className="text-sm font-semibold uppercase tracking-[0.3em] text-[var(--tmbc-charcoal)] transition hover:text-[var(--tmbc-mauve)]"
          >
            Read more
          </Link>
        </article>
      ))}
    </div>
  );
}

function BlogCallout() {
  return (
    <div
      className={cardBase("text-center text-sm uppercase tracking-[0.3em] text-[var(--tmbc-charcoal)]/70")}
    >
      You don’t have to navigate this alone.
      <div className="mt-2 text-[0.75rem] tracking-[0.4em]">
        <Link href="/membership" className="text-[var(--tmbc-charcoal)] hover:text-[var(--tmbc-mauve)]">
          Learn about Membership
        </Link>
      </div>
    </div>
  );
}

const artOfRegistryPreview = {
  title: "The Art of the Registry",
  excerpt:
    "How to prepare for baby without overbuying — or feeling like you’re doing it wrong.",
  tag: "Registry",
  slug: "the-art-of-the-registry",
  author: "TMBC",
  publishedAt: "October 28, 2024",
};

function EvergreenPreviewCard() {
  return (
    <section className={cardBase("space-y-4 bg-white/90 border-tmMauve/40")}>
      <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.4em] text-[var(--tmbc-charcoal)]/60">
        <span>{artOfRegistryPreview.tag}</span>
        <span>·</span>
        <span>{artOfRegistryPreview.author}</span>
        <span>·</span>
        <span>{artOfRegistryPreview.publishedAt}</span>
      </div>
      <MarketingHeading level="h2">{artOfRegistryPreview.title}</MarketingHeading>
      <p className="mkt-body text-[var(--tmbc-charcoal)] text-opacity-80">{artOfRegistryPreview.excerpt}</p>
      <Link
        href={`/blog/${artOfRegistryPreview.slug}`}
        className="text-sm font-semibold uppercase tracking-[0.3em] text-[var(--tmbc-charcoal)] transition hover:text-[var(--tmbc-mauve)]"
      >
        Read the full story
      </Link>
    </section>
  );
}

export default async function BlogMarketingPage() {
  const { posts, unavailable } = await fetchPublicPosts();
  const orderedPosts = ensureSecondPosition(posts);
  const [featuredPost, secondPost, ...otherPosts] = orderedPosts;

  if (unavailable || !featuredPost) {
    return (
      <>
        {marketingHeroBlock}
        <SectionBand bg="white">
          <EvergreenPreviewCard />
        </SectionBand>
        <SectionBand bg="ivory">
          <div className="mkt-body text-[var(--tmbc-charcoal)] text-opacity-80">
            New conversations arrive modestly—check back soon.
          </div>
        </SectionBand>
      </>
    );
  }

  return (
    <>
      {marketingHeroBlock}
      <SectionBand bg="white">
        <EvergreenPreviewCard />
      </SectionBand>
      <SectionBand bg="white">
        <FeaturedPost post={featuredPost} />
      </SectionBand>
      {secondPost && (
        <SectionBand bg="ivory">
          <div className={`${textCage("standard")}`}>
            <SecondaryPostPreview post={secondPost} />
          </div>
        </SectionBand>
      )}
      <SectionBand bg="ivory">
        <div className={`${textCage("standard")}`}>
          <CategoryFilter />
          <div className="mt-10">
            <PostGrid posts={otherPosts} />
          </div>
        </div>
      </SectionBand>
      <SectionBand bg="blush">
        <div className="space-y-8">
          <BlogCallout />
        </div>
      </SectionBand>
    </>
  );
}
