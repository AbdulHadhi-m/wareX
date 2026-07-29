import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

interface AppLogoProps {
  className?: string;
  variant?: 'default' | 'compact';
}

export function AppLogo({ className, variant = 'default' }: AppLogoProps) {
  return (
    <Link to="/" className={cn('flex items-center gap-2.5 group', className)}>
      <div className="size-9 rounded-full bg-[#111827] flex items-center justify-center text-white transition-transform group-hover:scale-105">
        <svg className="size-5 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
      </div>
      {variant === 'default' && (
        <span className="text-2xl font-black tracking-tight text-[#111827]">
          ware<span className="text-emerald-600">X</span>
        </span>
      )}
    </Link>
  );
}

