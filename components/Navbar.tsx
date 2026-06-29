"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Wordmark, GoldButton } from "./ui";
import { cn } from "@/lib/utils";

const links = [
  { label: "Science", href: "science" },
  { label: "Chronotypes", href: "chronotypes" },
  { label: "Rhythm", href: "rhythm" },
  { label: "For Teams", href: "corporate" },
  { label: "Legacy", href: "authority" },
];

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

export function Navbar({ onStartAssessment }: { onStartAssessment?: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [branding, setBranding] = useState<{ brandName: string; logoUrl: string | null } | null>(null);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrolled(window.scrollY > 60);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const path = window.location.pathname.replace(/^\//, "").split("/")[0];
    const reserved = new Set(["admin", "member", "super", "superadmin", "sign-in", "sign-up", "reports", "unauthorized", "api"]);
    if (path && !reserved.has(path.toLowerCase()) && !path.startsWith("REF-")) {
      fetch(`/api/branding?code=${encodeURIComponent(path)}`)
        .then((r) => r.json())
        .then((data) => { if (data) setBranding(data); })
        .catch(() => {});
    }
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled ? "border-b border-ivory/10 bg-midnight/70 backdrop-blur-xl" : "bg-transparent"
      )}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        {branding ? (
          <Link href="/" className="flex items-center gap-3 group">
            {branding.logoUrl ? (
              <img src={branding.logoUrl} alt="" className="h-8 w-8 rounded-lg object-contain" />
            ) : (
              <span className="relative flex h-8 w-8 items-center justify-center">
                <span className="absolute inset-0 rounded-full border border-gold/40" />
                <span className="h-2 w-2 rounded-full bg-gold shadow-[0_0_12px_#f4b54d]" />
              </span>
            )}
            <span className="font-serif text-2xl font-semibold tracking-[0.18em] text-ivory">
              {branding.brandName}
            </span>
          </Link>
        ) : (
          <Wordmark />
        )}
        <div className="hidden items-center gap-9 lg:flex">
          {links.map((l) => (
            <button
              key={l.label}
              onClick={() => scrollToId(l.href)}
              className="group relative text-sm font-medium text-ivory/70 transition-colors hover:text-ivory"
            >
              {l.label}
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-gold transition-all duration-300 group-hover:w-full" />
            </button>
          ))}
        </div>
        <div className="hidden items-center gap-4 lg:flex">
          <Link href="/sign-in" className="text-sm font-semibold text-ivory/80 transition-colors hover:text-gold">
            Sign In
          </Link>
          <button onClick={onStartAssessment}
            className="rounded-full bg-gradient-to-r from-champagne via-gold to-sunrise px-6 py-3 text-sm font-semibold text-midnight shadow-[0_8px_30px_rgba(244,181,77,0.35)] transition-transform hover:scale-[1.02]">
            {branding ? `Take ${branding.brandName} Assessment` : "Discover Your Blueprint"}
          </button>
        </div>
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 lg:hidden"
        >
          <span className={`h-0.5 w-6 rounded bg-ivory/60 transition-all ${open ? "translate-y-2 rotate-45" : ""}`} />
          <span className={`h-0.5 w-6 rounded bg-ivory/60 transition-all ${open ? "opacity-0" : ""}`} />
          <span className={`h-0.5 w-6 rounded bg-ivory/60 transition-all ${open ? "-translate-y-2 -rotate-45" : ""}`} />
        </button>
      </nav>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-ivory/10 bg-midnight"
          >
            <div className="flex flex-col gap-6 px-6 py-8">
              {links.map((l) => (
                <button key={l.label} onClick={() => { scrollToId(l.href); setOpen(false); }} className="text-left text-sm font-medium text-ivory/70 hover:text-ivory">{l.label}</button>
              ))}
              <Link href="/sign-in" className="text-sm font-semibold text-gold">Sign In</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
