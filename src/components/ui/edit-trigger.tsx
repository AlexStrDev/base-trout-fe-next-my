'use client';

import { useState, type ReactNode } from 'react';
import { Pencil } from 'lucide-react';
import { Modal } from '@/components/ui/modal';
import { ModalCloseContext } from '@/components/ui/modal-context';

interface EditTriggerProps {
  title: string;
  children: ReactNode;
}

export function EditTrigger({ title, children }: EditTriggerProps) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <>
      <button
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setOpen(true); }}
        title="Editar"
        className={[
          'flex h-7 w-7 items-center justify-center rounded-lg',
          'text-text-muted transition-all duration-150',
          'hover:bg-lake-900/60 hover:text-lake-400',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lake-500/40',
        ].join(' ')}
      >
        <Pencil className="h-3.5 w-3.5" />
      </button>

      <Modal open={open} onClose={close} title={title}>
        <ModalCloseContext.Provider value={close}>
          {children}
        </ModalCloseContext.Provider>
      </Modal>
    </>
  );
}
