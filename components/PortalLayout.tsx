"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Wordmark } from "./ui";
import { cn } from "@/lib/utils";

export type NavItem = { label: string; href: string; icon: string };

export function PortalLayout({
  nav,
  badge,
  badgeColor,
  user,
  children,
}: {
  nav: NavItem[];
  badge: string;
  badgeColor: string;
  user?: { name: string; role: string; initials: string };
  children: ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const clerkReady = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);
  const displayUser = user || { name: "User", role: badge, initials: "U" };
  const logout = async () => {
    document.cookie.split(";").forEach(c => {
      const name = c.trim().split("=")[0];
      if (name.startsWith("__session") || name.startsWith("__clerk")) {
        document.cookie = `${name}=; path=/; max-age=0`;
        document.cookie = `${name}=; path=/superadmin; max-age=0`;
        document.cookie = `${name}=; path=/admin; max-age=0`;
        document.cookie = `${name}=; path=/member; max-age=0`;
      }
    });
    try {
      const clerk = (window as any).Clerk;
      if (clerk?.signOut) {
        await clerk.signOut({ redirectUrl: "/sign-in" });
      }
    } catch {}
    router.push("/sign-in");
  };

  return (
    <div className="min-h-screen bg-midnight text-ivory">
      <div className="grain" />
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-ivory/10 bg-indigo-deep/80 backdrop-blur-xl transition-transform lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between px-6 py-6">
          <Wordmark />
          <span className={cn("rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest", badgeColor)}>{badge}</span>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto px-4 py-2">
          {nav.map((n) => {
            const active = pathname === n.href;
            return (
              <Link
                key={n.href}
                href={n.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "group relative flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all",
                  active ? "bg-gradient-to-r from-gold/20 to-transparent text-gold" : "text-ivory/60 hover:bg-ivory/5 hover:text-ivory"
                )}
              >
                {active && <motion.span layoutId={`active-${badge}`} className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r bg-gold" />}
                <span className="text-lg">{n.icon}</span>
                {n.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-ivory/10 p-4">
          <p className="mb-2 px-2 text-[10px] uppercase tracking-widest text-ivory/30">Session</p>
          <div className="grid gap-2 px-1">
            {clerkReady ? (
              <button onClick={logout} className="rounded-lg border border-ivory/10 px-3 py-2 text-left text-xs text-ivory/60 transition-colors hover:border-gold hover:text-gold">
                Log out
              </button>
            ) : (
              <Link href="/sign-in" className="rounded-lg border border-ivory/10 px-3 py-2 text-xs text-ivory/60 transition-colors hover:border-gold hover:text-gold">
                Sign in
              </Link>
            )}
            <Link href="/" className="rounded-lg border border-ivory/10 px-3 py-2 text-xs text-ivory/60 transition-colors hover:border-gold hover:text-gold">
              Home
            </Link>
          </div>
        </div>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-ivory/10 bg-midnight/70 px-6 py-4 backdrop-blur-xl">
          <button onClick={() => setOpen((v) => !v)} className="text-2xl lg:hidden">Menu</button>
          <div className="hidden items-center gap-2 rounded-full border border-ivory/10 bg-ivory/5 px-4 py-2 text-sm text-ivory/40 min-w-0 md:flex lg:ml-6">
            <span className="shrink-0">Search</span>
            <input
              type="text"
              placeholder="insights, users, reports..."
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.target as HTMLInputElement).value.trim()) {
                  const path = window.location.pathname.startsWith("/superadmin") ? "/superadmin" : window.location.pathname.startsWith("/admin") ? "/admin" : "/member";
                  router.push(`${path}/search?q=${encodeURIComponent((e.target as HTMLInputElement).value.trim())}`);
                }
              }}
              className="min-w-0 flex-1 bg-transparent outline-none text-ivory/60 placeholder:text-ivory/30"
            />
          </div>
          <div className="ml-auto flex items-center gap-4">
            <button className="relative text-xl text-ivory/60 hover:text-ivory" aria-label="Notifications">
              <span className="block h-5 w-5 rounded-full border border-ivory/40" />
              <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-gold" />
            </button>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-semibold leading-tight">{displayUser.name}</p>
                  <p className="text-xs text-ivory/40">{displayUser.role}</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-gold to-sunrise font-bold text-midnight">{displayUser.initials}</div>
              </div>
          </div>
        </header>
        <main className="p-6 lg:p-10">{children}</main>
      </div>

      {open && <div onClick={() => setOpen(false)} className="fixed inset-0 z-30 bg-black/50 lg:hidden" />}
    </div>
  );
}

export function PageHeader({ eyebrow, title, sub, action }: { eyebrow: string; title: string; sub?: string; action?: ReactNode }) {
  return (
    <div className="mb-9 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.35em] text-gold/80">{eyebrow}</p>
        <h1 className="font-serif text-4xl font-medium md:text-5xl">{title}</h1>
        {sub && <p className="mt-3 max-w-2xl text-ivory/55">{sub}</p>}
      </div>
      {action}
    </div>
  );
}

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={cn("rounded-2xl border border-ivory/10 bg-ivory/[0.04] p-6 backdrop-blur", className)}
    >
      {children}
    </motion.div>
  );
}

export function Stat({ label, value, delta, color = "text-gold" }: { label: string; value: string; delta?: string; color?: string }) {
  return (
    <Card>
      <p className="text-xs uppercase tracking-widest text-ivory/40">{label}</p>
      <p className={cn("mt-3 font-serif text-4xl font-medium", color)}>{value}</p>
      {delta && <p className="mt-2 text-xs text-ivory/45">{delta}</p>}
    </Card>
  );
}
