'use client';

import { useEffect } from 'react';
import { updateSectorAction } from '@/actions/mutations';
import { useFormAction } from '@/hooks/use-form-action';
import { InputField, SelectField, FormAlert } from '@/components/forms/fields';
import { SubmitButton } from '@/components/forms/submit-button';
import { useModalClose } from '@/components/ui/modal-context';
import type { SectorItem } from '@/lib/types';

interface Props {
  sector: SectorItem;
  fundoId: string;
  farmId: string;
}

export function EditSectorForm({ sector, fundoId, farmId }: Props) {
  const onClose = useModalClose();
  const { state, formAction } = useFormAction(updateSectorAction);

  useEffect(() => {
    if (state.success) onClose();
  }, [state.success, onClose]);

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="sector_id" value={sector.id} />
      <input type="hidden" name="fundo_id" value={fundoId} />
      <input type="hidden" name="farm_id" value={farmId} />
      <FormAlert error={state.error} />
      <InputField
        name="name"
        label="Nombre del sector"
        defaultValue={sector.name}
        error={state.fieldErrors?.name}
        required
      />
      <SelectField
        name="type_cultivation"
        label="Tipo de cultivo"
        defaultValue={sector.type_cultivation}
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
        defaultValue={sector.type_lote}
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
        defaultValue={String(sector.area)}
        error={state.fieldErrors?.area}
        required
      />
      <SelectField
        name="status"
        label="Estado"
        defaultValue={sector.status}
        options={[
          { value: 'activo', label: 'Activo' },
          { value: 'inactivo', label: 'Inactivo' },
        ]}
        required
      />
      <div className="flex justify-end pt-2">
        <SubmitButton pendingText="Guardando...">Guardar cambios</SubmitButton>
      </div>
    </form>
  );
}
