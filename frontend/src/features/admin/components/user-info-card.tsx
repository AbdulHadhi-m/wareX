import { Pencil, Trash2, UserCheck, UserX } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import type { AdminUser } from '../types';
import { useUpdateAdminUser } from '../hooks/use-admin-users';

interface UserInfoCardProps {
  user: AdminUser;
  onDelete: () => void;
  isDeleting: boolean;
}

function InfoRow({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="flex justify-between gap-4 py-2">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium text-foreground text-right">{value || '-'}</span>
    </div>
  );
}

export function UserInfoCard({ user, onDelete, isDeleting }: UserInfoCardProps) {
  const navigate = useNavigate();
  const updateMutation = useUpdateAdminUser(user.id);
  const isActive = user.isActive ?? true;

  const handleToggleStatus = () => {
    updateMutation.mutate({ isActive: !isActive });
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">{user.name}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">{user.email}</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={isActive ? 'success' : 'destructive'} className="font-semibold">
                {isActive ? 'Active' : 'Suspended'}
              </Badge>
              <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                {user.role}
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-x-8 gap-y-1 sm:grid-cols-2">
              <InfoRow label="Name" value={user.name} />
              <InfoRow label="Email" value={user.email} />
              <InfoRow label="Role" value={user.role} />
              <InfoRow label="Account Access Status" value={isActive ? 'Active' : 'Suspended'} />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              className="w-full gap-2"
              variant="outline"
              onClick={() => navigate(`/dashboard/admin/users/${user.id}/edit`)}
            >
              <Pencil className="size-4" />
              Edit User
            </Button>
            <Button
              className="w-full gap-2"
              variant={isActive ? 'outline' : 'default'}
              onClick={handleToggleStatus}
              disabled={updateMutation.isPending}
            >
              {isActive ? (
                <>
                  <UserX className="size-4 text-amber-500" />
                  Suspend Account
                </>
              ) : (
                <>
                  <UserCheck className="size-4 text-emerald-500" />
                  Reactivate Account
                </>
              )}
            </Button>
            <Button
              className="w-full gap-2"
              variant="destructive"
              onClick={onDelete}
              disabled={isDeleting}
            >
              <Trash2 className="size-4" />
              {isDeleting ? 'Deleting...' : 'Delete User'}
            </Button>
            <Separator />
            <div className="space-y-1 text-sm text-muted-foreground">
              <p>Created: {new Date(user.createdAt).toLocaleDateString()}</p>
              <p>Updated: {new Date(user.updatedAt).toLocaleDateString()}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
