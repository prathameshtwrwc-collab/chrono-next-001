import { createSupabaseAdmin } from "@/utils/supabase/admin";
import { PageHeader, Card } from "@/components/PortalLayout";
import { Pagination } from "@/components/Pagination";
import { AddRecommendationForm } from "@/components/AddRecommendationForm";
import { DeleteButton } from "./DeleteButton";
import { cache } from "react";

export const revalidate = 3600;

const getRecs = cache(async () => {
  const supabase = createSupabaseAdmin();
  if (!supabase) return [];
  const { data } = await supabase.from("recommendations").select("*").order("priority_order", { ascending: true });
  return data || [];
});

export default async function RecommendationsPage({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const limit = 10;
  const all = await getRecs();
  const totalPages = Math.ceil(all.length / limit);
  const recs = all.slice((page - 1) * limit, page * limit);

  return (
    <>
      <PageHeader eyebrow="Recommendations" title="Chronotype recommendations" action={<AddRecommendationForm />} />
      <Card className="overflow-x-auto p-0">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-ivory/10 text-left text-xs uppercase tracking-widest text-ivory/40">
              {["Title", "Chronotype", "Category", "Priority", "Active", ""].map((h) => (
                <th key={h} className="px-6 py-4 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {recs.map((r: any) => (
              <tr key={r.id} className="border-b border-ivory/5 hover:bg-ivory/[0.03]">
                <td className="px-6 py-4 text-ivory/85">{r.title}</td>
                <td className="px-6 py-4">
                  <span className={`rounded-full px-2.5 py-1 text-xs ${r.chronotype === "LARK" ? "bg-amber-400/15 text-amber-300" : r.chronotype === "EAGLE" ? "bg-blue-400/15 text-blue-300" : "bg-purple-400/15 text-purple-300"}`}>
                    {r.chronotype}
                  </span>
                </td>
                <td className="px-6 py-4 text-ivory/60">{r.category}</td>
                <td className="px-6 py-4 text-ivory/60">{r.priority_order}</td>
                <td className="px-6 py-4">
                  <span className={`rounded-full px-2 py-0.5 text-xs ${r.is_active ? "bg-emerald-400/15 text-emerald-300" : "bg-ivory/10 text-ivory/60"}`}>
                    {r.is_active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-6 py-4"><DeleteButton id={r.id} /></td>
              </tr>
            ))}
            {!recs.length && <tr><td colSpan={6} className="px-6 py-10 text-center text-ivory/45">No recommendations yet.</td></tr>}
          </tbody>
        </table>
      </Card>
      <Pagination current={page} total={totalPages} />
    </>
  );
}
