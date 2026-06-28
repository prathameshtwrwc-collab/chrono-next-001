import { notFound } from "next/navigation";
import { createSupabaseAdmin } from "@/utils/supabase/admin";
import Link from "next/link";
import { cache } from "react";

export const revalidate = 3600;

const getReport = cache(async (assessmentId: string) => {
  const supabase = createSupabaseAdmin();
  if (!supabase) return null;

  const { data: assessment } = await supabase
    .from("assessments")
    .select("id, member_id, created_at, chronotype_results(chronotype, total_score, confidence_score, lark_score, eagle_score, owl_score)")
    .eq("id", assessmentId)
    .single();

  if (!assessment) return null;

  const memberId = (assessment as any).member_id;
  if (!memberId) return null;

  const { data: member } = await supabase
    .from("members")
    .select("first_name, last_name, email")
    .eq("id", memberId)
    .single();

  const result = Array.isArray(assessment.chronotype_results)
    ? assessment.chronotype_results[0]
    : (assessment as any).chronotype_results;

  return {
    assessmentId: assessment.id,
    firstName: (member as any)?.first_name || "",
    lastName: (member as any)?.last_name || "",
    email: (member as any)?.email || "",
    chronotype: (result as any)?.chronotype || "EAGLE",
    totalScore: (result as any)?.total_score ?? 0,
    confidenceScore: (result as any)?.confidence_score ?? 0,
    larkScore: (result as any)?.lark_score ?? 0,
    eagleScore: (result as any)?.eagle_score ?? 0,
    owlScore: (result as any)?.owl_score ?? 0,
    date: new Date(assessment.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
  };
});

export default async function PublicReportPage({ params }: { params: Promise<{ assessmentId: string }> }) {
  const { assessmentId } = await params;
  const data = await getReport(assessmentId);
  if (!data) notFound();

  const ct = data.chronotype;
  const chronoColor = ct === "LARK" ? "text-amber-300" : ct === "OWL" ? "text-purple-300" : "text-blue-300";
  const chronoBg = ct === "LARK" ? "bg-amber-400/15" : ct === "OWL" ? "bg-purple-400/15" : "bg-blue-400/15";
  const name = [data.firstName, data.lastName].filter(Boolean).join(" ") || "Anonymous";

  return (
    <div className="min-h-screen bg-[#f0efe9] text-[#1a1a2e] flex items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="bg-[#1a1a2e] p-8 text-center">
          <span className={`inline-block px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${chronoBg} ${chronoColor}`}>
            {ct}
          </span>
          <h1 className="text-4xl font-extrabold text-white mt-3 tracking-tight">{ct}</h1>
          <p className="text-white/60 text-sm mt-1">Chronotype Assessment Result</p>
          <p className="text-white/90 text-xl font-semibold mt-4">{name}</p>
          <p className="text-white/40 text-xs mt-1">{data.date}</p>
        </div>

        <div className="p-8 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#f8f7f2] rounded-xl p-5 border border-[#e2ddd0]">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#99927a]">Total Score</p>
              <p className="text-3xl font-extrabold text-[#b8860b] mt-1">{data.totalScore}</p>
            </div>
            <div className="bg-[#f8f7f2] rounded-xl p-5 border border-[#e2ddd0]">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#99927a]">Confidence</p>
              <p className="text-3xl font-extrabold text-[#b8860b] mt-1">{data.confidenceScore}%</p>
            </div>
          </div>

          <div className="bg-[#f8f7f2] rounded-xl p-5 border border-[#e2ddd0]">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#99927a] mb-3">Score Breakdown</p>
            <div className="flex justify-around">
              {[
                { label: "Lark", value: data.larkScore, color: "text-amber-600" },
                { label: "Eagle", value: data.eagleScore, color: "text-blue-600" },
                { label: "Owl", value: data.owlScore, color: "text-purple-600" },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <p className="text-2xl font-bold ${s.color}">{s.value}</p>
                  <p className="text-xs text-[#99927a] uppercase tracking-wider mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center">
            <Link href="/" className="inline-block bg-[#b8860b] text-white px-8 py-3 rounded-full text-sm font-semibold hover:bg-[#a07609] transition-colors">
              Take Your Assessment
            </Link>
          </div>
        </div>

        <div className="border-t border-[#e2ddd0] p-4 text-center text-xs text-[#99927a]">
          Powered by CHRONOTYPE Intelligence
        </div>
      </div>
    </div>
  );
}
