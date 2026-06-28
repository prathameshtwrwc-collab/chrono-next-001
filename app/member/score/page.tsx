import { PageHeader, Card } from "@/components/PortalLayout";
import { getMemberDashboardData } from "@/lib/data/dashboard";

export const revalidate = 60;

export default async function SleepScorePage() {
  const data = await getMemberDashboardData();
  const result = data?.latestResult;
  const totalScore = result?.total_score || 0;
  const scores = [
    ["Duration", totalScore > 0 ? Math.min(totalScore + 10, 100) : 0, "#f4b54d"],
    ["Depth", result?.lark_score || 0, "#354a82"],
    ["Timing", result?.owl_score || 0, "#e7a95b"],
    ["Recovery", result?.eagle_score || 0, "#f5d18c"],
  ];

  return (
    <>
      <PageHeader eyebrow="Chronotype Score" title={result ? `${totalScore} · ${result.chronotype}` : "No assessment yet"} sub={result ? `Confidence: ${result.confidence_score}%` : "Complete your assessment to see your score."} />
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="flex flex-col items-center justify-center">
          <div className="flex h-44 w-44 items-center justify-center rounded-full bg-gradient-to-br from-gold/20 to-transparent">
            <span className="font-serif text-6xl text-gold">{totalScore || "-"}</span>
          </div>
          <p className="mt-4 text-sm text-ivory/55">Total Score</p>
        </Card>
        <Card className="lg:col-span-2">
          <p className="mb-5 font-serif text-2xl">Score breakdown</p>
          <div className="space-y-5">
            {scores.map(([l, v, c]) => (
              <div key={l as string}>
                <div className="mb-1.5 flex justify-between text-sm">
                  <span className="text-ivory/70">{l}</span>
                  <span className="font-semibold">{v}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-ivory/10">
                  <div className="h-full rounded-full" style={{ width: `${v}%`, background: c as string }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}
