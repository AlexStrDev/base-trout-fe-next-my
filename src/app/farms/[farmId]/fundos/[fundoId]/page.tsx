export const dynamic = 'force-dynamic';

import { notFound } from 'next/navigation';
import { getFarmSummary, getFundoSummary, getSectors } from '@/lib/api';
import { getUserId } from '@/lib/utils';
import { FundoDetailView } from './_components/fundo-detail-view';
import type { Metadata } from 'next';

interface Props {
  params: Promise<{ farmId: string; fundoId: string }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { farmId, fundoId } = await params;
  const userId = getUserId();
  try {
    const fundo = await getFundoSummary(userId, farmId, fundoId);
    return { title: fundo.name };
  } catch {
    return { title: 'Fundo' };
  }
}

export default async function FundoDetailPage({ params, searchParams }: Props) {
  const { farmId, fundoId } = await params;
  const { page: pageStr } = await searchParams;
  const userId = getUserId();
  const page = Math.max(1, Number(pageStr) || 1);

  let initialFarm, initialFundo;
  try {
    [initialFarm, initialFundo] = await Promise.all([
      getFarmSummary(userId, farmId),
      getFundoSummary(userId, farmId, fundoId),
    ]);
  } catch {
    notFound();
  }

  const initialSectors = await getSectors(userId, farmId, fundoId, page);

  return (
    <FundoDetailView
      userId={userId}
      farmId={farmId}
      fundoId={fundoId}
      page={page}
      initialFarm={initialFarm!}
      initialFundo={initialFundo!}
      initialSectors={initialSectors}
    />
  );
}
