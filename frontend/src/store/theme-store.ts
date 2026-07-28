import { create } from 'zustand';
import { type Theme, THEME_STORAGE_KEY, getSystemTheme } from '@/config/theme';

interface ThemeState {
  theme: Theme;
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
}

function getStoredTheme(): Theme {
  if (typeof window === 'undefined') return 'system';
  return (localStorage.getItem(THEME_STORAGE_KEY) as Theme) || 'system';
}

function getInitialResolvedTheme(): 'light' | 'dark' {
  const stored = getStoredTheme();
  return stored === 'system' ? getSystemTheme() : stored;
}

export const useThemeStore = create<ThemeState>((set) => ({
  theme: getStoredTheme(),
  resolvedTheme: getInitialResolvedTheme(),
  setTheme: (theme: Theme) => {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
    const resolved = theme === 'system' ? getSystemTheme() : theme;
    document.documentElement.classList.toggle('dark', resolved === 'dark');
    set({ theme, resolvedTheme: resolved });
  },
}));
