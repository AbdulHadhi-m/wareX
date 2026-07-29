import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { SearchableSelect } from './searchable-select';
import { ConfirmDialog } from '@/components/common/confirm-dialog';
import {
  useDeviceLocation,
  useWarehousesForInventory,
  useZonesByWarehouse,
  useAislesByZone,
  useBinsByAisle,
} from '../hooks/use-inventory';
import { api } from '@/lib/axios';
import type { Device } from '@/features/device/types';
import type { ApiResponse } from '@/types';
import {
  moveDeviceSchema,
  type MoveDeviceFormData,
} from '../schemas/inventory-schema';

interface MoveDeviceFormProps {
  preselectedDeviceId?: string;
  isPending: boolean;
  onSubmit: (data: MoveDeviceFormData) => void;
}

export function MoveDeviceForm({
  preselectedDeviceId,
  isPending,
  onSubmit,
}: MoveDeviceFormProps) {
  const [selectedDeviceId, setSelectedDeviceId] = useState(preselectedDeviceId ?? '');
  const [deviceSearch, setDeviceSearch] = useState('');
  const [deviceOptions, setDeviceOptions] = useState<{ id: string; deviceName: string; serialNumber: string }[]>([]);
  const [searching, setSearching] = useState(false);
  const [selectedWarehouseId, setSelectedWarehouseId] = useState('');
  const [selectedZoneId, setSelectedZoneId] = useState('');
  const [selectedAisleId, setSelectedAisleId] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<MoveDeviceFormData>({
    resolver: zodResolver(moveDeviceSchema),
    defaultValues: {
      deviceId: preselectedDeviceId ?? '',
      toBinId: '',
      movementType: 'Transfer',
      reason: '',
    },
  });

  const toBinId = watch('toBinId');
  const movementType = watch('movementType');

  const { data: location, isLoading: locLoading } = useDeviceLocation(selectedDeviceId);
  const { data: warehouses = [], isLoading: whLoading } = useWarehousesForInventory();
  const { data: zones = [], isLoading: zonesLoading } = useZonesByWarehouse(selectedWarehouseId);
  const { data: aisles = [], isLoading: aislesLoading } = useAislesByZone(selectedZoneId);
  const { data: bins = [], isLoading: binsLoading } = useBinsByAisle(selectedAisleId);

  useEffect(() => {
    if (preselectedDeviceId) {
      setSelectedDeviceId(preselectedDeviceId);
      setValue('deviceId', preselectedDeviceId);
    }
  }, [preselectedDeviceId, setValue]);

  useEffect(() => {
    if (location) {
      setSelectedWarehouseId(location.location.warehouse.id);
      setSelectedZoneId(location.location.zone.id);
      setSelectedAisleId(location.location.aisle.id);
    }
  }, [location]);

  const handleDeviceSearch = async () => {
    if (!deviceSearch.trim()) return;
    setSearching(true);
    try {
      const res = await api.get<ApiResponse<Device[]>>('/devices', {
        params: { search: deviceSearch, limit: 20 },
      });
      const devices = res.data.data ?? [];
      setDeviceOptions(
        devices.map((d) => ({
          id: d.id,
          deviceName: d.deviceName,
          serialNumber: d.serialNumber,
        })),
      );
    } catch {
      setDeviceOptions([]);
    } finally {
      setSearching(false);
    }
  };

  const filteredDeviceOptions = deviceOptions.filter(
    (d) =>
      d.deviceName.toLowerCase().includes(deviceSearch.toLowerCase()) ||
      d.serialNumber.toLowerCase().includes(deviceSearch.toLowerCase()),
  );

  const handleFormSubmit = (_data: MoveDeviceFormData) => {
    setShowConfirm(true);
  };

  const handleConfirm = () => {
    setShowConfirm(false);
    const data = {
      deviceId: selectedDeviceId,
      toBinId,
      movementType: movementType as MoveDeviceFormData['movementType'],
      reason: watch('reason') || undefined,
    };
    onSubmit(data);
  };

  const isSameBin = location && toBinId === location.location.bin.id;

  return (
    <>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        <Card>
          <CardContent className="space-y-4 p-6">
            <h3 className="text-sm font-medium text-foreground">Device</h3>
            {preselectedDeviceId ? (
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">Device ID:</span>
                <span className="font-medium">{preselectedDeviceId}</span>
              </div>
            ) : (
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    value={deviceSearch}
                    onChange={(e) => setDeviceSearch(e.target.value)}
                    placeholder="Search by device name or serial..."
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleDeviceSearch())}
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleDeviceSearch}
                  disabled={searching || !deviceSearch.trim()}
                >
                  <Search className="size-4" />
                </Button>
              </div>
            )}

            {!preselectedDeviceId && deviceOptions.length > 0 && (
              <div className="max-h-40 overflow-y-auto rounded-md border">
                {filteredDeviceOptions.map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => {
                      setSelectedDeviceId(d.id);
                      setValue('deviceId', d.id, { shouldValidate: true });
                      setDeviceOptions([]);
                      setDeviceSearch('');
                    }}
                    className={`w-full px-3 py-2 text-left text-sm hover:bg-accent ${
                      selectedDeviceId === d.id ? 'bg-accent font-medium' : ''
                    }`}
                  >
                    {d.deviceName} ({d.serialNumber})
                  </button>
                ))}
              </div>
            )}
            {errors.deviceId && (
              <p className="text-sm text-destructive">{errors.deviceId.message}</p>
            )}
          </CardContent>
        </Card>

        {location && (
          <Card>
            <CardContent className="space-y-4 p-6">
              <h3 className="text-sm font-medium text-foreground">
                Current Location
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Warehouse:</span>
                  <p className="font-medium">
                    {location.location.warehouse.name} (
                    {location.location.warehouse.code})
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Zone:</span>
                  <p className="font-medium">
                    {location.location.zone.name} ({location.location.zone.code})
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Aisle:</span>
                  <p className="font-medium">
                    {location.location.aisle.name} (
                    {location.location.aisle.code})
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Bin:</span>
                  <p className="font-medium">
                    {location.location.bin.name} ({location.location.bin.code})
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {locLoading && (
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="size-4 animate-spin" />
                Loading device location...
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardContent className="space-y-4 p-6">
            <h3 className="text-sm font-medium text-foreground">
              Destination Location
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
                    setValue('toBinId', '', { shouldValidate: true });
                  }}
                  placeholder="Select destination warehouse..."
                  disabled={isPending || !selectedDeviceId}
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
                    setValue('toBinId', '', { shouldValidate: true });
                  }}
                  placeholder={
                    !selectedWarehouseId
                      ? 'Select a warehouse first'
                      : 'Select destination zone...'
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
                    setValue('toBinId', '', { shouldValidate: true });
                  }}
                  placeholder={
                    !selectedZoneId
                      ? 'Select a zone first'
                      : 'Select destination aisle...'
                  }
                  disabled={isPending || !selectedZoneId}
                  loading={aislesLoading}
                />
              </div>
              <div className="space-y-2">
                <Label>Bin *</Label>
                <SearchableSelect
                  options={bins}
                  value={toBinId}
                  onChange={(bId) =>
                    setValue('toBinId', bId, { shouldValidate: true })
                  }
                  placeholder={
                    !selectedAisleId
                      ? 'Select an aisle first'
                      : 'Select destination bin...'
                  }
                  disabled={isPending || !selectedAisleId}
                  loading={binsLoading}
                  error={errors.toBinId?.message}
                />
                {errors.toBinId && (
                  <p className="text-sm text-destructive">
                    {errors.toBinId.message}
                  </p>
                )}
                {isSameBin && (
                  <p className="text-sm text-destructive">
                    Destination bin must be different from the current bin
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-4 p-6">
            <h3 className="text-sm font-medium text-foreground">
              Movement Details
            </h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="movementType">Movement Type *</Label>
                <select
                  id="movementType"
                  {...register('movementType')}
                  disabled={isPending}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="Initial Placement">Initial Placement</option>
                  <option value="Transfer">Transfer</option>
                  <option value="Return">Return</option>
                  <option value="Adjustment">Adjustment</option>
                </select>
                {errors.movementType && (
                  <p className="text-sm text-destructive">
                    {errors.movementType.message}
                  </p>
                )}
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="reason">Reason</Label>
                <Input
                  id="reason"
                  {...register('reason')}
                  placeholder="Optional reason for the movement"
                  disabled={isPending}
                />
                {errors.reason && (
                  <p className="text-sm text-destructive">
                    {errors.reason.message}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center gap-3">
          <Button
            type="submit"
            disabled={isPending || !selectedDeviceId || isSameBin}
          >
            {isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
            {isPending ? 'Moving...' : 'Review Movement'}
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

      <ConfirmDialog
        open={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleConfirm}
        title="Confirm Device Movement"
        message={`Move device "${location?.deviceName}" (${location?.serialNumber}) from ${location?.location.bin.name} to the selected destination bin?`}
        confirmLabel="Move Device"
        variant="default"
        loading={isPending}
      />
    </>
  );
}
