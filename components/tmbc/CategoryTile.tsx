"use client";

import Link from "next/link";
import type { ReactNode } from "react";

export type CategoryTileProps = {
  title: string;
  description: string;
  href: string;
  accent?: ReactNode;
};

export default function CategoryTile({ title, description, href, accent }: CategoryTileProps) {
  return (
    <Link
      href={href}
      className="group flex flex-col gap-2 rounded-[2rem] border border-[#E3C6D4] bg-gradient-to-br from-[#fff7f2] to-[#f6e9e6] p-5 text-sm text-[#3E2F35] transition hover:border-[#b98aa5]"
    >
      <div className="flex items-center justify-between text-xs uppercase tracking-[0.4em] text-[#C7A6C9]">
        <span>{title}</span>
        {accent}
      </div>
      <p className="text-base font-semibold text-[#3E2F35]">{description}</p>
    </Link>
  );
}
