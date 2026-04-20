import { notFound } from 'next/navigation';
import {
  getFarmSummary,
  getFundoSummary,
  getSectorSummary,
  getCohortBySector,
  getSamplings,
} from '@/lib/api';
import { formatDate, formatDateTime, formatNumber, formatWeight } from '@/lib/utils';
import { LOTE_LABELS, CULTIVATION_LABELS } from '@/lib/types';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { PageHeader } from '@/components/ui/page-header';
import { StatCard } from '@/components/ui/stat-card';
import { StatusBadge, StageBadge } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/empty-state';
import { Section } from '@/components/ui/section';
import { ModalTrigger } from '@/components/ui/modal-trigger';
import { CreateCohortForm } from '@/components/forms/create-cohort-form';
import { CreateSamplingForm } from '@/components/forms/create-sampling-form';
import { WeightChart } from '@/components/ui/weight-chart';
import { Pagination } from '@/components/ui/pagination';
import {
  Fish,
  Maximize2,
  Layers,
  Skull,
  Heart,
  Thermometer,
  Weight,
  ClipboardList,
  BarChart3,
} from 'lucide-react';
import type { Metadata } from 'next';
import type { CohortSummary } from '@/lib/types';

interface Props {
  params: Promise<{ farmId: string; fundoId: string; sectorId: string }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { sectorId } = await params;
  try {
    const sector = await getSectorSummary(sectorId);
    return { title: sector.name };
  } catch {
    return { title: 'Sector' };
  }
}

export default async function SectorDetailPage({ params, searchParams }: Props) {
  const { farmId, fundoId, sectorId } = await params;
  const { page: pageStr } = await searchParams;
  const page = Math.max(1, Number(pageStr) || 1);

  let farm, fundo, sector;
  try {
    [farm, fundo, sector] = await Promise.all([
      getFarmSummary(farmId),
      getFundoSummary(farmId, fundoId),
      getSectorSummary(sectorId),
    ]);
  } catch {
    notFound();
  }

  // El sector tiene como máximo un cohorte — lo cargamos si existe
  let cohort: CohortSummary | null = null;
  if (sector.cohort_id) {
    try {
      cohort = await getCohortBySector(sectorId);
    } catch {
      cohort = null;
    }
  }

  const samplings = cohort ? await getSamplings(cohort.cohort_id, page, 20) : null;

  const survivalRate =
    cohort && cohort.initial_num > 0
      ? ((cohort.alive / cohort.initial_num) * 100).toFixed(1)
      : '—';

  const cultivationLabel = CULTIVATION_LABELS[sector.type_cultivation] || sector.type_cultivation;
  const loteLabel = LOTE_LABELS[sector.type_lote] || sector.type_lote;

  return (
    <div className="space-y-8">
      <Breadcrumbs
        items={[
          { label: 'Granjas', href: '/' },
          { label: farm.name, href: `/farms/${farmId}` },
          { label: fundo.name, href: `/farms/${farmId}/fundos/${fundoId}` },
          { label: sector.name },
        ]}
      />

      <PageHeader
        title={sector.name}
        description={`${loteLabel} · ${cultivationLabel} · ${sector.area} m²`}
        action={
          !cohort ? (
            <ModalTrigger title="Registrar Cohorte" buttonLabel="Registrar Cohorte">
              <CreateCohortForm farmId={farmId} fundoId={fundoId} sectorId={sectorId} />
            </ModalTrigger>
          ) : (
            <div className="flex items-center gap-3">
              <StatusBadge status={cohort.status} />
              <StageBadge stage={cohort.current_stage} />
            </div>
          )
        }
      />

      {/* Sector info */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 stagger-children">
        <StatCard
          label="Tipo de lote"
          value={loteLabel}
          icon={<Layers className="h-5 w-5" />}
          variant="lake"
        />
        <StatCard
          label="Área"
          value={`${sector.area} m²`}
          icon={<Maximize2 className="h-5 w-5" />}
          variant="default"
        />
        <StatCard
          label="Estado"
          value={sector.status === 'activo' ? 'Activo' : 'Inactivo'}
          icon={<Fish className="h-5 w-5" />}
          variant={sector.status === 'activo' ? 'lake' : 'default'}
        />
      </div>

      {/* Sin cohorte */}
      {!cohort && (
        <Section title="Cohorte">
          <EmptyState
            icon={<Fish className="h-6 w-6" />}
            title="Sin cohorte registrada"
            description="Este sector aún no tiene una cohorte. Registra la cohorte para comenzar a hacer muestreos."
          />
        </Section>
      )}

      {/* Con cohorte: mostrar datos del cohorte directamente en la página del sector */}
      {cohort && (
        <>
          {/* Info de la cohorte */}
          <Section title={`Cohorte — iniciada el ${formatDate(cohort.start_date)}`}>
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
          </Section>

          {/* Últimas mediciones */}
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

          {/* Gráfico */}
          {samplings && samplings.results.length > 0 && (
            <WeightChart samplings={samplings.results} />
          )}

          {/* Formulario de muestreo + historial */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
            <div className="lg:col-span-2">
              <div className="rounded-xl border border-border bg-surface-card p-6 sticky top-8">
                <h3 className="text-base font-semibold font-display text-text-primary mb-5 flex items-center gap-2">
                  <ClipboardList className="h-4.5 w-4.5 text-lake-400" />
                  Nueva Medición
                </h3>
                <CreateSamplingForm cohortId={cohort.cohort_id} />
              </div>
            </div>

            <div className="lg:col-span-3">
              <h3 className="text-base font-semibold font-display text-text-primary mb-4">
                Historial de Mediciones
              </h3>

              {samplings && samplings.count === 0 ? (
                <EmptyState
                  icon={<ClipboardList className="h-6 w-6" />}
                  title="Sin mediciones"
                  description="Registra la primera medición para esta cohorte"
                />
              ) : samplings ? (
                <>
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
                              <span className={s.dead_trout > 0 ? 'text-danger-500' : 'text-text-muted'}>
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
              ) : null}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
