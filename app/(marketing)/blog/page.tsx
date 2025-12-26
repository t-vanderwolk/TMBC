import Link from "next/link";

import VisualPlaceholder from "@/components/marketing/VisualPlaceholder";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_APP_URL ||
  process.env.NEXT_PUBLIC_SITE_URL ||
  "http://localhost:3000";

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
  const response = await fetch(new URL("/api/blog/public", API_BASE_URL), {
    next: { revalidate: 300 },
  });

  if (!response.ok) {
    return [];
  }

  return response.json();
};

const BlogMarketingPage = async () => {
  const posts = await fetchPublicPosts();
  const [featuredPost, ...otherPosts] = posts;
  if (!featuredPost) {
    return (
      <section className="marketing-section text-center text-base text-[var(--tmbc-charcoal)] text-opacity-70">
        <p>No journal entries are available yet.</p>
      </section>
    );
  }

  return (
    <section className="marketing-section space-y-10">
      <header className="space-y-3 text-center">
        <p className="text-xs uppercase tracking-[0.6em] text-[var(--tmbc-charcoal)] text-opacity-60">Taylor-Made Journal</p>
        <h1 className="font-playfair text-3xl sm:text-4xl text-[var(--tmbc-charcoal)]">
          Notes from the planning side of parenthood
        </h1>
        <p className="text-base text-[var(--tmbc-charcoal)] text-opacity-70">
          Calm context, helpful perspective, and things we wish someone told us sooner.
        </p>
        <p className="text-sm text-[var(--tmbc-charcoal)] text-opacity-70">No "must-have" lists. We promise.</p>
      </header>

      <article className="mx-auto grid grid-cols-1 gap-6 overflow-hidden rounded-[40px] border border-tmMauve/40 bg-tmIvory shadow-editorial transition duration-300 hover:-translate-y-0.5 sm:grid-cols-[1.1fr_0.9fr]">
        <div className="marketing-media relative min-h-[320px] flex-1">
          <VisualPlaceholder
            label="Hero lifestyle image or calm planning moment"
            className="absolute inset-0 h-full w-full"
            minHeightClassName="min-h-full"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-tmGold/20 via-tmIvory/80 to-transparent" />
        </div>
        <div className="flex flex-1 flex-col gap-6 p-8 sm:p-10">
          <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-60">
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
          <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.35em] text-[var(--tmbc-charcoal)] text-opacity-60">
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
            Read the story
          </Link>
        </div>
      </article>

      <section className="space-y-6 marketing-section">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {otherPosts.map((post) => (
            <article
              key={post.slug}
              className="group flex min-h-[320px] flex-col justify-between overflow-hidden rounded-[32px] border border-tmMauve/30 bg-white/80 p-6 shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-editorial"
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
                <VisualPlaceholder
                  label="Story image placeholder"
                  className="rounded-[28px]"
                  minHeightClassName="min-h-[144px]"
                />
                <h3 className="font-playfair text-xl sm:text-2xl text-[var(--tmbc-charcoal)]">{post.title}</h3>
                <p className="text-base leading-relaxed text-[var(--tmbc-charcoal)] text-opacity-75">
                  {post.excerpt ?? ""}
                </p>
                <div className="flex flex-wrap gap-2 text-[0.65rem] uppercase tracking-[0.35em] text-[var(--tmbc-charcoal)] text-opacity-60">
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
    </section>
  );
};

export default BlogMarketingPage;
