"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, type ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function Reveal({
  children,
  className,
  delay = 0,
  y = 34,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function Parallax({
  children,
  speed = 100,
  className,
}: {
  children: ReactNode;
  speed?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [speed, -speed]);
  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  );
}

export function Eyebrow({
  children,
  className,
  dark,
}: {
  children: ReactNode;
  className?: string;
  dark?: boolean;
}) {
  return (
    <div
      className={cn(
        "mb-6 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.42em]",
        dark ? "text-royal" : "text-gold/90",
        className
      )}
    >
      <span
        className={cn(
          "inline-block h-px w-10",
          dark ? "bg-royal/50" : "bg-gold/60"
        )}
      />
      {children}
    </div>
  );
}

export function Wordmark({
  className,
  dark,
}: {
  className?: string;
  dark?: boolean;
}) {
  return (
    <Link href="/" className={cn("group flex items-center gap-2.5", className)}>
      <span className="relative flex h-8 w-8 items-center justify-center">
        <span className="animate-orbit-slow absolute inset-0 rounded-full border border-gold/40" />
        <span className="absolute inset-[5px] rounded-full border border-gold/25" />
        <span className="h-2 w-2 rounded-full bg-gold shadow-[0_0_12px_#f4b54d]" />
      </span>
      <span
        className={cn(
          "font-serif text-2xl font-semibold tracking-[0.18em]",
          dark ? "text-midnight" : "text-ivory"
        )}
      >
        CHRONOTYPE
      </span>
    </Link>
  );
}

export function GoldButton({
  children,
  to,
  className,
  onClick,
}: {
  children: ReactNode;
  to?: string;
  className?: string;
  onClick?: () => void;
}) {
  const cls = cn(
    "group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-champagne via-gold to-sunrise px-7 py-3.5 text-sm font-semibold text-midnight shadow-[0_8px_30px_rgba(244,181,77,0.35)] transition-transform hover:scale-[1.03]",
    className
  );
  const inner = (
    <>
      <span className="relative z-10">{children}</span>
      <span className="relative z-10 transition-transform group-hover:translate-x-1">→</span>
    </>
  );
  if (to)
    return (
      <Link href={to} className={cls}>
        {inner}
      </Link>
    );
  return (
    <button onClick={onClick} className={cls}>
      {inner}
    </button>
  );
}

export function GhostButton({
  children,
  to,
  dark,
  className,
}: {
  children: ReactNode;
  to: string;
  dark?: boolean;
  className?: string;
}) {
  return (
    <Link
      href={to}
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-7 py-3.5 text-sm font-semibold transition-colors",
        dark
          ? "border-midnight/20 text-midnight hover:bg-midnight hover:text-ivory"
          : "border-ivory/25 text-ivory hover:bg-ivory hover:text-midnight",
        className
      )}
    >
      {children}
    </Link>
  );
}
