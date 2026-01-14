import type { ReactNode } from "react";

type PlanLayoutProps = {
  children: ReactNode;
};

export default function PlanLayout({ children }: PlanLayoutProps) {
  // TODO: Handle responsive behavior for narrow screens (stacking, collapses, etc.)
  // TODO: Persist last-open section when we introduce state syncing
  return (
    <section
      className="grid gap-6 lg:grid-cols-[minmax(220px,260px)_1fr_minmax(260px,320px)]"
    >
      {children}
    </section>
  );
}
