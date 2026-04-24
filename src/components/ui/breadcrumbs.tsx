import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className={cn('animate-fade-in', className)}>
      <ol className="flex items-center gap-1 text-xs">
        <li>
          <Link
            href="/"
            className="flex h-6 w-6 items-center justify-center rounded-md text-text-muted transition-all duration-150 hover:bg-surface-overlay hover:text-lake-400"
          >
            <Home className="h-3.5 w-3.5" />
          </Link>
        </li>
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-1">
            <ChevronRight className="h-3 w-3 text-text-muted/35" />
            {item.href ? (
              <Link
                href={item.href}
                className="rounded-md px-1.5 py-0.5 text-text-muted transition-all duration-150 hover:bg-surface-overlay hover:text-lake-400"
              >
                {item.label}
              </Link>
            ) : (
              <span className="px-1.5 py-0.5 font-medium text-text-secondary">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
