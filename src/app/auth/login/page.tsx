import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Iniciar Sesión' };

interface Props {
  searchParams: Promise<{ error?: string }>;
}

const ERROR_MESSAGES: Record<string, string> = {
  bad_request:    'Solicitud inválida. Inténtalo nuevamente.',
  state_mismatch: 'Error de seguridad. Inténtalo nuevamente.',
  token_exchange: 'No se pudo completar el inicio de sesión.',
  access_denied:  'Acceso denegado.',
};

export default async function LoginPage({ searchParams }: Props) {
  const { error } = await searchParams;
  const errorMessage = error ? (ERROR_MESSAGES[error] ?? 'Ocurrió un error.') : null;

  return (
    <div className="relative flex min-h-screen overflow-hidden bg-surface">

      {/* ── Fondo con gradiente radial ── */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 -top-40 h-[600px] w-[600px] rounded-full bg-lake-900/20 blur-3xl" />
        <div className="absolute -bottom-40 -right-20 h-[500px] w-[500px] rounded-full bg-trout-900/20 blur-3xl" />
        <div className="absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-lake-950/30 blur-2xl" />
      </div>

      {/* ── Grid de fondo sutil ── */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(var(--color-lake-400) 1px, transparent 1px), linear-gradient(90deg, var(--color-lake-400) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      {/* ── Contenido centrado ── */}
      <div className="relative z-10 flex w-full flex-col items-center justify-center px-4 py-16">

        {/* Logo / marca */}
        <div className="mb-8 animate-[fade-in_0.6s_ease-out_both]">
          <div className="flex items-center justify-center gap-3">
            {/* Ícono trucha */}
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-lake-600/20 ring-1 ring-lake-600/40">
              <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7" aria-hidden="true">
                <path
                  d="M2 12C2 12 5 6 12 6C17 6 20 9 22 12C20 15 17 18 12 18C5 18 2 12 2 12Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-lake-400"
                />
                <path
                  d="M22 12C22 12 20 9 18 8L22 6V18L18 16C20 15 22 12 22 12Z"
                  fill="currentColor"
                  className="text-lake-500"
                />
                <circle cx="9" cy="11" r="1" fill="currentColor" className="text-lake-300" />
                <path
                  d="M12 9C13.5 9.5 15 10.5 15.5 12C15 13.5 13.5 14.5 12 15"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeLinecap="round"
                  className="text-lake-500/60"
                />
              </svg>
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold tracking-tight text-text-primary">
                Highlands
              </h1>
              <p className="text-xs font-medium uppercase tracking-widest text-lake-500">
                Trout
              </p>
            </div>
          </div>
        </div>

        {/* Tarjeta principal */}
        <div className="w-full max-w-sm animate-[slide-up_0.5s_ease-out_0.1s_both]">
          <div className="rounded-2xl border border-border bg-surface-card/80 p-8 shadow-2xl backdrop-blur-sm">

            {/* Encabezado */}
            <div className="mb-8 text-center">
              <h2 className="font-display text-xl font-semibold text-text-primary">
                Bienvenido de vuelta
              </h2>
              <p className="mt-1.5 text-sm text-text-muted">
                Plataforma de producción acuícola
              </p>
            </div>

            {/* Error */}
            {errorMessage && (
              <div className="mb-6 flex items-start gap-3 rounded-xl border border-danger-700/30 bg-danger-700/10 px-4 py-3">
                <svg viewBox="0 0 20 20" fill="currentColor" className="mt-0.5 h-4 w-4 shrink-0 text-danger-500" aria-hidden="true">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
                <p className="text-sm text-danger-400">{errorMessage}</p>
              </div>
            )}

            {/* Botón de login */}
            <a
              href="/api/auth/login"
              className="group relative flex w-full items-center justify-center gap-2.5 overflow-hidden rounded-xl bg-lake-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-lake-900/40 transition-all duration-200 hover:bg-lake-500 hover:shadow-lake-800/50 active:scale-[0.98]"
            >
              {/* Shimmer hover effect */}
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-500 group-hover:translate-x-full" />

              {/* Ícono Keycloak */}
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 opacity-90" aria-hidden="true">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/>
              </svg>
              Iniciar sesión
            </a>

            {/* Separador */}
            <div className="mt-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-border" />
              <span className="text-xs text-text-muted">autenticación segura</span>
              <div className="h-px flex-1 bg-border" />
            </div>

            {/* Info de seguridad */}
            <div className="mt-4 flex items-center justify-center gap-4 text-xs text-text-muted">
              <span className="flex items-center gap-1.5">
                <svg viewBox="0 0 16 16" fill="currentColor" className="h-3.5 w-3.5 text-lake-600" aria-hidden="true">
                  <path fillRule="evenodd" d="M8 1a3.5 3.5 0 00-3.5 3.5V7A1.5 1.5 0 003 8.5v4A1.5 1.5 0 004.5 14h7a1.5 1.5 0 001.5-1.5v-4A1.5 1.5 0 0011.5 7V4.5A3.5 3.5 0 008 1zm2 6V4.5a2 2 0 10-4 0V7h4z" clipRule="evenodd"/>
                </svg>
                SSO con Keycloak
              </span>
              <span className="flex items-center gap-1.5">
                <svg viewBox="0 0 16 16" fill="currentColor" className="h-3.5 w-3.5 text-lake-600" aria-hidden="true">
                  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
                </svg>
                PKCE OAuth 2.0
              </span>
            </div>
          </div>

          {/* Footer */}
          <p className="mt-6 text-center text-xs text-text-muted">
            &copy; {new Date().getFullYear()} Highlands Trout &middot; Sistema de producción acuícola
          </p>
        </div>
      </div>
    </div>
  );
}
