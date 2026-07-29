import { Moon, Sun, Menu } from 'lucide-react';
import { useTheme } from '@/hooks/use-theme';
import { Button } from '@/components/ui/button';
import { NotificationDropdown } from '@/features/notification';
import { GlobalSearch } from '@/components/common/global-search';
import { UserMenu } from '@/features/auth/components/user-menu';

interface HeaderProps {
  onMenuToggle: () => void;
}

export function Header({ onMenuToggle }: HeaderProps) {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-background px-4 sm:px-6">
      <Button variant="ghost" size="icon" className="lg:hidden" onClick={onMenuToggle}>
        <Menu className="size-5" />
      </Button>

      <GlobalSearch />

      <div className="flex-1" />

      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
        title={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`}
      >
        {resolvedTheme === 'dark' ? <Sun className="size-5" /> : <Moon className="size-5" />}
      </Button>

      <NotificationDropdown />

      <UserMenu />
    </header>
  );
}
