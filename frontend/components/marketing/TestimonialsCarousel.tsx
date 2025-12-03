'use client';

import { useEffect, useMemo, useState } from 'react';

const testimonials = [
  {
    quote:
      'Taylor-Made Baby Co. feels like a mentor, a stylist, and a best friend rolled into one. Our registry looked intentional, not messy.',
    author: '— Priya, Expecting Mama',
  },
  {
    quote:
      'The mentors know that every question carries emotion, and they answer with warmth, wit, and the calm confidence I needed.',
    author: '— Margo, Second Trimester',
  },
  {
    quote:
      'From registry drops to postpartum pep talks, the TMBC village holds space while still keeping it luxe and joyful.',
    author: '— Lakesha, Growing Family Insider',
  },
  {
    quote:
      'It feels like having a concierge architect for our entire parenting prep. The community notes are honest, wise, and kind.',
    author: '— Alina, Designer + Mama',
  },
  {
    quote:
      '“Warm, witty, wise.” That’s the tone they use, and the confidence it gave me? Priceless.',
    author: '— Casey, Birth Advocate',
  },
];

const TestimonialsCarousel = () => {
  const [index, setIndex] = useState(0);
  const current = testimonials[index];

  useEffect(() => {
    const rotate = setInterval(() => {
      setIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(rotate);
  }, []);

  const dots = useMemo(
    () => testimonials.map((_, idx) => idx === index),
    [index],
  );

  return (
    <section className="space-y-4 rounded-[32px] border border-[var(--tmbc-ivory)] bg-white/90 p-8 shadow-soft">
      <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)]/60">Testimonials</p>
      <div aria-live="polite" className="min-h-[120px]">
        <p className="text-lg text-[var(--tmbc-charcoal)]/80">{current.quote}</p>
        <p className="mt-4 text-sm font-semibold text-[var(--tmbc-mauve)]">{current.author}</p>
      </div>
      <div className="flex gap-2">
        {dots.map((active, idx) => (
          <span
            key={`dot-${idx}`}
            className={`h-1 w-6 rounded-full ${active ? 'bg-[var(--tmbc-mauve)]' : 'bg-[var(--tmbc-charcoal)]/30'}`}
            aria-hidden
          />
        ))}
      </div>
    </section>
  );
};

export default TestimonialsCarousel;
