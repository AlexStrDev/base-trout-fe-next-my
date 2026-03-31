'use client';

import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface SubmitButtonProps {
  children: ReactNode;
  isPending?: boolean;
  pendingText?: string;
  className?: string;
}

export function SubmitButton({
  children,
  isPending = false,
  pendingText = 'Guardando...',
  className,
}: SubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={isPending}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium',
        'bg-lake-600 text-white shadow-sm shadow-lake-900/30',
        'hover:bg-lake-500 active:bg-lake-700 transition-all duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lake-500/50',
        'disabled:pointer-events-none disabled:opacity-60',
        className,
      )}
    >
      {isPending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          {pendingText}
        </>
      ) : (
        children
      )}
    </button>
  );
}
