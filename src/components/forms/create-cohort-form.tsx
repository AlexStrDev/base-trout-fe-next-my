'use client';

import { createCohortAction } from '@/actions/mutations';
import { useFormAction } from '@/hooks/use-form-action';
import { InputField, SelectField, WeightRangeFields, FormAlert } from '@/components/forms/fields';
import { SubmitButton } from '@/components/forms/submit-button';

interface Props {
  farmId: string;
  fundoId: string;
  sectorId: string;
}

export function CreateCohortForm({ farmId, fundoId, sectorId }: Props) {
  const { state, formAction } = useFormAction(createCohortAction);

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="sector_id" value={sectorId} />
      <input type="hidden" name="farm_id" value={farmId} />
      <input type="hidden" name="fundo_id" value={fundoId} />
      <FormAlert error={state.error} />
      <InputField
        name="start_date"
        label="Fecha de inicio"
        type="date"
        error={state.fieldErrors?.start_date}
        required
      />
      <InputField
        name="initial_num"
        label="Cantidad inicial de truchas"
        type="number"
        min="1"
        placeholder="Ej: 5000"
        error={state.fieldErrors?.initial_num}
        required
      />
      <WeightRangeFields
        minName="initial_weight_min_g"
        maxName="initial_weight_max_g"
        minLabel="Peso mín. inicial (g)"
        maxLabel="Peso máx. inicial (g)"
        minPlaceholder="Ej: 1.5"
        maxPlaceholder="Ej: 3.0"
        minError={state.fieldErrors?.initial_weight_min_g}
        maxError={state.fieldErrors?.initial_weight_max_g}
      />
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
        <SubmitButton>Crear Cohorte</SubmitButton>
      </div>
    </form>
  );
}
