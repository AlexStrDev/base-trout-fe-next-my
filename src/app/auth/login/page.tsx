import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Iniciar Sesión' };

interface Props {
  searchParams: Promise<{ error?: string }>;
}

const ERROR_MESSAGES: Record<string, string> = {
  bad_request: 'Solicitud inválida. Inténtalo nuevamente.',
  state_mismatch: 'Error de seguridad. Inténtalo nuevamente.',
  token_exchange: 'No se pudo completar el inicio de sesión.',
  access_denied: 'Acceso denegado.',
};

export default async function LoginPage({ searchParams }: Props) {
  const { error } = await searchParams;
  const errorMessage = error ? (ERROR_MESSAGES[error] ?? 'Ocurrió un error.') : null;

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface">
      <div className="w-full max-w-sm space-y-8 rounded-2xl border border-border bg-surface-card p-8 shadow-lg">
        <div className="text-center">
          <h1 className="text-2xl font-bold font-display text-text-primary">
            Highlands
          </h1>
          <p className="mt-2 text-sm text-text-muted">
            Plataforma de producción acuícola
          </p>
        </div>

        {errorMessage && (
          <div className="rounded-lg border border-danger-700/30 bg-danger-950/40 px-4 py-3 text-sm text-danger-400">
            {errorMessage}
          </div>
        )}

        <a
          href="/api/auth/login"
          className="flex w-full items-center justify-center rounded-xl bg-lake-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-lake-500"
        >
          Iniciar sesión con Keycloak
        </a>
      </div>
    </div>
  );
}
