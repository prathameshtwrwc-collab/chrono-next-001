import { PageHeader } from "@/components/PortalLayout";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { createSupabaseAdmin } from "@/utils/supabase/admin";
import { cache } from "react";

const searchMyData = cache(async (q: string, userId: string) => {
  const supabase = createSupabaseAdmin();
  if (!supabase || !q.trim()) return { items: [] };
  const term = `%${q.trim()}%`;
  const { data: member } = await supabase.from("members").select("id").eq("clerk_user_id", userId).maybeSingle();
  if (!member) return { items: [] };
  const mid = (member as any).id;
  const items: { label: string; href: string }[] = [];

  const [{ data: chrono }, { data: reports }, { data: goals }] = await Promise.all([
    supabase.from("chronotype_results").select("chronotype").eq("member_id", mid).limit(1).maybeSingle(),
    supabase.from("reports").select("title").eq("member_id", mid).ilike("title", term).limit(5),
    supabase.from("member_goals").select("title").eq("member_id", mid).ilike("title", term).limit(5),
  ]);

  if (chrono && (chrono as any).chronotype.toLowerCase().includes(q.toLowerCase())) {
    items.push({ label: `Chronotype: ${(chrono as any).chronotype}`, href: "/member/chronotype" });
  }
  (reports || []).forEach((r: any) => items.push({ label: r.title || "Report", href: "/member/progress" }));
  (goals || []).forEach((g: any) => items.push({ label: g.title, href: "/member/goals" }));

  return { items };
});

export default async function MemberSearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { userId } = await auth();
  const { q = "" } = await searchParams;
  const results = userId && q ? await searchMyData(q, userId) : null;

  return (
    <>
      <PageHeader eyebrow="Search" title={q ? `Results for "${q}"` : "Search"} />
      {results ? results.items.map((item, i) => (
        <Link key={i} href={item.href} className="flex items-center justify-between rounded-xl border border-ivory/10 bg-ivory/[0.04] px-5 py-4 mt-3 transition hover:border-gold/30"><span className="text-sm text-ivory/85">{item.label}</span></Link>
      )) : <p className="text-sm text-ivory/45 mt-4">Type a search term above.</p>}
    </>
  );
}
