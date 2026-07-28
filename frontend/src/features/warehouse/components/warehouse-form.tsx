import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import {
  createWarehouseSchema,
  type CreateWarehouseFormData,
} from '../schemas/warehouse-schema';
import type { Warehouse } from '../types';

interface WarehouseFormProps {
  defaultValues?: Warehouse;
  isPending: boolean;
  onSubmit: (data: CreateWarehouseFormData) => void;
}

const emptyDefaults: CreateWarehouseFormData = {
  name: '',
  code: '',
  description: '',
  address: '',
  city: '',
  state: '',
  country: '',
  postalCode: '',
  status: 'Active',
};

function toFormDefaults(warehouse?: Warehouse): CreateWarehouseFormData {
  if (!warehouse) return emptyDefaults;
  return {
    name: warehouse.name,
    code: warehouse.code,
    description: warehouse.description ?? '',
    address: warehouse.address ?? '',
    city: warehouse.city ?? '',
    state: warehouse.state ?? '',
    country: warehouse.country ?? '',
    postalCode: warehouse.postalCode ?? '',
    status: warehouse.status,
  };
}

export function WarehouseForm({ defaultValues, isPending, onSubmit }: WarehouseFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateWarehouseFormData>({
    resolver: zodResolver(createWarehouseSchema),
    defaultValues: toFormDefaults(defaultValues),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardContent className="space-y-4 p-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
                placeholder="e.g. WH-001"
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

      <Card>
        <CardContent className="space-y-4 p-6">
          <h3 className="text-sm font-medium text-foreground">Address Information</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input id="address" {...register('address')} disabled={isPending} />
              {errors.address && <p className="text-sm text-destructive">{errors.address.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input id="city" {...register('city')} disabled={isPending} />
              {errors.city && <p className="text-sm text-destructive">{errors.city.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="state">State / Province</Label>
              <Input id="state" {...register('state')} disabled={isPending} />
              {errors.state && <p className="text-sm text-destructive">{errors.state.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input id="country" {...register('country')} disabled={isPending} />
              {errors.country && <p className="text-sm text-destructive">{errors.country.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="postalCode">Postal Code</Label>
              <Input id="postalCode" {...register('postalCode')} disabled={isPending} />
              {errors.postalCode && <p className="text-sm text-destructive">{errors.postalCode.message}</p>}
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
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={isPending}>
          {isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
          {isPending ? 'Saving...' : defaultValues ? 'Update Warehouse' : 'Create Warehouse'}
        </Button>
        <Button type="button" variant="outline" onClick={() => window.history.back()} disabled={isPending}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
