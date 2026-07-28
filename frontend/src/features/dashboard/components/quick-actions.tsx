import { useNavigate } from 'react-router-dom';
import { Warehouse, Cpu, ArrowLeftRight, ClipboardList, ShoppingCart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/constants';

const actions = [
  { label: 'Create Warehouse', icon: <Warehouse className="size-4" />, route: ROUTES.WAREHOUSES },
  { label: 'Register Device', icon: <Cpu className="size-4" />, route: ROUTES.DEVICES },
  { label: 'Move Device', icon: <ArrowLeftRight className="size-4" />, route: ROUTES.INVENTORY },
  { label: 'Create Pick List', icon: <ClipboardList className="size-4" />, route: ROUTES.PICK_LISTS },
  { label: 'Create Order', icon: <ShoppingCart className="size-4" />, route: ROUTES.ORDERS },
];

export function QuickActions() {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-2">
        {actions.map((action) => (
          <Button
            key={action.label}
            variant="outline"
            size="sm"
            onClick={() => navigate(action.route)}
            className="gap-2"
          >
            {action.icon}
            {action.label}
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}
