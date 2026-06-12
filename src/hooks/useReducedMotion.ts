import { useState, useEffect } from 'react';

export function useReducedMotion() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    const timeoutId = setTimeout(() => {
      setReducedMotion(mediaQuery.matches);
    }, 0);

    const handleChange = (event: MediaQueryListEvent) => {
      setReducedMotion(event.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => {
      clearTimeout(timeoutId);
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  return reducedMotion;
}
