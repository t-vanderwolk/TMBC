"use client";

type ModuleMetaRowProps = {
  stage?: string;
  estimatedMinutes?: number | null;
};

export default function ModuleMetaRow({
  stage,
  estimatedMinutes,
}: ModuleMetaRowProps) {
  return (
    <div className="flex flex-col gap-2 text-[0.65rem] uppercase tracking-[0.35em] text-[#3E2F35]/65 sm:flex-row sm:items-center sm:justify-between">
      <span>{stage ?? "Stage"}</span>
      {estimatedMinutes ? (
        <span>{`${estimatedMinutes} min`}</span>
      ) : (
        <span className="text-[#3E2F35]/40">Flexible</span>
      )}
    </div>
  );
}
