import { PageHeader, Card } from "@/components/PortalLayout";
import { MiniLine, Bars } from "@/components/charts";
import { getOrganizationDashboardData } from "@/lib/data/dashboard";

export const revalidate = 60;

export default async function AnalyticsPage() {
  const data = await getOrganizationDashboardData();

  return (
    <>
      <PageHeader eyebrow="Analytics" title="Organization analytics" sub="Behavioral and biological patterns scoped to your organization only." />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <p className="mb-4 font-serif text-2xl">Chronotype distribution</p>
          <Bars data={data.mix.map((item) => item[1])} h={130} color="#354a82" />
        </Card>
        <Card>
          <p className="mb-4 font-serif text-2xl">Engagement trend</p>
          <MiniLine data={[18, 22, 20, 27, 31, 36, 42]} h={130} color="#f4b54d" />
        </Card>
        <Card>
          <p className="mb-4 font-serif text-2xl">Members by source</p>
          <Bars data={[data.members.filter((m) => m.source === "ORGANIZATION").length, data.members.filter((m) => m.source === "DIRECT").length, data.members.filter((m) => m.source === "REFERRAL").length]} h={130} color="#e7a95b" />
        </Card>
        <Card>
          <p className="mb-4 font-serif text-2xl">Mapping health</p>
          <p className="text-ivory/60">Organization code: <span className="font-mono text-gold">{data.scope.uniqueCode || "Not assigned"}</span></p>
          <p className="mt-3 text-ivory/60">Link status: <span className="text-gold">{data.scope.linkActive ? "Active" : "Paused"}</span></p>
        </Card>
      </div>
    </>
  );
}
