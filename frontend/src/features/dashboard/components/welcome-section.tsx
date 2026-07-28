import { useAuth } from '@/features/auth';
import { Card, CardContent } from '@/components/ui/card';

export function WelcomeSection() {
  const { user } = useAuth();
  const now = new Date();
  const greeting =
    now.getHours() < 12 ? 'Good morning' : now.getHours() < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <Card>
      <CardContent className="flex flex-col gap-1 p-6">
        <h1 className="text-2xl font-semibold tracking-tight">
          {greeting}, {user?.name ?? 'User'}
        </h1>
        <p className="text-sm text-muted-foreground">
          Here is what is happening across your warehouses today.
        </p>
      </CardContent>
    </Card>
  );
}
