export const dynamic = 'force-dynamic';

import { notFound } from 'next/navigation';
import { getFarmSummary, getFundoSummary, getSectorSummary, getCohorts } from '@/lib/api';
import { getUserId } from '@/lib/utils';
import { SectorDetailView } from './_components/sector-detail-view';
import type { Metadata } from 'next';

interface Props {
  params: Promise<{ farmId: string; fundoId: string; sectorId: string }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { sectorId } = await params;
  const userId = getUserId();
  try {
    const sector = await getSectorSummary(userId, sectorId);
    return { title: sector.name };
  } catch {
    return { title: 'Sector' };
  }
}

export default async function SectorDetailPage({ params, searchParams }: Props) {
  const { farmId, fundoId, sectorId } = await params;
  const { page: pageStr } = await searchParams;
  const userId = getUserId();
  const page = Math.max(1, Number(pageStr) || 1);

  let initialFarm, initialFundo, initialSector;
  try {
    [initialFarm, initialFundo, initialSector] = await Promise.all([
      getFarmSummary(userId, farmId),
      getFundoSummary(userId, farmId, fundoId),
      getSectorSummary(userId, sectorId),
    ]);
  } catch {
    notFound();
  }

  const initialCohorts = await getCohorts(sectorId, page);

  return (
    <SectorDetailView
      userId={userId}
      farmId={farmId}
      fundoId={fundoId}
      sectorId={sectorId}
      page={page}
      initialFarm={initialFarm!}
      initialFundo={initialFundo!}
      initialSector={initialSector!}
      initialCohorts={initialCohorts}
    />
  );
}
