import { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { X, LayoutDashboard, Warehouse, Layers, GitBranch, Box, Cpu, Package, ClipboardList, ShoppingCart, Bell, BarChart3, Settings, Shield, ScrollText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/constants';
import { AppLogo } from '@/components/common/app-logo';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/features/auth';

const navItems = [
  { label: 'Dashboard', path: ROUTES.DASHBOARD, icon: LayoutDashboard },
  { label: 'Warehouses', path: ROUTES.WAREHOUSES, icon: Warehouse },
  { label: 'Zones', path: ROUTES.ZONES, icon: Layers },
  { label: 'Aisles', path: ROUTES.AISLES, icon: GitBranch },
  { label: 'Bins', path: ROUTES.BINS, icon: Box },
  { label: 'Devices', path: ROUTES.DEVICES, icon: Cpu },
  { label: 'Inventory', path: ROUTES.INVENTORY, icon: Package },
  { label: 'Pick Lists', path: ROUTES.PICK_LISTS, icon: ClipboardList },
  { label: 'Orders', path: ROUTES.ORDERS, icon: ShoppingCart },
  { label: 'Notifications', path: ROUTES.NOTIFICATIONS, icon: Bell },
  { label: 'Reports', path: ROUTES.REPORTS, icon: BarChart3 },
  { label: 'Settings', path: ROUTES.SETTINGS, icon: Settings },
];

const adminNavItems = [
  { label: 'Users', path: '/dashboard/admin/users', icon: Shield },
  { label: 'Audit Logs', path: '/dashboard/admin/audit-logs', icon: ScrollText },
];

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
}

export function MobileNav({ open, onClose }: MobileNavProps) {
  const { user } = useAuth();
  const isSuperAdmin = user?.role === 'SuperAdmin';

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <>
      <div
        className={cn(
          'fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 lg:hidden',
          open ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
        onClick={onClose}
      />
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r bg-sidebar transition-transform duration-300 lg:hidden',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
          <AppLogo variant="default" />
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="size-5" />
          </Button>
        </div>

        <nav className="flex-1 overflow-y-auto p-2 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === ROUTES.DASHBOARD}
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                    : 'text-sidebar-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                )
              }
            >
              <item.icon className="size-5 shrink-0" />
              {item.label}
            </NavLink>
          ))}
          {isSuperAdmin && (
            <>
              <Separator className="my-2" />
              <span className="px-3 text-xs font-semibold uppercase tracking-wider text-sidebar-muted-foreground">
                Administration
              </span>
              {adminNavItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                        : 'text-sidebar-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                    )
                  }
                >
                  <item.icon className="size-5 shrink-0" />
                  {item.label}
                </NavLink>
              ))}
            </>
          )}
        </nav>

        <div className="p-4 border-t border-sidebar-border">
          <p className="text-xs text-sidebar-muted-foreground text-center">wareX v1.0.0</p>
        </div>
      </aside>
    </>
  );
}
