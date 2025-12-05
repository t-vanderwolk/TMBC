"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";

type RevealVariant = "fade-up" | "slide-left" | "slide-right" | "slide-up" | "parallax";

type RevealProps = {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  threshold?: number;
  variant?: RevealVariant;
};

const variantStartingClasses: Record<RevealVariant, string> = {
  "fade-up": "opacity-0 translate-y-10",
  "slide-left": "opacity-0 -translate-x-10",
  "slide-right": "opacity-0 translate-x-10",
  "slide-up": "opacity-0 translate-y-6",
  parallax: "opacity-0",
};

const Reveal = ({
  children,
  className = "",
  style,
  threshold = 0.2,
  variant = "fade-up",
}: RevealProps) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [parallaxShift, setParallaxShift] = useState(0);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold }
    );

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, [threshold]);

  useEffect(() => {
    if (variant !== "parallax") return;
    const handleScroll = () => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      setParallaxShift(rect.top * 0.12);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [variant]);

  const startingClasses = variantStartingClasses[variant];

  const combinedStyle = useMemo(() => {
    const parallaxStyle =
      variant === "parallax"
        ? {
            transform: `translate3d(0, ${parallaxShift}px, 0)`,
          }
        : undefined;

    return {
      ...(style ?? {}),
      ...parallaxStyle,
    } satisfies CSSProperties;
  }, [style, variant, parallaxShift]);

  const visibleState =
    variant === "parallax"
      ? "opacity-100"
      : "opacity-100 translate-y-0 translate-x-0";

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out will-change-transform ${
        isVisible ? visibleState : startingClasses
      } ${className}`}
      style={combinedStyle}
    >
      {children}
    </div>
  );
};

export default Reveal;
