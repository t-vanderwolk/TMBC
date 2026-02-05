"use client";

import Link, { type LinkProps } from "next/link";
import type { ReactNode } from "react";

type ButtonVariant = "primary" | "secondary";

const VARIANTS: Record<ButtonVariant, string> = {
  primary:
    "bg-[var(--tmbc-blush-primary)] text-white hover:bg-[var(--tmbc-blush-primary-hover)]",
  secondary: "bg-transparent text-neutral-900 hover:text-neutral-700",
};

type ButtonProps = LinkProps & {
  variant?: ButtonVariant;
  children: ReactNode;
  className?: string;
};

export default function Button({
  href,
  variant = "primary",
  className = "",
  children,
  ...linkProps
}: ButtonProps) {
  const classes = [
    "inline-flex items-center justify-center rounded-full min-h-[48px] px-6 py-3.5 text-[14px] font-semibold tracking-[0.3em] transition",
    VARIANTS[variant],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Link href={href} className={classes} {...linkProps}>
      {children}
    </Link>
  );
}
