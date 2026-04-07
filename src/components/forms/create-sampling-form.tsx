'use client';

import { createSamplingAction } from '@/actions/mutations';
import { useFormAction } from '@/hooks/use-form-action';
import { InputField, TextareaField, WeightRangeFields, FormAlert } from '@/components/forms/fields';
import { SubmitButton } from '@/components/forms/submit-button';

interface Props {
  cohortId: string;
}

export function CreateSamplingForm({ cohortId }: Props) {
  const { state, formAction, formRef } = useFormAction(createSamplingAction, {
    resetOnSuccess: true,
  });

  return (
    <form ref={formRef} action={formAction} className="space-y-5">
      <input type="hidden" name="cohort_id" value={cohortId} />
      <FormAlert
        error={state.error}
        success={state.success}
        successMessage="Medición registrada correctamente"
      />
      <div className="grid grid-cols-2 gap-4">
        <InputField
          name="temperature_c"
          label="Temperatura (°C)"
          type="number"
          step="0.1"
          min="0"
          max="30"
          placeholder="Ej: 13.5"
          error={state.fieldErrors?.temperature_c}
          required
        />
        <InputField
          name="dead_trout"
          label="Truchas muertas"
          type="number"
          min="0"
          placeholder="Ej: 5"
          defaultValue="0"
          error={state.fieldErrors?.dead_trout}
          required
        />
      </div>
      <InputField
        name="num_sampled"
        label="Truchas muestreadas"
        type="number"
        min="1"
        placeholder="Ej: 30"
        error={state.fieldErrors?.num_sampled}
        required
      />
      <WeightRangeFields
        minName="weight_min_g"
        maxName="weight_max_g"
        minError={state.fieldErrors?.weight_min_g}
        maxError={state.fieldErrors?.weight_max_g}
      />
      <TextareaField
        name="details"
        label="Observaciones (opcional)"
        placeholder="Ej: Se observaron truchas con buen color y actividad normal"
        error={state.fieldErrors?.details}
      />
      <div className="flex justify-end gap-3 pt-2">
        <SubmitButton pendingText="Registrando...">Registrar Medición</SubmitButton>
      </div>
    </form>
  );
}
