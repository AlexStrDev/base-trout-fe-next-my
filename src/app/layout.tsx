import type { Metadata } from 'next';
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
        {children}
      </body>
    </html>
  );
}
