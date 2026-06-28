import { PageHeader, Card, Stat } from "@/components/PortalLayout";
import { Bars, MiniLine, Ring } from "@/components/charts";
import { getPlatformDashboardData } from "@/lib/data/dashboard";

export const revalidate = 60;

export default async function ReportsPage() {
  const data = await getPlatformDashboardData();
  const total = data.mix.reduce((s, m) => s + m[1], 0);
  const [larks, eagles, owls] = data.mix.map((m) => m[1]);

  return (
    <>
      <PageHeader eyebrow="Global Analytics" title="Worldwide intelligence" sub="Aggregate, anonymized patterns across the entire CHRONOTYPE network." />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {data.stats.map((s) => (
          <Stat key={s.label} {...s} />
        ))}
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <p className="mb-4 font-serif text-2xl">Chronotype distribution</p>
          <div className="flex items-end justify-center gap-8">
            <Ring value={larks} size={110} color="#f4b54d" label="Larks" />
            <Ring value={eagles} size={110} color="#354a82" label="Eagles" />
            <Ring value={owls} size={110} color="#e9e2f5" label="Owls" />
          </div>
          <div className="mt-6 h-3 overflow-hidden rounded-full bg-ivory/10 flex">
            <div className="h-full rounded-l-full" style={{ width: `${larks}%`, background: "#f4b54d" }} />
            <div className="h-full" style={{ width: `${eagles}%`, background: "#354a82" }} />
            <div className="h-full rounded-r-full" style={{ width: `${owls}%`, background: "#e9e2f5" }} />
          </div>
          <div className="mt-3 flex justify-between text-xs text-ivory/40">
            <span>Lark {larks}%</span>
            <span>Eagle {eagles}%</span>
            <span>Owl {owls}%</span>
          </div>
        </Card>
        <Card>
          <p className="mb-4 font-serif text-2xl">Assessment completion</p>
          <Bars data={[larks || 1, eagles || 1, owls || 1]} h={140} color="#f4b54d" />
          <div className="mt-3 flex justify-between text-xs text-ivory/40">
            <span>Larks</span>
            <span>Eagles</span>
            <span>Owls</span>
          </div>
        </Card>
      </div>
      {!total && (
        <Card className="mt-6">
          <p className="text-center text-sm text-ivory/45">No assessment results yet. Data will appear after members complete assessments.</p>
        </Card>
      )}
    </>
  );
}
