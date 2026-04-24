import { notFound } from 'next/navigation';
import {
  getFarmSummary,
  getFundoSummary,
  getSectorSummary,
  getCohortSummary,
  getSamplings,
  getWeightPredictions,
} from '@/lib/api';
import { formatDate, formatNumber } from '@/lib/utils';
import { STAGE_LABELS } from '@/lib/types';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { PageHeader } from '@/components/ui/page-header';
import { StatusBadge, StageBadge } from '@/components/ui/badge';
import { WeightChart } from '@/components/ui/weight-chart';
import { CohortStats } from '@/components/ui/cohort-stats';
import { LastSamplingStats } from '@/components/ui/last-sampling-stats';
import { SamplingPanel } from '@/components/ui/sampling-panel';
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
  const page = Math.max(1, Number(pageStr) || 1);

  let farm, fundo, sector, cohort;
  try {
    [farm, fundo, sector, cohort] = await Promise.all([
      getFarmSummary(farmId),
      getFundoSummary(farmId, fundoId),
      getSectorSummary(sectorId),
      getCohortSummary(cohortId),
    ]);
  } catch {
    notFound();
  }

  const [samplings, predictions] = await Promise.all([
    getSamplings(cohortId, page, 20),
    getWeightPredictions(cohortId).catch(() => []),
  ]);

  return (
    <div className="space-y-8">
      <Breadcrumbs
        items={[
          { label: 'Granjas', href: '/' },
          { label: farm.name, href: `/farms/${farmId}` },
          { label: fundo.name, href: `/farms/${farmId}/fundos/${fundoId}` },
          { label: sector.name, href: `/farms/${farmId}/fundos/${fundoId}/sectors/${sectorId}` },
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

      <CohortStats cohort={cohort} />

      <LastSamplingStats cohort={cohort} />

      {samplings.results.length > 0 && (
        <WeightChart samplings={samplings.results} predictions={predictions} />
      )}

      <SamplingPanel cohortId={cohortId} samplings={samplings} />
    </div>
  );
}
