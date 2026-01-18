import type { ReactNode } from "react";

type EmptyStateProps = {
  title: string;
  description?: string;
  action?: ReactNode;
};

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-[2rem] border border-[#EAD4D8] bg-white/90 px-6 py-10 text-center shadow-[0_25px_60px_rgba(84,35,52,0.12)]">
      <h3 className="text-lg font-serif text-[#3E2F35]">{title}</h3>
      {description && (
        <p className="mt-2 max-w-md text-sm text-[#3E2F35]/70">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
