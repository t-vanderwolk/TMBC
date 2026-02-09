import type { Metadata } from "next";

import BlogArticlePage, { generateMetadata as generateBlogMetadata } from "../[slug]/page";

export const generateMetadata = async (): Promise<Metadata> =>
  generateBlogMetadata({ params: { slug: "the-art-of-the-registry" } });

export default function ArtOfTheRegistryPage({
  searchParams,
}: {
  searchParams?: { sourceContext?: string };
}) {
  return (
    <BlogArticlePage
      params={{ slug: "the-art-of-the-registry" }}
      searchParams={searchParams}
    />
  );
}
