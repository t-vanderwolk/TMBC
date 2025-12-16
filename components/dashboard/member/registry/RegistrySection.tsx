import type { ReactNode } from "react";
import { useEffect, useState } from "react";

type RegistrySectionProps = {
  title: string;
  helper?: string;
  children: ReactNode;
  className?: string;
};

export default function RegistrySection({
  title,
  helper,
  children,
  className = "",
}: RegistrySectionProps) {
  const [open, setOpen] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mediaQuery = window.matchMedia("(min-width: 768px)");
    const apply = () => setOpen(mediaQuery.matches);
    apply();
    mediaQuery.addEventListener("change", apply);
    return () => mediaQuery.removeEventListener("change", apply);
  }, []);

  return (
    <section
      className={`space-y-3 rounded-[28px] border border-[#E3C6D4] bg-white/95 p-5 shadow-sm ${className}`}
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[0.8rem] font-semibold uppercase tracking-[0.35em] text-[#3E2F35]/70">{title}</p>
          {helper && <p className="text-xs text-[#3E2F35]/60">{helper}</p>}
        </div>
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="text-xs font-semibold uppercase tracking-[0.35em] text-[#B98AA5] md:hidden"
        >
          {open ? "Collapse" : "Expand"}
        </button>
      </div>
      <div className={`${open ? "block" : "hidden"} md:block`}>{children}</div>
    </section>
  );
}
