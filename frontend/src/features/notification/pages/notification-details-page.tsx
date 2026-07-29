import { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ExternalLink,
  Trash2,
  Loader2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Breadcrumb } from '@/components/common/breadcrumb';
import { PageContainer } from '@/components/common/page-container';
import { LoadingSpinner } from '@/components/common/loading-spinner';
import { ErrorState } from '@/components/common/error-state';
import { Separator } from '@/components/ui/separator';
import { ConfirmDialog } from '@/components/common/confirm-dialog';
import {
  useNotification,
  useMarkAsRead,
  useDeleteNotification,
} from '../hooks/use-notifications';
import { NotificationTypeIcon } from '../components/notification-type-icon';
import type { NotificationType } from '../types';

function InfoRow({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="flex justify-between gap-4 py-2">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium text-foreground text-right">
        {value ?? '-'}
      </span>
    </div>
  );
}

export function NotificationDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    data: notification,
    isLoading,
    isError,
    error,
    refetch,
  } = useNotification(id!);
  const markAsReadMutation = useMarkAsRead(id!);
  const deleteMutation = useDeleteNotification();
  const [showDelete, setShowDelete] = useState(false);

  useEffect(() => {
    if (notification && !notification.isRead) {
      markAsReadMutation.mutate();
    }
  }, [notification?.id]);

  const handleDelete = () => {
    deleteMutation.mutate(notification!.id, {
      onSuccess: () => {
        setShowDelete(false);
        navigate('/notifications', { replace: true });
      },
    });
  };

  const resourceUrl = useMemo(() => {
    if (!notification?.relatedModule || !notification?.relatedResourceId) return null;
    const module = notification.relatedModule.toLowerCase();
    if (module === 'order') return `/orders/${notification.relatedResourceId}`;
    if (module === 'picklist') return `/pick-lists/${notification.relatedResourceId}`;
    if (module === 'inventory') return `/inventory`;
    return null;
  }, [notification?.relatedModule, notification?.relatedResourceId]);

  if (isLoading) {
    return (
      <PageContainer>
        <LoadingSpinner size="lg" className="py-16" />
      </PageContainer>
    );
  }

  if (isError || !notification) {
    return (
      <PageContainer>
        <ErrorState
          title="Notification not found"
          message={error?.message ?? 'Unable to load notification details.'}
          onRetry={() => refetch()}
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Breadcrumb
        items={[
          { label: 'Notifications', href: '/notifications' },
          { label: notification.title },
        ]}
      />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center gap-3">
              <NotificationTypeIcon type={notification.type as NotificationType} />
              <div>
                <CardTitle className="text-lg">{notification.title}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {notification.type}
                  {!notification.isRead && (
                    <span className="ml-2 inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                      Unread
                    </span>
                  )}
                </p>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-foreground whitespace-pre-wrap">
                {notification.message}
              </p>
              <Separator className="my-4" />
              <div className="grid grid-cols-1 gap-x-8 gap-y-1 sm:grid-cols-2">
                <InfoRow label="Type" value={notification.type} />
                <InfoRow label="Priority" value={notification.priority} />
                <InfoRow label="Status" value={notification.isRead ? 'Read' : 'Unread'} />
                <InfoRow
                  label="Read At"
                  value={
                    notification.readAt
                      ? new Date(notification.readAt).toLocaleString()
                      : null
                  }
                />
                <InfoRow
                  label="Created"
                  value={new Date(notification.createdAt).toLocaleString()}
                />
                {notification.relatedModule && (
                  <InfoRow label="Related Module" value={notification.relatedModule} />
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {resourceUrl && (
                <Button
                  className="w-full gap-2"
                  variant="outline"
                  onClick={() => navigate(resourceUrl)}
                >
                  <ExternalLink className="size-4" />
                  View Related {notification.relatedModule}
                </Button>
              )}
              <Button
                className="w-full gap-2"
                variant="destructive"
                onClick={() => setShowDelete(true)}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Trash2 className="size-4" />
                )}
                {deleteMutation.isPending ? 'Deleting...' : 'Delete Notification'}
              </Button>
              <Separator />
              <div className="space-y-1 text-sm text-muted-foreground">
                <p>ID: {notification.id.slice(-8)}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <ConfirmDialog
        open={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={handleDelete}
        title="Delete Notification"
        message="Are you sure you want to delete this notification?"
        confirmLabel="Delete"
        variant="destructive"
        loading={deleteMutation.isPending}
      />
    </PageContainer>
  );
}
