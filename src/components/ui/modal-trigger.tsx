'use client';

import { useState, type ReactNode } from 'react';
import { Modal } from '@/components/ui/modal';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ModalTriggerProps {
  title: string;
  buttonLabel: string;
  children: ReactNode;
  buttonClassName?: string;
  variant?: 'primary' | 'secondary';
}

export function ModalTrigger({
  title,
  buttonLabel,
  children,
  buttonClassName,
  variant = 'primary',
}: ModalTriggerProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium',
          'transition-all duration-200',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lake-500/40',
          'active:scale-[0.97]',
          variant === 'primary'
            ? [
                'bg-lake-600 text-white',
                'shadow-[0_1px_2px_rgba(0,0,0,0.25),0_1px_6px_rgba(29,116,82,0.2)]',
                'hover:bg-lake-500 hover:shadow-[0_2px_10px_rgba(29,116,82,0.3)]',
              ].join(' ')
            : [
                'bg-surface-overlay text-text-secondary border border-border',
                'hover:border-border-light hover:text-text-primary',
              ].join(' '),
          buttonClassName,
        )}
      >
        <Plus className="h-4 w-4" />
        {buttonLabel}
      </button>

      <Modal open={open} onClose={() => setOpen(false)} title={title}>
        {children}
      </Modal>
    </>
  );
}
