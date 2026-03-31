'use client';

import { useFarmSummary } from '@/hooks/use-farms';
import { useFundoSummary } from '@/hooks/use-fundos';
import { useSectorSummary } from '@/hooks/use-sectors';
import { useCohortsList } from '@/hooks/use-cohorts';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { PageHeader } from '@/components/ui/page-header';
import { StatCard } from '@/components/ui/stat-card';
import { DataCard } from '@/components/ui/data-card';
import { EmptyState } from '@/components/ui/empty-state';
import { StatusBadge, StageBadge } from '@/components/ui/badge';
import { ModalTrigger } from '@/components/ui/modal-trigger';
import { CreateCohortForm } from '@/components/forms/create-cohort-form';
import { Pagination } from '@/components/ui/pagination';
import { formatDate, formatNumber } from '@/lib/utils';
import { LOTE_LABELS, STAGE_LABELS } from '@/lib/types';
import { Fish, Maximize2, Calendar, Layers } from 'lucide-react';
import type {
  FarmSummary,
  FundoSummary,
  SectorSummary,
  PaginatedResult,
  CohortItem,
} from '@/lib/types';

interface Props {
  userId: string;
  farmId: string;
  fundoId: string;
  sectorId: string;
  page: number;
  initialFarm: FarmSummary;
  initialFundo: FundoSummary;
  initialSector: SectorSummary;
  initialCohorts: PaginatedResult<CohortItem>;
}

export function SectorDetailView({
  userId,
  farmId,
  fundoId,
  sectorId,
  page,
  initialFarm,
  initialFundo,
  initialSector,
  initialCohorts,
}: Props) {
  const { data: farm = initialFarm } = useFarmSummary(userId, farmId, initialFarm);
  const { data: fundo = initialFundo } = useFundoSummary(userId, farmId, fundoId, initialFundo);
  const { data: sector = initialSector } = useSectorSummary(userId, sectorId, initialSector);
  const { data: cohorts = initialCohorts } = useCohortsList(sectorId, page, initialCohorts);

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
        description={`${LOTE_LABELS[sector.type_lote] || sector.type_lote} · ${sector.area} m²`}
        action={
          <ModalTrigger title="Nueva Cohorte" buttonLabel="Nueva Cohorte">
            <CreateCohortForm
              farmId={farmId}
              fundoId={fundoId}
              sectorId={sectorId}
              userId={userId}
            />
          </ModalTrigger>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 stagger-children">
        <StatCard
          label="Cohortes"
          value={formatNumber(sector.cohort_count)}
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

      {/* Cohorts */}
      <section>
        <h2 className="text-lg font-semibold font-display text-text-primary mb-4">
          Cohortes
        </h2>

        {cohorts.count === 0 ? (
          <EmptyState
            icon={<Fish className="h-6 w-6" />}
            title="Sin cohortes"
            description="Crea la primera cohorte de truchas en este sector"
          />
        ) : (
          <>
            <div className="space-y-3 stagger-children">
              {cohorts.results.map((cohort) => (
                <DataCard
                  key={cohort.id}
                  href={`/farms/${farmId}/fundos/${fundoId}/sectors/${sectorId}/cohorts/${cohort.id}`}
                  title={`Cohorte ${formatDate(cohort.start_date)}`}
                  subtitle={`${formatNumber(cohort.initial_num)} truchas iniciales`}
                  badge={<StatusBadge status={cohort.status} />}
                  stats={[
                    {
                      label: 'Etapa',
                      value: STAGE_LABELS[cohort.current_stage || ''] || '—',
                    },
                    { label: 'Muestreos', value: cohort.sampling_count },
                    {
                      label: 'Peso ini.',
                      value: `${cohort.initial_weight_min_g}–${cohort.initial_weight_max_g}g`,
                    },
                  ]}
                />
              ))}
            </div>
            <Pagination
              page={cohorts.page}
              numPages={cohorts.num_pages}
              count={cohorts.count}
              className="mt-6"
            />
          </>
        )}
      </section>
    </div>
  );
}
