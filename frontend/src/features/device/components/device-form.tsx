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
  useWarehousesForDevice,
  useZonesByWarehouse,
  useAislesByZone,
  useBinsByAisle,
} from '../hooks/use-devices';
import {
  createDeviceSchema,
  type CreateDeviceFormData,
} from '../schemas/device-schema';
import type { Device } from '../types';

interface DeviceFormProps {
  defaultValues?: Device;
  isPending: boolean;
  onSubmit: (data: CreateDeviceFormData) => void;
}

const emptyDefaults: CreateDeviceFormData = {
  binId: '',
  deviceName: '',
  brand: '',
  model: '',
  category: '',
  sku: '',
  serialNumber: '',
  imei: '',
  status: 'Available',
  condition: 'New',
  purchaseDate: '',
  warrantyExpiry: '',
  notes: '',
};

function toFormDefaults(device?: Device): CreateDeviceFormData {
  if (!device) return emptyDefaults;
  return {
    binId: device.binId,
    deviceName: device.deviceName,
    brand: device.brand,
    model: device.model,
    category: device.category,
    sku: device.sku ?? '',
    serialNumber: device.serialNumber,
    imei: device.imei ?? '',
    status: device.status,
    condition: device.condition,
    purchaseDate: device.purchaseDate ?? '',
    warrantyExpiry: device.warrantyExpiry ?? '',
    notes: device.notes ?? '',
  };
}

export function DeviceForm({ defaultValues, isPending, onSubmit }: DeviceFormProps) {
  const [selectedWarehouseId, setSelectedWarehouseId] = useState('');
  const [selectedZoneId, setSelectedZoneId] = useState('');
  const [selectedAisleId, setSelectedAisleId] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateDeviceFormData>({
    resolver: zodResolver(createDeviceSchema),
    defaultValues: toFormDefaults(defaultValues),
  });

  const binId = watch('binId');
  const { data: warehouses = [], isLoading: whLoading } = useWarehousesForDevice();
  const { data: zones = [], isLoading: zonesLoading } =
    useZonesByWarehouse(selectedWarehouseId);
  const { data: aisles = [], isLoading: aislesLoading } =
    useAislesByZone(selectedZoneId);
  const { data: bins = [], isLoading: binsLoading } =
    useBinsByAisle(selectedAisleId);

  useEffect(() => {
    if (defaultValues) {
      setSelectedWarehouseId(defaultValues.warehouseId);
      setSelectedZoneId(defaultValues.zoneId);
      setSelectedAisleId(defaultValues.aisleId);
    }
  }, [defaultValues]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardContent className="space-y-4 p-6">
          <h3 className="text-sm font-medium text-foreground">
            Device Information
          </h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="deviceName">Device Name *</Label>
              <Input
                id="deviceName"
                {...register('deviceName')}
                disabled={isPending}
              />
              {errors.deviceName && (
                <p className="text-sm text-destructive">
                  {errors.deviceName.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="brand">Brand *</Label>
              <Input id="brand" {...register('brand')} disabled={isPending} />
              {errors.brand && (
                <p className="text-sm text-destructive">{errors.brand.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="model">Model *</Label>
              <Input id="model" {...register('model')} disabled={isPending} />
              {errors.model && (
                <p className="text-sm text-destructive">{errors.model.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Input
                id="category"
                {...register('category')}
                disabled={isPending}
              />
              {errors.category && (
                <p className="text-sm text-destructive">
                  {errors.category.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="sku">SKU</Label>
              <Input id="sku" {...register('sku')} disabled={isPending} />
              {errors.sku && (
                <p className="text-sm text-destructive">{errors.sku.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="serialNumber">Serial Number *</Label>
              <Input
                id="serialNumber"
                {...register('serialNumber')}
                disabled={isPending}
              />
              {errors.serialNumber && (
                <p className="text-sm text-destructive">
                  {errors.serialNumber.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="imei">IMEI</Label>
              <Input
                id="imei"
                {...register('imei')}
                placeholder="15 digits"
                disabled={isPending}
              />
              {errors.imei && (
                <p className="text-sm text-destructive">{errors.imei.message}</p>
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
                <option value="Reserved">Reserved</option>
                <option value="Picked">Picked</option>
                <option value="Shipped">Shipped</option>
                <option value="Damaged">Damaged</option>
                <option value="Returned">Returned</option>
              </select>
              {errors.status && (
                <p className="text-sm text-destructive">{errors.status.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="condition">Condition *</Label>
              <select
                id="condition"
                {...register('condition')}
                disabled={isPending}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="New">New</option>
                <option value="Good">Good</option>
                <option value="Fair">Fair</option>
                <option value="Damaged">Damaged</option>
              </select>
              {errors.condition && (
                <p className="text-sm text-destructive">
                  {errors.condition.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="purchaseDate">Purchase Date</Label>
              <Input
                id="purchaseDate"
                type="date"
                {...register('purchaseDate')}
                disabled={isPending}
              />
              {errors.purchaseDate && (
                <p className="text-sm text-destructive">
                  {errors.purchaseDate.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="warrantyExpiry">Warranty Expiry</Label>
              <Input
                id="warrantyExpiry"
                type="date"
                {...register('warrantyExpiry')}
                disabled={isPending}
              />
              {errors.warrantyExpiry && (
                <p className="text-sm text-destructive">
                  {errors.warrantyExpiry.message}
                </p>
              )}
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="notes">Notes</Label>
              <Input
                id="notes"
                {...register('notes')}
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
          <h3 className="text-sm font-medium text-foreground">
            Location Assignment
          </h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Warehouse *</Label>
              <SearchableSelect
                options={warehouses}
                value={selectedWarehouseId}
                onChange={(whId) => {
                  setSelectedWarehouseId(whId);
                  setSelectedZoneId('');
                  setSelectedAisleId('');
                  setValue('binId', '', { shouldValidate: true });
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
                  setSelectedAisleId('');
                  setValue('binId', '', { shouldValidate: true });
                }}
                placeholder={
                  !selectedWarehouseId
                    ? 'Select a warehouse first'
                    : 'Select a zone...'
                }
                disabled={isPending || !selectedWarehouseId}
                loading={zonesLoading}
              />
            </div>

            <div className="space-y-2">
              <Label>Aisle *</Label>
              <SearchableSelect
                options={aisles}
                value={selectedAisleId}
                onChange={(aId) => {
                  setSelectedAisleId(aId);
                  setValue('binId', '', { shouldValidate: true });
                }}
                placeholder={
                  !selectedZoneId ? 'Select a zone first' : 'Select an aisle...'
                }
                disabled={isPending || !selectedZoneId}
                loading={aislesLoading}
              />
            </div>

            <div className="space-y-2">
              <Label>Bin *</Label>
              <SearchableSelect
                options={bins}
                value={binId}
                onChange={(bId) => setValue('binId', bId, { shouldValidate: true })}
                placeholder={
                  !selectedAisleId ? 'Select an aisle first' : 'Select a bin...'
                }
                disabled={isPending || !selectedAisleId}
                loading={binsLoading}
                error={errors.binId?.message}
              />
              {errors.binId && (
                <p className="text-sm text-destructive">{errors.binId.message}</p>
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
              ? 'Update Device'
              : 'Register Device'}
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
