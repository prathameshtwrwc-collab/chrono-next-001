import { PageHeader, Card, Stat } from "@/components/PortalLayout";
import { MiniLine } from "@/components/charts";
import { GoldButton } from "@/components/ui";
import { getOrganizationDashboardData } from "@/lib/data/dashboard";

export const revalidate = 60;

export default async function AdminOverview() {
  const data = await getOrganizationDashboardData();

  return (
    <>
      <PageHeader
        eyebrow={`Organization - ${data.scope.organizationName}`}
        title="Wellbeing overview"
        sub="Only members mapped to this organization code are visible here."
        action={<GoldButton to="/admin/share-link">Share Assessment Link</GoldButton>}
      />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {data.stats.map((s) => (
          <Stat key={s.label} {...s} />
        ))}
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <p className="mb-4 font-serif text-2xl">Assessment activity</p>
          <MiniLine data={[12, 18, 15, 24, 30, 28, 36, 42]} h={150} color="#f4b54d" />
        </Card>
        <Card>
          <p className="mb-4 font-serif text-2xl">Chronotype mix</p>
          {data.mix.map(([l, v, c]) => (
            <div key={l} className="mb-4">
              <div className="mb-1 flex justify-between text-sm"><span className="text-ivory/70">{l}</span><span>{v}%</span></div>
              <div className="h-2 overflow-hidden rounded-full bg-ivory/10"><div className="h-full rounded-full" style={{ width: `${v}%`, background: c }} /></div>
            </div>
          ))}
        </Card>
      </div>
    </>
  );
}
