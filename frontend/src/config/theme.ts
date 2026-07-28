export type Theme = 'light' | 'dark' | 'system';

export const THEME_STORAGE_KEY = 'warex-theme';

export function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}
