"use client";

import { useState } from "react";
import { createPortal } from "react-dom";

const genders = ["All", "Male", "Female", "Non-Binary", "Prefer not to say"];

export function DetailModal({
  title,
  data,
  columns,
  rowKey,
}: {
  title: string;
  data: Record<string, any>[];
  columns: { key: string; label: string }[];
  rowKey: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button onClick={() => setOpen(true)} className="text-left hover:text-gold transition-colors">{title}</button>
      {open && typeof window === "object" && createPortal(
        <div className="fixed inset-0 z-[100] flex items-start justify-center bg-midnight/80 p-4 backdrop-blur-xl overflow-y-auto" onClick={() => setOpen(false)}>
          <div className="w-full max-w-4xl my-8 rounded-2xl border border-white/10 bg-indigo-deep p-6 text-ivory shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between gap-4 mb-6">
              <p className="font-serif text-2xl">{title}</p>
              <button onClick={() => setOpen(false)} className="rounded-full border border-white/15 px-4 py-2 text-sm text-white/60">Close</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-ivory/10 text-left text-xs uppercase tracking-widest text-ivory/40">
                    {columns.map((c) => (<th key={c.key} className="px-4 py-3 font-medium">{c.label}</th>))}
                  </tr>
                </thead>
                <tbody>
                  {data.map((item, i) => (
                    <tr key={item[rowKey] || i} className="border-b border-ivory/5 hover:bg-ivory/[0.03]">
                      {columns.map((c) => (<td key={c.key} className="px-4 py-3 text-ivory/70">{formatCell(item[c.key])}</td>))}
                    </tr>
                  ))}
                  {!data.length && (
                    <tr><td colSpan={columns.length} className="px-4 py-8 text-center text-ivory/45">No records.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}

function formatCell(value: any): React.ReactNode {
  if (value === null || value === undefined) return "-";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value === "string" && value.startsWith("ACTIVE")) {
    return <span className="rounded-full bg-emerald-400/15 text-emerald-300 px-2 py-0.5 text-xs">{value}</span>;
  }
  return String(value);
}

export function ChronotypeModal({
  title,
  chronotype,
  data,
}: {
  title: string;
  chronotype: string;
  data: any[];
}) {
  const [open, setOpen] = useState(false);
  const [genderFilter, setGenderFilter] = useState("All");

  const filtered = genderFilter === "All" ? data : data.filter((m: any) => (m.gender || "").toLowerCase() === genderFilter.toLowerCase());
  const counts = genders.map((g) => ({
    label: g,
    count: g === "All" ? data.length : data.filter((m: any) => (m.gender || "").toLowerCase() === g.toLowerCase()).length,
  }));

  return (
    <>
      <button onClick={() => setOpen(true)} className="text-left hover:text-gold transition-colors">{title}</button>
      {open && typeof window === "object" && createPortal(
        <div className="fixed inset-0 z-[100] flex items-start justify-center bg-midnight/80 p-4 backdrop-blur-xl overflow-y-auto" onClick={() => setOpen(false)}>
          <div className="w-full max-w-4xl my-8 rounded-2xl border border-white/10 bg-indigo-deep p-6 text-ivory shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <p className="font-serif text-2xl">{title}</p>
                <p className="text-sm text-ivory/50">{chronotype} — {filtered.length} members</p>
              </div>
              <button onClick={() => setOpen(false)} className="rounded-full border border-white/15 px-4 py-2 text-sm text-white/60">Close</button>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {counts.map((c) => (
                <button
                  key={c.label}
                  onClick={() => setGenderFilter(c.label)}
                  className={`rounded-full px-3 py-1.5 text-xs transition-colors ${
                    genderFilter === c.label
                      ? "bg-gold text-midnight font-semibold"
                      : "border border-white/15 text-ivory/60 hover:border-gold/50"
                  }`}
                >
                  {c.label} ({c.count})
                </button>
              ))}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-ivory/10 text-left text-xs uppercase tracking-widest text-ivory/40">
                    {["Name", "Email", "Gender", "Age", "Source"].map((h) => (<th key={h} className="px-4 py-3 font-medium">{h}</th>))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((m: any) => (
                    <tr key={m.id} className="border-b border-ivory/5 hover:bg-ivory/[0.03]">
                      <td className="px-4 py-3 text-ivory/85">{m.first_name} {m.last_name}</td>
                      <td className="px-4 py-3 text-ivory/60">{m.email}</td>
                      <td className="px-4 py-3">
                        <span className="rounded-full border border-ivory/15 px-2 py-0.5 text-xs text-ivory/60">{m.gender || "-"}</span>
                      </td>
                      <td className="px-4 py-3 text-ivory/60">{m.age || "-"}</td>
                      <td className="px-4 py-3 text-ivory/40 text-xs">{m.source_type}</td>
                    </tr>
                  ))}
                  {!filtered.length && (
                    <tr><td colSpan={5} className="px-4 py-8 text-center text-ivory/45">No members match this filter.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
