import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-xl border border-dashed border-border',
        'bg-surface-card/50 px-6 py-16 text-center animate-fade-in',
        className,
      )}
    >
      {icon && (
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-trout-800/60 text-trout-400">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold font-display text-text-primary">{title}</h3>
      <p className="mt-1.5 max-w-sm text-sm text-text-muted">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
