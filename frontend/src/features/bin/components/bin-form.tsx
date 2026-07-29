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
  useWarehouses,
  useZonesByWarehouse,
  useAislesByZone,
} from '../hooks/use-bins';
import { binApi } from '../api/bin-api';
import {
  createBinSchema,
  type CreateBinFormData,
} from '../schemas/bin-schema';
import type { Bin } from '../types';

interface BinFormProps {
  defaultValues?: Bin;
  isPending: boolean;
  onSubmit: (data: CreateBinFormData) => void;
}

const emptyDefaults: CreateBinFormData = {
  aisleId: '',
  name: '',
  code: '',
  description: '',
  capacity: 0 as unknown as number,
  status: 'Available',
};

function toFormDefaults(bin?: Bin): CreateBinFormData {
  if (!bin) return emptyDefaults;
  return {
    aisleId: bin.aisleId,
    name: bin.name,
    code: bin.code,
    description: bin.description ?? '',
    capacity: bin.capacity,
    status: bin.status,
  };
}

export function BinForm({ defaultValues, isPending, onSubmit }: BinFormProps) {
  const [selectedWarehouseId, setSelectedWarehouseId] = useState('');
  const [selectedZoneId, setSelectedZoneId] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateBinFormData>({
    resolver: zodResolver(createBinSchema),
    defaultValues: toFormDefaults(defaultValues),
  });

  const aisleId = watch('aisleId');
  const { data: warehouses = [], isLoading: whLoading } = useWarehouses();
  const { data: zones = [], isLoading: zonesLoading } =
    useZonesByWarehouse(selectedWarehouseId);
  const { data: aisles = [], isLoading: aislesLoading } =
    useAislesByZone(selectedZoneId);

  useEffect(() => {
    if (!defaultValues?.aisleId) return;

    binApi.aisleById(defaultValues.aisleId).then((aisle) => {
      setSelectedZoneId(aisle.zoneId);
      binApi.zoneById(aisle.zoneId).then((zone) => {
        setSelectedWarehouseId(zone.warehouseId);
      });
    });
  }, []);

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
                  setSelectedZoneId('');
                  setValue('aisleId', '', { shouldValidate: true });
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
                value={selectedZoneId}
                onChange={(zId) => {
                  setSelectedZoneId(zId);
                  setValue('aisleId', '', { shouldValidate: true });
                }}
                placeholder={
                  !selectedWarehouseId ? 'Select a warehouse first' : 'Select a zone...'
                }
                disabled={isPending || !selectedWarehouseId}
                loading={zonesLoading}
                error={!selectedZoneId && selectedWarehouseId ? undefined : undefined}
              />
            </div>

            <div className="space-y-2">
              <Label>Aisle *</Label>
              <SearchableSelect
                options={aisles}
                value={aisleId}
                onChange={(aId) => setValue('aisleId', aId, { shouldValidate: true })}
                placeholder={
                  !selectedZoneId ? 'Select a zone first' : 'Select an aisle...'
                }
                disabled={isPending || !selectedZoneId}
                loading={aislesLoading}
                error={errors.aisleId?.message}
              />
              {errors.aisleId && (
                <p className="text-sm text-destructive">{errors.aisleId.message}</p>
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
                <option value="Available">Available</option>
                <option value="Full">Full</option>
                <option value="Blocked">Blocked</option>
                <option value="Inactive">Inactive</option>
              </select>
              {errors.status && (
                <p className="text-sm text-destructive">{errors.status.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input id="name" {...register('name')} disabled={isPending} />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="code">Code *</Label>
              <Input
                id="code"
                {...register('code')}
                placeholder="e.g. B-01"
                disabled={isPending}
                className="uppercase"
              />
              {errors.code && (
                <p className="text-sm text-destructive">{errors.code.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="capacity">Capacity *</Label>
              <Input
                id="capacity"
                type="number"
                min={1}
                step={1}
                {...register('capacity', { valueAsNumber: true })}
                disabled={isPending}
              />
              {errors.capacity && (
                <p className="text-sm text-destructive">{errors.capacity.message}</p>
              )}
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                {...register('description')}
                disabled={isPending}
              />
              {errors.description && (
                <p className="text-sm text-destructive">
                  {errors.description.message}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={isPending}>
          {isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
          {isPending
            ? 'Saving...'
            : defaultValues
              ? 'Update Bin'
              : 'Create Bin'}
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
