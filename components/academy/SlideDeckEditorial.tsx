'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

import SlideDeck from './SlideDeck';

type SlideDeckEditorialProps = {
  slides?: string[];
  slideIndex?: number;
  onSlideChange?: (index: number) => void;
};

const splitLectureIntoSlides = (raw: string = '') => {
  return raw
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
};

export default function SlideDeckEditorial({
  slides = [],
  slideIndex,
  onSlideChange,
}: SlideDeckEditorialProps) {
  const [currentIndex, setCurrentIndex] = useState(slideIndex ?? 0);
  const slidesLength = slides.length;
  const fairyActive = useMemo(() => Math.random() < 0.05, []);

  useEffect(() => {
    if (typeof slideIndex === 'number' && slideIndex !== currentIndex) {
      setCurrentIndex(Math.max(0, Math.min(slidesLength - 1, slideIndex)));
    }
  }, [slideIndex, currentIndex, slidesLength]);

  const changeIndex = useCallback(
    (nextIndex: number) => {
      const clamped = Math.max(0, Math.min(slidesLength - 1, nextIndex));
      setCurrentIndex(clamped);
      onSlideChange?.(clamped);
    },
    [onSlideChange, slidesLength],
  );

  const nextSlide = useCallback(() => {
    if (slidesLength === 0) return;
    changeIndex(currentIndex + 1);
  }, [changeIndex, currentIndex, slidesLength]);

  const prevSlide = useCallback(() => {
    if (slidesLength === 0) return;
    changeIndex(currentIndex - 1);
  }, [changeIndex, currentIndex, slidesLength]);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        nextSlide();
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        prevSlide();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [nextSlide, prevSlide]);

  const previewSlides = slidesLength ? slides : splitLectureIntoSlides('');

  return (
    <article className="tm-editorial-card space-y-6 rounded-[32px] border border-[var(--tm-blush)] bg-white/90 p-6 shadow-[0_35px_60px_rgba(143,77,104,0.15)]">
      <div className="flex items-center justify-between">
        <p className="text-[0.65rem] uppercase tracking-[0.45em] text-[var(--tm-mauve)]">Lecture slides</p>
        {fairyActive && (
          <span className="text-[0.7rem] font-semibold text-[var(--tm-gold)]">✨ “Good ideas grow here.”</span>
        )}
      </div>
      <SlideDeck
        slides={previewSlides}
        slideIndex={currentIndex}
        onSlideChange={(index) => {
          setCurrentIndex(index);
          onSlideChange?.(index);
        }}
      />
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={prevSlide}
          disabled={currentIndex <= 0}
          className="tm-btn-muted"
        >
          Back
        </button>
        <button
          type="button"
          onClick={nextSlide}
          disabled={currentIndex >= slidesLength - 1}
          className="tm-btn-primary"
        >
          Next slide
        </button>
        <span className="text-[0.65rem] uppercase tracking-[0.35em] text-[#7A5E73]">
          {slidesLength ? `Slide ${currentIndex + 1} / ${slidesLength}` : 'No slides yet'}
        </span>
      </div>
    </article>
  );
}
