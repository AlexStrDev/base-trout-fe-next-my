import { cn } from '@/lib/utils';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import type { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react';

function fieldInputClasses(error?: string, extra?: string) {
  return cn(
    'block w-full rounded-lg border bg-surface-overlay px-3.5 py-2.5 text-sm text-text-primary',
    'placeholder:text-text-muted/60 transition-colors duration-200',
    'focus:outline-none focus:ring-2 focus:ring-lake-500/40 focus:border-lake-600',
    error
      ? 'border-danger-600/50 focus:ring-danger-500/40'
      : 'border-border hover:border-border-light',
    extra,
  );
}

interface FormAlertProps {
  error?: string;
  success?: boolean;
  successMessage?: string;
}

export function FormAlert({
  error,
  success,
  successMessage = 'Operación realizada correctamente',
}: FormAlertProps) {
  if (error) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-danger-600/30 bg-danger-600/10 px-4 py-3 text-sm text-danger-500">
        <AlertCircle className="h-4 w-4 shrink-0" />
        {error}
      </div>
    );
  }
  if (success) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-lake-700/30 bg-lake-900/30 px-4 py-3 text-sm text-lake-300">
        <CheckCircle2 className="h-4 w-4 shrink-0" />
        {successMessage}
      </div>
    );
  }
  return null;
}

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function InputField({ label, error, className, id, ...props }: InputFieldProps) {
  const fieldId = id || props.name;
  return (
    <div className={cn('space-y-1.5', className)}>
      <label htmlFor={fieldId} className="block text-sm font-medium text-text-secondary">
        {label}
      </label>
      <input id={fieldId} className={fieldInputClasses(error)} {...props} />
      {error && <p className="text-xs text-danger-500">{error}</p>}
    </div>
  );
}

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
}

export function SelectField({
  label,
  error,
  options,
  placeholder,
  className,
  id,
  ...props
}: SelectFieldProps) {
  const fieldId = id || props.name;
  return (
    <div className={cn('space-y-1.5', className)}>
      <label htmlFor={fieldId} className="block text-sm font-medium text-text-secondary">
        {label}
      </label>
      <select id={fieldId} className={fieldInputClasses(error, 'appearance-none')} {...props}>
        {placeholder && (
          <option value="" className="text-text-muted">
            {placeholder}
          </option>
        )}
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-danger-500">{error}</p>}
    </div>
  );
}

interface TextareaFieldProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
}

export function TextareaField({ label, error, className, id, ...props }: TextareaFieldProps) {
  const fieldId = id || props.name;
  return (
    <div className={cn('space-y-1.5', className)}>
      <label htmlFor={fieldId} className="block text-sm font-medium text-text-secondary">
        {label}
      </label>
      <textarea
        id={fieldId}
        className={fieldInputClasses(error, 'resize-y min-h-20')}
        {...props}
      />
      {error && <p className="text-xs text-danger-500">{error}</p>}
    </div>
  );
}

interface WeightRangeFieldsProps {
  minName: string;
  maxName: string;
  minLabel?: string;
  maxLabel?: string;
  minPlaceholder?: string;
  maxPlaceholder?: string;
  minError?: string;
  maxError?: string;
}

export function WeightRangeFields({
  minName,
  maxName,
  minLabel = 'Peso mín. (g)',
  maxLabel = 'Peso máx. (g)',
  minPlaceholder = 'Ej: 85.0',
  maxPlaceholder = 'Ej: 110.0',
  minError,
  maxError,
}: WeightRangeFieldsProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <InputField
        name={minName}
        label={minLabel}
        type="number"
        step="0.01"
        min="0.01"
        placeholder={minPlaceholder}
        error={minError}
        required
      />
      <InputField
        name={maxName}
        label={maxLabel}
        type="number"
        step="0.01"
        min="0.01"
        placeholder={maxPlaceholder}
        error={maxError}
        required
      />
    </div>
  );
}
