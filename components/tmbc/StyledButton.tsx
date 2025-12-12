"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";

export type StyledButtonProps = {
  variant?: "primary" | "secondary" | "ghost";
  fullWidth?: boolean;
  children: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const VARIANTS: Record<NonNullable<StyledButtonProps["variant"]>, string> = {
  primary:
    "bg-tmMauve text-white border-transparent hover:bg-[#B28FB3]",
  secondary:
    "bg-tmBlush text-[#3E2F35] border border-[#E3C6D4] hover:border-[#B98AA5]",
  ghost:
    "bg-transparent text-[#3E2F35] border border-transparent hover:text-[#B98AA5]",
};

export default function StyledButton({
  variant = "primary",
  fullWidth = false,
  className = "",
  children,
  ...props
}: StyledButtonProps) {
  return (
    <button
      className={`rounded-full px-5 py-3 text-xs font-semibold uppercase tracking-[0.4em] transition ${VARIANTS[variant]} ${
        fullWidth ? "w-full" : ""
      } ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  );
}
