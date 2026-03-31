export default function FundoLoading() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-4 w-72 rounded bg-surface-overlay" />
      <div className="flex items-center justify-between">
        <div>
          <div className="h-7 w-44 rounded-lg bg-surface-overlay" />
          <div className="mt-2 h-4 w-52 rounded-md bg-surface-overlay" />
        </div>
        <div className="h-10 w-36 rounded-lg bg-surface-overlay" />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {[1, 2].map((i) => (
          <div key={i} className="h-28 rounded-xl border border-border bg-surface-card" />
        ))}
      </div>
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 rounded-xl border border-border bg-surface-card" />
        ))}
      </div>
    </div>
  );
}
