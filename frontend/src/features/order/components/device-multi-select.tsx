import { useState, useRef, useEffect, useCallback } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { orderApi } from '../api/order-api';
import type { Device } from '@/features/device/types';

interface DeviceMultiSelectProps {
  value: string[];
  onChange: (value: string[]) => void;
  disabled?: boolean;
  error?: string;
}

interface DeviceOption {
  id: string;
  deviceName: string;
  serialNumber: string;
}

export function DeviceMultiSelect({
  value,
  onChange,
  disabled,
  error,
}: DeviceMultiSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [devices, setDevices] = useState<DeviceOption[]>([]);
  const [deviceMap, setDeviceMap] = useState<Map<string, DeviceOption>>(new Map());
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
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

  const handleSearch = useCallback(async (term: string) => {
    setLoading(true);
    try {
      const results = await orderApi.searchDevices(term);
      const mapped = results.map((d: Device) => ({
        id: d.id,
        deviceName: d.deviceName,
        serialNumber: d.serialNumber,
      }));
      setDevices(mapped);
      setDeviceMap((prev) => {
        const next = new Map(prev);
        mapped.forEach((item) => next.set(item.id, item));
        return next;
      });
    } catch {
      setDevices([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    handleSearch('');
  }, [handleSearch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleSearch(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search, handleSearch]);

  const toggleDevice = (deviceId: string) => {
    if (value.includes(deviceId)) {
      onChange(value.filter((id) => id !== deviceId));
    } else {
      onChange([...value, deviceId]);
    }
  };

  const filtered = devices.filter(
    (d) =>
      !value.includes(d.id) &&
      (!search.trim() ||
        d.deviceName.toLowerCase().includes(search.toLowerCase()) ||
        d.serialNumber.toLowerCase().includes(search.toLowerCase())),
  );

  return (
    <div ref={containerRef} className="relative">
      <div
        onClick={() => !disabled && setOpen(!open)}
        className={cn(
          'flex min-h-10 w-full flex-wrap items-center gap-1 rounded-md border border-input bg-background px-3 py-1.5 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 cursor-pointer',
          disabled && 'cursor-not-allowed opacity-50',
          error && 'border-destructive',
        )}
      >
        {value.length === 0 ? (
          <span className="text-muted-foreground py-0.5">
            Search and select devices...
          </span>
        ) : (
          value.map((id) => {
            const d = deviceMap.get(id);
            return (
              <span
                key={id}
                className="flex items-center gap-1 rounded bg-secondary px-2 py-0.5 text-xs font-medium"
              >
                {d ? `${d.deviceName} (${d.serialNumber})` : id.slice(-6)}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleDevice(id);
                  }}
                  className="hover:text-destructive"
                >
                  <X className="size-3" />
                </button>
              </span>
            );
          })
        )}
      </div>

      {open && (
        <div className="absolute z-50 mt-1 w-full rounded-md border bg-background shadow-lg">
          <div className="flex items-center border-b px-3">
            <Search className="mr-2 size-4 shrink-0 text-muted-foreground" />
            <input
              ref={inputRef}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search available devices..."
              className="flex h-10 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>
          <ul className="max-h-48 overflow-y-auto py-1">
            {loading && (
              <li className="flex items-center justify-center gap-2 px-3 py-4 text-sm text-muted-foreground">
                <Loader2 className="size-4 animate-spin" />
                Searching...
              </li>
            )}
            {!loading && filtered.length === 0 && (
              <li className="px-3 py-2 text-sm text-muted-foreground">
                {search.trim() ? 'No devices found' : 'No available devices to select'}
              </li>
            )}
            {!loading &&
              filtered.map((d) => (
                <li
                  key={d.id}
                  onClick={() => toggleDevice(d.id)}
                  className="flex cursor-pointer items-center justify-between px-3 py-2 text-sm hover:bg-accent"
                >
                  <span>
                    {d.deviceName}
                    <span className="ml-1 text-muted-foreground">
                      ({d.serialNumber})
                    </span>
                  </span>
                </li>
              ))}
          </ul>
        </div>
      )}

      {error && <p className="mt-1 text-sm text-destructive">{error}</p>}
    </div>
  );
}
