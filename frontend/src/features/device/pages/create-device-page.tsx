import { Breadcrumb } from '@/components/common/breadcrumb';
import { PageContainer } from '@/components/common/page-container';
import { PageHeader } from '@/components/common/page-header';
import { DeviceForm } from '../components/device-form';
import { useCreateDevice } from '../hooks/use-devices';
import type { CreateDeviceFormData } from '../schemas/device-schema';

export function CreateDevicePage() {
  const createMutation = useCreateDevice();

  const handleSubmit = (data: CreateDeviceFormData) => {
    createMutation.mutate(data);
  };

  return (
    <PageContainer>
      <Breadcrumb
        items={[{ label: 'Devices', href: '/dashboard/devices' }, { label: 'Register Device' }]}
      />
      <PageHeader
        title="Register Device"
        description="Add a new device to inventory."
      />
      <DeviceForm
        isPending={createMutation.isPending}
        onSubmit={handleSubmit}
      />
    </PageContainer>
  );
}
