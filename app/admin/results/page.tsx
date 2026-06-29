import { PageHeader, Card, Stat } from "@/components/PortalLayout";
import { Bars } from "@/components/charts";
import { getOrganizationDashboardData } from "@/lib/data/dashboard";

export const revalidate = 3600;

export default async function ResultsPage() {
  const data = await getOrganizationDashboardData();

  return (
    <>
      <PageHeader eyebrow="Assessments" title="Assessment pipeline" sub="Track completed chronotype results for your organization." />
      <div className="grid gap-6 sm:grid-cols-3">
        <Stat label="Completed" value={String(data.submissions.length)} />
        <Stat label="Lark %" value={`${data.mix[0][1]}%`} color="text-champagne" />
        <Stat label="Owl %" value={`${data.mix[2][1]}%`} color="text-sunrise" />
      </div>
      <Card className="mt-6">
        <p className="mb-4 font-serif text-2xl">Completions per week</p>
        <Bars data={[2, 5, 3, 6, 8, 7, 9, 12]} h={150} color="#354a82" />
      </Card>
      <Card className="mt-6">
        <p className="mb-4 font-serif text-2xl">Recent submissions</p>
        {data.submissions.map((r) => (
          <div key={`${r.email}-${r.date}`} className="flex items-center justify-between border-b border-ivory/5 py-3 last:border-0">
            <span className="text-ivory/80">{r.member}</span>
            <span className="text-sm text-ivory/55">{r.chronotype}</span>
            <span className="text-xs text-gold">{r.confidence}% confidence</span>
          </div>
        ))}
        {!data.submissions.length && <p className="text-sm text-ivory/45">No completed assessments yet.</p>}
      </Card>
    </>
  );
}
