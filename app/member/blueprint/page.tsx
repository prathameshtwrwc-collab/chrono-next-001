import { PageHeader, Card } from "@/components/PortalLayout";
import { getMemberDashboardData } from "@/lib/data/dashboard";

export const revalidate = 3600;

export default async function BlueprintPage() {
  const data = await getMemberDashboardData();
  const r = data?.latestResult;

  const cards = [
    { label: "Chronotype", value: r?.chronotype || "Pending", desc: "Determined by your assessment responses." },
    { label: "Total Score", value: String(r?.total_score || "-"), desc: `Confidence: ${r?.confidence_score || 0}%` },
    { label: "Lark Score", value: String(r?.lark_score || 0), desc: "Morning energy alignment" },
    { label: "Owl Score", value: String(r?.owl_score || 0), desc: "Evening energy alignment" },
    { label: "Eagle Score", value: String(r?.eagle_score || 0), desc: "Balanced energy profile" },
  ];

  return (
    <>
      <PageHeader eyebrow="Sleep Blueprint" title="Your personal blueprint" sub="Based on your chronotype assessment results." />
      <div className="grid gap-6 lg:grid-cols-2">
        {cards.map((b) => (
          <Card key={b.label}>
            <p className="text-xs uppercase tracking-widest text-ivory/40">{b.label}</p>
            <p className="mt-2 font-serif text-3xl text-gold">{b.value}</p>
            <p className="mt-2 text-sm text-ivory/55">{b.desc}</p>
          </Card>
        ))}
      </div>
    </>
  );
}
