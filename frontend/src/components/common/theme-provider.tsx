import { useEffect, type ReactNode } from 'react';
import { useThemeStore } from '@/store/theme-store';

export function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = useThemeStore((s) => s.theme);
  const resolvedTheme = useThemeStore((s) => s.resolvedTheme);
  const setTheme = useThemeStore((s) => s.setTheme);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    if (theme === 'system') {
      document.documentElement.classList.toggle('dark', mediaQuery.matches);
      useThemeStore.setState({ resolvedTheme: mediaQuery.matches ? 'dark' : 'light' });
    }

    const handler = () => {
      if (theme === 'system') {
        const isDark = mediaQuery.matches;
        document.documentElement.classList.toggle('dark', isDark);
        useThemeStore.setState({ resolvedTheme: isDark ? 'dark' : 'light' });
      }
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [theme]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', resolvedTheme === 'dark');
  }, [resolvedTheme]);

  useEffect(() => {
    setTheme(theme);
  }, []);

  return <>{children}</>;
}
