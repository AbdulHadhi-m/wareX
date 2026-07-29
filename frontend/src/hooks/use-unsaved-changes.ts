import { useEffect } from 'react';
import { useBlocker } from 'react-router';

export function useUnsavedChanges(shouldBlock: boolean) {
  useEffect(() => {
    if (!shouldBlock) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [shouldBlock]);

  const blocker = useBlocker(shouldBlock);

  return {
    isBlocked: blocker.state === 'blocked',
    proceed: blocker.proceed,
    reset: blocker.reset,
  };
}
