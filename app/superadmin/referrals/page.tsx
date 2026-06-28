import { PageHeader, Card } from "@/components/PortalLayout";
import { Pagination } from "@/components/Pagination";
import { getAllReferrals } from "@/lib/data/dashboard";

export const revalidate = 60;

export default async function ReferralsPage({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const limit = 10;
  const all = await getAllReferrals();
  const totalPages = Math.ceil(all.length / limit);
  const referrals = all.slice((page - 1) * limit, page * limit);

  return (
    <>
      <PageHeader eyebrow="Referrals" title="Member referrals" sub="Track all referral activity across the platform." />
      <Card className="overflow-x-auto p-0">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-ivory/10 text-left text-xs uppercase tracking-widest text-ivory/40">
              {["Code", "Status", "Referrer", "Referred", "Organization", "Created"].map((h) => (
                <th key={h} className="px-6 py-4 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {referrals.map((r) => (
              <tr key={r.id} className="border-b border-ivory/5 hover:bg-ivory/[0.03]">
                <td className="px-6 py-4 font-mono text-gold text-xs">{r.code}</td>
                <td className="px-6 py-4"><span className={`rounded-full px-2.5 py-1 text-xs ${r.status === "CREATED" ? "bg-amber-400/15 text-amber-300" : "bg-emerald-400/15 text-emerald-300"}`}>{r.status}</span></td>
                <td className="px-6 py-4 text-ivory/60 font-mono text-xs">{r.referrerMemberId ? r.referrerMemberId.slice(0, 8) + "..." : "-"}</td>
                <td className="px-6 py-4 text-ivory/60 font-mono text-xs">{r.referredMemberId ? r.referredMemberId.slice(0, 8) + "..." : "-"}</td>
                <td className="px-6 py-4 text-ivory/60 font-mono text-xs">{r.referrerOrgId ? r.referrerOrgId.slice(0, 8) + "..." : "-"}</td>
                <td className="px-6 py-4 text-ivory/40 whitespace-nowrap">{new Date(r.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
            {!referrals.length && <tr><td colSpan={6} className="px-6 py-10 text-center text-ivory/45">No referrals yet.</td></tr>}
          </tbody>
        </table>
      </Card>
      <Pagination current={page} total={totalPages} />
    </>
  );
}
