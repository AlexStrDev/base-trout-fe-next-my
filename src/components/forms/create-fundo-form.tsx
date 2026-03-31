'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCreateFundo } from '@/hooks/use-fundos';
import { InputField } from '@/components/forms/fields';
import { SubmitButton } from '@/components/forms/submit-button';
import { AlertCircle } from 'lucide-react';

interface Props {
  farmId: string;
  userId: string;
}

export function CreateFundoForm({ farmId, userId }: Props) {
  const router = useRouter();
  const mutation = useCreateFundo();
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = fd.get('name')?.toString().trim() || '';

    const errors: Record<string, string> = {};
    if (!name) errors.name = 'El nombre es requerido';
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});
    mutation.mutate(
      { farm_id: farmId, name },
      { onSuccess: (data) => router.push(`/farms/${farmId}/fundos/${data.fundo_id}`) },
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {mutation.isError && (
        <div className="flex items-center gap-2 rounded-lg border border-danger-600/30 bg-danger-600/10 px-4 py-3 text-sm text-danger-500">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {mutation.error?.message || 'Error al crear el fundo'}
        </div>
      )}

      <InputField
        name="name"
        label="Nombre del fundo"
        placeholder="Ej: Fundo Norte"
        error={fieldErrors.name}
        required
      />

      <div className="flex justify-end gap-3 pt-2">
        <SubmitButton isPending={mutation.isPending}>Crear Fundo</SubmitButton>
      </div>
    </form>
  );
}
