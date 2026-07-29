import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface UnsavedChangesWarningProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function UnsavedChangesWarning({ open, onConfirm, onCancel }: UnsavedChangesWarningProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onCancel} />
      <div className="relative z-50 w-full max-w-md rounded-xl border bg-background p-6 shadow-lg">
        <div className="flex items-start gap-4">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-amber-500/10">
            <AlertTriangle className="size-5 text-amber-500" />
          </div>
          <div className="flex-1 space-y-2">
            <h3 className="font-semibold text-foreground">Unsaved changes</h3>
            <p className="text-sm text-muted-foreground">
              You have unsaved changes. Are you sure you want to leave?
            </p>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
          <Button variant="destructive" onClick={onConfirm}>Leave</Button>
        </div>
      </div>
    </div>
  );
}
