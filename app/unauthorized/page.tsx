import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-midnight px-6 text-ivory">
      <div className="max-w-lg text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.45em] text-gold/90">Access Restricted</p>
        <h1 className="mt-4 font-serif text-5xl">This dashboard is protected.</h1>
        <p className="mt-5 text-white/58">Your current account does not have the role required for this area.</p>
        <Link href="/" className="mt-8 inline-flex rounded-full bg-gradient-to-r from-champagne via-gold to-sunrise px-8 py-3 text-sm font-semibold text-midnight">
          Return Home
        </Link>
      </div>
    </main>
  );
}
