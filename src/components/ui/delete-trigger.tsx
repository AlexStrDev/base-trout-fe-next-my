'use client';

import { useState, type ReactNode } from 'react';
import { Trash2 } from 'lucide-react';
import { Modal } from '@/components/ui/modal';
import { ModalCloseContext } from '@/components/ui/modal-context';

interface DeleteTriggerProps {
  title: string;
  children: ReactNode;
}

export function DeleteTrigger({ title, children }: DeleteTriggerProps) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <>
      <button
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setOpen(true); }}
        title="Eliminar"
        className={[
          'flex h-7 w-7 items-center justify-center rounded-lg',
          'text-text-muted transition-all duration-150',
          'hover:bg-danger-950/60 hover:text-danger-400',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger-500/40',
        ].join(' ')}
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>

      <Modal open={open} onClose={close} title={title}>
        <ModalCloseContext.Provider value={close}>
          {children}
        </ModalCloseContext.Provider>
      </Modal>
    </>
  );
}
