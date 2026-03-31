import { cn } from '@/lib/utils';
import type { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react';

// ── Input ──────────────────────────────────────────────────────────

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
      <input
        id={fieldId}
        className={cn(
          'block w-full rounded-lg border bg-surface-overlay px-3.5 py-2.5 text-sm text-text-primary',
          'placeholder:text-text-muted/60 transition-colors duration-200',
          'focus:outline-none focus:ring-2 focus:ring-lake-500/40 focus:border-lake-600',
          error
            ? 'border-danger-600/50 focus:ring-danger-500/40'
            : 'border-border hover:border-border-light',
        )}
        {...props}
      />
      {error && <p className="text-xs text-danger-500">{error}</p>}
    </div>
  );
}

// ── Select ─────────────────────────────────────────────────────────

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
      <select
        id={fieldId}
        className={cn(
          'block w-full rounded-lg border bg-surface-overlay px-3.5 py-2.5 text-sm text-text-primary',
          'transition-colors duration-200 appearance-none',
          'focus:outline-none focus:ring-2 focus:ring-lake-500/40 focus:border-lake-600',
          error
            ? 'border-danger-600/50 focus:ring-danger-500/40'
            : 'border-border hover:border-border-light',
        )}
        {...props}
      >
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

// ── Textarea ───────────────────────────────────────────────────────

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
        className={cn(
          'block w-full rounded-lg border bg-surface-overlay px-3.5 py-2.5 text-sm text-text-primary',
          'placeholder:text-text-muted/60 transition-colors duration-200 resize-y min-h-20',
          'focus:outline-none focus:ring-2 focus:ring-lake-500/40 focus:border-lake-600',
          error
            ? 'border-danger-600/50 focus:ring-danger-500/40'
            : 'border-border hover:border-border-light',
        )}
        {...props}
      />
      {error && <p className="text-xs text-danger-500">{error}</p>}
    </div>
  );
}
