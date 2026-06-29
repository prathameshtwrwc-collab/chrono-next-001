import { PageHeader, Card } from "@/components/PortalLayout";
import { getMemberDashboardData } from "@/lib/data/dashboard";

export const revalidate = 3600;

export default async function RecommendationsPage() {
  const data = await getMemberDashboardData();
  const chronotype = data?.latestResult?.chronotype || "your biology";

  return (
    <>
      <PageHeader eyebrow="Recommendations" title="Tuned to your biology" sub={`Personalized protocols generated from ${chronotype}.`} />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {(data?.recommendations || []).map((r) => (
          <Card key={r.title} className="group transition-colors hover:bg-ivory/[0.07]">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-royal to-elegant text-xl">{r.icon || "*"}</div>
            <p className="text-xs uppercase tracking-widest text-gold/70">{r.category}</p>
            <p className="mt-1 font-serif text-2xl">{r.title}</p>
            <p className="mt-2 text-sm text-ivory/55">{r.description}</p>
          </Card>
        ))}
        {!data?.recommendations?.length && <Card><p className="text-ivory/55">Recommendations will appear after your first assessment.</p></Card>}
      </div>
    </>
  );
}
