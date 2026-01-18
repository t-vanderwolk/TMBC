"use client";

import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type ActionButtonProps = {
  children: ReactNode;
  href?: string;
  onClick?: ButtonHTMLAttributes<HTMLButtonElement>["onClick"];
  variant?: "primary" | "ghost";
  fullWidth?: boolean;
  className?: string;
};

const VARIANT_CLASSES: Record<NonNullable<ActionButtonProps["variant"]>, string> = {
  primary:
    "bg-member-accent-primary text-member-text-inverse border-transparent hover:bg-member-accent-secondary disabled:bg-member-state-disabled disabled:text-member-text-muted",
  ghost:
    "border border-member-border-default bg-member-background-card text-member-accent-primary hover:border-member-accent-primary hover:text-member-accent-primary disabled:border-member-state-disabled disabled:text-member-text-muted",
};

const baseClasses =
  "inline-flex justify-center gap-2 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-member-state-focus";

export default function ActionButton({
  children,
  href,
  onClick,
  variant = "primary",
  fullWidth = false,
  className = "",
}: ActionButtonProps) {
  const buttonClasses = `${baseClasses} ${VARIANT_CLASSES[variant]} ${fullWidth ? "w-full" : ""} ${className}`;

  if (href) {
    return (
      <Link href={href} className={buttonClasses}>
        {children}
      </Link>
    );
  }

  return (
    <button type="button" className={buttonClasses} onClick={onClick}>
      {children}
    </button>
  );
}
