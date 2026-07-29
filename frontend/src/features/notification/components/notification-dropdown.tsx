import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, CheckCheck, ExternalLink, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useUnreadCount, useNotifications, useMarkAllAsRead } from '../hooks/use-notifications';
import { NotificationTypeIcon } from './notification-type-icon';

export function NotificationDropdown() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const { data: unreadCount = 0 } = useUnreadCount();
  const { data, isLoading } = useNotifications({ page: 1, limit: 5 });
  const markAllAsReadMutation = useMarkAllAsRead();

  const notifications = data?.data ?? [];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <Button
        variant="ghost"
        size="icon"
        className="relative"
        title="Notifications"
        onClick={() => setOpen(!open)}
      >
        <Bell className="size-5" />
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </Button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-80 rounded-md border bg-background shadow-lg">
          <div className="flex items-center justify-between border-b px-4 py-3">
            <span className="text-sm font-medium">Notifications</span>
            {unreadCount > 0 && (
              <button
                onClick={() => markAllAsReadMutation.mutate()}
                disabled={markAllAsReadMutation.isPending}
                className="flex items-center gap-1 text-xs text-primary hover:underline disabled:opacity-50"
              >
                {markAllAsReadMutation.isPending ? (
                  <Loader2 className="size-3 animate-spin" />
                ) : (
                  <CheckCheck className="size-3" />
                )}
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="size-5 animate-spin text-muted-foreground" />
              </div>
            ) : notifications.length === 0 ? (
              <div className="py-8 text-center text-sm text-muted-foreground">
                No notifications
              </div>
            ) : (
              notifications.map((notification) => (
                <button
                  key={notification.id}
                  onClick={() => {
                    setOpen(false);
                    navigate(`/dashboard/notifications/${notification.id}`);
                  }}
                  className="flex w-full items-start gap-3 border-b px-4 py-3 text-left hover:bg-accent transition-colors last:border-0"
                >
                  <NotificationTypeIcon type={notification.type} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p
                        className={cn(
                          'text-sm truncate',
                          !notification.isRead && 'font-semibold',
                        )}
                      >
                        {notification.title}
                      </p>
                      {!notification.isRead && (
                        <span className="mt-1.5 size-2 shrink-0 rounded-full bg-primary" />
                      )}
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">
                      {notification.message}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {timeAgo(notification.createdAt)}
                    </p>
                  </div>
                </button>
              ))
            )}
          </div>

          <div className="border-t px-4 py-2.5">
            <button
              onClick={() => {
                setOpen(false);
                navigate('/dashboard/notifications');
              }}
              className="flex w-full items-center justify-center gap-1 text-sm text-primary hover:underline"
            >
              <ExternalLink className="size-3" />
              View all notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function timeAgo(dateString: string): string {
  const now = Date.now();
  const date = new Date(dateString).getTime();
  const diffMs = now - date;

  const seconds = Math.floor(diffMs / 1000);
  if (seconds < 60) return 'just now';

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;

  return new Date(dateString).toLocaleDateString();
}
