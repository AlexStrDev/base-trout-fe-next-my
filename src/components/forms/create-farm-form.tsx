'use client';

import { createFarmAction } from '@/actions/mutations';
import { useFormAction } from '@/hooks/use-form-action';
import { InputField, FormAlert } from '@/components/forms/fields';
import { SubmitButton } from '@/components/forms/submit-button';

export function CreateFarmForm() {
  const { state, formAction } = useFormAction(createFarmAction);

  return (
    <form action={formAction} className="space-y-5">
      <FormAlert error={state.error} />
      <InputField
        name="name"
        label="Nombre de la granja"
        placeholder="Ej: Granja Titicaca"
        error={state.fieldErrors?.name}
        required
      />
      <InputField
        name="location"
        label="Ubicación"
        placeholder="Ej: Puno, Perú"
        error={state.fieldErrors?.location}
        required
      />
      <div className="flex justify-end gap-3 pt-2">
        <SubmitButton>Crear Granja</SubmitButton>
      </div>
    </form>
  );
}
