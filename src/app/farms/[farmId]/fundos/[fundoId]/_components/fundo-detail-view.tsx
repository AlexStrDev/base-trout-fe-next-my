'use client';

import { useFarmSummary } from '@/hooks/use-farms';
import { useFundoSummary } from '@/hooks/use-fundos';
import { useSectorsList } from '@/hooks/use-sectors';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { PageHeader } from '@/components/ui/page-header';
import { StatCard } from '@/components/ui/stat-card';
import { DataCard } from '@/components/ui/data-card';
import { EmptyState } from '@/components/ui/empty-state';
import { StatusBadge } from '@/components/ui/badge';
import { ModalTrigger } from '@/components/ui/modal-trigger';
import { CreateSectorForm } from '@/components/forms/create-sector-form';
import { Pagination } from '@/components/ui/pagination';
import { formatDate, formatNumber } from '@/lib/utils';
import { LOTE_LABELS } from '@/lib/types';
import { Fish, Calendar, Maximize2 } from 'lucide-react';
import type { FarmSummary, FundoSummary, PaginatedResult, SectorItem } from '@/lib/types';

interface Props {
  userId: string;
  farmId: string;
  fundoId: string;
  page: number;
  initialFarm: FarmSummary;
  initialFundo: FundoSummary;
  initialSectors: PaginatedResult<SectorItem>;
}

export function FundoDetailView({
  userId,
  farmId,
  fundoId,
  page,
  initialFarm,
  initialFundo,
  initialSectors,
}: Props) {
  const { data: farm = initialFarm } = useFarmSummary(userId, farmId, initialFarm);
  const { data: fundo = initialFundo } = useFundoSummary(userId, farmId, fundoId, initialFundo);
  const { data: sectors = initialSectors } = useSectorsList(userId, farmId, fundoId, page, initialSectors);

  return (
    <div className="space-y-8">
      <Breadcrumbs
        items={[
          { label: 'Granjas', href: '/' },
          { label: farm.name, href: `/farms/${farmId}` },
          { label: fundo.name },
        ]}
      />

      <PageHeader
        title={fundo.name}
        description={`Fundo dentro de ${farm.name}`}
        action={
          <ModalTrigger title="Nuevo Sector" buttonLabel="Nuevo Sector">
            <CreateSectorForm farmId={farmId} fundoId={fundoId} userId={userId} />
          </ModalTrigger>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 stagger-children">
        <StatCard
          label="Sectores"
          value={formatNumber(fundo.sector_count)}
          icon={<Fish className="h-5 w-5" />}
          variant="lake"
        />
        <StatCard
          label="Creado"
          value={formatDate(fundo.created_at)}
          icon={<Calendar className="h-5 w-5" />}
          variant="default"
        />
      </div>

      {/* Sectors */}
      <section>
        <h2 className="text-lg font-semibold font-display text-text-primary mb-4">
          Sectores
        </h2>

        {sectors.count === 0 ? (
          <EmptyState
            icon={<Fish className="h-6 w-6" />}
            title="Sin sectores"
            description="Crea el primer sector (jaula o poza) dentro de este fundo"
          />
        ) : (
          <>
            <div className="space-y-3 stagger-children">
              {sectors.results.map((sector) => (
                <DataCard
                  key={sector.id}
                  href={`/farms/${farmId}/fundos/${fundoId}/sectors/${sector.id}`}
                  title={sector.name}
                  subtitle={`${LOTE_LABELS[sector.type_lote] || sector.type_lote} · ${sector.area} m²`}
                  badge={<StatusBadge status={sector.status} />}
                  stats={[
                    { label: 'Cohortes', value: sector.cohort_count },
                  ]}
                  meta={
                    <div className="flex items-center gap-1 text-xs text-text-muted">
                      <Maximize2 className="h-3 w-3" />
                      {sector.area} m²
                    </div>
                  }
                />
              ))}
            </div>
            <Pagination
              page={sectors.page}
              numPages={sectors.num_pages}
              count={sectors.count}
              className="mt-6"
            />
          </>
        )}
      </section>
    </div>
  );
}
