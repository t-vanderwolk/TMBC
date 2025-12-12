'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useSwipeable } from 'react-swipeable';
import confetti from 'canvas-confetti';

import SlideContainer from './SlideContainer';
import SlideNavigation from './SlideNavigation';

type SlideDeckProps = {
  slides?: string[];
  onComplete?: () => void;
  moduleTitle?: string;
  slideIndex?: number;
  onSlideChange?: (index: number) => void;
};

const slideVariants = {
  enterRight: { x: 40, opacity: 0 },
  enterLeft: { x: -40, opacity: 0 },
  center: { x: 0, opacity: 1 },
  exitRight: { x: 40, opacity: 0 },
  exitLeft: { x: -40, opacity: 0 },
};

export default function SlideDeck({
  slides = [],
  onComplete,
  moduleTitle,
  slideIndex,
  onSlideChange,
}: SlideDeckProps) {
  const [current, setCurrent] = useState(slideIndex ?? 0);
  const [direction, setDirection] = useState<'left' | 'right'>('right');
  const [ribbonSparkle, setRibbonSparkle] = useState(false);
  const [tipVisible, setTipVisible] = useState(false);
  const sparkleTimeout = useRef<number | null>(null);
  const tipTimeout = useRef<number | null>(null);
  const celebratedRef = useRef(false);

  const total = slides.length;
  const hasSlides = total > 0;

  useEffect(() => {
    return () => {
      if (sparkleTimeout.current) {
        clearTimeout(sparkleTimeout.current);
      }
      if (tipTimeout.current) {
        clearTimeout(tipTimeout.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!hasSlides) return;
    if (current === total - 1) {
      if (!celebratedRef.current) {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.7 },
          colors: ['#E7D8EA', '#C6B6CE', '#F6EDF7'],
        });
        onComplete?.();
        celebratedRef.current = true;
      }
    } else {
      celebratedRef.current = false;
    }
  }, [current, hasSlides, onComplete, total]);

  const clampSlide = useCallback(
    (value: number) => {
      if (!hasSlides) return 0;
      return Math.max(0, Math.min(total - 1, value));
    },
    [hasSlides, total],
  );

  useEffect(() => {
    if (!hasSlides || typeof slideIndex !== 'number') return;
    if (slideIndex === current) return;
    setDirection(slideIndex > current ? 'right' : 'left');
    setCurrent(clampSlide(slideIndex));
  }, [slideIndex, current, hasSlides, clampSlide]);

  const goToSlide = useCallback(
    (index: number, dir: 'left' | 'right') => {
      if (!hasSlides) return;
      const nextIndex = clampSlide(index);
      setDirection(dir);
      setCurrent(nextIndex);
      onSlideChange?.(nextIndex);
    },
    [clampSlide, hasSlides, onSlideChange],
  );

  const handleNext = useCallback(() => {
    if (current >= total - 1) return;
    goToSlide(current + 1, 'right');
  }, [current, total, goToSlide]);

  const handleBack = useCallback(() => {
    if (current <= 0) return;
    goToSlide(current - 1, 'left');
  }, [current, goToSlide]);

  const swipeHandlers = useSwipeable({
    onSwipedLeft: handleNext,
    onSwipedRight: handleBack,
    preventScrollOnSwipe: true,
    trackMouse: true,
  });

  const ribbonTipCopy = '✨ Baby Fairy Tip: Trust your instincts — you\'re already doing beautifully.';

  const handleRibbonClick = () => {
    setRibbonSparkle(true);
    if (sparkleTimeout.current) {
      clearTimeout(sparkleTimeout.current);
    }
    sparkleTimeout.current = window.setTimeout(() => {
      setRibbonSparkle(false);
    }, 900);

    if (Math.random() < 0.05) {
      setTipVisible(true);
      if (tipTimeout.current) {
        clearTimeout(tipTimeout.current);
      }
      tipTimeout.current = window.setTimeout(() => {
        setTipVisible(false);
      }, 3400);
    }
  };

  const dots = useMemo(() => slides.map((_, idx) => idx), [slides.length]);

  const slideContent = hasSlides ? (
    <AnimatePresence mode="wait">
      <motion.div
        key={`slide-${current}`}
        variants={slideVariants}
        initial={direction === 'right' ? 'enterRight' : 'enterLeft'}
        animate="center"
        exit={direction === 'right' ? 'exitLeft' : 'exitRight'}
        transition={{ duration: 0.45, ease: 'easeInOut' }}
        className="relative w-full"
      >
        <SlideContainer moduleTitle={moduleTitle}>
          <p className="whitespace-pre-line">{slides[current]}</p>
        </SlideContainer>
      </motion.div>
    </AnimatePresence>
  ) : (
    <div className="text-sm text-[#3E2F35]/80">
      Lecture coming soon — come back when the studio is ready.
    </div>
  );

  return (
    <section className="relative overflow-hidden rounded-3xl bg-[#F6F1EB] p-6 text-[#3E2F35] shadow-[0_35px_80px_rgba(62,47,53,0.12)]">
      <div className="absolute top-3 right-3">
        <button
          type="button"
          onClick={handleRibbonClick}
          className="relative flex h-10 w-10 items-center justify-center rounded-full border border-[var(--tm-gold)] bg-white/80 text-lg shadow-lg transition hover:scale-110"
        >
          <span>✨</span>
          {ribbonSparkle && <span className="ribbon-sparkle absolute inset-0" />}
        </button>
        {tipVisible && (
          <div className="absolute right-0 top-14 w-52 rounded-2xl border border-[var(--tm-gold)] bg-white/90 p-3 text-[0.65rem] text-[#3E2F35] shadow-xl">
            {ribbonTipCopy}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div>
          <p className="text-[0.65rem] uppercase tracking-[0.45em] text-[#A57A91]">Lecture journey</p>
          <p className="text-[0.65rem] uppercase tracking-[0.4em] text-[#7A5E73]">
            {hasSlides ? `Slide ${current + 1}/${total}` : 'Awaiting studio release'}
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2">
          <motion.button
            type="button"
            onClick={handleBack}
            disabled={current === 0 || !hasSlides}
            whileTap={{ scale: 0.95 }}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--tm-deep-mauve)] bg-white/80 text-[#3E2F35] disabled:opacity-40"
          >
            <span aria-hidden>‹</span>
          </motion.button>
          <motion.button
            type="button"
            onClick={handleNext}
            disabled={current >= total - 1 || !hasSlides}
            whileTap={{ scale: 0.95 }}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--tm-deep-mauve)] bg-[var(--tm-mauve)]/15 text-[#3E2F35] disabled:opacity-40"
          >
            <span aria-hidden>›</span>
          </motion.button>
        </div>
      </div>

      <div
        {...swipeHandlers}
        className="mt-6 min-h-[220px]"
        style={{ touchAction: 'pan-y' }}
      >
        {slideContent}
      </div>

      <div className="mt-4 flex items-center justify-center gap-2 sm:hidden">
        {dots.map((idx) => (
          <span
            key={idx}
            className={`h-2 w-2 rounded-full transition ${idx === current ? 'bg-[var(--tm-gold)]' : 'bg-[#C6B6CE]/40'}`}
          />
        ))}
      </div>

      <div className="mt-6 sm:mt-8">
        <SlideNavigation
          current={current}
          total={Math.max(total, 1)}
          onBack={handleBack}
          onNext={handleNext}
          disableBack={!hasSlides || current === 0}
          disableNext={!hasSlides || current >= total - 1}
        />
      </div>

      <div className="absolute inset-x-6 bottom-4 flex items-center justify-between sm:hidden">
        <motion.button
          type="button"
          onClick={handleBack}
          disabled={current === 0 || !hasSlides}
          whileTap={{ scale: 0.95 }}
          className="flex h-12 w-12 items-center justify-center rounded-full border border-[var(--tm-deep-mauve)] bg-white/90 text-2xl disabled:opacity-40"
        >
          ‹
        </motion.button>
        <motion.button
          type="button"
          onClick={handleNext}
          disabled={current >= total - 1 || !hasSlides}
          whileTap={{ scale: 0.95 }}
          className="flex h-12 w-12 items-center justify-center rounded-full border border-[var(--tm-deep-mauve)] bg-white/90 text-2xl disabled:opacity-40"
        >
          ›
        </motion.button>
      </div>
    </section>
  );
}
