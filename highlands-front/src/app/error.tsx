'use client';

import { useEffect } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('App error:', error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center animate-fade-in">
      <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-danger-700/20 text-danger-500 mb-6">
        <AlertCircle className="h-10 w-10" />
      </div>
      <h1 className="text-2xl font-bold font-display text-text-primary">
        Algo salió mal
      </h1>
      <p className="mt-2 text-sm text-text-muted max-w-md">
        Ocurrió un error inesperado. Puede que el servidor backend no esté disponible.
        Verifica que el API esté corriendo en{' '}
        <code className="text-warm-400 font-mono text-xs">localhost:3000</code>.
      </p>
      {error.message && (
        <pre className="mt-4 max-w-lg rounded-lg border border-border bg-surface-card px-4 py-3 text-left text-xs text-text-muted font-mono overflow-x-auto">
          {error.message}
        </pre>
      )}
      <button
        onClick={reset}
        className="mt-6 inline-flex items-center gap-2 rounded-lg bg-lake-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-lake-500 transition-colors"
      >
        <RefreshCw className="h-4 w-4" />
        Reintentar
      </button>
    </div>
  );
}
