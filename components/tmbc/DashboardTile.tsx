import Link from "next/link";
import type { ReactNode } from "react";

export type DashboardTileProps = {
  title: string;
  description?: string;
  href: string;
  icon?: ReactNode;
};

export default function DashboardTile({ title, description, href, icon }: DashboardTileProps) {
  return (
    <Link
      href={href}
      className="group rounded-[2rem] border border-transparent bg-gradient-to-br from-[#fff7f2] via-[#f8e8ef] to-[#f0d7dc] p-6 text-base font-semibold text-[#3E2F35] shadow-[0_15px_50px_rgba(199,166,199,0.25)] transition hover:border-[#c7a6c9] hover:shadow-[0_25px_60px_rgba(199,166,199,0.25)]"
    >
      <div className="flex items-center gap-3 text-xs uppercase tracking-[0.4em] text-[#3E2F35]/70">
        {icon}
        {href.split("/").pop()}
      </div>
      <h3 className="mt-4 text-xl text-[#3E2F35]">{title}</h3>
      {description && <p className="mt-2 text-sm text-[#3E2F35]/70">{description}</p>}
    </Link>
  );
}
