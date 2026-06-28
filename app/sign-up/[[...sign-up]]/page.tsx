import Link from "next/link";

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-midnight text-ivory flex items-center justify-center p-6">
      <div className="max-w-md text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.45em] text-gold/90">Sign Up</p>
        <h2 className="mt-4 font-serif text-4xl font-medium md:text-5xl">Assessment First.</h2>
        <p className="mt-4 text-sm leading-7 text-white/58">
          You don&apos;t need an account to get started. Take the chronotype assessment to create your profile. After completion, your email will be recognized for sign-in.
        </p>
        <Link
          href="/"
          className="mt-8 inline-block rounded-full bg-gradient-to-r from-champagne via-gold to-sunrise px-8 py-3.5 text-sm font-semibold text-midnight shadow-[0_8px_30px_rgba(244,181,77,0.35)] transition-transform hover:scale-[1.02]"
        >
          Take the Assessment
        </Link>
        <div className="mt-6 text-sm text-white/52">
          <Link href="/sign-in" className="hover:text-gold">Already have access? Sign in</Link>
        </div>
      </div>
    </div>
  );
}
