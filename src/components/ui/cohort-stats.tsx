import { formatNumber } from '@/lib/utils';
import { StatCard } from '@/components/ui/stat-card';
import { Fish, Skull, Heart, ClipboardList } from 'lucide-react';
import type { CohortSummary } from '@/lib/types';

interface Props {
  cohort: CohortSummary;
}

function calcSurvivalRate(cohort: CohortSummary): string {
  if (cohort.initial_num <= 0) return '—';
  return ((cohort.alive / cohort.initial_num) * 100).toFixed(1);
}

export function CohortStats({ cohort }: Props) {
  const survivalRate = calcSurvivalRate(cohort);

  return (
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
        value={survivalRate === '—' ? '—' : `${survivalRate}%`}
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
  );
}
