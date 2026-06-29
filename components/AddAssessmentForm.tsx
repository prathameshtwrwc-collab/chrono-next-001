"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { createAssessmentAction } from "@/app/actions/assessments";

type QuestionDraft = {
  key: string;
  question_text: string;
  category: string;
  options: { option_text: string; option_value: string; lark_score: number; eagle_score: number; owl_score: number }[];
};

let keyCounter = 0;
const newKey = () => `q_${++keyCounter}`;

const emptyOption = () => ({ option_text: "", option_value: "", lark_score: 0, eagle_score: 0, owl_score: 0 });

const defaultQuestions: QuestionDraft[] = [
  {
    key: newKey(),
    question_text: "",
    category: "sleep",
    options: [emptyOption(), emptyOption(), emptyOption(), emptyOption(), emptyOption()],
  },
];

export function AddAssessmentForm() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState<QuestionDraft[]>(defaultQuestions);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  const addQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      { key: newKey(), question_text: "", category: "sleep", options: [emptyOption(), emptyOption(), emptyOption(), emptyOption(), emptyOption()] },
    ]);
  };

  const updateQuestion = (key: string, field: string, value: string) => {
    setQuestions((prev) => prev.map((q) => (q.key === key ? { ...q, [field]: value } : q)));
  };

  const updateOption = (qKey: string, oIndex: number, field: string, value: string | number) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.key === qKey ? { ...q, options: q.options.map((o, i) => (i === oIndex ? { ...o, [field]: value } : o)) } : q
      )
    );
  };

  const removeQuestion = (key: string) => {
    setQuestions((prev) => prev.filter((q) => q.key !== key));
  };

  const submit = async () => {
    if (!name.trim()) { setMessage("Name is required."); return; }
    const validQuestions = questions.filter((q) => q.question_text.trim());
    if (!validQuestions.length) { setMessage("At least one question with text is required."); return; }
    setMessage("");
    setSaving(true);
    const result = await createAssessmentAction({
      name,
      description,
      questions: validQuestions.map((q, qi) => ({
        question_text: q.question_text,
        question_order: qi + 1,
        question_type: "single_choice",
        category: q.category || undefined,
        options: q.options
          .filter((o) => o.option_text.trim())
          .map((o, oi) => ({
            option_text: o.option_text,
            option_value: o.option_value || o.option_text.toLowerCase().replace(/\s+/g, "_"),
            option_order: oi + 1,
            lark_score: o.lark_score,
            eagle_score: o.eagle_score,
            owl_score: o.owl_score,
          })),
      })),
    });
    setMessage(result.message);
    setSaving(false);
    if (result.ok) {
      setName("");
      setDescription("");
      setQuestions(defaultQuestions.map((q) => ({ ...q, key: newKey() })));
      setTimeout(() => setOpen(false), 1500);
    }
  };

  return (
    <>
      <button onClick={() => setOpen(true)} className="rounded-full bg-gradient-to-r from-champagne via-gold to-sunrise px-6 py-3 text-sm font-semibold text-midnight shadow-[0_8px_30px_rgba(244,181,77,0.25)]">
        Add Assessment
      </button>
      {open && typeof window === "object" && createPortal(
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-midnight/80 p-4 backdrop-blur-xl overflow-y-auto" onClick={() => setOpen(false)}>
          <div className="w-full max-w-4xl my-8 rounded-2xl border border-white/10 bg-indigo-deep p-6 text-ivory shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-gold">Super Admin</p>
                <h2 className="mt-2 font-serif text-3xl">Create Assessment Version</h2>
                <p className="mt-2 text-sm text-white/55">Define questions, options, and chronotype scores for each option.</p>
              </div>
              <button type="button" onClick={() => setOpen(false)} className="rounded-full border border-white/15 px-4 py-2 text-sm text-white/60">Close</button>
            </div>

            <div className="mt-6 space-y-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <label>
                  <span className="mb-2 block text-[10px] uppercase tracking-[0.25em] text-white/42">Assessment Name</span>
                  <input value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-xl border border-white/12 bg-white/[0.045] px-4 py-3 text-sm outline-none focus:border-gold/60" />
                </label>
                <label>
                  <span className="mb-2 block text-[10px] uppercase tracking-[0.25em] text-white/42">Description</span>
                  <input value={description} onChange={(e) => setDescription(e.target.value)} className="w-full rounded-xl border border-white/12 bg-white/[0.045] px-4 py-3 text-sm outline-none focus:border-gold/60" />
                </label>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <p className="font-serif text-2xl">Questions</p>
                  <button onClick={addQuestion} className="rounded-full border border-gold/40 px-4 py-2 text-xs text-gold hover:bg-gold/10">+ Add Question</button>
                </div>
                {questions.map((q, qi) => (
                  <div key={q.key} className="rounded-2xl border border-white/10 bg-white/[0.035] p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-4">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_200px]">
                          <label>
                            <span className="mb-1 block text-[10px] uppercase tracking-[0.25em] text-white/42">Question {qi + 1}</span>
                            <input value={q.question_text} onChange={(e) => updateQuestion(q.key, "question_text", e.target.value)} className="w-full rounded-xl border border-white/12 bg-white/[0.045] px-4 py-3 text-sm outline-none focus:border-gold/60" />
                          </label>
                          <label>
                            <span className="mb-1 block text-[10px] uppercase tracking-[0.25em] text-white/42">Category</span>
                            <input value={q.category} onChange={(e) => updateQuestion(q.key, "category", e.target.value)} className="w-full rounded-xl border border-white/12 bg-white/[0.045] px-4 py-3 text-sm outline-none focus:border-gold/60" />
                          </label>
                        </div>
                        <div>
                          <p className="mb-2 text-[10px] uppercase tracking-[0.25em] text-white/42">Options (Lark / Eagle / Owl scores)</p>
                          <div className="space-y-2">
                            {q.options.map((o, oi) => (
                              <div key={oi} className="grid grid-cols-[1fr_80px_80px_80px] gap-2 items-center">
                                <input value={o.option_text} onChange={(e) => updateOption(q.key, oi, "option_text", e.target.value)} placeholder={`Option ${oi + 1}`} className="rounded-xl border border-white/12 bg-white/[0.045] px-3 py-2 text-sm outline-none focus:border-gold/60" />
                                <input type="number" value={o.lark_score} onChange={(e) => updateOption(q.key, oi, "lark_score", Number(e.target.value))} className="rounded-xl border border-white/12 bg-white/[0.045] px-2 py-2 text-xs text-center outline-none focus:border-gold/60 hide-spinner" />
                                <input type="number" value={o.eagle_score} onChange={(e) => updateOption(q.key, oi, "eagle_score", Number(e.target.value))} className="rounded-xl border border-white/12 bg-white/[0.045] px-2 py-2 text-xs text-center outline-none focus:border-gold/60 hide-spinner" />
                                <input type="number" value={o.owl_score} onChange={(e) => updateOption(q.key, oi, "owl_score", Number(e.target.value))} className="rounded-xl border border-white/12 bg-white/[0.045] px-2 py-2 text-xs text-center outline-none focus:border-gold/60 hide-spinner" />
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      {questions.length > 1 && (
                        <button onClick={() => removeQuestion(q.key)} className="rounded-full border border-red-400/30 px-3 py-1 text-xs text-red-400 hover:bg-red-400/10">Remove</button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {message && <p className={`text-sm ${message.includes("created") ? "text-emerald-400" : "text-gold"}`}>{message}</p>}

              <div className="flex justify-end gap-3">
                <button onClick={() => setOpen(false)} className="rounded-full border border-white/15 px-6 py-2.5 text-sm text-white/60">Cancel</button>
                <button onClick={submit} disabled={saving} className="rounded-full bg-gradient-to-r from-champagne via-gold to-sunrise px-7 py-2.5 text-sm font-semibold text-midnight disabled:opacity-50">
                  {saving ? "Creating..." : "Create Assessment"}
                </button>
              </div>
            </div>
          </div>
        </div>, document.body
      )}
    </>
  );
}
