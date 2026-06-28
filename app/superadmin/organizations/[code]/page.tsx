import { notFound } from "next/navigation";
import Link from "next/link";
import { PageHeader, Card, Stat } from "@/components/PortalLayout";
import { getOrganizationDetail } from "@/lib/data/dashboard";
import { DetailModal, ChronotypeModal } from "../OrgModals";

export const revalidate = 60;

export default async function OrgDetailPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const data = await getOrganizationDetail(code);
  if (!data) notFound();

  const { org, members, admins, stats, larks, eagles, owls } = data;

  return (
    <>
      <div className="mb-6">
        <Link href="/superadmin/organizations" className="text-xs text-gold/70 hover:text-gold tracking-wider">&larr; Back to organizations</Link>
      </div>
      <PageHeader
        eyebrow={org.organization_type}
        title={org.name}
        sub={`Code: ${org.unique_code} · Created ${new Date(org.created_at).toLocaleDateString()}`}
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mt-6">
        <DetailModal title="Members" data={members} rowKey="id" columns={[
          { key: "name", label: "Name" },
          { key: "email", label: "Email" },
          { key: "gender", label: "Gender" },
          { key: "age", label: "Age" },
          { key: "chronotype", label: "Chronotype" },
        ]} />
        <DetailModal title="Admins" data={admins} rowKey="id" columns={[
          { key: "name", label: "Name" },
          { key: "email", label: "Email" },
          { key: "role", label: "Role" },
          { key: "status", label: "Status" },
        ]} />
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mt-6">
        <Stat label="Members" value={String(stats.totalMembers)} delta="Total registered" />
        <Stat label="Admins" value={String(stats.totalAdmins)} delta="Organization admins" color="text-champagne" />
        <Stat label="Assessed" value={String(stats.larks + stats.eagles + stats.owls)} delta="With chronotype result" color="text-elegant" />
        <Stat label="Unassessed" value={String(stats.unassessed)} delta="Assessment pending" color="text-sunrise" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3 mt-6">
        <Card>
          <p className="mb-4 font-serif text-2xl">Organization Details</p>
          {[
            ["Name", org.name],
            ["Type", org.organization_type],
            ["Code", org.unique_code],
            ["Status", org.status],
            ["Contact", org.contact_person || "-"],
            ["Email", org.email || "-"],
            ["Phone", org.phone || "-"],
            ["Country", org.country || "-"],
            ["Address", org.address || "-"],
          ].map(([l, v]) => (
            <div key={l as string} className="flex justify-between border-b border-ivory/5 py-2.5 text-sm last:border-0">
              <span className="text-ivory/40">{l}</span>
              <span className="text-ivory/75 text-right">{v as string}</span>
            </div>
          ))}
        </Card>

        <Card className="lg:col-span-2">
          <p className="mb-4 font-serif text-2xl">Chronotype Distribution</p>
          {stats.larks + stats.eagles + stats.owls > 0 ? (
            <>
              <div className="h-4 overflow-hidden rounded-full bg-ivory/10 flex mb-6">
                {stats.larks > 0 && <div className="h-full rounded-l-full bg-gradient-to-r from-amber-400 to-amber-300" style={{ width: `${(stats.larks / (stats.larks + stats.eagles + stats.owls)) * 100}%` }} />}
                {stats.eagles > 0 && <div className="h-full bg-gradient-to-r from-blue-400 to-blue-300" style={{ width: `${(stats.eagles / (stats.larks + stats.eagles + stats.owls)) * 100}%` }} />}
                {stats.owls > 0 && <div className="h-full rounded-r-full bg-gradient-to-r from-purple-400 to-purple-300" style={{ width: `${(stats.owls / (stats.larks + stats.eagles + stats.owls)) * 100}%` }} />}
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                <ChronotypeModal title={`Larks (${stats.larks})`} chronotype="LARK" data={larks} />
                <ChronotypeModal title={`Eagles (${stats.eagles})`} chronotype="EAGLE" data={eagles} />
                <ChronotypeModal title={`Owls (${stats.owls})`} chronotype="OWL" data={owls} />
              </div>
            </>
          ) : (
            <p className="text-sm text-ivory/45">No assessment results yet for this organization.</p>
          )}
        </Card>
      </div>
    </>
  );
}
