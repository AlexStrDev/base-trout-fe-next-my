'use client';

import { useEffect } from 'react';
import { updateCohortAction } from '@/actions/mutations';
import { useFormAction } from '@/hooks/use-form-action';
import { InputField, SelectField, FormAlert } from '@/components/forms/fields';
import { SubmitButton } from '@/components/forms/submit-button';
import { WeightRangeFields } from '@/components/forms/fields';
import { useModalClose } from '@/components/ui/modal-context';
import type { CohortSummary } from '@/lib/types';

interface Props {
  cohort: CohortSummary;
  sectorId: string;
}

export function EditCohortForm({ cohort, sectorId }: Props) {
  const onClose = useModalClose();
  const { state, formAction } = useFormAction(updateCohortAction);

  useEffect(() => {
    if (state.success) onClose();
  }, [state.success, onClose]);

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="cohort_id" value={cohort.cohort_id} />
      <input type="hidden" name="sector_id" value={sectorId} />
      <FormAlert error={state.error} />
      <InputField
        name="start_date"
        label="Fecha de inicio"
        type="date"
        defaultValue={cohort.start_date}
        error={state.fieldErrors?.start_date}
        required
      />
      <InputField
        name="initial_num"
        label="Número inicial de truchas"
        type="number"
        min="1"
        defaultValue={String(cohort.initial_num)}
        error={state.fieldErrors?.initial_num}
        required
      />
      <WeightRangeFields
        minName="initial_weight_min_g"
        maxName="initial_weight_max_g"
        minLabel="Peso mín. inicial (g)"
        maxLabel="Peso máx. inicial (g)"
        minDefaultValue={String(cohort.initial_weight_min_g)}
        maxDefaultValue={String(cohort.initial_weight_max_g)}
        minError={state.fieldErrors?.initial_weight_min_g}
        maxError={state.fieldErrors?.initial_weight_max_g}
      />
      <SelectField
        name="current_stage"
        label="Etapa actual"
        defaultValue={cohort.current_stage ?? ''}
        placeholder="Sin etapa definida"
        options={[
          { value: 'eggs', label: 'Huevos' },
          { value: 'fingerlings', label: 'Alevines' },
          { value: 'young_fish', label: 'Juveniles' },
          { value: 'fattening', label: 'Engorde' },
        ]}
      />
      <SelectField
        name="status"
        label="Estado de la cohorte"
        defaultValue={cohort.status}
        options={[
          { value: 'active', label: 'Activa' },
          { value: 'harvested', label: 'Cosechada' },
          { value: 'lost', label: 'Perdida' },
        ]}
        required
      />
      <div className="flex justify-end pt-2">
        <SubmitButton pendingText="Guardando...">Guardar cambios</SubmitButton>
      </div>
    </form>
  );
}
