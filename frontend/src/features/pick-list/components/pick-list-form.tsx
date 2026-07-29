import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { DeviceMultiSelect } from './device-multi-select';
import {
  createPickListSchema,
  type CreatePickListFormData,
} from '../schemas/pick-list-schema';

interface PickListFormProps {
  isPending: boolean;
  onSubmit: (data: CreatePickListFormData) => void;
}

export function PickListForm({ isPending, onSubmit }: PickListFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreatePickListFormData>({
    resolver: zodResolver(createPickListSchema),
    defaultValues: {
      deviceIds: [],
      priority: 'Medium',
      notes: '',
    },
  });

  const deviceIds = watch('deviceIds');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardContent className="space-y-4 p-6">
          <h3 className="text-sm font-medium text-foreground">
            Pick List Details
          </h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="priority">Priority *</Label>
              <select
                id="priority"
                {...register('priority')}
                disabled={isPending}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
              {errors.priority && (
                <p className="text-sm text-destructive">
                  {errors.priority.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Devices Selected</Label>
              <div className="flex h-10 items-center rounded-md border bg-muted px-3 text-sm text-muted-foreground">
                {deviceIds.length} device{deviceIds.length !== 1 ? 's' : ''} selected
              </div>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="notes">Notes</Label>
              <Input
                id="notes"
                {...register('notes')}
                placeholder="Optional notes..."
                disabled={isPending}
              />
              {errors.notes && (
                <p className="text-sm text-destructive">{errors.notes.message}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-4 p-6">
          <h3 className="text-sm font-medium text-foreground">Devices *</h3>
          <DeviceMultiSelect
            value={deviceIds}
            onChange={(ids) => setValue('deviceIds', ids, { shouldValidate: true })}
            disabled={isPending}
            error={errors.deviceIds?.message}
          />
        </CardContent>
      </Card>

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={isPending}>
          {isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
          {isPending ? 'Creating...' : 'Create Pick List'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => window.history.back()}
          disabled={isPending}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
