import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Box, Warehouse, Cpu, Package, ShoppingCart, ClipboardList, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/constants';
import { useDebounce } from '@/hooks/use-debounce';
import { Button } from '@/components/ui/button';

interface SearchResult {
  label: string;
  path: string;
  icon: typeof Search;
  keywords: string[];
}

const searchIndex: SearchResult[] = [
  { label: 'Dashboard', path: ROUTES.DASHBOARD, icon: Search, keywords: ['home', 'dashboard'] },
  { label: 'Warehouses', path: ROUTES.WAREHOUSES, icon: Warehouse, keywords: ['warehouse', 'warehouses', 'building'] },
  { label: 'Zones', path: ROUTES.ZONES, icon: Box, keywords: ['zone', 'zones', 'area'] },
  { label: 'Aisles', path: ROUTES.AISLES, icon: Box, keywords: ['aisle', 'aisles', 'row'] },
  { label: 'Bins', path: ROUTES.BINS, icon: Box, keywords: ['bin', 'bins', 'location'] },
  { label: 'Devices', path: ROUTES.DEVICES, icon: Cpu, keywords: ['device', 'devices', 'iot', 'sensor'] },
  { label: 'Inventory', path: ROUTES.INVENTORY, icon: Package, keywords: ['inventory', 'stock', 'item'] },
  { label: 'Orders', path: ROUTES.ORDERS, icon: ShoppingCart, keywords: ['order', 'orders', 'purchase'] },
  { label: 'Pick Lists', path: ROUTES.PICK_LISTS, icon: ClipboardList, keywords: ['pick', 'picking', 'picklist'] },
  { label: 'Reports', path: ROUTES.REPORTS, icon: BarChart3, keywords: ['report', 'reports', 'analytics'] },
];

export function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 200);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const filtered = debouncedQuery
    ? searchIndex.filter(
        (item) =>
          item.label.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
          item.keywords.some((k) => k.includes(debouncedQuery.toLowerCase())),
      )
    : searchIndex;

  const handleSelect = useCallback(
    (path: string) => {
      setOpen(false);
      setQuery('');
      navigate(path);
    },
    [navigate],
  );

  useEffect(() => {
    setSelectedIndex(0);
  }, [debouncedQuery]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === 'Escape') {
        setOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    if (listRef.current && filtered[selectedIndex]) {
      const el = listRef.current.children[selectedIndex] as HTMLElement;
      el?.scrollIntoView({ block: 'nearest' });
    }
  }, [selectedIndex, filtered]);

  return (
    <div className="relative hidden sm:block">
      <Button
        variant="outline"
        className="relative h-9 w-56 justify-start text-sm text-muted-foreground sm:pr-12"
        onClick={() => setOpen(true)}
      >
        <Search className="size-4 mr-2" />
        <span>Search...</span>
        <kbd className="pointer-events-none absolute right-2 top-1/2 hidden -translate-y-1/2 items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>

      {open && (
        <>
          <div className="fixed inset-0 z-50" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-12 z-50 w-80 rounded-xl border bg-popover shadow-lg">
            <div className="flex items-center border-b px-3">
              <Search className="size-4 mr-2 shrink-0 text-muted-foreground" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    setSelectedIndex((i) => Math.min(i + 1, filtered.length - 1));
                  } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    setSelectedIndex((i) => Math.max(i - 1, 0));
                  } else if (e.key === 'Enter' && filtered[selectedIndex]) {
                    handleSelect(filtered[selectedIndex].path);
                  }
                }}
                placeholder="Search pages..."
                className="h-11 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
            </div>
            <div ref={listRef} className="max-h-64 overflow-y-auto p-1">
              {filtered.length === 0 ? (
                <p className="p-3 text-center text-sm text-muted-foreground">No results</p>
              ) : (
                filtered.map((item, index) => (
                  <button
                    key={item.path}
                    className={cn(
                      'flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors',
                      index === selectedIndex
                        ? 'bg-accent text-accent-foreground'
                        : 'text-foreground hover:bg-accent hover:text-accent-foreground',
                    )}
                    onClick={() => handleSelect(item.path)}
                    onMouseEnter={() => setSelectedIndex(index)}
                  >
                    <item.icon className="size-4 shrink-0 text-muted-foreground" />
                    {item.label}
                  </button>
                ))
              )}
            </div>
            <div className="border-t px-3 py-1.5 text-[10px] text-muted-foreground">
              <span className="mr-3">↑↓ Navigate</span>
              <span className="mr-3">↵ Open</span>
              <span>Esc Close</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
