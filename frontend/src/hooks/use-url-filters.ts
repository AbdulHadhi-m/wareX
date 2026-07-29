import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

export function useUrlFilters<T extends Record<string, string | undefined>>(
  defaults: T,
  prefix?: string,
) {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = useMemo(() => {
    const result = { ...defaults } as Record<string, string | undefined>;
    for (const key of Object.keys(defaults)) {
      const paramKey = prefix ? `${prefix}_${key}` : key;
      const value = searchParams.get(paramKey);
      if (value !== null) {
        result[key] = value;
      }
    }
    return result as T;
  }, [searchParams, defaults, prefix]);

  const setFilter = useCallback(
    (key: keyof T, value: string | undefined) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        const paramKey = prefix ? `${prefix}_${String(key)}` : String(key);
        if (value === undefined || value === '') {
          next.delete(paramKey);
        } else {
          next.set(paramKey, value);
        }
        next.delete('page');
        return next;
      }, { replace: true });
    },
    [setSearchParams, prefix],
  );

  const setFilters = useCallback(
    (values: Partial<T>) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        for (const [key, value] of Object.entries(values)) {
          const paramKey = prefix ? `${prefix}_${key}` : key;
          if (value === undefined || value === '') {
            next.delete(paramKey);
          } else {
            next.set(paramKey, value);
          }
        }
        next.delete('page');
        return next;
      }, { replace: true });
    },
    [setSearchParams, prefix],
  );

  const resetFilters = useCallback(() => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      for (const key of Object.keys(defaults)) {
        const paramKey = prefix ? `${prefix}_${key}` : key;
        next.delete(paramKey);
      }
      next.delete('page');
      return next;
    }, { replace: true });
  }, [setSearchParams, defaults, prefix]);

  return { filters, setFilter, setFilters, resetFilters };
}
