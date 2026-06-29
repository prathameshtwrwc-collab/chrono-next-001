export default function AdminLoading() {
  return (
    <div className="animate-pulse">
      <div className="mb-9 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="mb-2 h-3 w-24 rounded bg-ivory/10" />
          <div className="h-10 w-72 rounded bg-ivory/10 md:h-12" />
          <div className="mt-3 h-4 w-96 rounded bg-ivory/5" />
        </div>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="rounded-2xl border border-ivory/10 bg-ivory/[0.04] p-6">
            <div className="h-3 w-20 rounded bg-ivory/10" />
            <div className="mt-3 h-10 w-16 rounded bg-ivory/10" />
            <div className="mt-2 h-3 w-32 rounded bg-ivory/5" />
          </div>
        ))}
      </div>
    </div>
  );
}
