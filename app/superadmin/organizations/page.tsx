import Link from "next/link";
import { PageHeader, Card } from "@/components/PortalLayout";
import { Pagination } from "@/components/Pagination";
import { AddOrganizationForm, LinkToggle } from "@/components/AddOrganizationForm";
import { getPlatformDashboardData } from "@/lib/data/dashboard";

export const revalidate = 60;

export default async function OrgsPage({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const limit = 10;
  const data = await getPlatformDashboardData();
  const all = data.organizations;
  const totalPages = Math.ceil(all.length / limit);
  const orgs = all.slice((page - 1) * limit, page * limit);

  return (
    <>
      <PageHeader eyebrow="Organizations" title="Client organizations" sub="Create organizations, issue admin access, and control member mapping links." action={<AddOrganizationForm />} />
      <Card className="overflow-x-auto p-0">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-ivory/10 text-left text-xs uppercase tracking-widest text-ivory/40">
              {["Organization", "Type", "Unique Code", "Members", "Mapping", "Status"].map((h) => (
                <th key={h} className="px-6 py-4 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orgs.map((org) => (
              <tr key={org.id} className="border-b border-ivory/5 hover:bg-ivory/[0.03]">
                <td className="px-6 py-4"><Link href={`/superadmin/organizations/${org.uniqueCode}`} className="text-ivory/85 hover:text-gold font-medium transition-colors">{org.name}</Link></td>
                <td className="px-6 py-4"><span className="rounded-full border border-ivory/15 px-2.5 py-1 text-xs text-ivory/60">{org.type}</span></td>
                <td className="px-6 py-4 font-mono text-gold">{org.uniqueCode}</td>
                <td className="px-6 py-4 font-semibold text-gold">{org.members}</td>
                <td className="px-6 py-4"><LinkToggle organizationId={org.id} active={org.linkActive} /></td>
                <td className="px-6 py-4 text-ivory/50">{org.status}</td>
              </tr>
            ))}
            {!orgs.length && <tr><td colSpan={6} className="px-6 py-10 text-center text-ivory/45">No organizations yet.</td></tr>}
          </tbody>
        </table>
      </Card>
      <Pagination current={page} total={totalPages} />
    </>
  );
}
