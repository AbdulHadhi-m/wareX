import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/common/confirm-dialog';
import { useAuth, useLogout } from '../hooks/use-auth';

export function UserMenu() {
  const [open, setOpen] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const logout = useLogout();
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogoutClick = () => {
    setOpen(false);
    setShowConfirm(true);
  };

  const handleConfirmLogout = () => {
    setShowConfirm(false);
    logout();
    navigate('/auth/login', { replace: true });
  };

  return (
    <div ref={ref} className="relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen(!open)}
        title="User menu"
      >
        <User className="size-5" />
      </Button>

      {open && (
        <div className="absolute right-0 mt-2 z-50 w-60 rounded-xl border bg-background p-2 shadow-xl animate-in fade-in zoom-in-95 duration-100">
          <div className="px-3 py-2.5">
            <p className="text-sm font-semibold text-foreground truncate">{user?.name ?? 'User'}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
            <span className="mt-1.5 inline-block text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-400 px-2 py-0.5 rounded-md">
              {user?.role}
            </span>
          </div>
          <div className="my-1 border-t border-border" />
          <button
            onClick={handleLogoutClick}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
          >
            <LogOut className="size-4" />
            Log out
          </button>
        </div>
      )}

      <ConfirmDialog
        open={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleConfirmLogout}
        title="Confirm Logout"
        message="Are you sure you want to log out? You will be redirected to the login page."
        confirmLabel="Log out"
        variant="destructive"
      />
    </div>
  );
}
