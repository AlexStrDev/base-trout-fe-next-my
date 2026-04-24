'use client';

import { useEffect } from 'react';
import { updateFarmAction } from '@/actions/mutations';
import { useFormAction } from '@/hooks/use-form-action';
import { InputField, FormAlert } from '@/components/forms/fields';
import { SubmitButton } from '@/components/forms/submit-button';
import { useModalClose } from '@/components/ui/modal-context';
import type { FarmItem } from '@/lib/types';

interface Props {
  farm: FarmItem;
}

export function EditFarmForm({ farm }: Props) {
  const onClose = useModalClose();
  const { state, formAction } = useFormAction(updateFarmAction);

  useEffect(() => {
    if (state.success) onClose();
  }, [state.success, onClose]);

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="farm_id" value={farm.id} />
      <FormAlert error={state.error} />
      <InputField
        name="name"
        label="Nombre de la granja"
        defaultValue={farm.name}
        error={state.fieldErrors?.name}
        required
      />
      <InputField
        name="location"
        label="Ubicación"
        defaultValue={farm.location}
        error={state.fieldErrors?.location}
        required
      />
      <div className="flex justify-end pt-2">
        <SubmitButton pendingText="Guardando...">Guardar cambios</SubmitButton>
      </div>
    </form>
  );
}
