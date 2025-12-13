import type { ReactNode } from 'react';

import type { AffiliateProduct } from '@/data/blogPosts';
import AffiliateCallout from '@/components/blog/affiliate/AffiliateCallout';
import AffiliateInlineLink from '@/components/blog/affiliate/AffiliateInlineLink';

export const createHeadingId = (text: string) => text.toLowerCase().replace(/[^\w]+/g, '-');

const MarkdownRenderer = ({
  content,
  affiliates,
}: {
  content: string;
  affiliates?: AffiliateProduct[];
}) => {
  const inlineAffiliates = affiliates?.filter((item) => item.placement === 'inline') ?? [];
  const calloutAffiliates = affiliates?.filter((item) => item.placement === 'callout') ?? [];
  const boldPattern = /\*\*(.*?)\*\*/g;
  const lines = content.split('\n');
  const elements: ReactNode[] = [];
  let listBuffer: string[] = [];

  const renderBoldSegments = (text: string): ReactNode[] => {
    const segments = text.split(boldPattern);
    const nodes: ReactNode[] = [];

    segments.forEach((segment, index) => {
      if (index % 2 === 1) {
        nodes.push(
          <strong key={`strong-${segment}-${index}`} className="font-semibold text-tmCharcoal">
            {segment}
          </strong>,
        );
      } else if (segment) {
        nodes.push(<span key={`text-${segment}-${index}`}>{segment}</span>);
      }
    });

    return nodes;
  };

  const renderInlineText = (text: string): ReactNode[] => {
    const inlinePattern = /\[\[affiliate-inline:(\d+)\]\]/g;
    const nodes: ReactNode[] = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = inlinePattern.exec(text)) !== null) {
      const beforeText = text.slice(lastIndex, match.index);
      if (beforeText) {
        nodes.push(...renderBoldSegments(beforeText));
      }
      const productIndex = Number(match[1]);
      const product = inlineAffiliates[productIndex];
      if (product) {
        nodes.push(
          <AffiliateInlineLink
            key={`affiliate-inline-${productIndex}-${match.index}`}
            product={product}
          />,
        );
      } else {
        nodes.push(
          <span key={`affiliate-inline-fallback-${productIndex}-${match.index}`}>{match[0]}</span>,
        );
      }
      lastIndex = match.index + match[0].length;
    }

    const remaining = text.slice(lastIndex);
    if (remaining) {
      nodes.push(...renderBoldSegments(remaining));
    }

    return nodes;
  };

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

    const calloutMatch = trimmed.match(/^\[\[affiliate-callout:(\d+)\]\]$/);
    if (calloutMatch) {
      const index = Number(calloutMatch[1]);
      const product = calloutAffiliates[index];
      if (product) {
        elements.push(<AffiliateCallout key={`callout-${index}-${idx}`} product={product} />);
      }
      return;
    }

    if (trimmed.startsWith('### ')) {
      elements.push(
        <h3 key={`h3-${idx}`} id={createHeadingId(trimmed.slice(4))} className="text-2xl text-tmCharcoal">
          {trimmed.slice(4)}
        </h3>,
      );
      return;
    }

    if (trimmed.startsWith('## ')) {
      elements.push(
        <h2 key={`h2-${idx}`} id={createHeadingId(trimmed.slice(3))} className="text-3xl text-tmCharcoal">
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

export default MarkdownRenderer;
