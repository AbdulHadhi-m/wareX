import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { SearchableSelect } from './searchable-select';
import {
  useWarehousesForAisle,
  useZonesByWarehouse,
  useAllZones,
} from '../hooks/use-aisles';
import {
  createAisleSchema,
  type CreateAisleFormData,
} from '../schemas/aisle-schema';
import type { Aisle } from '../types';

interface AisleFormProps {
  defaultValues?: Aisle;
  isPending: boolean;
  onSubmit: (data: CreateAisleFormData) => void;
}

const emptyDefaults: CreateAisleFormData = {
  zoneId: '',
  name: '',
  code: '',
  description: '',
  status: 'Active',
};

function toFormDefaults(aisle?: Aisle): CreateAisleFormData {
  if (!aisle) return emptyDefaults;
  return {
    zoneId: aisle.zoneId,
    name: aisle.name,
    code: aisle.code,
    description: aisle.description ?? '',
    status: aisle.status,
  };
}

export function AisleForm({ defaultValues, isPending, onSubmit }: AisleFormProps) {
  const [selectedWarehouseId, setSelectedWarehouseId] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateAisleFormData>({
    resolver: zodResolver(createAisleSchema),
    defaultValues: toFormDefaults(defaultValues),
  });

  const zoneId = watch('zoneId');
  const { data: warehouses = [], isLoading: whLoading } = useWarehousesForAisle();
  const { data: zones = [], isLoading: zonesLoading } = useZonesByWarehouse(selectedWarehouseId);
  const { data: allZones = [] } = useAllZones();

  useEffect(() => {
    if (defaultValues?.zoneId && allZones.length > 0 && !selectedWarehouseId) {
      const zone = allZones.find((z) => z.id === defaultValues.zoneId);
      if (zone) {
        setSelectedWarehouseId(zone.warehouseId);
      }
    }
  }, [defaultValues?.zoneId, allZones, selectedWarehouseId]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardContent className="space-y-4 p-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Warehouse *</Label>
              <SearchableSelect
                options={warehouses}
                value={selectedWarehouseId}
                onChange={(whId) => {
                  setSelectedWarehouseId(whId);
                  setValue('zoneId', '', { shouldValidate: true });
                }}
                placeholder="Select a warehouse..."
                disabled={isPending}
                loading={whLoading}
              />
            </div>

            <div className="space-y-2">
              <Label>Zone *</Label>
              <SearchableSelect
                options={zones}
                value={zoneId}
                onChange={(zId) => setValue('zoneId', zId, { shouldValidate: true })}
                placeholder={!selectedWarehouseId ? 'Select a warehouse first' : 'Select a zone...'}
                disabled={isPending || !selectedWarehouseId}
                loading={zonesLoading}
                error={errors.zoneId?.message}
              />
              {errors.zoneId && <p className="text-sm text-destructive">{errors.zoneId.message}</p>}
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
                placeholder="e.g. A-01"
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
          {isPending ? 'Saving...' : defaultValues ? 'Update Aisle' : 'Create Aisle'}
        </Button>
        <Button type="button" variant="outline" onClick={() => window.history.back()} disabled={isPending}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
