import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import {
  createUserSchema,
  type CreateUserFormData,
} from '../schemas/user-schema';
import type { AdminUser } from '../types';

interface UserFormProps {
  defaultValues?: AdminUser;
  isPending: boolean;
  onSubmit: (data: CreateUserFormData) => void;
}

const emptyDefaults: CreateUserFormData = {
  name: '',
  email: '',
  password: '',
  role: 'Manager',
};

function toFormDefaults(user?: AdminUser): CreateUserFormData {
  if (!user) return emptyDefaults;
  return {
    name: user.name,
    email: user.email,
    password: '',
    role: user.role,
  };
}

export function UserForm({ defaultValues, isPending, onSubmit }: UserFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserSchema),
    defaultValues: toFormDefaults(defaultValues),
  });

  const isEdit = !!defaultValues;

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
              <Label htmlFor="email">Email *</Label>
              <Input id="email" type="email" {...register('email')} disabled={isPending} />
              {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">
                Password {isEdit ? '(leave blank to keep current)' : '*'}
              </Label>
              <Input
                id="password"
                type="password"
                {...register('password')}
                disabled={isPending}
                placeholder={isEdit ? 'New password (optional)' : 'Minimum 8 characters'}
              />
              {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role *</Label>
              <select
                id="role"
                {...register('role')}
                disabled={isPending}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="SuperAdmin">Super Admin</option>
                <option value="Manager">Manager</option>
                <option value="Worker">Worker</option>
              </select>
              {errors.role && <p className="text-sm text-destructive">{errors.role.message}</p>}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={isPending}>
          {isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
          {isPending ? 'Saving...' : isEdit ? 'Update User' : 'Create User'}
        </Button>
        <Button type="button" variant="outline" onClick={() => window.history.back()} disabled={isPending}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
