'use client';

import { useState, useRef, useEffect } from 'react';
import { useCreateSampling } from '@/hooks/use-samplings';
import { InputField, TextareaField } from '@/components/forms/fields';
import { SubmitButton } from '@/components/forms/submit-button';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

interface Props {
  cohortId: string;
}

export function CreateSamplingForm({ cohortId }: Props) {
  const mutation = useCreateSampling();
  const formRef = useRef<HTMLFormElement>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (mutation.isSuccess) {
      formRef.current?.reset();
      setShowSuccess(true);
    }
  }, [mutation.isSuccess]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const temperatureC = Number(fd.get('temperature_c'));
    const deadTrout = Number(fd.get('dead_trout') ?? 0);
    const numSampled = Number(fd.get('num_sampled'));
    const weightMin = Number(fd.get('weight_min_g'));
    const weightMax = Number(fd.get('weight_max_g'));
    const details = fd.get('details')?.toString().trim() || undefined;

    const errors: Record<string, string> = {};
    if (temperatureC < 0 || temperatureC > 30)
      errors.temperature_c = 'Debe estar entre 0 y 30 °C';
    if (!numSampled || numSampled <= 0) errors.num_sampled = 'Debe ser mayor a 0';
    if (!weightMin || weightMin <= 0) errors.weight_min_g = 'Debe ser mayor a 0';
    if (weightMax < weightMin) errors.weight_max_g = 'Debe ser >= peso mín.';
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});
    setShowSuccess(false);
    mutation.mutate({
      cohort_id: cohortId,
      temperature_c: temperatureC,
      dead_trout: deadTrout,
      num_sampled: numSampled,
      weight_min_g: weightMin,
      weight_max_g: weightMax,
      details,
    });
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
      {mutation.isError && (
        <div className="flex items-center gap-2 rounded-lg border border-danger-600/30 bg-danger-600/10 px-4 py-3 text-sm text-danger-500">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {mutation.error?.message || 'Error al registrar la medición'}
        </div>
      )}

      {showSuccess && (
        <div className="flex items-center gap-2 rounded-lg border border-lake-700/30 bg-lake-900/30 px-4 py-3 text-sm text-lake-300">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          Medición registrada correctamente
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <InputField
          name="temperature_c"
          label="Temperatura (°C)"
          type="number"
          step="0.1"
          min="0"
          max="30"
          placeholder="Ej: 13.5"
          error={fieldErrors.temperature_c}
          required
        />
        <InputField
          name="dead_trout"
          label="Truchas muertas"
          type="number"
          min="0"
          placeholder="Ej: 5"
          defaultValue="0"
          error={fieldErrors.dead_trout}
          required
        />
      </div>

      <InputField
        name="num_sampled"
        label="Truchas muestreadas"
        type="number"
        min="1"
        placeholder="Ej: 30"
        error={fieldErrors.num_sampled}
        required
      />

      <div className="grid grid-cols-2 gap-4">
        <InputField
          name="weight_min_g"
          label="Peso mín. (g)"
          type="number"
          step="0.01"
          min="0.01"
          placeholder="Ej: 85.0"
          error={fieldErrors.weight_min_g}
          required
        />
        <InputField
          name="weight_max_g"
          label="Peso máx. (g)"
          type="number"
          step="0.01"
          min="0.01"
          placeholder="Ej: 110.0"
          error={fieldErrors.weight_max_g}
          required
        />
      </div>

      <TextareaField
        name="details"
        label="Observaciones (opcional)"
        placeholder="Ej: Se observaron truchas con buen color y actividad normal"
        error={fieldErrors.details}
      />

      <div className="flex justify-end gap-3 pt-2">
        <SubmitButton isPending={mutation.isPending} pendingText="Registrando...">
          Registrar Medición
        </SubmitButton>
      </div>
    </form>
  );
}
