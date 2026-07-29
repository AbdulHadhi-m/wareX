import { PageContainer } from '@/components/common/page-container';
import { PageHeader } from '@/components/common/page-header';
import { AisleForm } from '../components/aisle-form';
import { useCreateAisle } from '../hooks/use-aisles';

export function CreateAislePage() {
  const { mutate: createAisle, isPending } = useCreateAisle();

  return (
    <PageContainer>
      <PageHeader title="Create Aisle" description="Add a new aisle to a warehouse zone." />
      <div className="max-w-2xl">
        <AisleForm isPending={isPending} onSubmit={createAisle} />
      </div>
    </PageContainer>
  );
}
