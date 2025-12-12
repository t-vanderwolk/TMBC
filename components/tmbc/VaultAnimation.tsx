export default function VaultAnimation() {
  return (
    <div className="relative h-28 overflow-hidden rounded-[2rem] border border-[#E3C6D4] bg-gradient-to-br from-[#fff7f2] via-[#f6e9e6] to-[#f3e4e8] p-4 shadow-[0_18px_60px_rgba(180,143,164,0.2)]">
      <div className="absolute inset-0 opacity-30 blur-[40px]" />
      <div className="relative flex h-full flex-col items-center justify-center text-xs uppercase tracking-[0.5em] text-[#C7A6C9]">
        <span>Motion gentle</span>
        <span>Time vault</span>
      </div>
    </div>
  );
}
