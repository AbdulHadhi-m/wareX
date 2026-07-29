import { useParams } from 'react-router-dom';
import { Breadcrumb } from '@/components/common/breadcrumb';
import { PageContainer } from '@/components/common/page-container';
import { PageHeader } from '@/components/common/page-header';
import { MoveDeviceForm } from '../components/move-device-form';
import { useMoveDevice } from '../hooks/use-inventory';
import type { MoveDeviceFormData } from '../schemas/inventory-schema';

export function MoveDevicePage() {
  const { deviceId } = useParams<{ deviceId: string }>();
  const moveMutation = useMoveDevice();

  const handleSubmit = (data: MoveDeviceFormData) => {
    moveMutation.mutate(data);
  };

  return (
    <PageContainer>
      <Breadcrumb
        items={[
          { label: 'Inventory', href: '/inventory' },
          { label: 'Move Device' },
        ]}
      />
      <PageHeader
        title="Move Device"
        description="Transfer a device to a new location."
      />
      <MoveDeviceForm
        preselectedDeviceId={deviceId}
        isPending={moveMutation.isPending}
        onSubmit={handleSubmit}
      />
    </PageContainer>
  );
}
