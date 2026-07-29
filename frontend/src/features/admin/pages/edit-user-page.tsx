import { useParams } from 'react-router-dom';
import { Breadcrumb } from '@/components/common/breadcrumb';
import { PageContainer } from '@/components/common/page-container';
import { PageHeader } from '@/components/common/page-header';
import { LoadingSpinner } from '@/components/common/loading-spinner';
import { ErrorState } from '@/components/common/error-state';
import { UserForm } from '../components/user-form';
import { useAdminUser, useUpdateAdminUser } from '../hooks/use-admin-users';
import type { CreateUserFormData } from '../schemas/user-schema';

export function EditUserPage() {
  const { id } = useParams<{ id: string }>();
  const { data: user, isLoading, isError, error, refetch } = useAdminUser(id!);
  const updateMutation = useUpdateAdminUser(id!);

  const handleSubmit = (data: CreateUserFormData) => {
    const { password, ...rest } = data;
    updateMutation.mutate(password ? data : rest);
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
          { label: user.name, href: `/dashboard/admin/users/${user.id}` },
          { label: 'Edit' },
        ]}
      />
      <PageHeader
        title={`Edit: ${user.name}`}
        description="Update user information."
      />
      <UserForm
        defaultValues={user}
        isPending={updateMutation.isPending}
        onSubmit={handleSubmit}
      />
    </PageContainer>
  );
}
