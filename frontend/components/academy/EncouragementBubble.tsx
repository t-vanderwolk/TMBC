"use client";

import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';

const messages = [
  'Progress looks lovely on you ✨',
  'Look at you showing up today.',
  'Take your time — big thoughts deserve soft landings.',
  'Ooh, this moodboard is giving “Pinterest, but calmer.”',
  'Every tiny step counts (and you’re doing great).',
];

type EncouragementContextValue = {
  trigger: () => void;
};

const EncouragementContext = createContext<EncouragementContextValue | null>(null);

export const useEncouragementBubble = () => {
  const context = useContext(EncouragementContext);
  if (!context) {
    throw new Error('useEncouragementBubble must be used within an EncouragementBubble provider');
  }
  return context;
};

type EncouragementBubbleProps = {
  children: ReactNode;
};

const EncouragementBubble = ({ children }: EncouragementBubbleProps) => {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');

  const trigger = useCallback(() => {
    const next = messages[Math.floor(Math.random() * messages.length)];
    setMessage(next);
    setVisible(true);
  }, []);

  useEffect(() => {
    if (!visible) return;
    const duration = 3600;
    const timer = setTimeout(() => setVisible(false), duration);
    return () => clearTimeout(timer);
  }, [visible]);

  return (
    <EncouragementContext.Provider value={{ trigger }}>
      {children}
      <div
        aria-live="polite"
        className={`encouragement-bubble fixed bottom-10 left-1/2 z-50 flex items-center justify-center px-6 py-3 transition-all duration-300 ease-out ${
          visible ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        <span className="rounded-[28px] border border-white/80 bg-gradient-to-r from-[var(--tm-gold)]/90 via-white/80 to-[var(--tm-gold)]/80 px-6 py-3 text-center text-sm font-semibold uppercase tracking-[0.25em] text-white shadow-lg">
          {message}
        </span>
      </div>
    </EncouragementContext.Provider>
  );
};

export default EncouragementBubble;
