export default function CohortLoading() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-4 w-96 rounded bg-surface-overlay" />
      <div className="flex items-center justify-between">
        <div>
          <div className="h-7 w-56 rounded-lg bg-surface-overlay" />
          <div className="mt-2 h-4 w-48 rounded-md bg-surface-overlay" />
        </div>
        <div className="flex gap-2">
          <div className="h-6 w-16 rounded-full bg-surface-overlay" />
          <div className="h-6 w-20 rounded-md bg-surface-overlay" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-28 rounded-xl border border-border bg-surface-card" />
        ))}
      </div>
      <div className="h-64 rounded-xl border border-border bg-surface-card" />
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
        <div className="lg:col-span-2 h-96 rounded-xl border border-border bg-surface-card" />
        <div className="lg:col-span-3 h-96 rounded-xl border border-border bg-surface-card" />
      </div>
    </div>
  );
}
