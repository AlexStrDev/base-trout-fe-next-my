'use client';

import { useFarmSummary } from '@/hooks/use-farms';
import { useFundosList } from '@/hooks/use-fundos';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { PageHeader } from '@/components/ui/page-header';
import { StatCard } from '@/components/ui/stat-card';
import { DataCard } from '@/components/ui/data-card';
import { EmptyState } from '@/components/ui/empty-state';
import { ModalTrigger } from '@/components/ui/modal-trigger';
import { CreateFundoForm } from '@/components/forms/create-fundo-form';
import { Pagination } from '@/components/ui/pagination';
import { formatDate, formatNumber } from '@/lib/utils';
import { Layers, Fish, Calendar } from 'lucide-react';
import type { FarmSummary, PaginatedResult, FundoItem } from '@/lib/types';

interface Props {
  userId: string;
  farmId: string;
  page: number;
  initialFarm: FarmSummary;
  initialFundos: PaginatedResult<FundoItem>;
}

export function FarmDetailView({ userId, farmId, page, initialFarm, initialFundos }: Props) {
  const { data: farm = initialFarm } = useFarmSummary(userId, farmId, initialFarm);
  const { data: fundos = initialFundos } = useFundosList(userId, farmId, page, initialFundos);

  return (
    <div className="space-y-8">
      <Breadcrumbs
        items={[
          { label: 'Granjas', href: '/' },
          { label: farm.name },
        ]}
      />

      <PageHeader
        title={farm.name}
        description={farm.location}
        action={
          <ModalTrigger title="Nuevo Fundo" buttonLabel="Nuevo Fundo">
            <CreateFundoForm farmId={farmId} userId={userId} />
          </ModalTrigger>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 stagger-children">
        <StatCard
          label="Fundos"
          value={formatNumber(farm.fundo_count)}
          icon={<Layers className="h-5 w-5" />}
          variant="lake"
        />
        <StatCard
          label="Sectores"
          value={formatNumber(farm.sector_count)}
          icon={<Fish className="h-5 w-5" />}
          variant="default"
        />
        <StatCard
          label="Creada"
          value={formatDate(farm.created_at)}
          icon={<Calendar className="h-5 w-5" />}
          variant="default"
        />
      </div>

      {/* Fundos */}
      <section>
        <h2 className="text-lg font-semibold font-display text-text-primary mb-4">
          Fundos
        </h2>

        {fundos.count === 0 ? (
          <EmptyState
            icon={<Layers className="h-6 w-6" />}
            title="Sin fundos"
            description="Crea el primer fundo dentro de esta granja"
          />
        ) : (
          <>
            <div className="space-y-3 stagger-children">
              {fundos.results.map((fundo) => (
                <DataCard
                  key={fundo.id}
                  href={`/farms/${farmId}/fundos/${fundo.id}`}
                  title={fundo.name}
                  stats={[
                    { label: 'Sectores', value: fundo.sector_count },
                  ]}
                />
              ))}
            </div>
            <Pagination
              page={fundos.page}
              numPages={fundos.num_pages}
              count={fundos.count}
              className="mt-6"
            />
          </>
        )}
      </section>
    </div>
  );
}
