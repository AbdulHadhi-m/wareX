import { Breadcrumb } from '@/components/common/breadcrumb';
import { PageContainer } from '@/components/common/page-container';
import { PageHeader } from '@/components/common/page-header';
import { BinForm } from '../components/bin-form';
import { useCreateBin } from '../hooks/use-bins';
import type { CreateBinFormData } from '../schemas/bin-schema';

export function CreateBinPage() {
  const createMutation = useCreateBin();

  const handleSubmit = (data: CreateBinFormData) => {
    createMutation.mutate(data);
  };

  return (
    <PageContainer>
      <Breadcrumb
        items={[{ label: 'Bins', href: '/dashboard/bins' }, { label: 'Create Bin' }]}
      />
      <PageHeader title="Create Bin" description="Add a new storage bin." />
      <BinForm isPending={createMutation.isPending} onSubmit={handleSubmit} />
    </PageContainer>
  );
}
