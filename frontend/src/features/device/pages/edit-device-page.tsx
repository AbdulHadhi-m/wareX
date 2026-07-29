import { useParams } from 'react-router-dom';
import { Breadcrumb } from '@/components/common/breadcrumb';
import { PageContainer } from '@/components/common/page-container';
import { PageHeader } from '@/components/common/page-header';
import { LoadingSpinner } from '@/components/common/loading-spinner';
import { ErrorState } from '@/components/common/error-state';
import { DeviceForm } from '../components/device-form';
import { useDevice, useUpdateDevice } from '../hooks/use-devices';
import type { CreateDeviceFormData } from '../schemas/device-schema';

export function EditDevicePage() {
  const { id } = useParams<{ id: string }>();
  const { data: device, isLoading, isError, error, refetch } = useDevice(id!);
  const updateMutation = useUpdateDevice(id!);

  const handleSubmit = (data: CreateDeviceFormData) => {
    updateMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <PageContainer>
        <LoadingSpinner size="lg" className="py-16" />
      </PageContainer>
    );
  }

  if (isError || !device) {
    return (
      <PageContainer>
        <ErrorState
          title="Device not found"
          message={error?.message ?? 'Unable to load device details.'}
          onRetry={() => refetch()}
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Breadcrumb
        items={[
          { label: 'Devices', href: '/dashboard/devices' },
          { label: device.deviceName, href: `/dashboard/devices/${device.id}` },
          { label: 'Edit' },
        ]}
      />
      <PageHeader
        title={`Edit: ${device.deviceName}`}
        description="Update device information."
      />
      <DeviceForm
        defaultValues={device}
        isPending={updateMutation.isPending}
        onSubmit={handleSubmit}
      />
    </PageContainer>
  );
}
