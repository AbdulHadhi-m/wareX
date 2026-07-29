import { Breadcrumb } from '@/components/common/breadcrumb';
import { PageContainer } from '@/components/common/page-container';
import { PageHeader } from '@/components/common/page-header';
import { PickListForm } from '../components/pick-list-form';
import { useCreatePickList } from '../hooks/use-pick-lists';
import type { CreatePickListFormData } from '../schemas/pick-list-schema';

export function CreatePickListPage() {
  const createMutation = useCreatePickList();

  const handleSubmit = (data: CreatePickListFormData) => {
    createMutation.mutate(data);
  };

  return (
    <PageContainer>
      <Breadcrumb
        items={[
          { label: 'Pick Lists', href: '/dashboard/pick-lists' },
          { label: 'Create Pick List' },
        ]}
      />
      <PageHeader
        title="Create Pick List"
        description="Create a new picking task for warehouse workers."
      />
      <PickListForm isPending={createMutation.isPending} onSubmit={handleSubmit} />
    </PageContainer>
  );
}
