import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function PageHeader({ title, description, action, className }: PageHeaderProps) {
  return (
    <div className={cn('flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between', className)}>
      <div className="animate-slide-up">
        <h1 className="text-2xl font-bold font-display text-text-primary tracking-tight">
          {title}
        </h1>
        {description && (
          <p className="mt-1 text-sm text-text-muted">{description}</p>
        )}
      </div>
      {action && <div className="mt-3 sm:mt-0 animate-fade-in">{action}</div>}
    </div>
  );
}
