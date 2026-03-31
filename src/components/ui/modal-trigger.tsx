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
          'inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lake-500/50',
          variant === 'primary'
            ? 'bg-lake-600 text-white shadow-sm shadow-lake-900/30 hover:bg-lake-500'
            : 'bg-surface-overlay text-text-secondary border border-border hover:border-border-light hover:text-text-primary',
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
