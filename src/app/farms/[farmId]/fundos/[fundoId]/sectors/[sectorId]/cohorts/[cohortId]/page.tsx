export const dynamic = 'force-dynamic';

import { notFound } from 'next/navigation';
import {
  getFarmSummary,
  getFundoSummary,
  getSectorSummary,
  getCohortSummary,
  getSamplings,
} from '@/lib/api';
import { getUserId, formatDate } from '@/lib/utils';
import { CohortDetailView } from './_components/cohort-detail-view';
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

  let initialFarm, initialFundo, initialSector, initialCohort;
  try {
    [initialFarm, initialFundo, initialSector, initialCohort] = await Promise.all([
      getFarmSummary(userId, farmId),
      getFundoSummary(userId, farmId, fundoId),
      getSectorSummary(userId, sectorId),
      getCohortSummary(cohortId),
    ]);
  } catch {
    notFound();
  }

  const initialSamplings = await getSamplings(cohortId, page, 20);

  return (
    <CohortDetailView
      userId={userId}
      farmId={farmId}
      fundoId={fundoId}
      sectorId={sectorId}
      cohortId={cohortId}
      page={page}
      initialFarm={initialFarm!}
      initialFundo={initialFundo!}
      initialSector={initialSector!}
      initialCohort={initialCohort!}
      initialSamplings={initialSamplings}
    />
  );
}
