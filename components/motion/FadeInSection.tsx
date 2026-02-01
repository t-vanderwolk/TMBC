"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  delay?: number;
  delayMs?: number;
  className?: string;
  /** Disable animation (used for heroes or critical content). */
  disabled?: boolean;
};

export default function FadeInSection({
  children,
  delay,
  delayMs,
  className = "",
  disabled = false,
}: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(disabled);
  const transitionDelay = delayMs ?? delay ?? 0;

  useEffect(() => {
    if (disabled) {
      setIsVisible(true);
      return;
    }

    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setIsVisible(true);
      return;
    }

    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [disabled]);

  if (disabled) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div
      ref={ref}
      className={[
        "transition-all duration-700 will-change-transform will-change-opacity",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={{ transitionDelay: `${transitionDelay}ms` }}
    >
      {children}
    </div>
  );
}
