import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface DataCardProps {
  href: string;
  title: string;
  subtitle?: string;
  meta?: ReactNode;
  badge?: ReactNode;
  stats?: { label: string; value: string | number }[];
  className?: string;
}

export function DataCard({
  href,
  title,
  subtitle,
  meta,
  badge,
  stats,
  className,
}: DataCardProps) {
  return (
    <Link
      href={href}
      className={cn(
        'group relative block rounded-xl border border-border bg-surface-card p-5',
        'transition-all duration-300 hover:border-lake-700/40 hover:bg-surface-overlay',
        'hover:shadow-lg hover:shadow-black/10',
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2.5">
            <h3 className="text-base font-semibold font-display text-text-primary group-hover:text-lake-300 transition-colors truncate">
              {title}
            </h3>
            {badge}
          </div>
          {subtitle && (
            <p className="mt-1 text-sm text-text-muted truncate">{subtitle}</p>
          )}
        </div>
        <ChevronRight className="h-5 w-5 shrink-0 text-text-muted/40 group-hover:text-lake-400 group-hover:translate-x-0.5 transition-all" />
      </div>

      {stats && stats.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1">
          {stats.map((s) => (
            <div key={s.label} className="flex items-baseline gap-1.5">
              <span className="text-xs text-text-muted">{s.label}</span>
              <span className="text-sm font-semibold font-display text-text-secondary tabular-nums">
                {s.value}
              </span>
            </div>
          ))}
        </div>
      )}

      {meta && <div className="mt-3">{meta}</div>}
    </Link>
  );
}
