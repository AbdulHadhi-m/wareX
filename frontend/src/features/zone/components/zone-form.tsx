import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { WarehouseSelect } from './warehouse-select';
import {
  createZoneSchema,
  type CreateZoneFormData,
} from '../schemas/zone-schema';
import type { Zone } from '../types';

interface ZoneFormProps {
  defaultValues?: Zone;
  isPending: boolean;
  onSubmit: (data: CreateZoneFormData) => void;
}

const emptyDefaults: CreateZoneFormData = {
  warehouseId: '',
  name: '',
  code: '',
  description: '',
  status: 'Active',
};

function toFormDefaults(zone?: Zone): CreateZoneFormData {
  if (!zone) return emptyDefaults;
  return {
    warehouseId: zone.warehouseId,
    name: zone.name,
    code: zone.code,
    description: zone.description ?? '',
    status: zone.status,
  };
}

export function ZoneForm({ defaultValues, isPending, onSubmit }: ZoneFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateZoneFormData>({
    resolver: zodResolver(createZoneSchema),
    defaultValues: toFormDefaults(defaultValues),
  });

  const warehouseId = watch('warehouseId');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardContent className="space-y-4 p-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="warehouseId">Warehouse *</Label>
              <WarehouseSelect
                value={warehouseId}
                onChange={(val) => setValue('warehouseId', val, { shouldValidate: true })}
                disabled={isPending}
                error={errors.warehouseId?.message}
              />
              {errors.warehouseId && (
                <p className="text-sm text-destructive">{errors.warehouseId.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <select
                id="status"
                {...register('status')}
                disabled={isPending}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
              {errors.status && <p className="text-sm text-destructive">{errors.status.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input id="name" {...register('name')} disabled={isPending} />
              {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="code">Code *</Label>
              <Input
                id="code"
                {...register('code')}
                placeholder="e.g. Z-A"
                disabled={isPending}
                className="uppercase"
              />
              {errors.code && <p className="text-sm text-destructive">{errors.code.message}</p>}
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Input id="description" {...register('description')} disabled={isPending} />
              {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={isPending}>
          {isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
          {isPending ? 'Saving...' : defaultValues ? 'Update Zone' : 'Create Zone'}
        </Button>
        <Button type="button" variant="outline" onClick={() => window.history.back()} disabled={isPending}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
