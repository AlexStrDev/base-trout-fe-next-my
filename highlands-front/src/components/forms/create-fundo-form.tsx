'use client';

import { createFundoAction } from '@/actions/mutations';
import { useFormAction } from '@/hooks/use-form-action';
import { InputField, FormAlert } from '@/components/forms/fields';
import { SubmitButton } from '@/components/forms/submit-button';

interface Props {
  farmId: string;
}

export function CreateFundoForm({ farmId }: Props) {
  const { state, formAction } = useFormAction(createFundoAction);

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="farm_id" value={farmId} />

      <FormAlert error={state.error} />

      <InputField
        name="name"
        label="Nombre del fundo"
        placeholder="Ej: Fundo Norte"
        error={state.fieldErrors?.name}
        required
      />

      <div className="flex justify-end gap-3 pt-2">
        <SubmitButton>Crear Fundo</SubmitButton>
      </div>
    </form>
  );
}
