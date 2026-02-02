import type { HTMLAttributes, ReactNode } from "react";

const headingClassMap = {
  h1: "marketing-heading-h1",
  h2: "marketing-heading-h2",
  h3: "marketing-heading-h3",
} as const;

type HeadingLevel = keyof typeof headingClassMap;

type MarketingHeadingProps = {
  level: HeadingLevel;
  className?: string;
  children: ReactNode;
} & Omit<HTMLAttributes<HTMLHeadingElement>, "className">;

export function MarketingHeading({ level, className = "", children, ...rest }: MarketingHeadingProps) {
  const Tag = level;
  return (
    <Tag className={`${headingClassMap[level]} ${className}`.trim()} {...rest}>
      {children}
    </Tag>
  );
}

type MarketingTextProps = {
  as?: keyof JSX.IntrinsicElements;
  className?: string;
  children: ReactNode;
} & HTMLAttributes<HTMLElement>;

export function MarketingBody({ as = "p", className = "", children, ...rest }: MarketingTextProps) {
  const Tag = as;
  return (
    <Tag className={`marketing-body-copy ${className}`.trim()} {...(rest as any)}>
      {children}
    </Tag>
  );
}

export function MarketingSupport({ as = "p", className = "", children, ...rest }: MarketingTextProps) {
  const Tag = as;
  return (
    <Tag className={`marketing-support-copy ${className}`.trim()} {...(rest as any)}>
      {children}
    </Tag>
  );
}
