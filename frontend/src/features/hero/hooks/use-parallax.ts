import { useEffect, useRef } from 'react';

export function useParallax<T extends HTMLElement>(speed = 0.1) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const onScroll = () => {
      el.style.transform = `translateY(${window.scrollY * speed}px)`;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [speed]);

  return ref;
}
