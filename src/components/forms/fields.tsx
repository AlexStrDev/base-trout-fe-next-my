'use client';

import { useState, useRef, useEffect, useCallback, type InputHTMLAttributes, type TextareaHTMLAttributes } from 'react';
import { AlertCircle, CheckCircle2, ChevronDown, Check, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

// ── Error message ─────────────────────────────────────────────────────────────

function FieldError({ error }: { error: string }) {
  return (
    <p className="flex items-center gap-1 mt-1.5 animate-slide-in-error text-xs text-danger-500">
      <AlertCircle className="h-3 w-3 shrink-0" />
      {error}
    </p>
  );
}

// ── Form Alert ────────────────────────────────────────────────────────────────

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
      <div className="flex items-start gap-2.5 rounded-xl border border-danger-600/25 bg-danger-600/8 px-4 py-3 text-sm text-danger-500 animate-slide-in-error">
        <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
        <span>{error}</span>
      </div>
    );
  }
  if (success) {
    return (
      <div className="flex items-start gap-2.5 rounded-xl border border-lake-700/30 bg-lake-900/25 px-4 py-3 text-sm text-lake-300 animate-slide-in-error">
        <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
        <span>{successMessage}</span>
      </div>
    );
  }
  return null;
}

// ── Input Field — floating label ──────────────────────────────────────────────

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function InputField({ label, error, className, id, ...props }: InputFieldProps) {
  const fieldId = id || props.name;
  const inputRef = useRef<HTMLInputElement>(null);
  const isDate = props.type === 'date' || props.type === 'datetime-local';

  const handleCalendarClick = () => {
    try {
      (inputRef.current as any)?.showPicker?.();
    } catch {
      inputRef.current?.click();
    }
  };

  return (
    <div className={cn('group relative', className)}>
      <div className="relative">
        <input
          ref={inputRef}
          id={fieldId}
          placeholder=" "
          className={cn(
            'peer block w-full rounded-xl border bg-surface-overlay',
            'px-4 pt-6 pb-2.5 text-sm text-text-primary',
            'transition-all duration-200 placeholder:opacity-0',
            'focus:outline-none',
            isDate && 'cursor-pointer pr-10',
            error
              ? 'border-danger-500/60 focus-glow-danger'
              : 'border-border hover:border-border-light focus-glow',
          )}
          {...props}
        />

        {/* Floating label */}
        <label
          htmlFor={fieldId}
          className={cn(
            'pointer-events-none absolute left-4 text-sm transition-all duration-200',
            'top-4.5',
            'peer-focus:top-2.5 peer-focus:text-[11px] peer-focus:font-medium peer-focus:tracking-wide',
            error ? 'peer-focus:text-danger-400' : 'peer-focus:text-lake-400',
            'peer-[:not(:placeholder-shown)]:top-2.5',
            'peer-[:not(:placeholder-shown)]:text-[11px]',
            'peer-[:not(:placeholder-shown)]:font-medium',
            'peer-[:not(:placeholder-shown)]:tracking-wide',
            error
              ? 'peer-[:not(:placeholder-shown)]:text-danger-400 text-danger-500/70'
              : 'peer-[:not(:placeholder-shown)]:text-text-secondary text-text-muted',
            // Date input always shows a value format → keep label floated
            isDate && 'top-2.5! text-[11px]! font-medium! tracking-wide! text-text-secondary!',
          )}
        >
          {label}
          {props.required && <span className="ml-0.5 text-lake-500">*</span>}
        </label>

        {/* Calendar icon for date inputs */}
        {isDate && (
          <button
            type="button"
            tabIndex={-1}
            onClick={handleCalendarClick}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted/50 transition-colors hover:text-lake-400 focus:outline-none"
            aria-label="Abrir calendario"
          >
            <Calendar className="h-4 w-4" />
          </button>
        )}
      </div>

      {error && <FieldError error={error} />}
    </div>
  );
}

// ── Select Field — custom animated dropdown ───────────────────────────────────

interface SelectOption {
  value: string;
  label: string;
}

interface SelectFieldProps {
  name: string;
  label: string;
  options: SelectOption[];
  error?: string;
  placeholder?: string;
  required?: boolean;
  defaultValue?: string;
  className?: string;
  id?: string;
}

export function SelectField({
  name,
  label,
  options,
  error,
  placeholder,
  required,
  defaultValue = '',
  className,
  id,
}: SelectFieldProps) {
  const fieldId = id || name;
  const [isOpen, setIsOpen] = useState(false);
  const [dropVisible, setDropVisible] = useState(false);
  const [selectedValue, setSelectedValue] = useState(defaultValue);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const focusedIndexRef = useRef<number>(-1);

  const selectedOption = options.find((o) => o.value === selectedValue);
  const hasValue = selectedValue !== '';

  // Dropdown animation: show → mount, then next frame → visible (triggers CSS transition)
  const openDropdown = useCallback(() => {
    setIsOpen(true);
    requestAnimationFrame(() =>
      requestAnimationFrame(() => setDropVisible(true)),
    );
  }, []);

  const closeDropdown = useCallback(() => {
    setDropVisible(false);
    const t = setTimeout(() => {
      setIsOpen(false);
      focusedIndexRef.current = -1;
    }, 180);
    return t;
  }, []);

  const toggle = useCallback(() => {
    if (isOpen) closeDropdown();
    else openDropdown();
  }, [isOpen, openDropdown, closeDropdown]);

  const selectOption = useCallback(
    (value: string) => {
      setSelectedValue(value);
      closeDropdown();
    },
    [closeDropdown],
  );

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        closeDropdown();
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [closeDropdown]);

  // Keyboard navigation
  const handleTriggerKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggle();
    } else if (e.key === 'Escape') {
      closeDropdown();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!isOpen) openDropdown();
      else {
        focusedIndexRef.current = Math.min(focusedIndexRef.current + 1, options.length - 1);
        (listRef.current?.children[focusedIndexRef.current] as HTMLElement)?.focus();
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      focusedIndexRef.current = Math.max(focusedIndexRef.current - 1, 0);
      (listRef.current?.children[focusedIndexRef.current] as HTMLElement)?.focus();
    }
  };

  const handleOptionKeyDown = (e: React.KeyboardEvent, value: string, index: number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      selectOption(value);
    } else if (e.key === 'Escape') {
      closeDropdown();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      focusedIndexRef.current = Math.min(index + 1, options.length - 1);
      (listRef.current?.children[focusedIndexRef.current] as HTMLElement)?.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      focusedIndexRef.current = Math.max(index - 1, 0);
      (listRef.current?.children[focusedIndexRef.current] as HTMLElement)?.focus();
    }
  };

  return (
    <div ref={containerRef} className={cn('group relative', className)}>
      {/* Hidden input for FormData submission */}
      <input type="hidden" name={name} value={selectedValue} />

      {/* Trigger */}
      <div
        id={fieldId}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls={`${fieldId}-listbox`}
        tabIndex={0}
        onClick={toggle}
        onKeyDown={handleTriggerKeyDown}
        className={cn(
          'relative cursor-pointer select-none rounded-xl border bg-surface-overlay',
          'px-4 pt-6 pb-2.5 pr-10 text-sm',
          'transition-all duration-200',
          'focus:outline-none',
          isOpen || hasValue ? 'text-text-primary' : 'text-transparent',
          error
            ? 'border-danger-500/60 focus-glow-danger'
            : isOpen
              ? 'border-lake-500/60 focus-glow'
              : 'border-border hover:border-border-light',
        )}
      >
        {hasValue ? selectedOption?.label : placeholder ?? ''}
      </div>

      {/* Floating label — always small since select always has a visible state */}
      <label
        htmlFor={fieldId}
        onClick={toggle}
        className={cn(
          'pointer-events-none absolute left-4 transition-all duration-200',
          hasValue || isOpen
            ? 'top-2.5 text-[11px] font-medium tracking-wide'
            : 'top-4.5 text-sm',
          error
            ? 'text-danger-400'
            : isOpen
              ? 'text-lake-400'
              : hasValue
                ? 'text-text-secondary'
                : 'text-text-muted',
        )}
      >
        {label}
        {required && <span className="ml-0.5 text-lake-500">*</span>}
      </label>

      {/* Chevron — rotates on open */}
      <ChevronDown
        className={cn(
          'pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2',
          'transition-all duration-200',
          isOpen ? 'rotate-180 text-lake-400' : 'text-text-muted/60',
        )}
      />

      {/* Dropdown panel */}
      {isOpen && (
        <div
          id={`${fieldId}-listbox`}
          ref={listRef}
          role="listbox"
          aria-label={label}
          className={cn(
            'absolute left-0 right-0 z-50 mt-1.5 overflow-hidden rounded-xl',
            'border border-border/80 bg-surface-raised',
            'shadow-[0_16px_48px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.03)]',
            // Animate in/out
            'transition-all duration-180',
            dropVisible
              ? 'opacity-100 translate-y-0 scale-100'
              : 'opacity-0 -translate-y-2 scale-[0.97] pointer-events-none',
          )}
          style={{ transformOrigin: 'top center' }}
        >
          {/* Top accent */}
          <div className="h-px bg-linear-to-r from-lake-700/0 via-lake-600/40 to-lake-700/0" />

          <div className="py-1">
            {/* Placeholder option */}
            {placeholder && (
              <div
                role="option"
                aria-selected={selectedValue === ''}
                tabIndex={0}
                onClick={() => selectOption('')}
                onKeyDown={(e) => handleOptionKeyDown(e, '', -1)}
                className={cn(
                  'flex cursor-pointer items-center gap-3 px-4 py-2.5 text-sm',
                  'text-text-muted/60 italic',
                  'transition-colors duration-100 hover:bg-white/4 hover:text-text-muted',
                  'focus:outline-none focus:bg-white/4',
                )}
              >
                <span className="h-3.5 w-3.5 shrink-0" />
                {placeholder}
              </div>
            )}

            {options.map((o, i) => {
              const isSelected = o.value === selectedValue;
              return (
                <div
                  key={o.value}
                  role="option"
                  aria-selected={isSelected}
                  tabIndex={0}
                  onClick={() => selectOption(o.value)}
                  onKeyDown={(e) => handleOptionKeyDown(e, o.value, i)}
                  className={cn(
                    'flex cursor-pointer items-center gap-3 px-4 py-2.5 text-sm',
                    'transition-colors duration-100',
                    'focus:outline-none',
                    isSelected
                      ? 'bg-lake-900/40 text-lake-300 focus:bg-lake-900/60'
                      : 'text-text-secondary hover:bg-white/4 hover:text-text-primary focus:bg-white/4 focus:text-text-primary',
                  )}
                >
                  <Check
                    className={cn(
                      'h-3.5 w-3.5 shrink-0 transition-opacity duration-150',
                      isSelected ? 'opacity-100 text-lake-400' : 'opacity-0',
                    )}
                  />
                  {o.label}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {error && <FieldError error={error} />}
    </div>
  );
}

// ── Textarea Field ────────────────────────────────────────────────────────────

interface TextareaFieldProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
}

export function TextareaField({ label, error, className, id, ...props }: TextareaFieldProps) {
  const fieldId = id || props.name;

  return (
    <div className={cn('group relative', className)}>
      <div className="relative">
        <textarea
          id={fieldId}
          placeholder=" "
          className={cn(
            'peer block w-full rounded-xl border bg-surface-overlay',
            'px-4 pt-6 pb-3 text-sm text-text-primary',
            'resize-y min-h-22',
            'placeholder:opacity-0 transition-all duration-200',
            'focus:outline-none',
            error
              ? 'border-danger-500/60 focus-glow-danger'
              : 'border-border hover:border-border-light focus-glow',
          )}
          {...props}
        />

        <label
          htmlFor={fieldId}
          className={cn(
            'pointer-events-none absolute left-4 text-sm transition-all duration-200',
            'top-4.5',
            'peer-focus:top-2.5 peer-focus:text-[11px] peer-focus:font-medium peer-focus:tracking-wide',
            error ? 'peer-focus:text-danger-400' : 'peer-focus:text-lake-400',
            'peer-[:not(:placeholder-shown)]:top-2.5',
            'peer-[:not(:placeholder-shown)]:text-[11px]',
            'peer-[:not(:placeholder-shown)]:font-medium',
            'peer-[:not(:placeholder-shown)]:tracking-wide',
            error
              ? 'peer-[:not(:placeholder-shown)]:text-danger-400 text-danger-500/70'
              : 'peer-[:not(:placeholder-shown)]:text-text-secondary text-text-muted',
          )}
        >
          {label}
          {props.required && <span className="ml-0.5 text-lake-500">*</span>}
        </label>
      </div>

      {error && <FieldError error={error} />}
    </div>
  );
}

// ── Weight Range Fields ───────────────────────────────────────────────────────

interface WeightRangeFieldsProps {
  minName: string;
  maxName: string;
  minLabel?: string;
  maxLabel?: string;
  minPlaceholder?: string;
  maxPlaceholder?: string;
  minError?: string;
  maxError?: string;
  minDefaultValue?: string;
  maxDefaultValue?: string;
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
  minDefaultValue,
  maxDefaultValue,
}: WeightRangeFieldsProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <InputField
        name={minName}
        label={minLabel}
        type="number"
        step="0.01"
        min="0.01"
        placeholder={minPlaceholder}
        defaultValue={minDefaultValue}
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
        defaultValue={maxDefaultValue}
        error={maxError}
        required
      />
    </div>
  );
}
