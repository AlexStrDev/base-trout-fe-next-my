export const dynamic = 'force-dynamic';

import { getFarms } from '@/lib/api';
import { getUserId } from '@/lib/utils';
import { DashboardView } from './_components/dashboard-view';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard',
};

export default async function DashboardPage() {
  const userId = getUserId();
  const initialFarms = await getFarms(userId, 1, 50);

  return <DashboardView userId={userId} initialFarms={initialFarms} />;
}
