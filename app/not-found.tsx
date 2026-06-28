import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-midnight px-6 text-ivory">
      <div className="max-w-xl text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.45em] text-gold/90">404</p>
        <h1 className="mt-4 font-serif text-5xl">This rhythm is off-map.</h1>
        <p className="mt-5 text-white/58">The page you are looking for does not exist or has moved.</p>
        <Link href="/" className="mt-8 inline-flex rounded-full bg-gradient-to-r from-champagne via-gold to-sunrise px-8 py-3 text-sm font-semibold text-midnight">
          Return Home
        </Link>
      </div>
    </main>
  );
}
