import { useState } from 'react';
import {
  UserPlus,
  Play,
  CheckCircle2,
  XCircle,
  Loader2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { StatusBadge } from '@/components/common/status-badge';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/features/auth';
import {
  useAssignWorker,
  useStartPickList,
  useCompletePickList,
  useCancelPickList,
  useWorkers,
} from '../hooks/use-pick-lists';
import type { PickList, PickListPriority } from '../types';

interface PickListInfoCardProps {
  pickList: PickList;
}

const priorityVariantMap: Record<
  PickListPriority,
  'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning'
> = {
  Low: 'secondary',
  Medium: 'default',
  High: 'warning',
  Urgent: 'destructive',
};

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

export function PickListInfoCard({ pickList }: PickListInfoCardProps) {
  const { user } = useAuth();
  const isManager = user?.role === 'Manager' || user?.role === 'SuperAdmin';
  const isAssignedWorker = user?.id === pickList.workerId;
  const { data: workers = [] } = useWorkers();

  const assignedWorker = workers.find((w) => w.id === pickList.workerId);

  const [showAssign, setShowAssign] = useState(false);
  const [workerId, setWorkerId] = useState('');
  const [assignError, setAssignError] = useState('');

  const assignMutation = useAssignWorker(pickList.id);
  const startMutation = useStartPickList(pickList.id);
  const completeMutation = useCompletePickList(pickList.id);
  const cancelMutation = useCancelPickList(pickList.id);

  const handleAssign = () => {
    if (!workerId.trim()) {
      setAssignError('Please select a worker');
      return;
    }
    setAssignError('');
    assignMutation.mutate({ workerId: workerId.trim() });
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">
                {pickList.pickListNumber}
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Priority:{' '}
                <Badge
                  variant={priorityVariantMap[pickList.priority] ?? 'default'}
                  className="ml-1"
                >
                  {pickList.priority}
                </Badge>
              </p>
            </div>
            <StatusBadge status={pickList.status} />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-x-8 gap-y-1 sm:grid-cols-2">
              <InfoRow
                label="Assigned Worker"
                value={assignedWorker ? `${assignedWorker.name} (${assignedWorker.email})` : (pickList.workerId ?? 'Unassigned')}
              />
              <InfoRow label="Device Count" value={String(pickList.deviceIds.length)} />
              <InfoRow label="Created By" value={pickList.createdBy} />
              <InfoRow
                label="Created"
                value={new Date(pickList.createdAt).toLocaleDateString()}
              />
              <InfoRow
                label="Started"
                value={
                  pickList.startedAt
                    ? new Date(pickList.startedAt).toLocaleString()
                    : '-'
                }
              />
              <InfoRow
                label="Completed"
                value={
                  pickList.completedAt
                    ? new Date(pickList.completedAt).toLocaleString()
                    : '-'
                }
              />
              <div className="sm:col-span-2">
                <InfoRow label="Notes" value={pickList.notes} />
              </div>
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
            {isManager && pickList.status === 'Draft' && (
              <>
                {showAssign ? (
                  <div className="space-y-2">
                    <Label htmlFor="workerId">Select Worker</Label>
                    <select
                      id="workerId"
                      value={workerId}
                      onChange={(e) => {
                        setWorkerId(e.target.value);
                        setAssignError('');
                      }}
                      disabled={assignMutation.isPending}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <option value="">Select a worker...</option>
                      {workers.map((w) => (
                        <option key={w.id} value={w.id}>
                          {w.name} ({w.email})
                        </option>
                      ))}
                    </select>
                    {assignError && (
                      <p className="text-sm text-destructive">{assignError}</p>
                    )}
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={handleAssign}
                        disabled={assignMutation.isPending}
                      >
                        {assignMutation.isPending && (
                          <Loader2 className="mr-1 size-3 animate-spin" />
                        )}
                        Confirm
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setShowAssign(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button
                    className="w-full gap-2"
                    variant="outline"
                    onClick={() => setShowAssign(true)}
                  >
                    <UserPlus className="size-4" />
                    Assign Worker
                  </Button>
                )}
              </>
            )}

            {isManager &&
              (pickList.status === 'Assigned' || pickList.status === 'In Progress') && (
                <Button
                  className="w-full gap-2"
                  variant="destructive"
                  onClick={() => cancelMutation.mutate()}
                  disabled={cancelMutation.isPending}
                >
                  {cancelMutation.isPending ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <XCircle className="size-4" />
                  )}
                  {cancelMutation.isPending ? 'Cancelling...' : 'Cancel Pick List'}
                </Button>
              )}

            {isAssignedWorker && pickList.status === 'Assigned' && (
              <Button
                className="w-full gap-2"
                onClick={() => startMutation.mutate()}
                disabled={startMutation.isPending}
              >
                {startMutation.isPending ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Play className="size-4" />
                )}
                {startMutation.isPending ? 'Starting...' : 'Start Picking'}
              </Button>
            )}

            {isAssignedWorker && pickList.status === 'In Progress' && (
              <Button
                className="w-full gap-2"
                onClick={() => completeMutation.mutate()}
                disabled={completeMutation.isPending}
              >
                {completeMutation.isPending ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <CheckCircle2 className="size-4" />
                )}
                {completeMutation.isPending ? 'Completing...' : 'Complete Picking'}
              </Button>
            )}

            <Separator />
            <div className="space-y-1 text-sm text-muted-foreground">
              <p>
                Created: {new Date(pickList.createdAt).toLocaleDateString()}
              </p>
              <p>
                Updated: {new Date(pickList.updatedAt).toLocaleDateString()}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
