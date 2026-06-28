"use client";

import { useState } from "react";
import { createPortal } from "react-dom";

export function ViewAssessmentButton({ versionId }: { versionId: string }) {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const openView = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/assessments?id=${versionId}`);
      const d = await res.json();
      setData(d);
      setOpen(true);
    } catch {}
    setLoading(false);
  };

  return (
    <>
      <button onClick={openView} disabled={loading} className="rounded-full border border-gold/30 px-3 py-1 text-xs text-gold hover:bg-gold/10 disabled:opacity-50">
        {loading ? "..." : "View"}
      </button>
      {open && data && typeof window === "object" && createPortal(
        <div className="fixed inset-0 z-[100] flex items-start justify-center bg-midnight/80 p-4 backdrop-blur-xl overflow-y-auto" onClick={() => setOpen(false)}>
          <div className="w-full max-w-4xl my-8 rounded-2xl border border-white/10 bg-indigo-deep p-6 text-ivory shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-gold">Assessment v{data.version}</p>
                <h2 className="mt-2 font-serif text-3xl">{data.name}</h2>
                {data.description && <p className="mt-2 text-sm text-white/55">{data.description}</p>}
                <p className="mt-1 text-xs text-ivory/40">Status: {data.status} · {data.questions?.length || 0} questions</p>
              </div>
              <button type="button" onClick={() => setOpen(false)} className="rounded-full border border-white/15 px-4 py-2 text-sm text-white/60">Close</button>
            </div>

            <div className="mt-6 space-y-6">
              {(data.questions || []).map((q: any, qi: number) => (
                <div key={q.id} className="rounded-2xl border border-white/10 bg-white/[0.035] p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gold/20 text-xs text-gold">{qi + 1}</span>
                    <div>
                      <p className="text-sm text-ivory/85">{q.question_text}</p>
                      {q.category && <p className="text-xs text-ivory/40">{q.category}</p>}
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-ivory/10 text-left text-ivory/40">
                          <th className="py-2 pr-4 font-medium">Option</th>
                          <th className="py-2 px-3 font-medium text-center">Lark</th>
                          <th className="py-2 px-3 font-medium text-center">Eagle</th>
                          <th className="py-2 px-3 font-medium text-center">Owl</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(q.options || []).map((o: any) => (
                          <tr key={o.id} className="border-b border-ivory/5">
                            <td className="py-2 pr-4 text-ivory/70">{o.option_text}</td>
                            <td className={`py-2 px-3 text-center ${o.lark_score > 0 ? "text-amber-300" : "text-ivory/40"}`}>{o.lark_score}</td>
                            <td className={`py-2 px-3 text-center ${o.eagle_score > 0 ? "text-blue-300" : "text-ivory/40"}`}>{o.eagle_score}</td>
                            <td className={`py-2 px-3 text-center ${o.owl_score > 0 ? "text-purple-300" : "text-ivory/40"}`}>{o.owl_score}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
