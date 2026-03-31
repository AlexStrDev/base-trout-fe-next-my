import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: ReactNode;
  trend?: { value: number; label: string };
  variant?: 'default' | 'lake' | 'warm' | 'danger';
  className?: string;
}

const variantStyles = {
  default: 'border-border',
  lake: 'border-lake-700/40',
  warm: 'border-warm-700/40',
  danger: 'border-danger-600/40',
};

const iconBgStyles = {
  default: 'bg-trout-800 text-trout-300',
  lake: 'bg-lake-900/60 text-lake-400',
  warm: 'bg-warm-900/60 text-warm-400',
  danger: 'bg-danger-700/20 text-danger-500',
};

export function StatCard({
  label,
  value,
  icon,
  trend,
  variant = 'default',
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-xl border bg-surface-card p-5',
        'transition-all duration-300 hover:border-border-light hover:shadow-lg hover:shadow-black/10',
        variantStyles[variant],
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-text-muted tracking-wide uppercase">
            {label}
          </p>
          <p className="mt-2 text-2xl font-bold font-display text-text-primary tabular-nums">
            {value}
          </p>
          {trend && (
            <p
              className={cn(
                'mt-1.5 text-xs font-medium',
                trend.value >= 0 ? 'text-lake-400' : 'text-danger-500',
              )}
            >
              {trend.value >= 0 ? '↑' : '↓'} {Math.abs(trend.value)}% {trend.label}
            </p>
          )}
        </div>
        {icon && (
          <div
            className={cn(
              'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg',
              iconBgStyles[variant],
            )}
          >
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
