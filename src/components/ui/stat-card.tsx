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

const variantConfig = {
  default: {
    border: 'border-border hover:border-border-light',
    accent: 'from-trout-600/30 to-trout-800/10',
    iconBg: 'bg-trout-800/60 text-trout-300',
    iconRing: 'ring-trout-700/30',
    glow: '',
  },
  lake: {
    border: 'border-lake-700/35 hover:border-lake-600/50',
    accent: 'from-lake-600/40 to-lake-800/10',
    iconBg: 'bg-lake-900/70 text-lake-400',
    iconRing: 'ring-lake-700/40',
    glow: 'hover:shadow-lake-900/30',
  },
  warm: {
    border: 'border-warm-700/35 hover:border-warm-600/50',
    accent: 'from-warm-600/40 to-warm-800/10',
    iconBg: 'bg-warm-900/70 text-warm-400',
    iconRing: 'ring-warm-700/40',
    glow: 'hover:shadow-warm-950/40',
  },
  danger: {
    border: 'border-danger-600/30 hover:border-danger-600/50',
    accent: 'from-danger-600/35 to-danger-700/5',
    iconBg: 'bg-danger-700/15 text-danger-500',
    iconRing: 'ring-danger-700/30',
    glow: 'hover:shadow-danger-950/20',
  },
};

export function StatCard({
  label,
  value,
  icon,
  trend,
  variant = 'default',
  className,
}: StatCardProps) {
  const config = variantConfig[variant];

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-xl border bg-surface-card',
        'transition-all duration-300',
        'hover:shadow-lg hover:-translate-y-px',
        config.border,
        config.glow,
        className,
      )}
    >
      {/* Top accent gradient line */}
      <div className={cn('absolute inset-x-0 top-0 h-px bg-linear-to-r', config.accent)} />

      {/* Subtle corner glow */}
      <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-white/1 blur-xl" />

      <div className="relative p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-text-muted">
              {label}
            </p>
            <p className="mt-2.5 text-2xl font-bold font-display text-text-primary tabular-nums leading-none">
              {value}
            </p>
            {trend && (
              <p
                className={cn(
                  'mt-2 flex items-center gap-1 text-xs font-medium',
                  trend.value >= 0 ? 'text-lake-400' : 'text-danger-500',
                )}
              >
                <span className="text-sm leading-none">{trend.value >= 0 ? '↑' : '↓'}</span>
                {Math.abs(trend.value)}% {trend.label}
              </p>
            )}
          </div>

          {icon && (
            <div
              className={cn(
                'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl',
                'ring-1 transition-all duration-300',
                config.iconBg,
                config.iconRing,
              )}
            >
              {icon}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
