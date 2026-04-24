import { formatDateTime, formatWeight } from '@/lib/utils';
import { Pagination } from '@/components/ui/pagination';
import { EmptyState } from '@/components/ui/empty-state';
import { ClipboardList, Thermometer } from 'lucide-react';
import type { PaginatedResult, SamplingItem } from '@/lib/types';

interface Props {
  samplings: PaginatedResult<SamplingItem>;
}

export function SamplingTable({ samplings }: Props) {
  if (samplings.count === 0) {
    return (
      <EmptyState
        icon={<ClipboardList className="h-6 w-6" />}
        title="Sin mediciones"
        description="Registra la primera medición para comenzar el historial de esta cohorte"
      />
    );
  }

  return (
    <>
      <div className="overflow-x-auto rounded-xl border border-border/80">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/80 bg-surface-overlay/40">
              <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-widest text-text-muted">
                Fecha
              </th>
              <th className="px-4 py-3 text-right text-[10px] font-semibold uppercase tracking-widest text-text-muted">
                Temp.
              </th>
              <th className="px-4 py-3 text-right text-[10px] font-semibold uppercase tracking-widest text-text-muted">
                Muertas
              </th>
              <th className="px-4 py-3 text-right text-[10px] font-semibold uppercase tracking-widest text-text-muted">
                Peso prom.
              </th>
              <th className="px-4 py-3 text-right text-[10px] font-semibold uppercase tracking-widest text-text-muted">
                Rango
              </th>
              <th className="hidden sm:table-cell px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-widest text-text-muted">
                Notas
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {samplings.results.map((s, i) => (
              <tr
                key={s.id}
                className="group transition-colors duration-150 hover:bg-surface-overlay/40"
                style={{ animationDelay: `${i * 30}ms` }}
              >
                <td className="whitespace-nowrap px-4 py-3 text-xs text-text-muted">
                  {formatDateTime(s.timestamps)}
                </td>
                <td className="px-4 py-3 text-right">
                  <span className="inline-flex items-center gap-0.5 font-mono text-xs tabular-nums text-text-secondary">
                    <Thermometer className="h-3 w-3 text-text-muted/60" />
                    {s.temperature_c}°C
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <span
                    className={
                      s.dead_trout > 0
                        ? 'inline-flex items-center justify-center rounded-md bg-danger-600/10 px-2 py-0.5 font-mono text-xs font-medium tabular-nums text-danger-500'
                        : 'font-mono text-xs tabular-nums text-text-muted/60'
                    }
                  >
                    {s.dead_trout}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <span className="font-mono text-sm font-semibold tabular-nums text-lake-300">
                    {formatWeight(s.weight_average_g)}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <span className="font-mono text-[11px] tabular-nums text-text-muted">
                    {s.weight_min_g}–{s.weight_max_g}g
                  </span>
                </td>
                <td className="hidden max-w-48 truncate px-4 py-3 text-xs text-text-muted sm:table-cell">
                  {s.details ? (
                    <span className="italic">{s.details}</span>
                  ) : (
                    <span className="opacity-30">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination
        page={samplings.page}
        numPages={samplings.num_pages}
        count={samplings.count}
        className="mt-4"
      />
    </>
  );
}
