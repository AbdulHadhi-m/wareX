import { useParams } from 'react-router-dom';
import { Breadcrumb } from '@/components/common/breadcrumb';
import { PageContainer } from '@/components/common/page-container';
import { PageHeader } from '@/components/common/page-header';
import { LoadingSpinner } from '@/components/common/loading-spinner';
import { ErrorState } from '@/components/common/error-state';
import { ZoneForm } from '../components/zone-form';
import { useZone, useUpdateZone } from '../hooks/use-zones';
import type { CreateZoneFormData } from '../schemas/zone-schema';

export function EditZonePage() {
  const { id } = useParams<{ id: string }>();
  const { data: zone, isLoading, isError, error, refetch } = useZone(id!);
  const updateMutation = useUpdateZone(id!);

  const handleSubmit = (data: CreateZoneFormData) => {
    updateMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <PageContainer>
        <LoadingSpinner size="lg" className="py-16" />
      </PageContainer>
    );
  }

  if (isError || !zone) {
    return (
      <PageContainer>
        <ErrorState
          title="Zone not found"
          message={error?.message ?? 'Unable to load zone details.'}
          onRetry={() => refetch()}
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Breadcrumb
        items={[
          { label: 'Zones', href: '/dashboard/zones' },
          { label: zone.name, href: `/dashboard/zones/${zone.id}` },
          { label: 'Edit' },
        ]}
      />
      <PageHeader title={`Edit: ${zone.name}`} description="Update zone information." />
      <ZoneForm
        defaultValues={zone}
        isPending={updateMutation.isPending}
        onSubmit={handleSubmit}
      />
    </PageContainer>
  );
}
