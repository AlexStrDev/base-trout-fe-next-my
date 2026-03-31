import { cn } from '@/lib/utils';
import { STATUS_LABELS, STAGE_LABELS } from '@/lib/types';

type BadgeVariant = 'active' | 'inactive' | 'warning' | 'info';

const variantMap: Record<string, BadgeVariant> = {
  active: 'active',
  activo: 'active',
  harvested: 'info',
  lost: 'warning',
  inactivo: 'inactive',
};

const variantStyles: Record<BadgeVariant, string> = {
  active: 'bg-lake-900/50 text-lake-300 border-lake-700/30',
  inactive: 'bg-trout-800/50 text-trout-400 border-trout-700/30',
  warning: 'bg-warm-900/50 text-warm-400 border-warm-700/30',
  info: 'bg-blue-900/50 text-blue-300 border-blue-700/30',
};

const dotStyles: Record<BadgeVariant, string> = {
  active: 'bg-lake-400',
  inactive: 'bg-trout-500',
  warning: 'bg-warm-400',
  info: 'bg-blue-400',
};

interface StatusBadgeProps {
  status: string;
  className?: string;
  showDot?: boolean;
}

export function StatusBadge({ status, className, showDot = true }: StatusBadgeProps) {
  const variant = variantMap[status] || 'inactive';
  const label = STATUS_LABELS[status] || status;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium',
        variantStyles[variant],
        className,
      )}
    >
      {showDot && (
        <span className={cn('h-1.5 w-1.5 rounded-full', dotStyles[variant])} />
      )}
      {label}
    </span>
  );
}

interface StageBadgeProps {
  stage: string | null;
  className?: string;
}

export function StageBadge({ stage, className }: StageBadgeProps) {
  if (!stage) return <span className="text-text-muted text-sm">—</span>;
  const label = STAGE_LABELS[stage] || stage;

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md bg-trout-800/60 border border-trout-700/30',
        'px-2 py-0.5 text-xs font-medium text-trout-300',
        className,
      )}
    >
      {label}
    </span>
  );
}
