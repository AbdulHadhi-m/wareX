import { Pencil, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import type { AdminUser } from '../types';

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

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">{user.name}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">{user.email}</p>
            </div>
            <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
              {user.role}
            </span>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-x-8 gap-y-1 sm:grid-cols-2">
              <InfoRow label="Name" value={user.name} />
              <InfoRow label="Email" value={user.email} />
              <InfoRow label="Role" value={user.role} />
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
              onClick={() => navigate(`/admin/users/${user.id}/edit`)}
            >
              <Pencil className="size-4" />
              Edit User
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
