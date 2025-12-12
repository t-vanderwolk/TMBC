import type { ReactNode } from "react";

type PageSectionProps = {
  children: ReactNode;
  className?: string;
};

export default function PageSection({ children, className = "" }: PageSectionProps) {
  const sectionClasses = [
    "mx-auto flex w-full max-w-screen-xl flex-col gap-6 px-6 py-12 sm:py-16 md:px-10",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return <section className={sectionClasses}>{children}</section>;
}
