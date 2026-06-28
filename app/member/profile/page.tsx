import { PageHeader, Card } from "@/components/PortalLayout";
import { getMemberDashboardData } from "@/lib/data/dashboard";

export const revalidate = 60;

export default async function ProfilePage() {
  const data = await getMemberDashboardData();
  const member = data?.member;
  const name = member ? `${member.first_name} ${member.last_name}` : "Member";

  return (
    <>
      <PageHeader eyebrow="Profile" title="Account & preferences" />
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="text-center">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-gold to-sunrise font-serif text-4xl text-midnight">{name.split(" ").map((part) => part[0]).join("").slice(0, 2)}</div>
          <p className="mt-4 font-serif text-2xl">{name}</p>
          <p className="text-sm text-ivory/50">{data?.latestResult?.chronotype || "Member"}</p>
        </Card>
        <Card className="lg:col-span-2">
          <p className="mb-5 font-serif text-2xl">Details</p>
          <div className="grid gap-5 sm:grid-cols-2">
            {[
              ["Email", member?.email || "-"],
              ["Source", member?.source_type || "-"],
              ["Referral Code", member?.referral_code || "-"],
              ["Organization", member?.organization_id || "WelcomeCure"],
            ].map(([l, v]) => (
              <div key={l}>
                <p className="text-xs uppercase tracking-widest text-ivory/40">{l}</p>
                <p className="mt-1 break-all text-ivory/85">{v}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}
