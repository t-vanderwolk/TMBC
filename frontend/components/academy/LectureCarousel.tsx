'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type LectureCarouselProps = {
  slides?: string[];
};

export default function LectureCarousel({ slides = [] }: LectureCarouselProps) {
  const [index, setIndex] = useState(0);

  if (!slides?.length) {
    return <p className="text-sm text-gray-500">Lecture coming soon.</p>;
  }

  const next = () => setIndex((i) => (i + 1) % slides.length);
  const prev = () => setIndex((i) => (i - 1 + slides.length) % slides.length);

  return (
    <div className="relative w-full">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.35 }}
          className="p-6 bg-white/70 shadow-lg rounded-2xl backdrop-blur"
        >
          <p className="text-lg leading-relaxed text-gray-800">{slides[index]}</p>
        </motion.div>
      </AnimatePresence>

      <div className="flex justify-between mt-4">
        <button
          type="button"
          onClick={prev}
          className="px-3 py-1 text-sm rounded bg-gray-200 hover:bg-gray-300"
        >
          Back
        </button>
        <span className="text-xs text-gray-500">
          {index + 1} / {slides.length}
        </span>
        <button
          type="button"
          onClick={next}
          className="px-3 py-1 text-sm rounded bg-gray-200 hover:bg-gray-300"
        >
          Next
        </button>
      </div>
    </div>
  );
}
