import { notFound } from 'next/navigation';
import { getFarmSummary, getFundos } from '@/lib/api';
import { formatDate, formatNumber } from '@/lib/utils';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { PageHeader } from '@/components/ui/page-header';
import { StatCard } from '@/components/ui/stat-card';
import { DataCard } from '@/components/ui/data-card';
import { EmptyState } from '@/components/ui/empty-state';
import { EntityList } from '@/components/ui/entity-list';
import { Section } from '@/components/ui/section';
import { ModalTrigger } from '@/components/ui/modal-trigger';
import { EditTrigger } from '@/components/ui/edit-trigger';
import { DeleteTrigger } from '@/components/ui/delete-trigger';
import { CreateFundoForm } from '@/components/forms/create-fundo-form';
import { EditFundoForm } from '@/components/forms/edit-fundo-form';
import { DeleteConfirmForm } from '@/components/forms/delete-confirm-form';
import { deleteFundoAction } from '@/actions/mutations';
import { Layers, Fish, Calendar } from 'lucide-react';
import type { Metadata } from 'next';

interface Props {
  params: Promise<{ farmId: string }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { farmId } = await params;
  try {
    const farm = await getFarmSummary(farmId);
    return { title: farm.name };
  } catch {
    return { title: 'Granja' };
  }
}

export default async function FarmDetailPage({ params, searchParams }: Props) {
  const { farmId } = await params;
  const { page: pageStr } = await searchParams;
  const page = Math.max(1, Number(pageStr) || 1);

  let farm;
  try {
    farm = await getFarmSummary(farmId);
  } catch {
    notFound();
  }
  const fundos = await getFundos(farmId, page);

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
            <CreateFundoForm farmId={farmId} />
          </ModalTrigger>
        }
      />
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
      {/* TODO: agregar una paginacion de fundos */}
      <Section title="Fundos">
        <EntityList
          data={fundos}
          emptyState={
            <EmptyState
              icon={<Layers className="h-6 w-6" />}
              title="Sin fundos"
              description="Crea el primer fundo dentro de esta granja"
            />
          }
          renderItem={(fundo) => (
            <div key={fundo.id} className="group/row relative flex items-center gap-2">
              <div className="min-w-0 flex-1">
                <DataCard
                  href={`/farms/${farmId}/fundos/${fundo.id}`}
                  title={fundo.name}
                  stats={[{ label: 'Sectores', value: fundo.sector_count }]}
                />
              </div>
              <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity duration-150 group-hover/row:opacity-100">
                <EditTrigger title="Editar Fundo">
                  <EditFundoForm fundo={fundo} farmId={farmId} />
                </EditTrigger>
                <DeleteTrigger title="Eliminar Fundo">
                  <DeleteConfirmForm
                    action={deleteFundoAction}
                    entityName={fundo.name}
                    entityLabel="el fundo"
                    hiddenFields={{ fundo_id: fundo.id, farm_id: farmId }}
                    warningMessage="Se eliminarán también todos los sectores y cohortes asociados."
                  />
                </DeleteTrigger>
              </div>
            </div>
          )}
        />
      </Section>
    </div>
  );
}
