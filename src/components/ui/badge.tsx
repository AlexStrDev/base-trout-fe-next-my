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

const variantStyles: Record<BadgeVariant, { wrap: string; dot: string }> = {
  active: {
    wrap: 'bg-lake-900/40 text-lake-300 border-lake-700/35',
    dot: 'bg-lake-400 shadow-[0_0_4px_1px_rgba(74,173,128,0.5)]',
  },
  inactive: {
    wrap: 'bg-trout-800/40 text-trout-400 border-trout-700/30',
    dot: 'bg-trout-500',
  },
  warning: {
    wrap: 'bg-warm-900/40 text-warm-400 border-warm-700/30',
    dot: 'bg-warm-400 shadow-[0_0_4px_1px_rgba(241,184,79,0.4)]',
  },
  info: {
    wrap: 'bg-blue-900/40 text-blue-300 border-blue-700/30',
    dot: 'bg-blue-400',
  },
};

interface StatusBadgeProps {
  status: string;
  className?: string;
  showDot?: boolean;
}

export function StatusBadge({ status, className, showDot = true }: StatusBadgeProps) {
  const variant = variantMap[status] || 'inactive';
  const label = STATUS_LABELS[status] || status;
  const styles = variantStyles[variant];

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium',
        styles.wrap,
        className,
      )}
    >
      {showDot && (
        <span className={cn('h-1.5 w-1.5 shrink-0 rounded-full', styles.dot)} />
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
  if (!stage) return <span className="text-xs text-text-muted">—</span>;
  const label = STAGE_LABELS[stage] || stage;

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-lg border border-trout-700/25 bg-trout-800/50',
        'px-2 py-0.5 text-xs font-medium text-trout-300',
        className,
      )}
    >
      {label}
    </span>
  );
}
