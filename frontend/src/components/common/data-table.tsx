import { type Table as TableType, flexRender } from '@tanstack/react-table';
import { type ReactNode } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface DataTableProps<TData> {
  table: TableType<TData>;
  isLoading?: boolean;
  emptyState?: ReactNode;
  skeletonRows?: number;
  stickyHeader?: boolean;
  bulkActions?: (rows: TData[]) => ReactNode;
  containerClassName?: string;
}

export function DataTable<TData>({
  table,
  isLoading,
  emptyState,
  skeletonRows = 5,
  stickyHeader = true,
  bulkActions,
  containerClassName,
}: DataTableProps<TData>) {
  const selectedRows = table.getSelectedRowModel().rows;
  const hasSelection = selectedRows.length > 0;

  if (isLoading) {
    return (
      <div className={cn('rounded-md border', containerClassName)}>
        <div className="p-1">
          <div className="flex gap-4 border-b px-4 py-3">
            {Array.from({ length: table.getAllColumns().length }).map((_, ci) => (
              <Skeleton key={ci} className="h-4 flex-1" />
            ))}
          </div>
          {Array.from({ length: skeletonRows }).map((_, ri) => (
            <div key={ri} className="flex gap-4 border-b px-4 py-4 last:border-0">
              {Array.from({ length: table.getAllColumns().length }).map((_, ci) => (
                <Skeleton key={ci} className="h-4 flex-1" />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (table.getRowModel().rows.length === 0) {
    return emptyState ? <>{emptyState}</> : null;
  }

  return (
    <div className={cn('rounded-md border', containerClassName)}>
      {hasSelection && bulkActions && (
        <div className="flex items-center gap-4 border-b bg-muted/50 px-4 py-2">
          <span className="text-sm text-muted-foreground">
            {selectedRows.length} selected
          </span>
          {bulkActions(selectedRows.map((r) => r.original))}
        </div>
      )}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className={stickyHeader ? 'sticky top-0 z-10' : undefined}>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
