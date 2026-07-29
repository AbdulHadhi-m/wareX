import { Link } from 'react-router-dom';
import { Home, ShieldX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/constants';

export function AccessDeniedPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <ShieldX className="size-16 text-destructive" />
      <div className="space-y-1">
        <h1 className="text-4xl font-bold tracking-tight">403</h1>
        <p className="text-muted-foreground">Access denied.</p>
      </div>
      <Button asChild variant="outline">
        <Link to={ROUTES.DASHBOARD}>
          <Home className="size-4 mr-2" />
          Go Home
        </Link>
      </Button>
    </div>
  );
}
