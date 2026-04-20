'use client';

import { createSectorAction } from '@/actions/mutations';
import { useFormAction } from '@/hooks/use-form-action';
import { InputField, SelectField, FormAlert } from '@/components/forms/fields';
import { SubmitButton } from '@/components/forms/submit-button';

interface Props {
  farmId: string;
  fundoId: string;
}

export function CreateSectorForm({ farmId, fundoId }: Props) {
  const { state, formAction } = useFormAction(createSectorAction);

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="fundo_id" value={fundoId} />
      <input type="hidden" name="farm_id" value={farmId} />
      <FormAlert error={state.error} />
      <InputField
        name="name"
        label="Nombre del sector"
        placeholder="Ej: Jaula J-1 o Poza P-1"
        error={state.fieldErrors?.name}
        required
      />
      <SelectField
        name="type_cultivation"
        label="Tipo de cultivo"
        placeholder="Seleccionar tipo"
        options={[
          { value: 'ciclo_completo', label: 'Ciclo completo' },
          { value: 'por_etapa', label: 'Por etapa' },
        ]}
        error={state.fieldErrors?.type_cultivation}
        required
      />
      <SelectField
        name="type_lote"
        label="Tipo de infraestructura"
        placeholder="Seleccionar tipo"
        options={[
          { value: 'jaula', label: 'Jaula' },
          { value: 'poza', label: 'Poza' },
        ]}
        error={state.fieldErrors?.type_lote}
        required
      />
      <InputField
        name="area"
        label="Área (m²)"
        type="number"
        step="0.01"
        min="0.01"
        placeholder="Ej: 50"
        error={state.fieldErrors?.area}
        required
      />
      <div className="flex justify-end gap-3 pt-2">
        <SubmitButton>Crear Sector</SubmitButton>
      </div>
    </form>
  );
}
