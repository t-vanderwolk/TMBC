import Link from "next/link";
import MarketingHero from "@/components/marketing/MarketingHero";
import MarketingContent from "@/components/marketing/MarketingContent";

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

const formatAuthorRole = (role?: PublicBlogPost["authorRoleSnapshot"]) => {
  if (role === "ADMIN") return "Admin";
  if (role === "MENTOR") return "Mentor";
  return "Staff";
};

const fetchPublicPosts = async (): Promise<PublicBlogPost[]> => {
  if (SHOULD_SKIP_PUBLIC_BLOG_FETCH) {
    return [];
  }

  try {
    const response = await fetch(new URL("/api/blog/public", API_BASE_URL), {
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      return [];
    }

    return response.json();
  } catch {
    return [];
  }
};

const heroSupportingText = (
  <>
    <span className="text-xs uppercase tracking-[0.6em] text-[var(--tmbc-charcoal)]">
      Taylor-Made Journal
    </span>
    <span className="block mt-4">
      Real conversations about baby prep, decisions, and life with a new child — without fear-based advice. (Or a 47-tab deep dive at midnight.)
    </span>
  </>
);

const heroSection = (
  <MarketingHero
    imageSrc="/assets/images/section-background-soft-ribbon.png"
    imageAlt="Soft ribbon background"
    imageWidth={1536}
    imageHeight={1024}
    headline="Clear thinking for pregnancy and early parenthood."
    supportingText={heroSupportingText}
    primaryCta={{
      label: "Request an Invite",
      href: "/request-invite",
      className: "marketing-btn marketing-btn-primary marketing-btn-primary-medium uppercase tracking-[0.35em]",
    }}
    secondaryCta={{
      label: "How the journal works",
      href: "/how-it-works",
    }}
    priority
  />
);

const BlogMarketingPage = async () => {
  const posts = await fetchPublicPosts();
  const [featuredPost, ...otherPosts] = posts;

  if (!featuredPost) {
    return (
      <>
        {heroSection}
        <MarketingContent>
          <div className="marketing-content space-y-24 md:space-y-32 text-[var(--tmbc-charcoal)]">
            <section className="marketing-section mb-24 md:mb-28 text-center text-base text-[var(--tmbc-charcoal)] text-opacity-70">
              <p>No journal entries are available yet.</p>
              <p className="mt-2 text-sm text-[var(--tmbc-charcoal)] text-opacity-60">
                Check back soon — we publish gently.
              </p>
            </section>
          </div>
        </MarketingContent>
      </>
    );
  }

  return (
    <>
      {heroSection}
      <MarketingContent>
        <div className="marketing-content space-y-24 md:space-y-32 text-[var(--tmbc-charcoal)]">
          <section className="marketing-section space-y-10 mb-24 md:mb-28">
            <article className="mx-auto grid grid-cols-1 gap-6 overflow-hidden rounded-2xl border border-[var(--tmbc-ivory)]/60 bg-tmIvory transition-all duration-300 hover:shadow-[0_10px_30px_rgba(0,0,0,0.06)]">
              <div className="flex flex-col gap-6 p-8 sm:p-10">
                <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-50">
                  <span>
                    {featuredPost.publishedAt
                      ? new Date(featuredPost.publishedAt).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "Coming soon"}
                  </span>
                  <span>•</span>
                  <span>{featuredPost.authorName}</span>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.35em] text-[var(--tmbc-charcoal)] text-opacity-50">
                  {featuredPost.tags.map((tag) => (
                    <span key={tag} className="rounded-full bg-tmBlush/70 px-3 py-1 font-semibold text-[0.55rem] tracking-[0.3em] text-tmCharcoal">
                      {tag}
                    </span>
                  ))}
                  <span className="rounded-full border border-tmBlush/70 px-3 py-1 text-[0.55rem] font-semibold text-[var(--tmbc-charcoal)]">
                    {formatAuthorRole(featuredPost.authorRoleSnapshot)}
                  </span>
                </div>
                <h2 className="font-playfair text-2xl sm:text-3xl text-[var(--tmbc-charcoal)]">{featuredPost.title}</h2>
                <p className="text-base leading-relaxed text-[var(--tmbc-charcoal)] text-opacity-80">
                  {featuredPost.excerpt ?? ""}
                </p>
                <Link
                  href={`/blog/${featuredPost.slug}`}
                  className="marketing-btn marketing-btn-secondary uppercase tracking-[0.35em] text-center sm:text-left"
                >
                  Read the story (take your time)
                </Link>
              </div>
            </article>
          </section>

          <section className="marketing-section space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {otherPosts.map((post) => (
                <article
                  key={post.slug}
                  className="marketing-card group flex min-h-[320px] flex-col justify-between overflow-hidden bg-white/80 p-6"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-[0.65rem] uppercase tracking-[0.4em] text-[var(--tmbc-charcoal)] text-opacity-50">
                      <span>
                        {post.publishedAt
                          ? new Date(post.publishedAt).toLocaleDateString("en-US", {
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            })
                          : "Coming soon"}
                      </span>
                      <span>{post.authorName}</span>
                    </div>
                    <h3 className="font-playfair text-xl sm:text-2xl text-[var(--tmbc-charcoal)]">{post.title}</h3>
                    <p className="text-base leading-relaxed text-[var(--tmbc-charcoal)] text-opacity-75">
                      {post.excerpt ?? ""}
                    </p>
                    <div className="flex flex-wrap gap-2 text-[0.65rem] uppercase tracking-[0.35em] text-[var(--tmbc-charcoal)] text-opacity-50">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-tmBlush/70 px-3 py-1 text-[0.55rem] font-semibold text-[var(--tmbc-charcoal)]"
                        >
                          {tag}
                        </span>
                      ))}
                      <span className="rounded-full border border-tmBlush/70 px-3 py-1 text-[0.55rem] font-semibold text-[var(--tmbc-charcoal)]">
                        {formatAuthorRole(post.authorRoleSnapshot)}
                      </span>
                    </div>
                  </div>
                  <div className="mt-6 border-t border-tmMauve/40 pt-4 text-sm uppercase tracking-[0.4em] text-[var(--tmbc-charcoal)]">
                    <Link href={`/blog/${post.slug}`} className="inline-flex items-center gap-2 font-semibold">
                      Read more
                      <span aria-hidden>→</span>
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      </MarketingContent>
    </>
  );
};

export default BlogMarketingPage;
