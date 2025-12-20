export function SectionSkeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div className="rounded-[28px] border border-[#E3C6D4] bg-white/60 p-6 shadow-sm">
      <div className="h-3 w-28 rounded-full bg-[#E3C6D4]/40 animate-pulse" />
      <div className="mt-4 space-y-3">
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className="h-3 w-full rounded-full bg-[#E3C6D4]/30 animate-pulse"
          />
        ))}
      </div>
    </div>
  );
}

export function HeroSkeleton() {
  return (
    <div className="rounded-[32px] border border-[#E3C6D4] bg-white/80 p-8 shadow-[0_25px_50px_rgba(199,166,199,0.2)]">
      <div className="space-y-3">
        <div className="h-4 w-32 rounded-full bg-[#E3C6D4]/30 animate-pulse" />
        <div className="h-12 w-60 rounded-full bg-[#E3C6D4]/30 animate-pulse" />
        <div className="h-4 w-48 rounded-full bg-[#E3C6D4]/30 animate-pulse" />
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="h-24 rounded-2xl bg-[#E3C6D4]/25 p-4 animate-pulse"
          />
        ))}
      </div>
    </div>
  );
}
