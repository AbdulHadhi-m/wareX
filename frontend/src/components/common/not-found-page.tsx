import { Link } from 'react-router-dom';
import { Home, SearchX } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function NotFoundPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <SearchX className="size-16 text-muted-foreground" />
      <div className="space-y-1">
        <h1 className="text-4xl font-bold tracking-tight">404</h1>
        <p className="text-muted-foreground">Page not found.</p>
      </div>
      <Button asChild variant="outline">
        <Link to="/">
          <Home className="size-4 mr-2" />
          Go Home
        </Link>
      </Button>
    </div>
  );
}
