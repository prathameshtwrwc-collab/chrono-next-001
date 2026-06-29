import { PageHeader, Card } from "@/components/PortalLayout";
import { AddGoalForm } from "@/components/AddGoalForm";
import { getMemberGoalsData } from "@/lib/data/dashboard";

export const revalidate = 3600;

export default async function GoalsPage() {
  const goals = await getMemberGoalsData();

  return (
    <>
      <PageHeader eyebrow="Goals" title="Where you're headed" sub="Small, rhythm-aligned commitments compound into transformation." action={<AddGoalForm />} />
      {goals.length ? (
        <div className="grid gap-6 md:grid-cols-2">
          {goals.map((g) => (
            <Card key={g.title}>
              <div className="flex items-center justify-between">
                <p className="font-serif text-2xl">{g.title}</p>
                <span className={`text-sm ${g.status === "ACTIVE" ? "text-emerald-400" : "text-ivory/40"}`}>
                  {g.status === "ACTIVE" ? "Active" : g.status}
                </span>
              </div>
              {g.description && <p className="mt-2 text-sm text-ivory/50">{g.description}</p>}
              {g.targetDate && <p className="mt-2 text-xs text-ivory/40">Target: {new Date(g.targetDate).toLocaleDateString()}</p>}
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <p className="text-sm text-ivory/45">No goals set yet. Goals will appear here after you create them.</p>
        </Card>
      )}
    </>
  );
}
