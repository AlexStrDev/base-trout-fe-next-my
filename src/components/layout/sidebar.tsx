'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Fish,
  LayoutDashboard,
  Warehouse,
  Menu,
  X,
  Waves,
  BarChart3,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUIStore } from '@/stores/ui-store';

const NAV_ITEMS = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/farms', label: 'Granjas', icon: Warehouse },
];

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen, toggleSidebar, setSidebarOpen } = useUIStore();

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 flex h-10 w-10 items-center justify-center rounded-lg bg-surface-card border border-border text-text-secondary lg:hidden"
        aria-label="Toggle menu"
      >
        {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-border bg-surface-raised',
          'transition-transform duration-300 lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 border-b border-border px-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-lake-600 shadow-sm shadow-lake-900/40">
            <Fish className="h-5 w-5 text-white" />
          </div>
          <div>
            <span className="text-base font-bold font-display text-text-primary tracking-tight">
              Highlands
            </span>
            <span className="block text-[10px] uppercase tracking-widest text-lake-400 font-medium">
              Acuicultura
            </span>
          </div>
        </div>

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <div className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const isActive =
                item.href === '/'
                  ? pathname === '/'
                  : pathname.startsWith(item.href);
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'bg-lake-600/10 text-lake-300 border border-lake-700/20'
                      : 'text-text-muted hover:text-text-secondary hover:bg-surface-overlay border border-transparent',
                  )}
                >
                  <Icon className="h-4.5 w-4.5 shrink-0" />
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Info box */}
          <div className="mt-8 rounded-xl border border-border bg-surface-card/50 p-4">
            <div className="flex items-center gap-2 text-xs font-medium text-warm-400">
              <BarChart3 className="h-3.5 w-3.5" />
              Predicción & Analítica
            </div>
            <p className="mt-2 text-xs text-text-muted leading-relaxed">
              El módulo de predicción y análisis se conectará pronto como microservicio independiente.
            </p>
          </div>
        </nav>

        {/* Footer */}
        <div className="border-t border-border px-5 py-3">
          <div className="flex items-center gap-2 text-xs text-text-muted">
            <Waves className="h-3.5 w-3.5 text-lake-500" />
            Trucha Arcoíris
          </div>
        </div>
      </aside>
    </>
  );
}
