import type { ReactNode } from "react";

export type BlogContentBlock =
  | {
      type: "paragraph";
      text: string;
    }
  | {
      type: "heading";
      text: string;
      level?: number;
    }
  | {
      type: "list";
      items: string[];
    };

export const createHeadingId = (text: string) =>
  text.toLowerCase().replace(/[^\w]+/g, "-");

const isParagraphBlock = (block: BlogContentBlock) => block.type === "paragraph";
const isHeadingBlock = (
  block: BlogContentBlock
): block is Extract<BlogContentBlock, { type: "heading" }> => block.type === "heading";
const isListBlock = (block: BlogContentBlock) => block.type === "list";

const renderHeading = (block: Extract<BlogContentBlock, { type: "heading" }>, key: string) => {
  const level = block.level ?? 2;
  const headingId = createHeadingId(block.text);

  if (level >= 3) {
    return (
      <h3 key={key} id={headingId} className="text-2xl text-tmCharcoal">
        {block.text}
      </h3>
    );
  }

  return (
    <h2 key={key} id={headingId} className="text-3xl text-tmCharcoal">
      {block.text}
    </h2>
  );
};

export default function BlogContentRenderer({ blocks }: { blocks: BlogContentBlock[] }) {
  const elements: ReactNode[] = [];

  blocks.forEach((block, index) => {
    const key = `${block.type}-${index}`;

    if (isHeadingBlock(block)) {
      elements.push(renderHeading(block, key));
      return;
    }

    if (isListBlock(block)) {
      elements.push(
        <ul key={key} className="ml-6 list-disc space-y-2 text-tmCharcoal/80">
          {block.items.map((item, itemIndex) => (
            <li key={`${key}-item-${itemIndex}`}>{item}</li>
          ))}
        </ul>,
      );
      return;
    }

    if (isParagraphBlock(block)) {
      elements.push(
        <p key={key} className="text-base leading-relaxed text-tmCharcoal/85">
          {block.text}
        </p>,
      );
    }
  });

  return <div className="space-y-6">{elements}</div>;
}
