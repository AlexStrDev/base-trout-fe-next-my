export const dynamic = 'force-dynamic';

import { notFound } from 'next/navigation';
import { getFarmSummary, getFundos } from '@/lib/api';
import { getUserId } from '@/lib/utils';
import { FarmDetailView } from './_components/farm-detail-view';
import type { Metadata } from 'next';

interface Props {
  params: Promise<{ farmId: string }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { farmId } = await params;
  const userId = getUserId();
  try {
    const farm = await getFarmSummary(userId, farmId);
    return { title: farm.name };
  } catch {
    return { title: 'Granja' };
  }
}

export default async function FarmDetailPage({ params, searchParams }: Props) {
  const { farmId } = await params;
  const { page: pageStr } = await searchParams;
  const userId = getUserId();
  const page = Math.max(1, Number(pageStr) || 1);

  let initialFarm;
  try {
    initialFarm = await getFarmSummary(userId, farmId);
  } catch {
    notFound();
  }

  const initialFundos = await getFundos(userId, farmId, page);

  return (
    <FarmDetailView
      userId={userId}
      farmId={farmId}
      page={page}
      initialFarm={initialFarm!}
      initialFundos={initialFundos}
    />
  );
}
