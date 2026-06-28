"use client";

export function MiniLine({ data, color = "#f4b54d", h = 80 }: { data: number[]; color?: string; h?: number }) {
  const w = 300;
  const max = Math.max(...data), min = Math.min(...data);
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / (max - min || 1)) * (h - 12) - 6}`);
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id={`g${color}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline points={`0,${h} ${pts.join(" ")} ${w},${h}`} fill={`url(#g${color})`} />
      <polyline points={pts.join(" ")} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Bars({ data, color = "#354a82", h = 90 }: { data: number[]; color?: string; h?: number }) {
  const max = Math.max(...data);
  return (
    <div className="flex h-full items-end gap-1.5" style={{ height: h }}>
      {data.map((v, i) => (
        <div key={i} className="flex-1 rounded-t" style={{ height: `${(v / max) * 100}%`, background: color, opacity: 0.4 + (v / max) * 0.6 }} />
      ))}
    </div>
  );
}

export function Ring({ value, size = 120, color = "#f4b54d", label }: { value: number; size?: number; color?: string; label?: string }) {
  const r = size / 2 - 8;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#ffffff14" strokeWidth="8" />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth="8" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c - (value / 100) * c} />
      </svg>
      <div className="absolute text-center">
        <span className="font-serif text-3xl font-medium">{value}</span>
        {label && <span className="block text-[10px] uppercase tracking-widest text-ivory/40">{label}</span>}
      </div>
    </div>
  );
}
