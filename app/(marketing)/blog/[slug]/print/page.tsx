import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { blogPosts } from '@/data/blogPosts';
import PrintableBlogLayout from '@/components/blog/recommendations/PrintableBlogLayout';

type Params = {
  slug: string;
};

export const generateStaticParams = () =>
  blogPosts.map((post) => ({
    slug: post.slug,
  }));

const BlogPrintPage = ({ params }: { params: Params }) => {
  const post = blogPosts.find((item) => item.slug === params.slug);
  if (!post) notFound();

  return <PrintableBlogLayout post={post} />;
};

export default BlogPrintPage;

export const generateMetadata = ({ params }: { params: Params }): Metadata => {
  const post = blogPosts.find((item) => item.slug === params.slug);
  if (!post) return {};

  return {
    title: `taylor-made-baby-co-${post.slug}`,
  };
};
