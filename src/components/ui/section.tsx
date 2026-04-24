import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface SectionProps {
  title: string;
  children: ReactNode;
  className?: string;
  action?: ReactNode;
}

export function Section({ title, children, className, action }: SectionProps) {
  return (
    <section className={cn('space-y-4', className)}>
      <div className="flex items-center gap-3">
        {/* Accent line */}
        <span className="h-4 w-0.5 rounded-full bg-lake-600" aria-hidden />
        <h2 className="text-sm font-semibold uppercase tracking-widest text-text-muted">
          {title}
        </h2>
        {action && <div className="ml-auto">{action}</div>}
      </div>
      {children}
    </section>
  );
}
