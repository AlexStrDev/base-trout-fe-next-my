import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { PageHeader } from '@/components/ui/page-header';
import { CreateFarmForm } from '@/components/forms/create-farm-form';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Nueva Granja',
};

export default function NewFarmPage() {
  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: 'Granjas', href: '/' },
          { label: 'Nueva Granja' },
        ]}
      />

      <div className="mx-auto max-w-lg">
        <PageHeader
          title="Nueva Granja"
          description="Registra una nueva granja acuícola"
        />

        <div className="mt-6 rounded-xl border border-border bg-surface-card p-6 animate-slide-up">
          <CreateFarmForm />
        </div>
      </div>
    </div>
  );
}
