import { getFarms } from '@/lib/api';
import { formatNumber } from '@/lib/utils';
import { PageHeader } from '@/components/ui/page-header';
import { StatCard } from '@/components/ui/stat-card';
import { DataCard } from '@/components/ui/data-card';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { Section } from '@/components/ui/section';
import { Warehouse, MapPin, Fish, Plus, Layers, BarChart3, Thermometer } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard',
};

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const farms = await getFarms(1, 50);

  const totalFundos = farms.results.reduce((acc, f) => acc + f.fundo_count, 0);
  const totalSectors = farms.results.reduce((acc, f) => acc + f.sector_count, 0);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Dashboard"
        description="Vista general de tu operación acuícola"
        action={
          <Button href="/farms/new" icon={<Plus className="h-4 w-4" />}>
            Nueva Granja
          </Button>
        }
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 stagger-children">
        <StatCard
          label="Granjas"
          value={formatNumber(farms.count)}
          icon={<Warehouse className="h-5 w-5" />}
          variant="lake"
        />
        <StatCard
          label="Fundos"
          value={formatNumber(totalFundos)}
          icon={<Layers className="h-5 w-5" />}
          variant="default"
        />
        <StatCard
          label="Sectores"
          value={formatNumber(totalSectors)}
          icon={<Fish className="h-5 w-5" />}
          variant="warm"
        />
      </div>
      <div className="relative overflow-hidden rounded-xl border border-warm-700/20 bg-gradient-to-r from-warm-950/80 via-surface-card to-surface-card p-6">
        <div className="relative z-10 flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-warm-600/15 text-warm-400">
            <BarChart3 className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-base font-semibold font-display text-text-primary">
              Módulo de Predicción
            </h3>
            <p className="mt-1 text-sm text-text-muted max-w-xl leading-relaxed">
              El microservicio de análisis y predicción de crecimiento procesará los datos
              registrados aquí para generar proyecciones de peso, mortalidad y fechas
              estimadas de cosecha.
            </p>
            <div className="mt-3 flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-warm-900/40 border border-warm-700/30 px-2.5 py-0.5 text-xs font-medium text-warm-400">
                <Thermometer className="h-3 w-3" />
                Próximamente
              </span>
            </div>
          </div>
        </div>
        <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-warm-500/5 blur-2xl" />
      </div>
      <Section title="Tus Granjas">
        {farms.count === 0 ? (
          <EmptyState
            icon={<Warehouse className="h-6 w-6" />}
            title="Sin granjas aún"
            description="Crea tu primera granja para comenzar a registrar tu producción acuícola"
            action={
              <Button href="/farms/new" icon={<Plus className="h-4 w-4" />}>
                Crear Primera Granja
              </Button>
            }
          />
        ) : (
          <div className="space-y-3 stagger-children">
            {farms.results.map((farm) => (
              <DataCard
                key={farm.id}
                href={`/farms/${farm.id}`}
                title={farm.name}
                subtitle={farm.location}
                badge={
                  <span className="inline-flex items-center gap-1 text-xs text-text-muted">
                    <MapPin className="h-3 w-3" />
                  </span>
                }
                stats={[
                  { label: 'Fundos', value: farm.fundo_count },
                  { label: 'Sectores', value: farm.sector_count },
                ]}
              />
            ))}
          </div>
        )}
      </Section>
    </div>
  );
}
