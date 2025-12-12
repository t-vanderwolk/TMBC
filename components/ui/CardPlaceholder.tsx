import type { CSSProperties } from 'react';

type CardPlaceholderProps = {
  className?: string;
  style?: CSSProperties;
};

export default function CardPlaceholder({ className = "", style }: CardPlaceholderProps) {
  return (
    <div
      className={`rounded-2xl bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400 text-sm ${className}`}
      style={{ minHeight: 160, ...style }}
    >
      <div className="flex flex-col items-center">
        <div className="w-10 h-10 rounded-lg bg-gray-300" />
        <p className="mt-2 text-xs text-gray-500">Image placeholder</p>
      </div>
    </div>
  );
}
