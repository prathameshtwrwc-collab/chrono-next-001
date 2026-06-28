"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { CircleX, Copy, Download, ExternalLink, MessageCircle, Printer, Share2, UserPlus } from "lucide-react";
import { submitAssessment } from "@/app/actions/assessment";
import { assessmentQuestions, scoreAssessment, type ChronotypeResult } from "@/lib/assessment";

type Details = {
  firstName: string;
  lastName: string;
  age: string;
  gender: string;
  marital_status: string;
  department: string;
  location: string;
  country: string;
  city: string;
  pincode: string;
  occupation: string;
  email: string;
  phone: string;
  organizationCode: string;
  referralCode: string;
};

const emptyDetails: Details = {
  firstName: "",
  lastName: "",
  age: "",
  gender: "",
  marital_status: "",
  department: "",
  location: "",
  country: "",
  city: "",
  pincode: "",
  occupation: "",
  email: "",
  phone: "",
  organizationCode: "",
  referralCode: "",
};

const genderOptions = ["", "Male", "Female", "Non-Binary", "Prefer not to say"];
const maritalOptions = ["", "Single", "Married", "Divorced", "Widowed", "Prefer not to say"];

const fields: Array<{ key: keyof Details; label: string; type?: string; optional?: boolean; span?: string; selectOptions?: string[] }> = [
  { key: "firstName", label: "First Name" },
  { key: "lastName", label: "Last Name" },
  { key: "age", label: "Age", type: "number" },
  { key: "gender", label: "Gender", selectOptions: genderOptions },
  { key: "marital_status", label: "Marital Status", selectOptions: maritalOptions },
  { key: "department", label: "Department", optional: true },
  { key: "location", label: "Location", optional: true },
  { key: "country", label: "Country" },
  { key: "city", label: "City" },
  { key: "pincode", label: "Pincode" },
  { key: "occupation", label: "Occupation" },
  { key: "email", label: "Email", type: "email", span: "md:col-span-2" },
  { key: "phone", label: "Phone", type: "tel", span: "md:col-span-2" },
  { key: "organizationCode", label: "Organization Code", optional: true },
  { key: "referralCode", label: "Referral Code", optional: true },
];

export function AssessmentModal({ onClose }: { onClose: () => void }) {
  const [screen, setScreen] = useState<"details" | "questions" | "result">("details");
  const [details, setDetails] = useState<Details>(emptyDetails);
  const [answers, setAnswers] = useState<string[]>([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [result, setResult] = useState<ChronotypeResult | null>(null);
  const [assessmentId, setAssessmentId] = useState<string | null>(null);
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();
  const [orgLocked, setOrgLocked] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  useEffect(() => {
    const url = new URL(window.location.href);
    const pathCode = url.pathname.split("/").filter(Boolean)[0];
    const reservedPaths = new Set(["admin", "member", "super", "superadmin", "sign-in", "sign-up", "reports", "unauthorized"]);
    const codeFromPath = pathCode && !reservedPaths.has(pathCode.toLowerCase()) ? pathCode.toUpperCase() : "";
    const orgFromQuery = url.searchParams.get("org") || "";
    const refFromQuery = url.searchParams.get("ref") || "";
    const detectedOrg = (codeFromPath.startsWith("REF-") ? "" : codeFromPath) || orgFromQuery.toUpperCase();

    if (detectedOrg) setOrgLocked(true);

    setDetails((current) => ({
      ...current,
      organizationCode: current.organizationCode || detectedOrg,
      referralCode: current.referralCode || (codeFromPath.startsWith("REF-") ? codeFromPath : "") || refFromQuery.toUpperCase(),
    }));
  }, []);

  const total = assessmentQuestions.length;
  const currentQuestion = assessmentQuestions[questionIndex];
  const detailsComplete = fields
    .filter((field) => !field.optional)
    .every((field) => details[field.key].trim().length > 0);

  const resultUrl = useMemo(() => {
    if (typeof window === "undefined") return "";
    return assessmentId ? `${window.location.origin}/reports/${assessmentId}` : window.location.href;
  }, [assessmentId]);

  const referralUrl = useMemo(() => {
    if (typeof window === "undefined" || !referralCode) return "";
    return `${window.location.origin}/${referralCode}`;
  }, [referralCode]);

  const update = (key: keyof Details, value: string) => {
    setDetails((current) => ({ ...current, [key]: value }));
  };

  const startQuestions = () => {
    if (!detailsComplete) {
      setMessage("Please complete the required details before starting.");
      return;
    }
    setMessage("");
    setScreen("questions");
  };

  const choose = (optionId: string) => {
    const nextAnswers = [...answers];
    nextAnswers[questionIndex] = optionId;
    setAnswers(nextAnswers);

    if (questionIndex < total - 1) {
      setTimeout(() => setQuestionIndex((index) => index + 1), 220);
      return;
    }

    finish(nextAnswers);
  };

  const finish = (finalAnswers: string[]) => {
    setMessage("");
    const localResult = scoreAssessment(finalAnswers);

    startTransition(async () => {
      const response = await submitAssessment({
        details: {
          ...details,
          age: Number(details.age),
          maritalStatus: details.marital_status,
          organizationCode: details.organizationCode || undefined,
          referralCode: details.referralCode || undefined,
        },
        answers: finalAnswers,
      });

      if (!response.ok) {
        setResult(localResult);
        setReferralCode(null);
        setAssessmentId(null);
        setMessage(response.message ? `Result shown. Backend save needs attention: ${response.message}` : "Result shown. Backend save needs attention.");
        setScreen("result");
        return;
      }

      setResult(response.result || localResult);
      setReferralCode(response.referralCode || null);
      setAssessmentId(response.assessmentId || null);
      setScreen("result");
    });
  };

  const downloadReport = async () => {
    if (!result || !assessmentId) return;
    try {
      const resp = await fetch("/api/reports/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: details.firstName,
          lastName: details.lastName,
          chronotype: result.chronotype,
          totalScore: result.totalScore,
          larkScore: result.larkScore,
          eagleScore: result.eagleScore,
          owlScore: result.owlScore,
          summary: result.summary,
          recommendations: [],
          orgName: details.organizationCode || "WelcomeCure",
          logoUrl: null,
        }),
      });
      if (!resp.ok) throw new Error("PDF generation failed");
      const blob = await resp.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `chronotype-report-${details.firstName || "member"}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      setMessage("Could not generate PDF. Please try again.");
    }
  };

  const copyShareLink = async () => {
    await navigator.clipboard.writeText(resultUrl);
    setMessage("Share link copied.");
  };

  const copyReferralLink = async () => {
    if (!referralUrl) return;
    await navigator.clipboard.writeText(referralUrl);
    setMessage("Referral link copied.");
  };

  const shareResult = async () => {
    const publicUrl = assessmentId ? `${window.location.origin}/reports/${assessmentId}` : resultUrl;
    const shareText = `I discovered my ${result?.title || "chronotype"} sleep rhythm. View my full result: ${publicUrl}`;
    if (navigator.share) {
      await navigator.share({ title: "Chronotype Assessment", text: shareText, url: publicUrl });
      return;
    }
    try {
      await navigator.clipboard.writeText(publicUrl);
      setMessage("Result link copied to clipboard!");
    } catch {}
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-midnight/90 p-4 backdrop-blur-2xl overflow-hidden" onWheel={(e) => e.stopPropagation()}>
      <style>{`input[type=number]::-webkit-inner-spin-button,input[type=number]::-webkit-outer-spin-button{-webkit-appearance:none;margin:0}input[type=number]{-moz-appearance:textfield}`}</style>
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.97 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        style={{ maxHeight: "90vh", minHeight: "400px", overscrollBehavior: "contain" }}
        className="relative w-full max-w-6xl overflow-y-auto rounded-[2rem] border border-white/10 bg-gradient-to-br from-[#111d35] via-indigo-deep to-midnight text-ivory shadow-[0_30px_90px_rgba(0,0,0,0.58)]"
      >
        <button
          onClick={onClose}
          className="sticky top-4 z-20 float-right mr-4 flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/5 text-lg text-white/60 transition-all hover:bg-white/10 hover:text-white"
          aria-label="Close assessment"
        >
          <CircleX className="h-5 w-5" />
        </button>

        <AnimatePresence mode="wait">
            {screen === "details" && (
              <motion.div
                key="details"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid gap-0 lg:grid-cols-[0.85fr_1.15fr]"
              >
                <div className="relative min-h-[320px] overflow-hidden bg-midnight lg:min-h-[720px]">
                  <div
                    className="absolute inset-0 bg-cover bg-center opacity-80"
                    style={{ backgroundImage: "url('https://images.pexels.com/photos/3771069/pexels-photo-3771069.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1000&w=900')" }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-midnight via-midnight/70 to-midnight/5" />
                  <div className="absolute bottom-8 left-8 right-8">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.45em] text-gold">Begin the descent</p>
                    <h2 className="mt-4 font-serif text-4xl font-medium leading-tight md:text-5xl">
                      Your biology needs context first.
                    </h2>
                    <p className="mt-4 max-w-md text-sm leading-7 text-white/62">
                      We capture essentials before the questions so your result, report, organization mapping, and referral path can be stored correctly.
                    </p>
                  </div>
                </div>

                <div className="p-8 md:p-12">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.45em] text-gold/90">Data Fillups</p>
                  <h3 className="mt-3 font-serif text-3xl font-medium md:text-4xl">
                    Tell us who this sleep blueprint belongs to.
                  </h3>

                  <div className="mt-8 grid gap-4 md:grid-cols-2">
                    {fields.map((field) => {
                      const isOrgLocked = field.key === "organizationCode" && orgLocked;
                      return (
                        <label key={field.key} className={field.span || ""}>
                          <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.25em] text-white/42">
                            {field.label} {field.optional ? <span className="text-white/25">(optional)</span> : null}
                            {isOrgLocked && <span className="ml-2 text-gold/60">(auto-detected)</span>}
                          </span>
                          {field.selectOptions ? (
                            <select
                              value={details[field.key]}
                              onChange={(e) => update(field.key, e.target.value)}
                              className="w-full rounded-xl border border-white/12 bg-white/[0.045] px-4 py-3 text-sm text-ivory outline-none transition focus:border-gold/60 [&>option]:bg-indigo-deep"
                            >
                              {field.selectOptions.map((opt) => (
                                <option key={opt} value={opt} disabled={!opt}>{opt || "Select..."}</option>
                              ))}
                            </select>
                          ) : (
                            <input
                              type={field.type || "text"}
                              value={details[field.key]}
                              onChange={(e) => update(field.key, e.target.value)}
                              max={field.key === "age" ? 120 : undefined}
                              readOnly={isOrgLocked}
                              className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition ${
                                isOrgLocked
                                  ? "border-gold/20 bg-gold/[0.04] text-gold/80 cursor-not-allowed"
                                  : "border-white/12 bg-white/[0.045] text-ivory focus:border-gold/60 focus:bg-white/[0.07]"
                              }`}
                            />
                          )}
                        </label>
                      );
                    })}
                  </div>

                  {message && <p className="mt-5 rounded-xl border border-gold/20 bg-gold/10 px-4 py-3 text-sm text-gold">{message}</p>}

                  <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                    <button
                      onClick={startQuestions}
                      className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-champagne via-gold to-sunrise px-8 py-3.5 text-sm font-semibold text-midnight shadow-[0_8px_30px_rgba(244,181,77,0.35)] transition-transform hover:scale-[1.03]"
                    >
                      Begin Assessment
                    </button>
                    <p className="text-xs text-white/40">Organization and referral mapping are applied automatically.</p>
                  </div>
                </div>
              </motion.div>
            )}

            {screen === "questions" && (
              <motion.div
                key={`q-${questionIndex}`}
                initial={{ opacity: 0, x: 36 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -36 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="grid gap-0 md:grid-cols-5"
              >
                <div className="flex flex-col justify-center p-8 md:col-span-3 md:p-14">
                  <div className="mb-8 flex items-center justify-between">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.4em] text-gold/80">
                      Question {questionIndex + 1} / {total}
                    </span>
                    <span className="text-sm text-white/40">{Math.round(((questionIndex + 1) / total) * 100)}%</span>
                  </div>
                  <div className="mb-8 h-1 overflow-hidden rounded-full bg-white/10">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${((questionIndex + 1) / total) * 100}%` }}
                      className="h-full rounded-full bg-gradient-to-r from-champagne via-gold to-sunrise"
                    />
                  </div>

                  <h3 className="font-serif text-3xl font-medium leading-tight md:text-4xl">{currentQuestion.prompt}</h3>
                  {currentQuestion.context && <p className="mt-4 text-sm text-white/50">{currentQuestion.context}</p>}

                  <div className="mt-8 space-y-3">
                    {currentQuestion.options.map((option, index) => {
                      const selected = answers[questionIndex] === option.id;
                      return (
                        <button
                          key={option.id}
                          onClick={() => choose(option.id)}
                          disabled={isPending}
                          className={`group flex w-full items-center gap-4 rounded-2xl border p-5 text-left transition-all ${
                            selected
                              ? "border-gold/50 bg-gold/12 text-gold"
                              : "border-white/10 bg-white/[0.035] text-white/72 hover:border-white/25 hover:bg-white/[0.065]"
                          }`}
                        >
                          <span className={`flex h-9 w-9 flex-none items-center justify-center rounded-full text-sm font-semibold ${selected ? "bg-gold text-midnight" : "border border-white/20 text-white/50"}`}>
                            {String.fromCharCode(65 + index)}
                          </span>
                          <span className="text-base md:text-lg">{option.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  {message && <p className="mt-5 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-100">{message}</p>}

                  <div className="mt-8 flex items-center justify-between">
                    <button
                      onClick={() => {
                        if (questionIndex === 0) setScreen("details");
                        else setQuestionIndex((index) => index - 1);
                      }}
                      className="rounded-full border border-white/15 px-6 py-2.5 text-sm text-white/60 transition-colors hover:bg-white/10 hover:text-white"
                    >
                      Back
                    </button>
                    {isPending && <span className="text-sm text-gold">Submitting your rhythm...</span>}
                  </div>
                </div>

                <div className="relative hidden min-h-[560px] md:col-span-2 md:block">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(244,181,77,0.16),transparent_40%),linear-gradient(160deg,#15233d,#07101e)]" />
                  <div className="absolute inset-x-10 top-16 aspect-square rounded-full border border-gold/20" />
                  <div className="absolute inset-x-16 top-24 aspect-square rounded-full border border-white/10" />
                  <div className="absolute bottom-10 left-8 right-8">
                    <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-gold/70">Auto-saved on submit</p>
                    <div className="mt-3 flex gap-1.5">
                      {assessmentQuestions.map((_, index) => (
                        <div key={index} className={`h-1 flex-1 rounded-full ${index <= questionIndex ? "bg-gold" : "bg-white/15"}`} />
                      ))}
                    </div>
                    <p className="mt-5 font-serif text-2xl text-white/85">
                      Your rhythm is taking shape.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {screen === "result" && result && (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid gap-0 lg:grid-cols-[1fr_0.9fr]"
              >
                <div className="p-8 md:p-14">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.5em] text-gold/90">Assessment Complete</p>
                  <h2 className="mt-4 font-serif text-5xl font-medium leading-tight md:text-7xl">
                    You are a <span className="gold-text italic">{result.title}</span>
                  </h2>
                  <p className="mt-4 max-w-2xl text-lg leading-8 text-white/66">{result.tagline}</p>

                  <div className="mt-8 grid gap-4 md:grid-cols-3">
                    {[
                      ["Confidence", `${result.confidenceScore}%`],
                      ["Total Score", String(result.totalScore)],
                      ["Referral", referralCode || "Ready"],
                    ].map(([label, value]) => (
                      <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.045] p-5">
                        <p className="text-[10px] uppercase tracking-[0.28em] text-white/38">{label}</p>
                        <p className="mt-2 font-serif text-3xl text-gold">{value}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.04] p-6">
                    <p className="text-base leading-8 text-white/72">{result.summary}</p>
                    <div className="mt-6 grid gap-6 md:grid-cols-3">
                      {[
                        ["Strengths", result.strengths],
                        ["Challenges", result.challenges],
                        ["Optimize", result.suggestions],
                      ].map(([title, items]) => (
                        <div key={title as string}>
                          <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.28em] text-gold">{title as string}</p>
                          <div className="space-y-2">
                            {(items as string[]).map((item) => (
                              <p key={item} className="rounded-xl bg-white/[0.035] px-3 py-2 text-sm text-white/62">{item}</p>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {message && <p className="mt-5 text-sm text-gold">{message}</p>}

                  <div className="mt-8 flex flex-wrap gap-3">
                    <button onClick={downloadReport} className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-champagne via-gold to-sunrise px-6 py-3 text-sm font-semibold text-midnight">
                      <Download className="h-4 w-4" />
                      Download
                    </button>
                    <button onClick={async () => {
                      if (!result || !assessmentId) return;
                      const resp = await fetch("/api/reports/generate", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          firstName: details.firstName,
                          lastName: details.lastName,
                          chronotype: result.chronotype,
                          totalScore: result.totalScore,
                          larkScore: result.larkScore,
                          eagleScore: result.eagleScore,
                          owlScore: result.owlScore,
                          summary: result.summary,
                          recommendations: [],
                          orgName: details.organizationCode || "WelcomeCure",
                          logoUrl: null,
                        }),
                      });
                      if (resp.ok) { const blob = await resp.blob(); const url = URL.createObjectURL(blob); window.open(url, "_blank"); }
                    }} className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-white/72 hover:bg-white/10">
                      <Printer className="h-4 w-4" />
                      Print
                    </button>
                    <button onClick={shareResult} className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-white/72 hover:bg-white/10">
                      <Share2 className="h-4 w-4" />
                      Share
                    </button>
                    <button onClick={copyShareLink} className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-white/72 hover:bg-white/10">
                      <Copy className="h-4 w-4" />
                      Copy Link
                    </button>
                    <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(resultUrl)}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-white/72 hover:bg-white/10">
                      <ExternalLink className="h-4 w-4" />
                      LinkedIn
                    </a>
                    <a href={`https://wa.me/?text=${encodeURIComponent(`I discovered my ${result.title} chronotype. Try yours: ${resultUrl}`)}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-white/72 hover:bg-white/10">
                      <MessageCircle className="h-4 w-4" />
                      WhatsApp
                    </a>
                  </div>
                </div>

                <div className="relative flex min-h-[520px] flex-col justify-between overflow-hidden border-t border-white/10 bg-midnight/40 p-8 md:p-12 lg:border-l lg:border-t-0">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_12%,rgba(244,181,77,0.2),transparent_34%)]" />
                  <div className="relative">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.45em] text-gold/90">Your next move</p>
                    <h3 className="mt-4 font-serif text-4xl leading-tight">Save your result and invite someone into better sleep.</h3>
                    <p className="mt-4 text-sm leading-7 text-white/58">
                      Your member profile is stored in Supabase. Clerk account linking activates the protected dashboard and long-term report access.
                    </p>
                  </div>

                  <div className="relative space-y-4">
                    <div className="rounded-2xl border border-gold/20 bg-gold/10 p-5">
                      <p className="text-[10px] uppercase tracking-[0.28em] text-gold">Refer a friend</p>
                      <p className="mt-2 font-mono text-xl text-white">{referralCode || "Generating..."}</p>
                      <p className="mt-2 text-sm text-white/55">Referral users stay under WelcomeCure unless an organization code is explicitly used.</p>
                      {referralUrl && (
                        <button onClick={copyReferralLink} className="mt-4 inline-flex items-center gap-2 rounded-full border border-gold/30 px-4 py-2 text-xs font-semibold text-gold hover:bg-gold/10">
                          <UserPlus className="h-4 w-4" />
                          Copy referral link
                        </button>
                      )}
                    </div>
                    <div className="flex flex-col gap-3">
                      <Link href={`/sign-up?email=${encodeURIComponent(details.email)}`} className="rounded-full bg-white px-6 py-3 text-center text-sm font-semibold text-midnight">
                        Create / Link Member Account
                      </Link>
                      <Link href="/member" onClick={onClose} className="rounded-full border border-white/15 px-6 py-3 text-center text-sm font-semibold text-white/72 hover:bg-white/10">
                        Open Dashboard
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
      </motion.div>
    </div>
  );
}
