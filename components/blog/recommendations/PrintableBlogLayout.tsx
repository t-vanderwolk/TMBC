import type { AffiliatePolicy } from "@/lib/blog/affiliatePolicy";
import type { BlogContentBlock } from "@/components/blog/BlogContentRenderer";
import BlogContentRenderer from "@/components/blog/BlogContentRenderer";
import BlogAffiliateEndCard from "@/components/blog/BlogAffiliateEndCard";

import PrintTrigger from "./PrintTrigger";

type PrintableBlogLayoutProps = {
  post: {
    title: string;
    excerpt: string | null;
    content: BlogContentBlock[];
    publishedAt: string | null;
    authorName: string;
    authorRoleSnapshot: "ADMIN" | "MENTOR";
    affiliateLinks: Array<{
      id: string;
      partnerName: string;
      label: string;
      position: "INLINE" | "CALLOUT" | "END_CARD";
      isPrimary: boolean;
      policy?: AffiliatePolicy;
    }>;
  };
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

const formatAuthorRole = (role: PrintableBlogLayoutProps["post"]["authorRoleSnapshot"]) =>
  role === "ADMIN" ? "Admin" : "Mentor";

export default function PrintableBlogLayout({ post }: PrintableBlogLayoutProps) {
  const contentBlocks = Array.isArray(post.content) ? post.content : [];
  const mainBlocks = splitContentBlocks(contentBlocks);
  const publishedLabel = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
    : "Coming soon";

  return (
    <div className="min-h-screen bg-white text-tmCharcoal">
      <PrintTrigger />
      <article className="mx-auto max-w-4xl space-y-12 px-6 py-12">
        <header className="space-y-3 border-b border-tmBlush/40 pb-6 text-center">
          <p className="text-[0.6rem] uppercase tracking-[0.5em] text-tmCharcoal/60">Taylor-Made Journal</p>
          <h1 className="font-playfair text-4xl text-tmCharcoal">{post.title}</h1>
          {post.excerpt && <p className="text-sm text-tmCharcoal/75">{post.excerpt}</p>}
          <div className="flex flex-wrap items-center justify-center gap-4 text-[0.65rem] uppercase tracking-[0.35em] text-tmCharcoal/65">
            {post.authorName && <span>{post.authorName}</span>}
            <span>{formatAuthorRole(post.authorRoleSnapshot)}</span>
            <span>{publishedLabel}</span>
          </div>
        </header>

        <section className="space-y-10">
          <BlogContentRenderer blocks={mainBlocks} />
        </section>

        <BlogAffiliateEndCard links={post.affiliateLinks} />
      </article>
    </div>
  );
}
