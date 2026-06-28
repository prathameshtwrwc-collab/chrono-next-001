import { PageHeader, Card } from "@/components/PortalLayout";
import Link from "next/link";
import { createSupabaseAdmin } from "@/utils/supabase/admin";
import { cache } from "react";

const searchAll = cache(async (q: string) => {
  const supabase = createSupabaseAdmin();
  if (!supabase || !q.trim()) return { orgs: [], members: [], admins: [], versions: [] };

  const term = `%${q.trim()}%`;

  const [{ data: orgs }, { data: members }, { data: admins }, { data: versions }] = await Promise.all([
    supabase.from("organizations").select("id, name, unique_code, status").ilike("name", term).limit(10),
    supabase.from("members").select("id, first_name, last_name, email").or(`first_name.ilike.${term},last_name.ilike.${term},email.ilike.${term}`).limit(10),
    supabase.from("organization_admins").select("id, first_name, last_name, email").or(`first_name.ilike.${term},last_name.ilike.${term},email.ilike.${term}`).limit(10),
    supabase.from("assessment_versions").select("id, name, version, status").ilike("name", term).limit(10),
  ]);

  return {
    orgs: (orgs || []).map((o: any) => ({ label: o.name, sub: o.unique_code, href: `/superadmin/organizations/${o.unique_code}`, badge: o.status })),
    members: (members || []).map((m: any) => ({ label: `${m.first_name} ${m.last_name}`, sub: m.email, href: "#" })),
    admins: (admins || []).map((a: any) => ({ label: `${a.first_name} ${a.last_name}`, sub: a.email, href: "/superadmin/users" })),
    versions: (versions || []).map((v: any) => ({ label: v.name, sub: `v${v.version}`, href: "/superadmin/assessments", badge: v.status })),
  };
});

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = "" } = await searchParams;
  const results = q ? await searchAll(q) : null;

  return (
    <>
      <PageHeader eyebrow="Search" title={q ? `Results for "${q}"` : "Search"} sub={q ? `${[results?.orgs, results?.members, results?.admins, results?.versions].flat().length} results` : "Type a search term and press Enter."} />
      {results && (
        <div className="grid gap-8">
          {(["orgs", "members", "admins", "versions"] as const).map((key) => {
            const items = results[key];
            const label = { orgs: "Organizations", members: "Members", admins: "Admins", versions: "Assessment Versions" }[key];
            if (!items.length) return null;
            return (
              <div key={key}>
                <p className="mb-4 text-xs uppercase tracking-widest text-gold/70">{label}</p>
                <div className="grid gap-3">
                  {items.map((item: any, i: number) => (
                    <Link key={i} href={item.href} className="flex items-center justify-between rounded-xl border border-ivory/10 bg-ivory/[0.04] px-5 py-4 transition hover:border-gold/30 hover:bg-ivory/[0.06]">
                      <div>
                        <p className="text-sm font-medium text-ivory/85">{item.label}</p>
                        <p className="text-xs text-ivory/40">{item.sub}</p>
                      </div>
                      {item.badge && (
                        <span className={`rounded-full px-2.5 py-1 text-xs ${item.badge === "ACTIVE" ? "bg-emerald-400/15 text-emerald-300" : "bg-ivory/10 text-ivory/60"}`}>{item.badge}</span>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
          {!q && <p className="text-sm text-ivory/45">Enter a search term above to find organizations, members, admins, and assessment versions.</p>}
        </div>
      )}
    </>
  );
}
