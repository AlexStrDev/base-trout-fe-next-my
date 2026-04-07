import { notFound } from 'next/navigation';
import { getFarmSummary, getFundoSummary, getSectors } from '@/lib/api';
import { formatDate, formatNumber } from '@/lib/utils';
import { LOTE_LABELS } from '@/lib/types';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { PageHeader } from '@/components/ui/page-header';
import { StatCard } from '@/components/ui/stat-card';
import { DataCard } from '@/components/ui/data-card';
import { EmptyState } from '@/components/ui/empty-state';
import { EntityList } from '@/components/ui/entity-list';
import { Section } from '@/components/ui/section';
import { StatusBadge } from '@/components/ui/badge';
import { ModalTrigger } from '@/components/ui/modal-trigger';
import { CreateSectorForm } from '@/components/forms/create-sector-form';
import { Fish, Calendar, Maximize2 } from 'lucide-react';
import type { Metadata } from 'next';

interface Props {
  params: Promise<{ farmId: string; fundoId: string }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { farmId, fundoId } = await params;
  try {
    const fundo = await getFundoSummary(farmId, fundoId);
    return { title: fundo.name };
  } catch {
    return { title: 'Fundo' };
  }
}

export default async function FundoDetailPage({ params, searchParams }: Props) {
  const { farmId, fundoId } = await params;
  const { page: pageStr } = await searchParams;
  const page = Math.max(1, Number(pageStr) || 1);
  let farm, fundo;

  try {
    [farm, fundo] = await Promise.all([
      getFarmSummary(farmId),
      getFundoSummary(farmId, fundoId),
    ]);
  } catch {
    notFound();
  }
  const sectors = await getSectors(farmId, fundoId, page);

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
            <CreateSectorForm farmId={farmId} fundoId={fundoId} />
          </ModalTrigger>
        }
      />
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
      <Section title="Sectores">
        <EntityList
          data={sectors}
          emptyState={
            <EmptyState
              icon={<Fish className="h-6 w-6" />}
              title="Sin sectores"
              description="Crea el primer sector (jaula o poza) dentro de este fundo"
            />
          }
          renderItem={(sector) => (
            <DataCard
              key={sector.id}
              href={`/farms/${farmId}/fundos/${fundoId}/sectors/${sector.id}`}
              title={sector.name}
              subtitle={`${LOTE_LABELS[sector.type_lote] || sector.type_lote} · ${sector.area} m²`}
              badge={<StatusBadge status={sector.status} />}
              stats={[{ label: 'Cohortes', value: sector.cohort_count }]}
              meta={
                <div className="flex items-center gap-1 text-xs text-text-muted">
                  <Maximize2 className="h-3 w-3" />
                  {sector.area} m²
                </div>
              }
            />
          )}
        />
      </Section>
    </div>
  );
}
