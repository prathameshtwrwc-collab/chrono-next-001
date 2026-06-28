import { PageHeader, Card } from "@/components/PortalLayout";
import { Pagination } from "@/components/Pagination";
import { getActivityLogs } from "@/lib/data/dashboard";

export const revalidate = 60;

export default async function ActivityPage({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const limit = 10;
  const all = await getActivityLogs();
  const totalPages = Math.ceil(all.length / limit);
  const logs = all.slice((page - 1) * limit, page * limit);

  return (
    <>
      <PageHeader eyebrow="Activity" title="Platform activity log" sub="All significant actions recorded across the platform." />
      <Card className="overflow-x-auto p-0">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-ivory/10 text-left text-xs uppercase tracking-widest text-ivory/40">
              {["Action", "User Type", "Entity", "Details", "Date"].map((h) => (
                <th key={h} className="px-6 py-4 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {logs.map((l) => (
              <tr key={l.id} className="border-b border-ivory/5 hover:bg-ivory/[0.03]">
                <td className="px-6 py-4"><span className="rounded-full bg-gold/15 text-gold px-2.5 py-1 text-xs">{l.action}</span></td>
                <td className="px-6 py-4 text-ivory/70">{l.userType}</td>
                <td className="px-6 py-4 text-ivory/60">{l.entityType || "-"}</td>
                <td className="px-6 py-4 text-ivory/50 max-w-xs truncate">{typeof l.details === "object" ? JSON.stringify(l.details).slice(0, 80) : String(l.details || "-")}</td>
                <td className="px-6 py-4 text-ivory/40 whitespace-nowrap">{new Date(l.createdAt).toLocaleString()}</td>
              </tr>
            ))}
            {!logs.length && <tr><td colSpan={5} className="px-6 py-10 text-center text-ivory/45">No activity recorded.</td></tr>}
          </tbody>
        </table>
      </Card>
      <Pagination current={page} total={totalPages} />
    </>
  );
}
