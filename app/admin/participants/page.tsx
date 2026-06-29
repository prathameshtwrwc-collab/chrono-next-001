import { PageHeader, Card } from "@/components/PortalLayout";
import { GoldButton } from "@/components/ui";
import { getOrganizationDashboardData } from "@/lib/data/dashboard";

export const revalidate = 3600;

export default async function ParticipantsPage() {
  const data = await getOrganizationDashboardData();

  return (
    <>
      <PageHeader eyebrow="User Management" title="Organization members" sub={`${data.members.length} members mapped to ${data.scope.organizationName}.`} action={<GoldButton to="/admin/share-link">Copy Link</GoldButton>} />
      <Card className="overflow-x-auto p-0">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-ivory/10 text-left text-xs uppercase tracking-widest text-ivory/40">
              {["Member", "Email", "Source", "Joined"].map((h) => <th key={h} className="px-6 py-4 font-medium">{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {data.members.map((member) => (
              <tr key={member.id} className="border-b border-ivory/5 transition-colors hover:bg-ivory/[0.03]">
                <td className="px-6 py-4"><div className="flex items-center gap-3"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-royal to-elegant text-xs">{member.name.split(" ").map((n) => n[0]).join("")}</span>{member.name}</div></td>
                <td className="px-6 py-4 text-ivory/65">{member.email}</td>
                <td className="px-6 py-4 text-gold">{member.source}</td>
                <td className="px-6 py-4 text-ivory/50">{new Date(member.joined).toLocaleDateString()}</td>
              </tr>
            ))}
            {!data.members.length && (
              <tr><td colSpan={4} className="px-6 py-10 text-center text-ivory/45">No members yet. Share the organization link to start mapping assessments.</td></tr>
            )}
          </tbody>
        </table>
      </Card>
    </>
  );
}
