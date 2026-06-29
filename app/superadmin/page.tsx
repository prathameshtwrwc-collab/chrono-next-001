import { PageHeader, Card, Stat } from "@/components/PortalLayout";
import { MiniLine } from "@/components/charts";
import { GoldButton } from "@/components/ui";
import { getPlatformDashboardData } from "@/lib/data/dashboard";

export const revalidate = 3600;

export default async function CommandCenter() {
  const data = await getPlatformDashboardData();

  return (
    <>
      <PageHeader
        eyebrow="Platform Command Center"
        title="WelcomeCure global view"
        sub="All direct, referral, and organization assessment activity across the platform."
        action={<GoldButton to="/superadmin/organizations">Manage Organizations</GoldButton>}
      />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {data.stats.map((s) => (
          <Stat key={s.label} {...s} />
        ))}
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <p className="mb-4 font-serif text-2xl">Platform growth signal</p>
          <MiniLine data={[10, 14, 18, 22, 28, 35, 43, 51, 62, 74, 88, 100]} h={160} color="#f4b54d" />
        </Card>
        <Card>
          <p className="mb-4 font-serif text-2xl">Chronotype distribution</p>
          {data.mix.map(([l, v, c]) => (
            <div key={l} className="mb-3">
              <div className="mb-1 flex justify-between text-sm">
                <span className="text-ivory/70">{l}</span>
                <span>{v}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-ivory/10">
                <div className="h-full rounded-full" style={{ width: `${v}%`, background: c }} />
              </div>
            </div>
          ))}
        </Card>
      </div>
    </>
  );
}
