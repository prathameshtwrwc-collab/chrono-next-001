import { PageHeader, Card } from "@/components/PortalLayout";
import { Pagination } from "@/components/Pagination";
import { getAllMembers } from "@/lib/data/dashboard";

export const revalidate = 3600;

export default async function MembersPage({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const limit = 10;
  const all = await getAllMembers();
  const totalPages = Math.ceil(all.length / limit);
  const members = all.slice((page - 1) * limit, page * limit);

  return (
    <>
      <PageHeader eyebrow="Members" title="Platform members" sub="All registered members across all organizations." />
      <Card className="overflow-x-auto p-0">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-ivory/10 text-left text-xs uppercase tracking-widest text-ivory/40">
              {["Name", "Email", "Phone", "Source", "Organization", "Joined"].map((h) => (
                <th key={h} className="px-6 py-4 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {members.map((m) => (
              <tr key={m.id} className="border-b border-ivory/5 hover:bg-ivory/[0.03]">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-gold to-sunrise text-xs text-midnight">{m.name.split(" ").pop()?.[0] || "M"}</span>
                    {m.name}
                  </div>
                </td>
                <td className="px-6 py-4 text-ivory/70">{m.email}</td>
                <td className="px-6 py-4 text-ivory/60">{m.phone}</td>
                <td className="px-6 py-4"><span className="rounded-full border border-ivory/15 px-2.5 py-1 text-xs text-ivory/60">{m.source}</span></td>
                <td className="px-6 py-4 text-ivory/70">{m.organization}</td>
                <td className="px-6 py-4 text-ivory/45 whitespace-nowrap">{new Date(m.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
            {!members.length && <tr><td colSpan={6} className="px-6 py-10 text-center text-ivory/45">No members yet.</td></tr>}
          </tbody>
        </table>
      </Card>
      <Pagination current={page} total={totalPages} />
    </>
  );
}
