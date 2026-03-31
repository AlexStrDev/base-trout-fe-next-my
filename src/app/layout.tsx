import type { Metadata } from 'next';
import { Sidebar } from '@/components/layout/sidebar';
import { QueryProvider } from '@/providers/query-provider';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Highlands — Acuicultura Inteligente',
    template: '%s | Highlands',
  },
  description:
    'Sistema de planeamiento y simulación para producción acuícola de trucha arcoíris.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:ital,wght@0,400;0,500;0,600;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-surface text-text-primary">
        <QueryProvider>
          <Sidebar />
          <main className="lg:pl-64">
            <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 pt-16 lg:pt-8">
              {children}
            </div>
          </main>
        </QueryProvider>
      </body>
    </html>
  );
}
