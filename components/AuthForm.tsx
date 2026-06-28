"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { checkEmailStatus, signInAsMember, createClerkSession } from "@/app/actions/auth";

type Audience = "member" | "superadmin";

export function AuthForm({ audience = "member" }: { audience?: Audience }) {
  const router = useRouter();
  const params = useSearchParams();
  const clerkReady = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);
  const [email, setEmail] = useState(params?.get("email") || "");
  const [password, setPassword] = useState("");
  const [step, setStep] = useState(audience === "superadmin" ? "password" : "email");
  const [message, setMessage] = useState("");
  const [detectedRole, setDetectedRole] = useState<string | null>(null);

  const title = audience === "superadmin" ? "Super Admin access." : "Welcome back.";
  const sub = audience === "superadmin"
    ? "Email and password only for the WelcomeCure command center."
    : "Enter your email to continue.";

  const signInWithSession = async (email: string, target: string) => {
    const result = await createClerkSession(email) as any;
    if (result.ok && result.jwt) {
      document.cookie = `__session=${result.jwt}; path=/; max-age=86400; samesite=lax`;
      router.push(target);
      return true;
    }
    return false;
  };

  const submit = async (event?: React.MouseEvent | React.KeyboardEvent) => {
    event?.preventDefault?.();
    setMessage("");

    if (!clerkReady) {
      setMessage("Clerk is not configured.");
      return;
    }

    try {
      if (step === "email" && audience !== "superadmin") {
        const result = await checkEmailStatus(email);

        if (result.status === "member") {
          const ok = await signInWithSession(email, "/member");
          if (!ok) setMessage("Could not sign in. Please try again.");
          return;
        }
        if (result.status === "admin" || result.status === "superadmin") {
          setDetectedRole(result.status);
          setStep("password");
          return;
        }
        if (result.status === "unknown") {
          setMessage("Please take the assessment first. Your account does not exist yet.");
          return;
        }
        setMessage("An error occurred. Please try again.");
        return;
      }

      if (step === "password") {
        const signIn = (window as any).Clerk?.client?.signIn;
        if (!signIn) { setMessage("Authentication not ready."); return; }
        await signIn.create({ identifier: email }).catch(() => {});
        const r = await signIn.attemptFirstFactor({ strategy: "password", password });

        if (r?.status === "complete" && r.createdSessionId) {
          const target = audience === "superadmin" ? "/superadmin" : (detectedRole === "admin" ? "/admin" : "/superadmin");
          const ok = await signInWithSession(email, target);
          if (ok) return;
        }
        if (r?.status === "needs_second_factor") { setMessage("Extra security step required."); return; }
        setMessage("Please enter correct username and password.");
        return;
      }
    } catch (error) {
      const e = error as any;
      console.error("[Auth] Sign-in error:", error);
      setMessage(e?.message || e?.errors?.[0]?.longMessage || e?.errors?.[0]?.message || "An error occurred.");
    }
  };

  return (
    <AuthShell audience={audience} title={title} sub={sub}>
      <form onSubmit={(e) => { e.preventDefault(); submit(); }} className="space-y-5">
        {message && <p className="rounded-xl border border-gold/20 bg-gold/10 px-4 py-3 text-sm text-gold">{message}</p>}

        <Input label="Email" type="email" value={email} onChange={setEmail} />

        {step === "password" && (
          <Input label="Password" type="password" value={password} onChange={setPassword} />
        )}

        <button
          type="submit"
          disabled={!email || (step === "password" && !password)}
          className="mt-8 w-full rounded-full bg-gradient-to-r from-champagne via-gold to-sunrise px-8 py-3.5 text-sm font-semibold text-midnight shadow-[0_8px_30px_rgba(244,181,77,0.35)] transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
        >
          {step === "password" ? "Sign In" : "Continue"}
        </button>
      </form>
    </AuthShell>
  );
}

function AuthShell({
  audience,
  title,
  sub,
  children,
}: {
  audience: Audience;
  title: string;
  sub: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-midnight text-ivory">
      <div className="grain" />
      <div className="grid min-h-screen lg:grid-cols-[0.95fr_1.05fr]">
        <div className="relative hidden overflow-hidden lg:block">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('https://images.pexels.com/photos/3771069/pexels-photo-3771069.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=1000')" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-midnight via-midnight/65 to-transparent" />
          <div className="absolute bottom-12 left-12 right-12">
            <Link href="/" className="text-[11px] font-bold uppercase tracking-[0.45em] text-gold">Chronotype</Link>
            <h1 className="mt-5 font-serif text-5xl leading-tight">A protected space for your sleep intelligence.</h1>
          </div>
        </div>

        <div className="flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-md">
            <p className="text-[11px] font-semibold uppercase tracking-[0.45em] text-gold/90">Sign In</p>
            <h2 className="mt-4 font-serif text-4xl font-medium md:text-5xl">{title}</h2>
            <p className="mt-4 text-sm leading-7 text-white/58">{sub}</p>

            <div className="mt-8">{children}</div>

            <div className="mt-6 flex items-center justify-between text-sm text-white/52">
              <Link href="/" className="hover:text-gold">Back home</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <label>
      <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.25em] text-white/42">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-white/12 bg-white/[0.045] px-4 py-3 text-sm text-ivory outline-none transition focus:border-gold/60 focus:bg-white/[0.07]"
      />
    </label>
  );
}
