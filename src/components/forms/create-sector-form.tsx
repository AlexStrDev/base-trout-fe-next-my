'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCreateSector } from '@/hooks/use-sectors';
import { InputField, SelectField } from '@/components/forms/fields';
import { SubmitButton } from '@/components/forms/submit-button';
import { AlertCircle } from 'lucide-react';

interface Props {
  farmId: string;
  fundoId: string;
  userId: string;
}

export function CreateSectorForm({ farmId, fundoId, userId }: Props) {
  const router = useRouter();
  const mutation = useCreateSector();
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = fd.get('name')?.toString().trim() || '';
    const typeLote = fd.get('type_lote')?.toString() || '';
    const area = Number(fd.get('area'));

    const errors: Record<string, string> = {};
    if (!name) errors.name = 'El nombre es requerido';
    if (!typeLote) errors.type_lote = 'El tipo es requerido';
    if (!area || area <= 0) errors.area = 'El área debe ser mayor a 0';
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});
    mutation.mutate(
      { fundo_id: fundoId, name, type_cultivation: 'trout', type_lote: typeLote, area },
      {
        onSuccess: (data) =>
          router.push(`/farms/${farmId}/fundos/${fundoId}/sectors/${data.sector_id}`),
      },
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {mutation.isError && (
        <div className="flex items-center gap-2 rounded-lg border border-danger-600/30 bg-danger-600/10 px-4 py-3 text-sm text-danger-500">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {mutation.error?.message || 'Error al crear el sector'}
        </div>
      )}

      <InputField
        name="name"
        label="Nombre del sector"
        placeholder="Ej: Jaula J-1 o Poza P-1"
        error={fieldErrors.name}
        required
      />

      <SelectField
        name="type_lote"
        label="Tipo de infraestructura"
        placeholder="Seleccionar tipo"
        options={[
          { value: 'cage', label: 'Jaula' },
          { value: 'pool', label: 'Poza' },
        ]}
        error={fieldErrors.type_lote}
        required
      />

      <InputField
        name="area"
        label="Área (m²)"
        type="number"
        step="0.01"
        min="0.01"
        placeholder="Ej: 50"
        error={fieldErrors.area}
        required
      />

      <div className="flex justify-end gap-3 pt-2">
        <SubmitButton isPending={mutation.isPending}>Crear Sector</SubmitButton>
      </div>
    </form>
  );
}
