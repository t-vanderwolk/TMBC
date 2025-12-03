'use client';

import { useCallback } from 'react';

export function useEasterEgg() {
  const trigger = useCallback((key?: string) => {
    console.log('✨ Easter egg triggered:', key ?? 'unknown');
  }, []);

  return { trigger };
}
