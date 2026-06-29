import { PageHeader, Card } from "@/components/PortalLayout";
import { Pagination } from "@/components/Pagination";
import { AddAdminForm } from "@/components/AddAdminForm";
import { AdminDetailModal } from "@/components/AdminDetailModal";
import { getOrganizationAdmins } from "@/lib/data/dashboard";

export const revalidate = 3600;

export default async function UsersPage({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const limit = 10;
  const all = await getOrganizationAdmins();
  const totalPages = Math.ceil(all.length / limit);
  const admins = all.slice((page - 1) * limit, page * limit);

  return (
    <>
      <PageHeader eyebrow="Admin Management" title="Platform administrators" action={<AddAdminForm />} />
      <Card className="overflow-x-auto p-0">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-ivory/10 text-left text-xs uppercase tracking-widest text-ivory/40">
              {["Admin", "Email", "Phone", "Organization", "Role", "Status"].map((h) => (
                <th key={h} className="px-6 py-4 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {admins.map((a, i) => (
              <tr key={a.id || i} className="border-b border-ivory/5 hover:bg-ivory/[0.03]">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-gold to-sunrise text-xs text-midnight">{a.name.split(" ").pop()?.[0] || "A"}</span>
                    <AdminDetailModal admin={a} />
                  </div>
                </td>
                <td className="px-6 py-4 text-ivory/70">{a.email}</td>
                <td className="px-6 py-4 text-ivory/60">{a.phone}</td>
                <td className="px-6 py-4 text-ivory/70">{a.organization}</td>
                <td className="px-6 py-4 text-ivory/60">{a.role}</td>
                <td className="px-6 py-4">
                  <span className={`rounded-full px-2.5 py-1 text-xs ${a.status === "Active" ? "bg-emerald-400/15 text-emerald-300" : "bg-ivory/10 text-ivory/60"}`}>
                    {a.status}
                  </span>
                </td>
              </tr>
            ))}
            {!admins.length && <tr><td colSpan={6} className="px-6 py-10 text-center text-ivory/45">No organization admins yet.</td></tr>}
          </tbody>
        </table>
      </Card>
      <Pagination current={page} total={totalPages} />
    </>
  );
}
