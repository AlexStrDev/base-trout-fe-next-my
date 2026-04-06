import { notFound } from 'next/navigation';
import { getFarmSummary, getFundoSummary, getSectorSummary, getCohorts } from '@/lib/api';
import { formatDate, formatNumber } from '@/lib/utils';
import { LOTE_LABELS, STAGE_LABELS } from '@/lib/types';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { PageHeader } from '@/components/ui/page-header';
import { StatCard } from '@/components/ui/stat-card';
import { DataCard } from '@/components/ui/data-card';
import { EmptyState } from '@/components/ui/empty-state';
import { EntityList } from '@/components/ui/entity-list';
import { Section } from '@/components/ui/section';
import { StatusBadge } from '@/components/ui/badge';
import { ModalTrigger } from '@/components/ui/modal-trigger';
import { CreateCohortForm } from '@/components/forms/create-cohort-form';
import { Fish, Maximize2, Layers } from 'lucide-react';
import type { Metadata } from 'next';

interface Props {
  params: Promise<{ farmId: string; fundoId: string; sectorId: string }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { sectorId } = await params;
  try {
    const sector = await getSectorSummary(sectorId);
    return { title: sector.name };
  } catch {
    return { title: 'Sector' };
  }
}

export default async function SectorDetailPage({ params, searchParams }: Props) {
  const { farmId, fundoId, sectorId } = await params;
  const { page: pageStr } = await searchParams;
  const page = Math.max(1, Number(pageStr) || 1);

  let farm, fundo, sector;
  try {
    [farm, fundo, sector] = await Promise.all([
      getFarmSummary(farmId),
      getFundoSummary(farmId, fundoId),
      getSectorSummary(sectorId),
    ]);
  } catch {
    notFound();
  }

  const cohorts = await getCohorts(sectorId, page);

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
            <CreateCohortForm farmId={farmId} fundoId={fundoId} sectorId={sectorId} />
          </ModalTrigger>
        }
      />

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

      <Section title="Cohortes">
        <EntityList
          data={cohorts}
          emptyState={
            <EmptyState
              icon={<Fish className="h-6 w-6" />}
              title="Sin cohortes"
              description="Crea la primera cohorte de truchas en este sector"
            />
          }
          renderItem={(cohort) => (
            <DataCard
              key={cohort.id}
              href={`/farms/${farmId}/fundos/${fundoId}/sectors/${sectorId}/cohorts/${cohort.id}`}
              title={`Cohorte ${formatDate(cohort.start_date)}`}
              subtitle={`${formatNumber(cohort.initial_num)} truchas iniciales`}
              badge={<StatusBadge status={cohort.status} />}
              stats={[
                { label: 'Etapa', value: STAGE_LABELS[cohort.current_stage || ''] || '—' },
                { label: 'Muestreos', value: cohort.sampling_count },
                { label: 'Peso ini.', value: `${cohort.initial_weight_min_g}–${cohort.initial_weight_max_g}g` },
              ]}
            />
          )}
        />
      </Section>
    </div>
  );
}
