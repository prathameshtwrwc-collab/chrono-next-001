"use client";

import { cn } from "@/lib/utils";

export function CircadianOrbit({
  className,
  intensity = 1,
}: {
  className?: string;
  intensity?: number;
}) {
  const nodes = [
    { a: 0, c: "#f4b54d", label: "energy" },
    { a: 51, c: "#f5d18c", label: "focus" },
    { a: 120, c: "#e7a95b", label: "recovery" },
    { a: 200, c: "#354a82", label: "sleep" },
    { a: 270, c: "#f2a640", label: "rhythm" },
    { a: 320, c: "#2c3d73", label: "potential" },
  ];

  return (
    <div className={cn("relative aspect-square", className)}>
      <div
          className="animate-pulse-glow absolute left-1/2 top-1/2 h-[42%] w-[42%] -translate-x-1/2 -translate-y-1/2 rounded-full blur-2xl"
          style={{
            background:
              "radial-gradient(circle, rgba(244,181,77,0.4), rgba(231,169,91,0.1) 45%, transparent 70%)",
            opacity: intensity * 0.7,
            willChange: "transform",
            transform: "translate3d(-50%, -50%, 0)",
          }}
        />

      <svg viewBox="0 0 400 400" className="absolute inset-0 h-full w-full">
        <defs>
          <radialGradient id="coreGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fff6e2" />
            <stop offset="35%" stopColor="#f4b54d" />
            <stop offset="100%" stopColor="#e7a95b" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#f5d18c" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#354a82" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#f4b54d" stopOpacity="0.8" />
          </linearGradient>
        </defs>

        {[190, 155, 120, 85].map((r, i) => (
          <circle
            key={r}
            cx="200"
            cy="200"
            r={r}
            fill="none"
            stroke="url(#ringGrad)"
            strokeWidth={i === 0 ? 1.2 : 0.7}
            strokeOpacity={0.4 - i * 0.06}
          />
        ))}

        <circle cx="200" cy="200" r="46" fill="url(#coreGrad)" />
        <circle cx="200" cy="200" r="14" fill="#fff8ec" opacity="0.95" />
      </svg>

      <div className="animate-orbit-slow absolute inset-0" style={{ willChange: "transform" }}>
        <Ring radius={47.5} nodes={nodes.slice(0, 3)} />
      </div>
      <div className="animate-orbit-rev absolute inset-0" style={{ willChange: "transform" }}>
        <Ring radius={38.5} nodes={nodes.slice(3, 6)} />
      </div>
      <div className="animate-orbit absolute inset-0" style={{ willChange: "transform" }}>
        <Ring radius={30} nodes={[{ a: 30, c: "#f5d18c" }, { a: 210, c: "#f4b54d" }]} />
      </div>

      <svg viewBox="0 0 400 400" className="animate-orbit-rev absolute inset-0 h-full w-full">
        <circle
          cx="200"
          cy="200"
          r="172"
          fill="none"
          stroke="#f5d18c"
          strokeOpacity="0.25"
          strokeWidth="0.8"
          strokeDasharray="2 9"
        />
      </svg>
    </div>
  );
}

function Ring({
  radius,
  nodes,
}: {
  radius: number;
  nodes: { a: number; c: string }[];
}) {
  return (
    <>
      {nodes.map((n, i) => {
        const rad = (n.a * Math.PI) / 180;
        const x = 50 + radius * Math.cos(rad);
        const y = 50 + radius * Math.sin(rad);
        return (
          <span
            key={i}
            className="absolute h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              background: n.c,
              boxShadow: `0 0 10px ${n.c}`,
            }}
          />
        );
      })}
    </>
  );
}
