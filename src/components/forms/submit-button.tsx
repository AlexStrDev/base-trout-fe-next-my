'use client';

import { useFormStatus } from 'react-dom';
import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface SubmitButtonProps {
  children: ReactNode;
  pendingText?: string;
  className?: string;
}

export function SubmitButton({
  children,
  pendingText = 'Guardando...',
  className,
}: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={cn(
        'relative w-full overflow-hidden rounded-xl px-5 py-3 text-sm font-semibold',
        'bg-lake-600 text-white',
        'shadow-[0_1px_2px_rgba(0,0,0,0.3),0_2px_8px_rgba(29,116,82,0.25)]',
        'hover:bg-lake-500 hover:shadow-[0_2px_12px_rgba(29,116,82,0.35)]',
        'active:scale-[0.98] active:bg-lake-700',
        'transition-all duration-200 ease-out',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lake-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-card',
        'disabled:pointer-events-none disabled:opacity-55',
        className,
      )}
    >
      {/* Progress bar while pending */}
      {pending && (
        <span
          className="absolute inset-x-0 bottom-0 h-0.5 bg-lake-300/60 animate-[progress-fill_2.5s_ease-out_both]"
          aria-hidden
        />
      )}

      <span className={cn('flex items-center justify-center gap-2 transition-opacity duration-150', pending && 'opacity-70')}>
        {pending ? (
          <>
            {/* Three dots loading */}
            <span className="flex items-center gap-1" aria-hidden>
              <span className="h-1.5 w-1.5 rounded-full bg-white/80 animate-[pulse-soft_1.2s_ease-in-out_infinite]" style={{ animationDelay: '0ms' }} />
              <span className="h-1.5 w-1.5 rounded-full bg-white/80 animate-[pulse-soft_1.2s_ease-in-out_infinite]" style={{ animationDelay: '200ms' }} />
              <span className="h-1.5 w-1.5 rounded-full bg-white/80 animate-[pulse-soft_1.2s_ease-in-out_infinite]" style={{ animationDelay: '400ms' }} />
            </span>
            {pendingText}
          </>
        ) : (
          children
        )}
      </span>
    </button>
  );
}
