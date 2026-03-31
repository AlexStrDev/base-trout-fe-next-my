import { notFound } from 'next/navigation';
import {
  getFarmSummary,
  getFundoSummary,
  getSectorSummary,
  getCohortSummary,
  getSamplings,
} from '@/lib/api';
import { getUserId, formatDate, formatDateTime, formatNumber, formatWeight } from '@/lib/utils';
import { STAGE_LABELS } from '@/lib/types';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { PageHeader } from '@/components/ui/page-header';
import { StatCard } from '@/components/ui/stat-card';
import { StatusBadge, StageBadge } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/empty-state';
import { ModalTrigger } from '@/components/ui/modal-trigger';
import { CreateSamplingForm } from '@/components/forms/create-sampling-form';
import { WeightChart } from '@/components/ui/weight-chart';
import { Pagination } from '@/components/ui/pagination';
import {
  Fish,
  Skull,
  Heart,
  Thermometer,
  Weight,
  ClipboardList,
  BarChart3,
} from 'lucide-react';
import type { Metadata } from 'next';

interface Props {
  params: Promise<{
    farmId: string;
    fundoId: string;
    sectorId: string;
    cohortId: string;
  }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { cohortId } = await params;
  try {
    const cohort = await getCohortSummary(cohortId);
    return { title: `Cohorte ${formatDate(cohort.start_date)}` };
  } catch {
    return { title: 'Cohorte' };
  }
}

export default async function CohortDetailPage({ params, searchParams }: Props) {
  const { farmId, fundoId, sectorId, cohortId } = await params;
  const { page: pageStr } = await searchParams;
  const userId = getUserId();
  const page = Math.max(1, Number(pageStr) || 1);

  let farm, fundo, sector, cohort;
  try {
    [farm, fundo, sector, cohort] = await Promise.all([
      getFarmSummary(userId, farmId),
      getFundoSummary(userId, farmId, fundoId),
      getSectorSummary(userId, sectorId),
      getCohortSummary(cohortId),
    ]);
  } catch {
    notFound();
  }

  const samplings = await getSamplings(cohortId, page, 20);
  const survivalRate =
    cohort.initial_num > 0
      ? ((cohort.alive / cohort.initial_num) * 100).toFixed(1)
      : '—';

  return (
    <div className="space-y-8">
      <Breadcrumbs
        items={[
          { label: 'Granjas', href: '/' },
          { label: farm.name, href: `/farms/${farmId}` },
          { label: fundo.name, href: `/farms/${farmId}/fundos/${fundoId}` },
          {
            label: sector.name,
            href: `/farms/${farmId}/fundos/${fundoId}/sectors/${sectorId}`,
          },
          { label: `Cohorte ${formatDate(cohort.start_date)}` },
        ]}
      />

      <PageHeader
        title={`Cohorte — ${formatDate(cohort.start_date)}`}
        description={`${formatNumber(cohort.initial_num)} truchas · ${STAGE_LABELS[cohort.current_stage || ''] || 'Sin etapa'}`}
        action={
          <div className="flex items-center gap-3">
            <StatusBadge status={cohort.status} />
            <StageBadge stage={cohort.current_stage} />
          </div>
        }
      />

      {/* Key metrics */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 stagger-children">
        <StatCard
          label="Vivas"
          value={formatNumber(cohort.alive)}
          icon={<Heart className="h-5 w-5" />}
          variant="lake"
        />
        <StatCard
          label="Muertas"
          value={formatNumber(cohort.total_dead)}
          icon={<Skull className="h-5 w-5" />}
          variant="danger"
        />
        <StatCard
          label="Supervivencia"
          value={`${survivalRate}%`}
          icon={<Fish className="h-5 w-5" />}
          variant={Number(survivalRate) > 90 ? 'lake' : 'warm'}
        />
        <StatCard
          label="Muestreos"
          value={cohort.sampling_count}
          icon={<ClipboardList className="h-5 w-5" />}
          variant="default"
        />
      </div>

      {/* Last measurement quick view */}
      {cohort.last_sampling_date && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 stagger-children">
          <StatCard
            label="Último peso prom."
            value={cohort.last_weight_average_g ? formatWeight(cohort.last_weight_average_g) : '—'}
            icon={<Weight className="h-5 w-5" />}
            variant="lake"
          />
          <StatCard
            label="Última temperatura"
            value={cohort.last_temperature_c ? `${cohort.last_temperature_c} °C` : '—'}
            icon={<Thermometer className="h-5 w-5" />}
            variant="default"
          />
          <StatCard
            label="Último muestreo"
            value={formatDate(cohort.last_sampling_date)}
            icon={<BarChart3 className="h-5 w-5" />}
            variant="default"
          />
        </div>
      )}

      {/* Weight Chart */}
      {samplings.results.length > 0 && (
        <WeightChart samplings={samplings.results} />
      )}

      {/* New sampling form + table */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
        {/* Sampling form */}
        <div className="lg:col-span-2">
          <div className="rounded-xl border border-border bg-surface-card p-6 sticky top-8">
            <h3 className="text-base font-semibold font-display text-text-primary mb-5 flex items-center gap-2">
              <ClipboardList className="h-4.5 w-4.5 text-lake-400" />
              Nueva Medición
            </h3>
            <CreateSamplingForm cohortId={cohortId} />
          </div>
        </div>

        {/* Samplings list */}
        <div className="lg:col-span-3">
          <h3 className="text-base font-semibold font-display text-text-primary mb-4">
            Historial de Mediciones
          </h3>

          {samplings.count === 0 ? (
            <EmptyState
              icon={<ClipboardList className="h-6 w-6" />}
              title="Sin mediciones"
              description="Registra la primera medición para esta cohorte"
            />
          ) : (
            <>
              {/* Table */}
              <div className="overflow-x-auto rounded-xl border border-border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-surface-overlay/50">
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-muted">
                        Fecha
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-text-muted">
                        Temp.
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-text-muted">
                        Muertas
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-text-muted">
                        Peso prom.
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-text-muted">
                        Rango
                      </th>
                      <th className="hidden sm:table-cell px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-muted">
                        Notas
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {samplings.results.map((s) => (
                      <tr
                        key={s.id}
                        className="hover:bg-surface-overlay/30 transition-colors"
                      >
                        <td className="px-4 py-3 text-text-secondary whitespace-nowrap">
                          {formatDateTime(s.timestamps)}
                        </td>
                        <td className="px-4 py-3 text-right font-mono text-text-secondary tabular-nums">
                          {s.temperature_c}°C
                        </td>
                        <td className="px-4 py-3 text-right font-mono tabular-nums">
                          <span
                            className={
                              s.dead_trout > 0 ? 'text-danger-500' : 'text-text-muted'
                            }
                          >
                            {s.dead_trout}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right font-mono text-lake-300 font-medium tabular-nums">
                          {formatWeight(s.weight_average_g)}
                        </td>
                        <td className="px-4 py-3 text-right font-mono text-text-muted text-xs tabular-nums">
                          {s.weight_min_g}–{s.weight_max_g}g
                        </td>
                        <td className="hidden sm:table-cell px-4 py-3 text-text-muted text-xs max-w-48 truncate">
                          {s.details || '—'}
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
                className="mt-6"
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
