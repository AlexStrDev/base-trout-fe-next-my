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
        'flex flex-col items-center justify-center rounded-xl',
        'border border-dashed border-border/70 bg-surface-card/40',
        'px-8 py-14 text-center animate-fade-in',
        className,
      )}
    >
      {icon && (
        <div className="relative mb-5">
          {/* Glow ring */}
          <div className="absolute inset-0 rounded-full bg-trout-600/10 blur-xl animate-pulse-soft" />
          <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-surface-overlay text-trout-400 animate-float">
            {icon}
          </div>
        </div>
      )}
      <h3 className="text-base font-semibold font-display text-text-primary">{title}</h3>
      <p className="mt-2 max-w-xs text-sm text-text-muted leading-relaxed">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
