export default function SectionDivider({ className = "" }: { className?: string }) {
  return (
    <div
      className={`tmbc-divider-ribbon my-10 ${className}`.trim()}
      aria-hidden="true"
    />
  );
}
