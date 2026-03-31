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
      <ol className="flex items-center gap-1.5 text-sm">
        <li>
          <Link
            href="/"
            className="flex items-center text-text-muted hover:text-lake-400 transition-colors"
          >
            <Home className="h-3.5 w-3.5" />
          </Link>
        </li>
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-1.5">
            <ChevronRight className="h-3.5 w-3.5 text-text-muted/50" />
            {item.href ? (
              <Link
                href={item.href}
                className="text-text-muted hover:text-lake-400 transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-text-secondary font-medium">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
