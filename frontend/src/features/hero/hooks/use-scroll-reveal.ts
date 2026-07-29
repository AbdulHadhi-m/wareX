import { useEffect, useRef } from 'react';

const observerOptions: IntersectionObserverInit = { threshold: 0.2 };

export function useScrollReveal<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.remove('opacity-0', 'translate-y-12');
          el.style.transform = '';
          entry.target.classList.add('opacity-100', 'translate-y-0');
        }
      });
    }, observerOptions);

    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  return ref;
}
