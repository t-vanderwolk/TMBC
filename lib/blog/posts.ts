import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import matter from "gray-matter";
import { serialize } from "next-mdx-remote/serialize";
import type { MDXRemoteSerializeResult } from "next-mdx-remote";

const contentDirectory = join(process.cwd(), "content", "blog");

export type PostFrontMatter = {
  title: string;
  slug: string;
  excerpt: string;
  tags: string[];
  publishedAt: string;
  readTime: number;
  seoTitle?: string;
  seoDescription?: string;
};

export type PostMeta = PostFrontMatter;

export type PostWithContent = PostFrontMatter & {
  content: string;
  mdxSource: MDXRemoteSerializeResult;
};

async function safeReadDir(directory: string) {
  try {
    return await readdir(directory);
  } catch (error) {
    return [];
  }
}

async function readPostFile(pathToFile: string) {
  return readFile(pathToFile, "utf-8");
}

function normalizeTags(tags: unknown): string[] {
  if (!Array.isArray(tags)) {
    return [];
  }

  return tags.filter((tag): tag is string => typeof tag === "string");
}

function buildPostFromMatter(slug: string, content: string): PostMeta {
  const { data } = matter(content);
  const frontMatter = data as Partial<PostFrontMatter>;

  return {
    title: frontMatter.title ?? slug,
    slug: frontMatter.slug ?? slug,
    excerpt: frontMatter.excerpt ?? "",
    tags: normalizeTags(frontMatter.tags),
    publishedAt: frontMatter.publishedAt ?? new Date().toISOString(),
    readTime: typeof frontMatter.readTime === "number" ? frontMatter.readTime : 0,
    seoTitle: frontMatter.seoTitle,
    seoDescription: frontMatter.seoDescription,
  };
}

export async function getPostFiles() {
  return safeReadDir(contentDirectory);
}

export async function getAllPosts(): Promise<PostMeta[]> {
  const files = await getPostFiles();

  const posts: PostMeta[] = await Promise.all(
    files
      .filter((file) => file.endsWith(".mdx"))
      .map(async (file) => {
        const slug = file.replace(/\.mdx$/, "");
        const content = await readPostFile(join(contentDirectory, file));
        return buildPostFromMatter(slug, content);
      }),
  );

  return posts.sort((a, b) => {
    return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
  });
}

export async function getPostBySlug(slug: string): Promise<PostWithContent | null> {
  try {
    const files = await getPostFiles();
    const targetFile =
      files.find((file) => file.replace(/\.mdx$/, "") === slug) ?? null;

    if (!targetFile) {
      return null;
    }

    const fullPath = join(contentDirectory, targetFile);
    const rawContent = await readPostFile(fullPath);
    const { data, content } = matter(rawContent);
    const frontMatter = data as Partial<PostFrontMatter>;
    const meta: PostMeta = {
      title: frontMatter.title ?? slug,
      slug: frontMatter.slug ?? slug,
      excerpt: frontMatter.excerpt ?? "",
      tags: normalizeTags(frontMatter.tags),
      publishedAt: frontMatter.publishedAt ?? new Date().toISOString(),
      readTime:
        typeof frontMatter.readTime === "number" ? frontMatter.readTime : 0,
      seoTitle: frontMatter.seoTitle,
      seoDescription: frontMatter.seoDescription,
    };

    const mdxSource = await serialize(content, {
      mdxOptions: {
        remarkPlugins: [],
        rehypePlugins: [],
      },
    });

    return {
      ...meta,
      content,
      mdxSource,
    };
  } catch (error) {
    return null;
  }
}
