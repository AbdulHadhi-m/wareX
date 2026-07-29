import { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';
import { Button, type ButtonProps } from '@/components/ui/button';

interface LoadingButtonProps extends ButtonProps {
  isLoading?: boolean;
}

const LoadingButton = forwardRef<HTMLButtonElement, LoadingButtonProps>(
  ({ isLoading, disabled, children, ...props }, ref) => {
    return (
      <Button ref={ref} disabled={disabled || isLoading} {...props}>
        {isLoading && <Loader2 className="size-4 animate-spin" />}
        {children}
      </Button>
    );
  },
);
LoadingButton.displayName = 'LoadingButton';

export { LoadingButton };
