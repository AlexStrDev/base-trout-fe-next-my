import { Sidebar } from '@/components/layout/sidebar';
import { getSession } from '@/lib/session';

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  return (
    <>
      <Sidebar email={session.email} preferredUsername={session.preferredUsername} />
      <main className="lg:pl-64">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 pt-16 lg:pt-8">
          {children}
        </div>
      </main>
    </>
  );
}
