import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Warehouse,
  Layers,
  GitBranch,
  Box,
  Cpu,
  Package,
  ClipboardList,
  ShoppingCart,
  Bell,
  BarChart3,
  Settings,
  ChevronLeft,
  Shield,
  ScrollText,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/constants';
import { AppLogo } from '@/components/common/app-logo';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/features/auth';
import type { NavigationItem } from '@/types';

const navigationItems: NavigationItem[] = [
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

const adminNavItems: NavigationItem[] = [
  { label: 'Users', path: '/dashboard/admin/users', icon: Shield },
  { label: 'Audit Logs', path: '/dashboard/admin/audit-logs', icon: ScrollText },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const { user } = useAuth();
  const isSuperAdmin = user?.role === 'SuperAdmin';

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 flex h-full flex-col border-r bg-sidebar transition-all duration-300',
        collapsed ? 'w-16' : 'w-64',
      )}
    >
      <div
        className={cn(
          'flex h-16 items-center border-b border-sidebar-border px-4',
          collapsed ? 'justify-center' : 'justify-between',
        )}
      >
        <AppLogo variant={collapsed ? 'compact' : 'default'} />
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className={cn('hidden lg:flex', collapsed && 'rotate-180')}
        >
          <ChevronLeft className="size-4" />
        </Button>
      </div>

      <nav className="flex-1 overflow-y-auto p-2 space-y-1">
        {navigationItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === ROUTES.DASHBOARD}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'text-sidebar-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                collapsed && 'justify-center px-2',
              )
            }
            title={collapsed ? item.label : undefined}
          >
            <item.icon className="size-5 shrink-0" />
            {!collapsed && <span className="truncate">{item.label}</span>}
          </NavLink>
        ))}
        {isSuperAdmin && !collapsed && (
          <div className="pt-4 pb-1">
            <Separator className="mb-2" />
            <span className="px-3 text-xs font-semibold uppercase tracking-wider text-sidebar-muted-foreground">
              Administration
            </span>
          </div>
        )}
        {isSuperAdmin && adminNavItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'text-sidebar-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                collapsed && 'justify-center px-2',
              )
            }
            title={collapsed ? item.label : undefined}
          >
            <item.icon className="size-5 shrink-0" />
            {!collapsed && <span className="truncate">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {!collapsed && (
        <div className="p-4">
          <Separator className="mb-4" />
          <p className="text-xs text-sidebar-muted-foreground text-center">wareX v1.0.0</p>
        </div>
      )}
    </aside>
  );
}
