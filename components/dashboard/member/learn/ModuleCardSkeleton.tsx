"use client";

function ModuleCardSkeleton() {
  return (
    <article className="animate-pulse rounded-[28px] border border-[#E7D8DA] bg-white/80 p-5 shadow-[0_20px_40px_rgba(145,116,125,0.15)]">
      <div className="mb-3 h-3 w-24 rounded-full bg-[#E6DEDE]" />
      <div className="mb-3 h-6 w-3/4 rounded-[12px] bg-[#E9E0E0]" />
      <div className="mb-3 h-4 w-full rounded-[10px] bg-[#EDE6E6]" />
      <div className="mb-4 h-3 w-1/2 rounded-full bg-[#EDE6E6]" />
      <div className="flex items-center justify-between">
        <div className="h-8 w-24 rounded-full bg-[#E6DEDE]" />
        <div className="h-4 w-4 rounded-full bg-[#E6DEDE]" />
      </div>
      <div className="mt-4 h-1.5 rounded-full bg-[#F3E9E4]"></div>
    </article>
  );
}

export default ModuleCardSkeleton;
