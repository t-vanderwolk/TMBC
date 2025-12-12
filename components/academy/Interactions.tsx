'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useMemo, useState } from 'react';

const greetingCopy: Record<string, string> = {
  dawn: 'Soft morning guidance ready to greet your nest.',
  mid: 'Warm whispers for a midday studio reset.',
  dusk: 'Gentle twilight concierge notes for the day you just curated.',
};

const computeGreetingKey = (hour: number) => {
  if (hour < 6) return 'dawn';
  if (hour < 12) return 'mid';
  if (hour < 19) return 'mid';
  return 'dusk';
};

const confettiPalette = ['#EED9E1', '#C9B3C9', '#D5C19E', '#FAF7F2'];

type ConfettiBurst = {
  id: number;
  offsets: number[];
};

export const useDailyGreeting = () => {
  const [greeting, setGreeting] = useState(() => {
    const now = new Date();
    return greetingCopy[computeGreetingKey(now.getHours())];
  });

  useEffect(() => {
    const tick = () => {
      const next = greetingCopy[computeGreetingKey(new Date().getHours())];
      setGreeting(next);
    };
    const timer = setInterval(tick, 60 * 1000);
    return () => clearInterval(timer);
  }, []);

  return greeting;
};

export const useEasterEggs = () => {
  const [clicks, setClicks] = useState(0);
  const [magical, setMagical] = useState(false);

  const triggerHighlight = useCallback(() => {
    setClicks((prev) => {
      const next = prev + 1;
      if (next >= 5) {
        setMagical(true);
        return 0;
      }
      return next;
    });
  }, []);

  const dismissMagic = useCallback(() => setMagical(false), []);

  return {
    highlightClicked: triggerHighlight,
    highlightClicks: clicks,
    fairyIsPresent: magical,
    dismissFairy: dismissMagic,
  };
};

export const useSoftConfetti = () => {
  const [bursts, setBursts] = useState<ConfettiBurst[]>([]);

  const triggerSoftConfetti = useCallback(() => {
    const id = Date.now();
    const payload: ConfettiBurst = {
      id,
      offsets: Array.from({ length: 6 }, () => Math.random()),
    };
    setBursts((prev) => [...prev, payload]);
    window.setTimeout(() => {
      setBursts((prev) => prev.filter((burst) => burst.id !== id));
    }, 1600);
  }, []);

  const SoftConfettiLayer = useMemo(
    () =>
      function SoftConfettiLayerComponent() {
        return (
          <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden">
            <AnimatePresence>
              {bursts.map((burst) => (
                <div key={burst.id} className="absolute inset-0">
                  {burst.offsets.map((offset, index) => (
                    <motion.span
                      key={`${burst.id}-${index}`}
                      className="absolute h-4 w-2 rounded-full opacity-90"
                      style={{
                        left: `${offset * 100}%`,
                        top: `${10 + index * 10}%`,
                        background: confettiPalette[index % confettiPalette.length],
                      }}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 30, rotate: Math.random() * 30 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 1.2, ease: 'easeOut' }}
                    />
                  ))}
                </div>
              ))}
            </AnimatePresence>
          </div>
        );
      },
    [bursts],
  );

  return { triggerSoftConfetti, SoftConfettiLayer };
};
