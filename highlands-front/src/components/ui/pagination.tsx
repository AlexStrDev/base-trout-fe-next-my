'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PaginationProps {
  page: number;
  numPages: number;
  count: number;
  className?: string;
}

export function Pagination({ page, numPages, count, className }: PaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createPageURL = useCallback(
    (pageNum: number) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set('page', String(pageNum));
      return `${pathname}?${params.toString()}`;
    },
    [pathname, searchParams],
  );

  if (numPages <= 1) return null;

  return (
    <div
      className={cn(
        'flex items-center justify-between border-t border-border pt-4',
        className,
      )}
    >
      <p className="text-xs text-text-muted">
        {count} resultado{count !== 1 ? 's' : ''} · Página {page} de {numPages}
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => router.push(createPageURL(page - 1))}
          disabled={page <= 1}
          className={cn(
            'flex h-8 w-8 items-center justify-center rounded-md transition-colors',
            'hover:bg-surface-overlay text-text-muted hover:text-text-primary',
            'disabled:pointer-events-none disabled:opacity-30',
          )}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        {Array.from({ length: Math.min(numPages, 5) }, (_, i) => {
          let pageNum: number;
          if (numPages <= 5) {
            pageNum = i + 1;
          } else if (page <= 3) {
            pageNum = i + 1;
          } else if (page >= numPages - 2) {
            pageNum = numPages - 4 + i;
          } else {
            pageNum = page - 2 + i;
          }
          return (
            <button
              key={pageNum}
              onClick={() => router.push(createPageURL(pageNum))}
              className={cn(
                'flex h-8 w-8 items-center justify-center rounded-md text-xs font-medium transition-colors',
                pageNum === page
                  ? 'bg-lake-600 text-white'
                  : 'text-text-muted hover:bg-surface-overlay hover:text-text-primary',
              )}
            >
              {pageNum}
            </button>
          );
        })}
        <button
          onClick={() => router.push(createPageURL(page + 1))}
          disabled={page >= numPages}
          className={cn(
            'flex h-8 w-8 items-center justify-center rounded-md transition-colors',
            'hover:bg-surface-overlay text-text-muted hover:text-text-primary',
            'disabled:pointer-events-none disabled:opacity-30',
          )}
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
