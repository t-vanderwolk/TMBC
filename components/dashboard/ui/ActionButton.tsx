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
  primary: "bg-[#B98AA5] text-white border-transparent hover:bg-[#c89ebb]",
  ghost: "border border-[#E3D0DA] bg-white/90 text-[#B98AA5] hover:border-[#C8A1B4]",
};

const baseClasses =
  "inline-flex justify-center gap-2 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B98AA5]";

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
