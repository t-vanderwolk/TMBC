"use client";

import { useCallback } from "react";

type TagFilterProps = {
  availableTags: string[];
  activeTags: string[];
  onChange: (selected: string[]) => void;
};

export function TagFilter({
  availableTags,
  activeTags,
  onChange,
}: TagFilterProps) {
  const toggleTag = useCallback(
    (tag: string) => {
      onChange(
        activeTags.includes(tag)
          ? activeTags.filter((item) => item !== tag)
          : [...activeTags, tag],
      );
    },
    [activeTags, onChange],
  );

  const clearTags = useCallback(() => onChange([]), [onChange]);

  if (availableTags.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-2 text-sm">
      {availableTags.map((tag) => {
        const isActive = activeTags.includes(tag);
        return (
          <button
            key={tag}
            type="button"
            onClick={() => toggleTag(tag)}
            className={`rounded-full border px-4 py-1 transition ${
              isActive
                ? "border-foreground bg-foreground text-background"
                : "border-foreground/40 text-foreground/80 hover:border-foreground/80"
            }`}
          >
            {tag}
          </button>
        );
      })}
      {activeTags.length > 0 && (
        <button
          type="button"
          onClick={clearTags}
          className="rounded-full border border-foreground/40 px-4 py-1 text-foreground/70 hover:border-foreground hover:text-foreground"
        >
          Clear
        </button>
      )}
    </div>
  );
}
