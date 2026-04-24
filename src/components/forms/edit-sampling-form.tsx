'use client';

import { useEffect } from 'react';
import { updateSamplingAction } from '@/actions/mutations';
import { useFormAction } from '@/hooks/use-form-action';
import { InputField, TextareaField, FormAlert, WeightRangeFields } from '@/components/forms/fields';
import { SubmitButton } from '@/components/forms/submit-button';
import { useModalClose } from '@/components/ui/modal-context';
import type { SamplingItem } from '@/lib/types';

interface Props {
  sampling: SamplingItem;
  cohortId: string;
}

export function EditSamplingForm({ sampling, cohortId }: Props) {
  const onClose = useModalClose();
  const { state, formAction } = useFormAction(updateSamplingAction);

  useEffect(() => {
    if (state.success) onClose();
  }, [state.success, onClose]);

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="sampling_id" value={sampling.id} />
      <input type="hidden" name="cohort_id" value={cohortId} />
      <FormAlert error={state.error} />
      <InputField
        name="temperature_c"
        label="Temperatura del agua (°C)"
        type="number"
        step="0.1"
        min="0"
        max="30"
        defaultValue={String(sampling.temperature_c)}
        error={state.fieldErrors?.temperature_c}
        required
      />
      <InputField
        name="dead_trout"
        label="Truchas muertas"
        type="number"
        min="0"
        defaultValue={String(sampling.dead_trout)}
        error={state.fieldErrors?.dead_trout}
        required
      />
      <InputField
        name="num_sampled"
        label="Truchas muestreadas"
        type="number"
        min="1"
        defaultValue={String(sampling.num_sampled)}
        error={state.fieldErrors?.num_sampled}
        required
      />
      <WeightRangeFields
        minName="weight_min_g"
        maxName="weight_max_g"
        minLabel="Peso mínimo (g)"
        maxLabel="Peso máximo (g)"
        minDefaultValue={String(sampling.weight_min_g)}
        maxDefaultValue={String(sampling.weight_max_g)}
        minError={state.fieldErrors?.weight_min_g}
        maxError={state.fieldErrors?.weight_max_g}
      />
      <TextareaField
        name="details"
        label="Observaciones (opcional)"
        defaultValue={sampling.details ?? ''}
      />
      <div className="flex justify-end pt-2">
        <SubmitButton pendingText="Guardando...">Guardar cambios</SubmitButton>
      </div>
    </form>
  );
}
