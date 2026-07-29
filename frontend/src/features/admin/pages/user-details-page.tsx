import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Breadcrumb } from '@/components/common/breadcrumb';
import { PageContainer } from '@/components/common/page-container';
import { LoadingSpinner } from '@/components/common/loading-spinner';
import { ErrorState } from '@/components/common/error-state';
import { ConfirmDialog } from '@/components/common/confirm-dialog';
import { UserInfoCard } from '../components/user-info-card';
import { useAdminUser, useDeleteAdminUser } from '../hooks/use-admin-users';

export function UserDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { data: user, isLoading, isError, error, refetch } = useAdminUser(id!);
  const deleteMutation = useDeleteAdminUser();
  const [showDelete, setShowDelete] = useState(false);

  const handleDelete = () => {
    deleteMutation.mutate(user!.id, {
      onSuccess: () => setShowDelete(false),
    });
  };

  if (isLoading) {
    return (
      <PageContainer>
        <LoadingSpinner size="lg" className="py-16" />
      </PageContainer>
    );
  }

  if (isError || !user) {
    return (
      <PageContainer>
        <ErrorState
          title="User not found"
          message={error?.message ?? 'Unable to load user details.'}
          onRetry={() => refetch()}
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Breadcrumb
        items={[
          { label: 'Users', href: '/dashboard/admin/users' },
          { label: user.name },
        ]}
      />
      <UserInfoCard
        user={user}
        onDelete={() => setShowDelete(true)}
        isDeleting={deleteMutation.isPending}
      />

      <ConfirmDialog
        open={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={handleDelete}
        title="Delete User"
        message={`Are you sure you want to delete "${user.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="destructive"
        loading={deleteMutation.isPending}
      />
    </PageContainer>
  );
}
