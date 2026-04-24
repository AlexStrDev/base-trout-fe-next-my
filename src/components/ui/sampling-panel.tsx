import { CreateSamplingForm } from '@/components/forms/create-sampling-form';
import { SamplingTable } from '@/components/ui/sampling-table';
import { ClipboardList, ListOrdered } from 'lucide-react';
import type { PaginatedResult, SamplingItem } from '@/lib/types';

interface Props {
  cohortId: string;
  samplings: PaginatedResult<SamplingItem>;
}

export function SamplingPanel({ cohortId, samplings }: Props) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
      {/* Form column */}
      <div className="lg:col-span-2">
        <div className="sticky top-8 rounded-xl border border-border/80 bg-surface-card overflow-hidden">
          {/* Header strip */}
          <div className="flex items-center gap-2.5 border-b border-border/60 bg-surface-overlay/30 px-5 py-4">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-lake-900/60 text-lake-400">
              <ClipboardList className="h-3.5 w-3.5" />
            </div>
            <h3 className="text-sm font-semibold font-display text-text-primary">
              Nueva Medición
            </h3>
          </div>
          <div className="p-5">
            <CreateSamplingForm cohortId={cohortId} />
          </div>
        </div>
      </div>

      {/* Table column */}
      <div className="lg:col-span-3">
        <div className="mb-4 flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-surface-overlay text-text-muted">
            <ListOrdered className="h-3.5 w-3.5" />
          </div>
          <h3 className="text-sm font-semibold font-display text-text-primary">
            Historial de Mediciones
          </h3>
          {samplings.count > 0 && (
            <span className="ml-auto rounded-full bg-surface-overlay px-2 py-0.5 text-[11px] font-medium text-text-muted">
              {samplings.count}
            </span>
          )}
        </div>
        <SamplingTable samplings={samplings} cohortId={cohortId} />
      </div>
    </div>
  );
}
