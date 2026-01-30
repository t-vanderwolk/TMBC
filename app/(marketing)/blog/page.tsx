import Image from "next/image";
import Link from "next/link";
import MarketingContent from "@/components/marketing/MarketingContent";
import MarketingHero from "@/components/marketing/MarketingHero";
import SectionDivider from "@/components/marketing/SectionDivider";
import blogHero from "@/assets/images/blogpagehero.png";

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

const marketingHeroBlock = (
  <MarketingHero
    eyebrow="Journal"
    headline="Thoughtful guidance, shared gently."
    lead="Reflections, planning support, and calm perspectives for modern parents."
    primaryCta={{ label: "Request an Invite", href: "/request-invite" }}
    secondaryCta={{ label: "Learn about membership", href: "/membership" }}
    imageSrc={blogHero}
    imageAlt="Soft editorial collage for the blog"
    priority
  />
);

function FeaturedPost({ post }: { post: PublicBlogPost }) {
  const primaryCategory = post.tags.at(0) ?? "Journal";

  return (
    <section className="space-y-6 lg:space-y-0">
      <div className="grid gap-8 lg:grid-cols-[1.05fr_1fr]">
        <div className="relative h-72 w-full overflow-hidden rounded-[28px] border border-[var(--tmbc-ivory)] bg-white/60">
          {post.heroImage && (
            <Image
              src={post.heroImage}
              alt={post.title}
              fill
              sizes="(min-width: 1024px) 520px, 100vw"
              className="object-cover"
            />
          )}
        </div>
        <div className="space-y-5">
          <p className="text-xs uppercase tracking-[0.4em] text-[var(--tmbc-charcoal)]/60">
            {primaryCategory} · {formatDate(post.publishedAt)}
          </p>
          <h2 className="mkt-h2 font-playfair text-[var(--tmbc-charcoal)]">{post.title}</h2>
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

function CategoryFilter() {
  return (
    <div className="flex flex-wrap gap-4 border-y border-[var(--tmbc-ivory)]/80 py-6 text-sm uppercase tracking-[0.3em] text-[var(--tmbc-charcoal)]/70">
      {categories.map((category) => (
        <button
          key={category}
          type="button"
          className="transition hover:text-[var(--tmbc-charcoal)]"
          aria-pressed={category === "All"}
        >
          {category}
        </button>
      ))}
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
        <article
          key={post.slug}
          className="flex flex-col gap-5 rounded-[26px] border border-[var(--tmbc-ivory)]/80 bg-white/50 p-6"
        >
          <div className="relative h-48 w-full overflow-hidden rounded-[20px] bg-[var(--tmbc-ivory)]">
            {post.heroImage && (
              <Image
                src={post.heroImage}
                alt={post.title}
                fill
                sizes="(min-width: 1024px) 480px, 100vw"
                className="object-cover"
              />
            )}
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-xs uppercase tracking-[0.35em] text-[var(--tmbc-charcoal)]/60">
              <span>{post.tags.at(0) ?? "Journal"}</span>
              <span>•</span>
              <span>{formatDate(post.publishedAt)}</span>
            </div>
            <h3 className="mkt-h2 font-playfair text-[var(--tmbc-charcoal)] text-[22px] leading-[1.4]">
              {post.title}
            </h3>
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
    <div className="rounded-[28px] bg-white/70 px-6 py-8 text-center text-sm uppercase tracking-[0.3em] text-[var(--tmbc-charcoal)]/70">
      You don’t have to navigate this alone.
      <div className="mt-2 text-[0.75rem] tracking-[0.4em]">
        <Link href="/membership" className="text-[var(--tmbc-charcoal)] hover:text-[var(--tmbc-mauve)]">
          Learn about Membership
        </Link>
      </div>
    </div>
  );
}

function Pagination() {
  return (
    <div className="mt-12 flex justify-center">
      <Link
        href="/blog?page=2"
        className="text-sm font-semibold uppercase tracking-[0.3em] text-[var(--tmbc-charcoal)] transition hover:text-[var(--tmbc-mauve)]"
      >
        Load more
      </Link>
    </div>
  );
}

export default async function BlogMarketingPage() {
  const { posts, unavailable } = await fetchPublicPosts();
  const [featuredPost, ...otherPosts] = posts;

  if (unavailable || !featuredPost) {
    return (
      <>
        {marketingHeroBlock}
        <SectionDivider />
        <MarketingContent>
          <section className="marketing-section marketing-section-wash text-center">
            <p className="mkt-body text-[var(--tmbc-charcoal)]/80">
              Our editorial library is being refreshed. Check back soon for calm stories and reflections.
            </p>
          </section>
        </MarketingContent>
      </>
    );
  }

  return (
    <>
      {marketingHeroBlock}
      <SectionDivider />
      <MarketingContent>
        <section className="marketing-section">
          <FeaturedPost post={featuredPost} />
        </section>
        <SectionDivider />
        <section className="marketing-section marketing-section-wash">
          <CategoryFilter />
          <div className="mt-10">
            <PostGrid posts={otherPosts} />
          </div>
        </section>
        <SectionDivider />
        <section className="marketing-section">
          <div className="space-y-8">
            <BlogCallout />
            <Pagination />
          </div>
        </section>
      </MarketingContent>
    </>
  );
}
