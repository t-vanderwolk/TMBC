type ProgressFlowerProps = {
  completed: number;
  total: number;
};

export default function ProgressFlower({ completed, total }: ProgressFlowerProps) {
  const petals = Array.from({ length: total });

  return (
    <div className="flex flex-col items-center">
      <div className="relative h-16 w-16">
        {petals.map((_, i) => {
          const rotate = (360 / total) * i;
          const filled = i < completed;
          return (
            <div
              key={i}
              className="absolute left-1/2 top-1/2 h-3 w-8 origin-left rounded-full"
              style={{
                transform: `rotate(${rotate}deg) translateX(-50%)`,
                background: filled ? "#C8A1B4" : "rgba(200,161,180,0.25)",
              }}
            />
          );
        })}
      </div>
      <p className="mt-2 text-xs text-[#3E2F35]/70">
        {completed} / {total} completed
      </p>
    </div>
  );
}
