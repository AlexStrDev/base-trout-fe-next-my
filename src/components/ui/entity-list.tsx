import type { ReactNode } from 'react';
import type { PaginatedResult } from '@/lib/types';
import { Pagination } from './pagination';

interface EntityListProps<T extends { id: string }> {
  data: PaginatedResult<T>;
  emptyState: ReactNode;
  renderItem: (item: T) => ReactNode;
}

export function EntityList<T extends { id: string }>({
  data,
  emptyState,
  renderItem,
}: EntityListProps<T>) {
  if (data.count === 0) return <>{emptyState}</>;

  return (
    <>
      <div className="space-y-3 stagger-children">{data.results.map(renderItem)}</div>
      <Pagination
        page={data.page}
        numPages={data.num_pages}
        count={data.count}
        className="mt-6"
      />
    </>
  );
}
