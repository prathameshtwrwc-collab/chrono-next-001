import { PageHeader, Card } from "@/components/PortalLayout";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { createSupabaseAdmin } from "@/utils/supabase/admin";
import { cache } from "react";

const searchOrg = cache(async (q: string, userId: string) => {
  const supabase = createSupabaseAdmin();
  if (!supabase || !q.trim()) return { members: [] };
  const { data: admin } = await supabase.from("organization_admins").select("organization_id").eq("clerk_user_id", userId).maybeSingle();
  if (!admin) return { members: [] };
  const term = `%${q.trim()}%`;
  const { data: members } = await supabase.from("members").select("id, first_name, last_name, email").eq("organization_id", (admin as any).organization_id).or(`first_name.ilike.${term},last_name.ilike.${term},email.ilike.${term}`).limit(10);
  return { members: (members || []).map((m: any) => ({ label: `${m.first_name} ${m.last_name}`, sub: m.email, href: "/admin/participants" })) };
});

export default async function AdminSearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { userId } = await auth();
  const { q = "" } = await searchParams;
  const results = userId && q ? await searchOrg(q, userId) : null;

  return (
    <>
      <PageHeader eyebrow="Search" title={q ? `Results for "${q}"` : "Search"} sub={results ? `${results.members.length} results` : "Type a search term and press Enter."} />
      {results && results.members.map((m: any, i: number) => (
        <Link key={i} href={m.href} className="flex items-center justify-between rounded-xl border border-ivory/10 bg-ivory/[0.04] px-5 py-4 transition hover:border-gold/30">{m.label}<span className="text-xs text-ivory/40">{m.sub}</span></Link>
      ))}
    </>
  );
}
