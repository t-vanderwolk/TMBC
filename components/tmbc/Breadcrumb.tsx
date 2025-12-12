import Link from "next/link";

export type BreadcrumbProps = {
  items: Array<{ label: string; href?: string }>;
};

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="flex text-xs uppercase tracking-[0.4em] text-[#C7A6C9]">
      {items.map((item, index) => (
        <span key={item.label} className="flex items-center gap-2">
          {item.href ? (
            <Link href={item.href} className="hover:text-[#B98AA5]">
              {item.label}
            </Link>
          ) : (
            <span className="font-semibold text-[#3E2F35]">{item.label}</span>
          )}
          {index < items.length - 1 && <span>→</span>}
        </span>
      ))}
    </nav>
  );
}
