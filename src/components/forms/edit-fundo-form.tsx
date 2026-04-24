'use client';

import { useEffect } from 'react';
import { updateFundoAction } from '@/actions/mutations';
import { useFormAction } from '@/hooks/use-form-action';
import { InputField, FormAlert } from '@/components/forms/fields';
import { SubmitButton } from '@/components/forms/submit-button';
import { useModalClose } from '@/components/ui/modal-context';
import type { FundoItem } from '@/lib/types';

interface Props {
  fundo: FundoItem;
  farmId: string;
}

export function EditFundoForm({ fundo, farmId }: Props) {
  const onClose = useModalClose();
  const { state, formAction } = useFormAction(updateFundoAction);

  useEffect(() => {
    if (state.success) onClose();
  }, [state.success, onClose]);

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="fundo_id" value={fundo.id} />
      <input type="hidden" name="farm_id" value={farmId} />
      <FormAlert error={state.error} />
      <InputField
        name="name"
        label="Nombre del fundo"
        defaultValue={fundo.name}
        error={state.fieldErrors?.name}
        required
      />
      <div className="flex justify-end pt-2">
        <SubmitButton pendingText="Guardando...">Guardar cambios</SubmitButton>
      </div>
    </form>
  );
}
