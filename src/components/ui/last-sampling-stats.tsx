import { formatDate, formatWeight } from '@/lib/utils';
import { StatCard } from '@/components/ui/stat-card';
import { Weight, Thermometer, BarChart3 } from 'lucide-react';
import type { CohortSummary } from '@/lib/types';

interface Props {
  cohort: CohortSummary;
}

export function LastSamplingStats({ cohort }: Props) {
  if (!cohort.last_sampling_date) return null;

  return (
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
  );
}
