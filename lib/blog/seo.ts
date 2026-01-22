import type { Metadata } from "next";
import type { PostMeta } from "./posts";

const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL ?? "https://taylor-made-baby-co.com";

const defaults = {
  siteName: "Taylor-Made Baby Co.",
  description:
    "Stories, education, and thoughtful gear advice from the Taylor-Made Baby Co. family.",
};

export function getBlogIndexMetadata(): Metadata {
  return {
    title: "TMBC Blog & Gear Notes",
    description: defaults.description,
    openGraph: {
      title: "TMBC Blog & Gear Notes",
      description: defaults.description,
      url: `${baseUrl}/blog`,
      siteName: defaults.siteName,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "TMBC Blog & Gear Notes",
      description: defaults.description,
    },
    alternates: {
      canonical: `${baseUrl}/blog`,
    },
  };
}

export function getBlogPostMetadata(post: PostMeta): Metadata {
  const title = post.seoTitle ?? post.title;
  const description = post.seoDescription ?? post.excerpt;
  const url = `${baseUrl}/blog/${post.slug}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: defaults.siteName,
      type: "article",
      publishedTime: post.publishedAt,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: {
      canonical: url,
    },
  };
}
