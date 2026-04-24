'use client';

import { useEffect, useState, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  className?: string;
}

function useModalAnimation(open: boolean) {
  // show  → DOM presence (keeps element mounted during exit animation)
  // ready → CSS animated state (triggers transitions)
  const [show, setShow] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (open) {
      setShow(true);
      // Double rAF: first frame mounts the element, second triggers the transition
      const id = requestAnimationFrame(() =>
        requestAnimationFrame(() => setReady(true)),
      );
      return () => cancelAnimationFrame(id);
    } else {
      setReady(false);
      const t = setTimeout(() => setShow(false), 220);
      return () => clearTimeout(t);
    }
  }, [open]);

  return { show, ready };
}

export function Modal({ open, onClose, title, children, className }: ModalProps) {
  const { show, ready } = useModalAnimation(open);
  const panelRef = useRef<HTMLDivElement>(null);

  // Lock body scroll while open
  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = prev; };
    }
  }, [open]);

  // ESC key
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!show) return null;

  return createPortal(
    // Full-screen overlay — always centered
    <div
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6',
        // Prevent clicks from reaching content behind
        'isolate',
      )}
      aria-modal="true"
      role="dialog"
      aria-label={title}
    >
      {/* Backdrop */}
      <div
        className={cn(
          'absolute inset-0 bg-black/65 backdrop-blur-[6px]',
          'transition-opacity duration-200 ease-out',
          ready ? 'opacity-100' : 'opacity-0',
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        ref={panelRef}
        className={cn(
          'relative z-10 w-full max-w-lg rounded-2xl',
          'border border-white/[0.06] bg-surface-raised',
          'shadow-[0_32px_80px_rgba(0,0,0,0.7),0_0_0_1px_rgba(255,255,255,0.04)]',
          // Enter/exit transition
          'transition-all duration-[220ms] ease-[cubic-bezier(0.16,1,0.3,1)]',
          ready
            ? 'opacity-100 translate-y-0 scale-100'
            : 'opacity-0 translate-y-5 scale-[0.95]',
          className,
        )}
      >
        {/* Top accent line */}
        <div className="absolute inset-x-0 top-0 h-px rounded-t-2xl bg-linear-to-r from-lake-700/0 via-lake-600/50 to-lake-700/0" />

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.05]">
          <div className="flex items-center gap-2.5">
            <span className="h-1.5 w-1.5 rounded-full bg-lake-500 animate-pulse-soft" aria-hidden />
            <h2 className="text-base font-semibold font-display text-text-primary">{title}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className={cn(
              'flex h-7 w-7 items-center justify-center rounded-lg',
              'text-text-muted transition-all duration-150',
              'hover:bg-white/[0.06] hover:text-text-primary',
              'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-border-light',
            )}
            aria-label="Cerrar"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>,
    document.body,
  );
}
