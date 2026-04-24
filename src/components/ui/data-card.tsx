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
        'group relative block rounded-xl border border-border bg-surface-card',
        'transition-all duration-250 ease-out',
        'hover:border-lake-700/40 hover:bg-surface-overlay',
        'hover:shadow-[0_4px_20px_rgba(0,0,0,0.2),0_0_0_1px_rgba(29,116,82,0.08)]',
        'hover:-translate-y-px',
        className,
      )}
    >
      {/* Left accent bar — slides in on hover */}
      <div className="absolute inset-y-0 left-0 w-0.5 rounded-l-xl bg-lake-600/0 transition-all duration-300 group-hover:bg-lake-600/70" />

      <div className="px-5 py-4">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2.5">
              <h3 className="truncate text-sm font-semibold font-display text-text-primary transition-colors duration-200 group-hover:text-lake-300">
                {title}
              </h3>
              {badge}
            </div>
            {subtitle && (
              <p className="mt-0.5 truncate text-xs text-text-muted">{subtitle}</p>
            )}
          </div>

          <ChevronRight className="h-4 w-4 shrink-0 text-text-muted/30 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-lake-500/70" />
        </div>

        {stats && stats.length > 0 && (
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1">
            {stats.map((s, i) => (
              <div key={s.label} className="flex items-baseline gap-1.5">
                {i > 0 && (
                  <span className="mr-1 h-3 w-px bg-border" aria-hidden />
                )}
                <span className="text-[11px] text-text-muted">{s.label}</span>
                <span className="text-sm font-bold font-display text-text-secondary tabular-nums">
                  {s.value}
                </span>
              </div>
            ))}
          </div>
        )}

        {meta && <div className="mt-3">{meta}</div>}
      </div>
    </Link>
  );
}
