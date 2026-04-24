import { notFound } from 'next/navigation';
import {
  getFarmSummary,
  getFundoSummary,
  getSectorSummary,
  getCohortBySector,
  getSamplings,
  getWeightPredictions,
} from '@/lib/api';
import { formatDate, formatNumber } from '@/lib/utils';
import { LOTE_LABELS, CULTIVATION_LABELS } from '@/lib/types';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { PageHeader } from '@/components/ui/page-header';
import { StatCard } from '@/components/ui/stat-card';
import { StatusBadge, StageBadge } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/empty-state';
import { Section } from '@/components/ui/section';
import { ModalTrigger } from '@/components/ui/modal-trigger';
import { CreateCohortForm } from '@/components/forms/create-cohort-form';
import { WeightChart } from '@/components/ui/weight-chart';
import { CohortStats } from '@/components/ui/cohort-stats';
import { LastSamplingStats } from '@/components/ui/last-sampling-stats';
import { SamplingPanel } from '@/components/ui/sampling-panel';
import { Fish, Maximize2, Layers } from 'lucide-react';
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

  // Un sector tiene como máximo una cohorte — la cargamos solo si existe
  let cohort: CohortSummary | null = null;
  if (sector.cohort_id) {
    try {
      cohort = await getCohortBySector(sectorId);
    } catch {
      cohort = null;
    }
  }

  const [samplings, predictions] = cohort
    ? await Promise.all([
        getSamplings(cohort.cohort_id, page, 20),
        getWeightPredictions(cohort.cohort_id).catch(() => []),
      ])
    : [null, []];

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

      {!cohort && (
        <Section title="Cohorte">
          <EmptyState
            icon={<Fish className="h-6 w-6" />}
            title="Sin cohorte registrada"
            description="Este sector aún no tiene una cohorte. Registra la cohorte para comenzar a hacer muestreos."
          />
        </Section>
      )}

      {cohort && samplings && (
        <>
          <Section title={`Cohorte — iniciada el ${formatDate(cohort.start_date)}`}>
            <CohortStats cohort={cohort} />
          </Section>

          <LastSamplingStats cohort={cohort} />

          {samplings.results.length > 0 && (
            <WeightChart samplings={samplings.results} predictions={predictions} />
          )}

          <SamplingPanel cohortId={cohort.cohort_id} samplings={samplings} />
        </>
      )}
    </div>
  );
}
