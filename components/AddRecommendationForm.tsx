"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { saveRecommendationAction, deleteRecommendationAction } from "@/app/actions/extras";

const chronotypes = ["LARK", "EAGLE", "OWL"];
const categories = ["sleep", "energy", "nutrition", "movement", "light", "recovery", "deep_work", "wind_down"];

export function AddRecommendationForm() {
  const [open, setOpen] = useState(false);
  const [chronotype, setChronotype] = useState("EAGLE");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("sleep");
  const [icon, setIcon] = useState("");
  const [priority, setPriority] = useState("0");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    if (!title.trim() || !description.trim()) { setMessage("Title and description required."); return; }
    setSaving(true); setMessage("");
    const res = await saveRecommendationAction({ chronotype, title, description, category, icon, priority_order: priority, action_items: [] });
    setMessage(res.message);
    setSaving(false);
    if (res.ok) { setTitle(""); setDescription(""); setTimeout(() => setOpen(false), 1000); }
  };

  return (
    <>
      <button onClick={() => setOpen(true)} className="rounded-full bg-gradient-to-r from-champagne via-gold to-sunrise px-6 py-3 text-sm font-semibold text-midnight shadow-[0_8px_30px_rgba(244,181,77,0.25)]">
        Add Recommendation
      </button>
      {open && typeof window === "object" && createPortal(
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-midnight/80 p-4 backdrop-blur-xl overflow-y-auto" onClick={() => setOpen(false)}>
          <div className="w-full max-w-lg my-8 rounded-2xl border border-white/10 bg-indigo-deep p-6 text-ivory shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between gap-4 mb-6">
              <p className="font-serif text-2xl">Add Recommendation</p>
              <button onClick={() => setOpen(false)} className="rounded-full border border-white/15 px-4 py-2 text-sm text-white/60">Close</button>
            </div>
            <div className="space-y-4">
              <label><span className="mb-2 block text-[10px] uppercase text-white/42">Chronotype</span>
                <select value={chronotype} onChange={(e) => setChronotype(e.target.value)} className="w-full rounded-xl border border-white/12 bg-white/[0.045] px-4 py-3 text-sm outline-none focus:border-gold/60 [&>option]:bg-indigo-deep">
                  {chronotypes.map((c) => (<option key={c} value={c}>{c}</option>))}
                </select>
              </label>
              <label><span className="mb-2 block text-[10px] uppercase text-white/42">Title</span>
                <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded-xl border border-white/12 bg-white/[0.045] px-4 py-3 text-sm outline-none focus:border-gold/60" />
              </label>
              <label><span className="mb-2 block text-[10px] uppercase text-white/42">Description</span>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="w-full rounded-xl border border-white/12 bg-white/[0.045] px-4 py-3 text-sm outline-none focus:border-gold/60" />
              </label>
              <div className="grid grid-cols-2 gap-4">
                <label><span className="mb-2 block text-[10px] uppercase text-white/42">Category</span>
                  <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full rounded-xl border border-white/12 bg-white/[0.045] px-4 py-3 text-sm outline-none focus:border-gold/60 [&>option]:bg-indigo-deep">
                    {categories.map((c) => (<option key={c} value={c}>{c}</option>))}
                  </select>
                </label>
                <label><span className="mb-2 block text-[10px] uppercase text-white/42">Icon</span>
                  <input value={icon} onChange={(e) => setIcon(e.target.value)} className="w-full rounded-xl border border-white/12 bg-white/[0.045] px-4 py-3 text-sm outline-none focus:border-gold/60" />
                </label>
              </div>
              <label><span className="mb-2 block text-[10px] uppercase text-white/42">Priority</span>
                <input type="number" value={priority} onChange={(e) => setPriority(e.target.value)} className="w-full rounded-xl border border-white/12 bg-white/[0.045] px-4 py-3 text-sm outline-none focus:border-gold/60" />
              </label>
            </div>
            {message && <p className={`mt-4 text-sm ${message.includes("added") ? "text-emerald-400" : "text-gold"}`}>{message}</p>}
            <button onClick={submit} disabled={saving} className="mt-6 w-full rounded-full bg-gradient-to-r from-champagne via-gold to-sunrise px-7 py-3 text-sm font-semibold text-midnight disabled:opacity-50">
              {saving ? "Saving..." : "Save Recommendation"}
            </button>
          </div>
        </div>, document.body
      )}
    </>
  );
}
