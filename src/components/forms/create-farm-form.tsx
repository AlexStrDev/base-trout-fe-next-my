'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCreateFarm } from '@/hooks/use-farms';
import { getUserId } from '@/lib/utils';
import { InputField } from '@/components/forms/fields';
import { SubmitButton } from '@/components/forms/submit-button';
import { AlertCircle } from 'lucide-react';

export function CreateFarmForm() {
  const router = useRouter();
  const mutation = useCreateFarm();
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = fd.get('name')?.toString().trim() || '';
    const location = fd.get('location')?.toString().trim() || '';

    const errors: Record<string, string> = {};
    if (!name) errors.name = 'El nombre es requerido';
    if (!location) errors.location = 'La ubicación es requerida';
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});
    mutation.mutate(
      { user_id: getUserId(), name, location },
      { onSuccess: (data) => router.push(`/farms/${data.farm_id}`) },
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {mutation.isError && (
        <div className="flex items-center gap-2 rounded-lg border border-danger-600/30 bg-danger-600/10 px-4 py-3 text-sm text-danger-500">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {mutation.error?.message || 'Error al crear la granja'}
        </div>
      )}

      <InputField
        name="name"
        label="Nombre de la granja"
        placeholder="Ej: Granja Titicaca"
        error={fieldErrors.name}
        required
      />

      <InputField
        name="location"
        label="Ubicación"
        placeholder="Ej: Puno, Perú"
        error={fieldErrors.location}
        required
      />

      <div className="flex justify-end gap-3 pt-2">
        <SubmitButton isPending={mutation.isPending}>Crear Granja</SubmitButton>
      </div>
    </form>
  );
}
