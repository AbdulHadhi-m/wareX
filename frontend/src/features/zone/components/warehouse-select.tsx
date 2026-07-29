import { useState, useRef, useEffect } from 'react';
import { Check, ChevronDown, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useWarehousesForSelect } from '../hooks/use-zones';

interface WarehouseSelectProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  error?: string;
}

export function WarehouseSelect({ value, onChange, disabled, error }: WarehouseSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { data: warehouses = [], isLoading } = useWarehousesForSelect();

  const selected = warehouses.find((w) => w.id === value);

  const filtered = warehouses.filter(
    (w) =>
      w.name.toLowerCase().includes(search.toLowerCase()) ||
      w.code.toLowerCase().includes(search.toLowerCase()),
  );

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => !disabled && setOpen(!open)}
        disabled={disabled}
        className={cn(
          'flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          error && 'border-destructive',
        )}
      >
        <span className={selected ? '' : 'text-muted-foreground'}>
          {isLoading ? 'Loading warehouses...' : selected ? `${selected.name} (${selected.code})` : 'Select a warehouse...'}
        </span>
        <ChevronDown className="size-4 text-muted-foreground" />
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full rounded-md border bg-background shadow-lg">
          <div className="flex items-center border-b px-3">
            <Search className="mr-2 size-4 shrink-0 text-muted-foreground" />
            <input
              ref={inputRef}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search warehouses..."
              className="flex h-10 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>
          <ul className="max-h-48 overflow-y-auto py-1">
            {filtered.length === 0 ? (
              <li className="px-3 py-2 text-sm text-muted-foreground">No warehouses found</li>
            ) : (
              filtered.map((w) => (
                <li
                  key={w.id}
                  onClick={() => {
                    onChange(w.id);
                    setOpen(false);
                    setSearch('');
                  }}
                  className={cn(
                    'flex cursor-pointer items-center justify-between px-3 py-2 text-sm hover:bg-accent',
                    w.id === value && 'bg-accent',
                  )}
                >
                  <span>
                    {w.name}
                    <span className="ml-1 text-muted-foreground">({w.code})</span>
                  </span>
                  {w.id === value && <Check className="size-4 text-primary" />}
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
