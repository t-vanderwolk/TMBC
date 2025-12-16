"use client";

import Link from "next/link";
import type { ButtonHTMLAttributes } from "react";

type CTAButtonProps = {
  label: string;
  href?: string;
  variant?: "primary" | "ghost";
  fullWidth?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const VARIANT_CLASSES: Record<string, string> = {
  primary: "bg-[#3E2F35] text-white border border-[#3E2F35]/0 hover:bg-[#2d2428]",
  ghost: "border border-[#E3C6D4] text-[#3E2F35] bg-white hover:border-[#B98AA5]",
};

export default function CTAButton({
  label,
  href,
  variant = "primary",
  fullWidth = true,
  className = "",
  ...props
}: CTAButtonProps) {
  const baseClasses = `flex h-12 items-center justify-center rounded-2xl px-4 text-xs font-semibold uppercase tracking-[0.35em] transition ${VARIANT_CLASSES[variant]} ${
    fullWidth ? "w-full" : ""
  } ${className}`;

  if (href) {
    return (
      <Link href={href} className={baseClasses}>
        {label}
      </Link>
    );
  }

  return (
    <button type="button" className={baseClasses} {...props}>
      {label}
    </button>
  );
}
