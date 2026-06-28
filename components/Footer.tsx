"use client";

import Link from "next/link";
import { Wordmark } from "./ui";

export function Footer() {
  const cols = [
    {
      title: "Platform",
      links: ["Sleep Blueprint", "Chronotype Discovery", "Energy Timeline", "Recommendations"],
    },
    {
      title: "Science",
      links: ["Circadian Biology", "Sleep Cycles", "REM & NREM", "Research Library"],
    },
    {
      title: "Organization",
      links: ["For Teams", "Corporate Wellbeing", "Leadership", "Global Impact"],
    },
  ];
  return (
    <footer className="relative overflow-hidden border-t border-ivory/10 bg-midnight px-6 pb-12 pt-20">
      <div
        className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[60rem] -translate-x-1/2 rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(244,181,77,0.12), transparent 70%)" }}
      />
      <div className="relative mx-auto max-w-7xl">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Wordmark />
            <p className="mt-6 max-w-xs font-serif text-2xl leading-snug text-ivory/70">
              Where sleep science meets human potential.
            </p>
            <div className="mt-8 flex gap-3">
              {["Portal", "Admin", "System"].map((p, i) => (
                <Link
                  key={p}
                  href={["/app", "/admin", "/super"][i]}
                  className="rounded-full border border-ivory/15 px-4 py-2 text-xs font-medium text-ivory/70 transition-colors hover:border-gold hover:text-gold"
                >
                  {p}
                </Link>
              ))}
            </div>
          </div>
          {cols.map((c) => (
            <div key={c.title}>
              <h4 className="mb-5 text-xs font-semibold uppercase tracking-[0.3em] text-gold/80">
                {c.title}
              </h4>
              <ul className="space-y-3">
                {c.links.map((l) => (
                  <li key={l}>
                    <a href="#" className="text-sm text-ivory/60 transition-colors hover:text-ivory">
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-ivory/10 pt-8 text-xs text-ivory/40 md:flex-row">
          <p>© 2026 CHRONOTYPE Intelligence. A new category in human wellbeing.</p>
          <p className="font-serif italic text-ivory/50">Better Sleep. Better Humans. Better Future.</p>
        </div>
      </div>
    </footer>
  );
}
