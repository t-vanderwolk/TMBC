"use client";

import { useEffect, useMemo, useState } from "react";

import Reveal from "@/components/marketing/Reveal";

const testimonials = [
  {
    quote:
      "I stopped doom-scrolling reviews at 1 a.m. and started just asking my circle inside TMBC.",
    author: "- Priya, third trimester",
  },
  {
    quote: "It felt like having a big sister who's obsessed with baby gear.",
    author: "- Mika, partner planner",
  },
  {
    quote:
      "Taylor-Made Baby Co. still keeps it luxe, but the tone is warm, witty, and real, exactly what I needed.",
    author: "- Lakesha, passionate mama",
  },
  {
    quote:
      "Mentors answer with care, humor, and a reminder that every question is welcome, 500 times over.",
    author: "- Alina, designer + mama",
  },
];

const TestimonialsCarousel = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const rotate = setInterval(() => {
      setIndex((prev) => (prev + 1) % testimonials.length);
    }, 6500);
    return () => clearInterval(rotate);
  }, []);

  const dots = useMemo(
    () =>
      testimonials.map((_, idx) => (
      <span
        key={`dot-${idx}`}
        className={`h-1.5 w-8 rounded-full transition-all duration-300 ${
          idx === index ? "bg-[var(--tmbc-charcoal)]" : "bg-[var(--tmbc-charcoal)]/30"
        }`}
        aria-hidden
      />
      )),
    [index]
  );

  const current = testimonials[index] ?? testimonials[0];
  if (!current) {
    return null;
  }

  return (
    <Reveal variant="parallax">
      <section className="marketing-section marketing-card transition duration-300">
        <div className="space-y-4 text-[var(--tmbc-charcoal)]">
          <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-60">Testimonials</p>
          <p
            key={current.quote}
            className="text-lg leading-relaxed tracking-tight transition-all duration-700 ease-out"
            aria-live="polite"
          >
            {current.quote}
          </p>
          <p className="text-sm font-semibold text-[var(--tmbc-mauve)]">{current.author}</p>
          <div className="flex gap-3">{dots}</div>
        </div>
      </section>
    </Reveal>
  );
};

export default TestimonialsCarousel;
