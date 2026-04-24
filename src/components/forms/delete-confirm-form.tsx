'use client';

import { useEffect } from 'react';
import { useFormAction } from '@/hooks/use-form-action';
import { SubmitButton } from '@/components/forms/submit-button';
import { FormAlert } from '@/components/forms/fields';
import { useModalClose } from '@/components/ui/modal-context';
import { AlertTriangle } from 'lucide-react';
import type { ActionState } from '@/actions/mutations';

type ServerAction = (prev: ActionState, data: FormData) => Promise<ActionState>;

interface Props {
  action: ServerAction;
  entityName: string;
  entityLabel: string;
  hiddenFields: Record<string, string>;
  warningMessage?: string;
}

export function DeleteConfirmForm({
  action,
  entityName,
  entityLabel,
  hiddenFields,
  warningMessage,
}: Props) {
  const onClose = useModalClose();
  const { state, formAction } = useFormAction(action);

  useEffect(() => {
    if (state.success) onClose();
  }, [state.success, onClose]);

  return (
    <form action={formAction} className="space-y-5">
      {Object.entries(hiddenFields).map(([name, value]) => (
        <input key={name} type="hidden" name={name} value={value} />
      ))}

      <FormAlert error={state.error} />

      <div className="flex gap-3 rounded-xl border border-danger-700/30 bg-danger-950/30 p-4">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-danger-900/50 text-danger-400">
          <AlertTriangle className="h-4 w-4" />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-text-primary">
            ¿Eliminar {entityLabel}{' '}
            <span className="font-semibold text-danger-300">"{entityName}"</span>?
          </p>
          {warningMessage && (
            <p className="text-xs text-text-muted">{warningMessage}</p>
          )}
          <p className="text-xs text-text-muted">Esta acción no se puede deshacer.</p>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onClose}
          className={[
            'flex-1 rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-text-secondary',
            'transition-all duration-150 hover:border-border-light hover:text-text-primary',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lake-500/40',
          ].join(' ')}
        >
          Cancelar
        </button>
        <div className="flex-1">
          <SubmitButton variant="danger" pendingText="Eliminando...">
            Sí, eliminar
          </SubmitButton>
        </div>
      </div>
    </form>
  );
}
