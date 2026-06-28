"use client";

import { useRouter, useSearchParams } from "next/navigation";

export function Pagination({ current, total }: { current: number; total: number }) {
  const router = useRouter();
  const params = useSearchParams();

  if (total <= 1) return null;

  const go = (page: number) => {
    const next = new URLSearchParams(params?.toString() || "");
    next.set("page", String(page));
    router.push(`?${next.toString()}`);
  };

  const pages: (number | string)[] = [];
  for (let i = 1; i <= total; i++) {
    if (i === 1 || i === total || (i >= current - 1 && i <= current + 1)) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "...") {
      pages.push("...");
    }
  }

  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      <button disabled={current <= 1} onClick={() => go(current - 1)}
        className="rounded-full border border-white/15 px-4 py-2 text-xs text-white/60 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed">
        Prev
      </button>
      {pages.map((p, i) =>
        typeof p === "number" ? (
          <button key={i} onClick={() => go(p)}
            className={`rounded-full px-4 py-2 text-xs transition-colors ${p === current ? "bg-gold text-midnight font-semibold" : "border border-white/15 text-white/60 hover:bg-white/10"}`}>
            {p}
          </button>
        ) : (
          <span key={i} className="text-xs text-ivory/40 px-1">...</span>
        )
      )}
      <button disabled={current >= total} onClick={() => go(current + 1)}
        className="rounded-full border border-white/15 px-4 py-2 text-xs text-white/60 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed">
        Next
      </button>
    </div>
  );
}
