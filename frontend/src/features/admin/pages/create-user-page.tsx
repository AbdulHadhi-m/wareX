import { Breadcrumb } from '@/components/common/breadcrumb';
import { PageContainer } from '@/components/common/page-container';
import { PageHeader } from '@/components/common/page-header';
import { UserForm } from '../components/user-form';
import { useCreateAdminUser } from '../hooks/use-admin-users';
import type { CreateUserFormData } from '../schemas/user-schema';

export function CreateUserPage() {
  const createMutation = useCreateAdminUser();

  const handleSubmit = (data: CreateUserFormData) => {
    createMutation.mutate(data);
  };

  return (
    <PageContainer>
      <Breadcrumb items={[{ label: 'Users', href: '/admin/users' }, { label: 'Create User' }]} />
      <PageHeader
        title="Create User"
        description="Add a new user to the system."
      />
      <UserForm isPending={createMutation.isPending} onSubmit={handleSubmit} />
    </PageContainer>
  );
}
