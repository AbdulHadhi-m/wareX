import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Breadcrumb } from '@/components/common/breadcrumb';
import { PageContainer } from '@/components/common/page-container';
import { LoadingSpinner } from '@/components/common/loading-spinner';
import { ErrorState } from '@/components/common/error-state';
import { ConfirmDialog } from '@/components/common/confirm-dialog';
import { DeviceInfoCard } from '../components/device-info-card';
import { useDevice, useDeleteDevice } from '../hooks/use-devices';

export function DeviceDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { data: device, isLoading, isError, error, refetch } = useDevice(id!);
  const deleteMutation = useDeleteDevice();
  const [showDelete, setShowDelete] = useState(false);

  const handleDelete = () => {
    deleteMutation.mutate(device!.id, {
      onSuccess: () => setShowDelete(false),
    });
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
          { label: device.deviceName },
        ]}
      />
      <DeviceInfoCard
        device={device}
        onDelete={() => setShowDelete(true)}
        isDeleting={deleteMutation.isPending}
      />

      <ConfirmDialog
        open={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={handleDelete}
        title="Delete Device"
        message={`Are you sure you want to delete "${device.deviceName}"? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="destructive"
        loading={deleteMutation.isPending}
      />
    </PageContainer>
  );
}
