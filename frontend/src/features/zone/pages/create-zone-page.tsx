import { Breadcrumb } from '@/components/common/breadcrumb';
import { PageContainer } from '@/components/common/page-container';
import { PageHeader } from '@/components/common/page-header';
import { ZoneForm } from '../components/zone-form';
import { useCreateZone } from '../hooks/use-zones';
import type { CreateZoneFormData } from '../schemas/zone-schema';

export function CreateZonePage() {
  const createMutation = useCreateZone();

  const handleSubmit = (data: CreateZoneFormData) => {
    createMutation.mutate(data);
  };

  return (
    <PageContainer>
      <Breadcrumb items={[{ label: 'Zones', href: '/zones' }, { label: 'Create Zone' }]} />
      <PageHeader title="Create Zone" description="Add a new zone to a warehouse." />
      <ZoneForm isPending={createMutation.isPending} onSubmit={handleSubmit} />
    </PageContainer>
  );
}
