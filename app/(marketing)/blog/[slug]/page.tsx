import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';

import { blogPosts, type BlogPost } from '@/data/blogPosts';
import CardPlaceholder from '@/components/ui/CardPlaceholder';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.taylormadebaby.co';

type Params = {
  slug: string;
};

const getPost = (slug: string) => blogPosts.find((post) => post.slug === slug);

export const generateStaticParams = () =>
  blogPosts.map((post) => ({
    slug: post.slug,
  }));

export const generateMetadata = ({ params }: { params: Params }): Metadata => {
  const post = getPost(params.slug);
  if (!post) return {};

  const url = `${siteUrl}/blog/${post.slug}`;

  const openGraph: Metadata['openGraph'] = {
    title: post.title,
    description: post.description,
    url,
    siteName: 'Taylor-Made Baby Co.',
    type: 'article',
    publishedTime: post.date,
    authors: [post.author],
    ...(post.heroImage ? { images: [{ url: post.heroImage }] } : {}),
  };

  const twitter: Metadata['twitter'] = {
    card: 'summary_large_image',
    title: post.title,
    description: post.description,
    ...(post.heroImage ? { images: [post.heroImage] } : {}),
  };

  return {
    title: `${post.title} | Taylor-Made Baby Co.`,
    description: post.description,
    alternates: {
      canonical: url,
    },
    openGraph,
    twitter,
  };
};

const renderInlineText = (text: string): ReactNode[] => {
  const boldPattern = /\*\*(.*?)\*\*/g;
  const segments = text.split(boldPattern);
  const parts: ReactNode[] = [];

  segments.forEach((segment, index) => {
    if (index % 2 === 1) {
      parts.push(
        <strong key={`strong-${segment}-${index}`} className="font-semibold text-tmCharcoal">
          {segment}
        </strong>,
      );
    } else if (segment) {
      parts.push(<span key={`text-${segment}-${index}`}>{segment}</span>);
    }
  });

  return parts;
};

const createHeadingId = (text: string) => text.toLowerCase().replace(/[^\w]+/g, '-');

const MarkdownRenderer = ({ content }: { content: string }) => {
  const lines = content.split('\n');
  const elements: ReactNode[] = [];
  let listBuffer: string[] = [];

  const flushList = () => {
    if (listBuffer.length) {
      elements.push(
        <ul key={`list-${elements.length}`} className="ml-6 list-disc space-y-2 text-tmCharcoal/80">
          {listBuffer.map((item, idx) => (
            <li key={`li-${idx}`}>{renderInlineText(item)}</li>
          ))}
        </ul>,
      );
      listBuffer = [];
    }
  };

  lines.forEach((line, idx) => {
    const trimmed = line.trim();
    if (!trimmed) {
      flushList();
      return;
    }

    if (trimmed.startsWith('- ')) {
      listBuffer.push(trimmed.slice(2));
      return;
    }

    flushList();

    if (trimmed.startsWith('### ')) {
      elements.push(
        <h3
          key={`h3-${idx}`}
          id={createHeadingId(trimmed.slice(4))}
          className="text-2xl text-tmCharcoal"
        >
          {trimmed.slice(4)}
        </h3>,
      );
      return;
    }

    if (trimmed.startsWith('## ')) {
      elements.push(
        <h2
          key={`h2-${idx}`}
          id={createHeadingId(trimmed.slice(3))}
          className="text-3xl text-tmCharcoal"
        >
          {trimmed.slice(3)}
        </h2>,
      );
      return;
    }

    if (trimmed.startsWith('# ')) {
      elements.push(
        <h1 key={`h1-${idx}`} className="text-4xl text-tmCharcoal">
          {trimmed.slice(2)}
        </h1>,
      );
      return;
    }

    if (trimmed.startsWith('>')) {
      elements.push(
        <blockquote
          key={`quote-${idx}`}
          className="rounded-2xl border-l-4 border-tmMauve/60 bg-tmIvory/80 px-6 py-4 text-lg italic text-tmCharcoal"
        >
          {trimmed.replace(/^>\s?/, '')}
        </blockquote>,
      );
      return;
    }

    elements.push(
      <p key={`p-${idx}`} className="text-base leading-relaxed text-tmCharcoal/85">
        {renderInlineText(trimmed)}
      </p>,
    );
  });

  flushList();
  return <div className="space-y-6">{elements}</div>;
};

const getTableOfContents = (content: string) =>
  content
    .split('\n')
    .filter((line) => line.startsWith('## '))
    .map((line) => {
      const heading = line.replace('## ', '').trim();
      const id = createHeadingId(heading);
      return { heading, id };
    });

const BlogArticlePage = ({ params }: { params: Params }) => {
  const post = getPost(params.slug);
  if (!post) notFound();

  const toc = getTableOfContents(post.content);
  const shareUrl = encodeURIComponent(`${siteUrl}/blog/${post.slug}`);
  const shareText = encodeURIComponent(post.title);

  return (
    <article className="pb-16">
      <div className="relative h-[360px] w-full">
        <CardPlaceholder className="absolute inset-0 h-full w-full" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-transparent" />
        <div className="section-wrap absolute inset-x-0 bottom-6 text-white">
          <p className="text-sm uppercase tracking-[0.6em]">Taylor-Made Journal</p>
          <h1 className="mt-2 text-4xl">{post.title}</h1>
          <p className="mt-2 text-base text-white/80">{post.description}</p>
          <div className="mt-3 flex flex-wrap items-center gap-4 text-xs uppercase tracking-[0.3em] text-white/70">
            <span>{new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
            <span>•</span>
            <span>{post.readTime}</span>
          </div>
        </div>
      </div>

      <div className="section-wrap mt-10 grid gap-10 lg:grid-cols-[240px_1fr]">
        <aside className="space-y-6 rounded-3xl border border-white/70 bg-white/90 p-6 shadow-soft">
          <div>
            <p className="text-xs uppercase tracking-[0.5em] text-tmMauve">Table of Contents</p>
            <ul className="mt-4 space-y-3 text-sm text-tmCharcoal/80">
              {toc.map((item) => (
                <li key={item.id}>
                  <a href={`#${item.id}`} className="transition hover:text-tmMauve">
                    {item.heading}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-4 border-t border-tmBlush/40 pt-4">
            <p className="text-xs uppercase tracking-[0.5em] text-tmMauve">Share</p>
            <div className="flex flex-wrap gap-3">
              <a
                href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareText}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-tmMauve px-3 py-1 text-xs font-semibold text-tmMauve"
              >
                Twitter
              </a>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-tmMauve px-3 py-1 text-xs font-semibold text-tmMauve"
              >
                Facebook
              </a>
              <a
                href={`mailto:?subject=${shareText}&body=${shareUrl}`}
                className="rounded-full border border-tmMauve px-3 py-1 text-xs font-semibold text-tmMauve"
              >
                Email
              </a>
            </div>
          </div>
        </aside>
        <div className="space-y-8 rounded-[32px] border border-white/70 bg-white/90 p-8 shadow-soft">
          <MarkdownRenderer content={post.content} />
          <div className="rounded-3xl border-l-4 border-[#D4AF37] bg-tmIvory/80 px-6 py-5">
            <p className="font-serif text-2xl uppercase tracking-[0.3em] text-tmCharcoal">
              “Taylor-Made concierge care turns preparation into a love letter for your baby.”
            </p>
          </div>
          <div className="rounded-3xl border border-[#D4AF37]/30 bg-gradient-to-r from-tmMauve to-tmBlush px-8 py-10 text-white shadow-soft">
            <p className="text-xs uppercase tracking-[0.6em]">Need bespoke support?</p>
            <h2 className="mt-3 text-3xl">Want personalized help? Request an Invite.</h2>
            <p className="mt-2 text-sm text-white/85">
              Tap into concierge mentors, curated registry planning, and the Taylor-Made Academy tailored to your due date.
            </p>
            <Link
              href="/request-invite"
              className="mt-5 inline-flex items-center justify-center rounded-full bg-white/90 px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-tmMauve shadow-soft"
            >
              Request Invite
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
};

export default BlogArticlePage;
