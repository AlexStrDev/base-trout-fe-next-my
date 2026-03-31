'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCreateCohort } from '@/hooks/use-cohorts';
import { InputField, SelectField } from '@/components/forms/fields';
import { SubmitButton } from '@/components/forms/submit-button';
import { AlertCircle } from 'lucide-react';

interface Props {
  farmId: string;
  fundoId: string;
  sectorId: string;
  userId: string;
}

export function CreateCohortForm({ farmId, fundoId, sectorId, userId }: Props) {
  const router = useRouter();
  const mutation = useCreateCohort();
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const startDate = fd.get('start_date')?.toString() || '';
    const initialNum = Number(fd.get('initial_num'));
    const weightMin = Number(fd.get('initial_weight_min_g'));
    const weightMax = Number(fd.get('initial_weight_max_g'));
    const stage = fd.get('current_stage')?.toString() || undefined;

    const errors: Record<string, string> = {};
    if (!startDate) errors.start_date = 'La fecha es requerida';
    if (!initialNum || initialNum <= 0) errors.initial_num = 'Debe ser mayor a 0';
    if (!weightMin || weightMin <= 0) errors.initial_weight_min_g = 'Debe ser mayor a 0';
    if (weightMax < weightMin) errors.initial_weight_max_g = 'Debe ser >= peso mín.';
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});
    mutation.mutate(
      {
        sector_id: sectorId,
        start_date: startDate,
        initial_num: initialNum,
        initial_weight_min_g: weightMin,
        initial_weight_max_g: weightMax,
        current_stage: stage || undefined,
      },
      {
        onSuccess: (data) =>
          router.push(
            `/farms/${farmId}/fundos/${fundoId}/sectors/${sectorId}/cohorts/${data.cohort_id}`,
          ),
      },
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {mutation.isError && (
        <div className="flex items-center gap-2 rounded-lg border border-danger-600/30 bg-danger-600/10 px-4 py-3 text-sm text-danger-500">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {mutation.error?.message || 'Error al crear la cohorte'}
        </div>
      )}

      <InputField
        name="start_date"
        label="Fecha de inicio"
        type="date"
        error={fieldErrors.start_date}
        required
      />

      <InputField
        name="initial_num"
        label="Cantidad inicial de truchas"
        type="number"
        min="1"
        placeholder="Ej: 5000"
        error={fieldErrors.initial_num}
        required
      />

      <div className="grid grid-cols-2 gap-4">
        <InputField
          name="initial_weight_min_g"
          label="Peso mín. inicial (g)"
          type="number"
          step="0.01"
          min="0.01"
          placeholder="Ej: 1.5"
          error={fieldErrors.initial_weight_min_g}
          required
        />
        <InputField
          name="initial_weight_max_g"
          label="Peso máx. inicial (g)"
          type="number"
          step="0.01"
          min="0.01"
          placeholder="Ej: 3.0"
          error={fieldErrors.initial_weight_max_g}
          required
        />
      </div>

      <SelectField
        name="current_stage"
        label="Etapa actual"
        placeholder="Seleccionar etapa"
        options={[
          { value: 'eggs', label: 'Huevos' },
          { value: 'fingerlings', label: 'Alevines' },
          { value: 'young_fish', label: 'Juveniles' },
          { value: 'fattening', label: 'Engorde' },
        ]}
      />

      <div className="flex justify-end gap-3 pt-2">
        <SubmitButton isPending={mutation.isPending}>Crear Cohorte</SubmitButton>
      </div>
    </form>
  );
}
