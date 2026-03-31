export default function Loading() {
  return (
    <div className="animate-pulse space-y-6">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div>
          <div className="h-7 w-48 rounded-lg bg-surface-overlay" />
          <div className="mt-2 h-4 w-64 rounded-md bg-surface-overlay" />
        </div>
        <div className="h-10 w-32 rounded-lg bg-surface-overlay" />
      </div>

      {/* Stats skeleton */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-28 rounded-xl border border-border bg-surface-card" />
        ))}
      </div>

      {/* Cards skeleton */}
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 rounded-xl border border-border bg-surface-card" />
        ))}
      </div>
    </div>
  );
}
