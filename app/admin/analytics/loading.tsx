export default function AdminLoading() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-gold border-t-transparent" />
        <p className="mt-4 text-sm text-ivory/50">Loading...</p>
      </div>
    </div>
  );
}
