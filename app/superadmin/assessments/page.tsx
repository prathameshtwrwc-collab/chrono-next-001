import { PageHeader, Card } from "@/components/PortalLayout";
import { Pagination } from "@/components/Pagination";
import { AddAssessmentForm } from "@/components/AddAssessmentForm";
import { getAssessmentVersions, getScoringRules } from "@/lib/data/dashboard";
import { ViewAssessmentButton } from "./ViewAssessmentButton";
import { ActivateButton } from "./ActivateButton";

export const revalidate = 60;

export default async function AssessmentsPage({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const limit = 10;
  const all = await getAssessmentVersions();
  const totalPages = Math.ceil(all.length / limit);
  const versions = all.slice((page - 1) * limit, page * limit);
  const scoringRules = await getScoringRules();

  return (
    <>
      <PageHeader eyebrow="Assessments" title="Assessment versions" action={<AddAssessmentForm />} />
      <Card className="overflow-x-auto p-0">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-ivory/10 text-left text-xs uppercase tracking-widest text-ivory/40">
              {["Name", "Version", "Status", "Created", "Actions"].map((h) => (
                <th key={h} className="px-6 py-4 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {versions.map((v) => (
              <tr key={v.id} className="border-b border-ivory/5 hover:bg-ivory/[0.03]">
                <td className="px-6 py-4 text-ivory/85">{v.name}</td>
                <td className="px-6 py-4 font-mono text-gold">v{v.version}</td>
                <td className="px-6 py-4">
                  <span className={`rounded-full px-2.5 py-1 text-xs ${v.status === "ACTIVE" ? "bg-emerald-400/15 text-emerald-300" : v.status === "DRAFT" ? "bg-amber-400/15 text-amber-300" : "bg-ivory/10 text-ivory/60"}`}>
                    {v.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-ivory/50">{new Date(v.created_at).toLocaleDateString()}</td>
                <td className="px-6 py-4 flex gap-2">
                  <ViewAssessmentButton versionId={v.id} />
                  {v.status !== "ACTIVE" && <ActivateButton versionId={v.id} />}
                </td>
              </tr>
            ))}
            {!versions.length && <tr><td colSpan={5} className="px-6 py-10 text-center text-ivory/45">No assessment versions yet.</td></tr>}
          </tbody>
        </table>
      </Card>
      <Pagination current={page} total={totalPages} />

      <Card className="mt-6">
        <p className="mb-4 font-serif text-2xl">Scoring Rules</p>
        {scoringRules.length ? (
          <div className="grid gap-4 md:grid-cols-3">
            {["LARK", "EAGLE", "OWL"].map((ct) => {
              const rules = scoringRules.filter((r) => r.chronotype === ct);
              return (
                <div key={ct} className={`rounded-2xl border border-white/10 bg-white/[0.035] p-5`}>
                  <p className={`font-serif text-xl mb-3 ${ct === "LARK" ? "text-amber-300" : ct === "EAGLE" ? "text-blue-300" : "text-purple-300"}`}>{ct}</p>
                  {rules.length ? rules.map((r) => (
                    <div key={r.id} className="border-b border-ivory/5 py-2 text-sm last:border-0">
                      <span className="text-ivory/70">Score {r.minScore}–{r.maxScore}</span>
                      {r.isActive && <span className="ml-2 rounded-full bg-emerald-400/15 text-emerald-300 px-2 py-0.5 text-xs">Active</span>}
                    </div>
                  )) : <p className="text-sm text-ivory/45">No rules defined.</p>}
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-ivory/45">No scoring rules defined. Scoring is currently handled by the local assessment engine.</p>
        )}
      </Card>
    </>
  );
}
