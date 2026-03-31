import Link from 'next/link';
import { Fish, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center animate-fade-in">
      <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-trout-800/60 text-trout-400 mb-6">
        <Fish className="h-10 w-10" />
      </div>
      <h1 className="text-4xl font-bold font-display text-text-primary">404</h1>
      <p className="mt-2 text-text-muted max-w-sm">
        La página que buscas no existe o el recurso fue eliminado.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex items-center gap-2 rounded-lg bg-lake-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-lake-500 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver al inicio
      </Link>
    </div>
  );
}
