import { PageHeader, Card } from "@/components/PortalLayout";
import { CircadianOrbit } from "@/components/CircadianOrbit";
import { getMemberDashboardData } from "@/lib/data/dashboard";

export const revalidate = 60;

export default async function ChronotypePage() {
  const data = await getMemberDashboardData();
  const result = data?.latestResult;
  const chronotype = result?.chronotype || "EAGLE";

  return (
    <>
      <PageHeader eyebrow="Chronotype Result" title={`You are ${chronotype}`} sub={result ? `Confidence: ${result.confidence_score}%.` : "Complete an assessment to generate your result."} />
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="relative overflow-hidden lg:col-span-1">
          <CircadianOrbit className="mx-auto h-48 w-48" />
          <p className="mt-4 text-center font-serif text-3xl text-gold">{chronotype}</p>
          <p className="text-center text-sm text-ivory/50">Personal rhythm intelligence</p>
        </Card>
        <Card className="lg:col-span-2">
          <p className="mb-4 font-serif text-2xl">What this means for you</p>
          <p className="leading-relaxed text-ivory/65">Your dashboard now reflects the latest completed assessment stored in Supabase. The next phase will add richer report rendering, progress history, and goals.</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {[["Lark", result?.lark_score || 0], ["Eagle", result?.eagle_score || 0], ["Owl", result?.owl_score || 0]].map(([l, v]) => (
              <div key={l} className="rounded-xl border border-ivory/10 bg-ivory/[0.03] p-4">
                <p className="text-xs uppercase tracking-widest text-ivory/40">{l}</p>
                <p className="mt-1 font-serif text-2xl text-champagne">{v}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}
