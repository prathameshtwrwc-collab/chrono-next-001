import { auth } from "@clerk/nextjs/server";
import { PageHeader, Card } from "@/components/PortalLayout";
import { createSupabaseAdmin } from "@/utils/supabase/admin";
import { redirect } from "next/navigation";
import { cache } from "react";

export const revalidate = 3600;

const getAdminOrg = cache(async () => {
  const { userId } = await auth();
  if (!userId) return null;
  const supabase = createSupabaseAdmin();
  if (!supabase) return null;

  const { data: admin } = await supabase
    .from("organization_admins")
    .select("id, first_name, last_name, email, phone, role, status, organization_id, organizations(name, organization_type, unique_code, status, country, created_at)")
    .eq("clerk_user_id", userId)
    .maybeSingle();

  return admin as any;
});

export default async function AdminSettingsPage() {
  const admin = await getAdminOrg();
  if (!admin) return <PageHeader eyebrow="Settings" title="Admin profile not found." />;

  const org = Array.isArray(admin.organizations) ? admin.organizations[0] : (admin.organizations as any);
  const orgName = org?.name || "—";
  const orgType = org?.organization_type || "—";
  const orgCode = org?.unique_code || "—";
  const orgCountry = org?.country || "—";

  return (
    <>
      <PageHeader eyebrow="Settings" title="Your organization" sub={`${orgName} · ${orgCode}`} />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <p className="mb-4 font-serif text-2xl">Organization Details</p>
          {[
            ["Name", orgName],
            ["Type", orgType],
            ["Code", orgCode],
            ["Country", orgCountry],
            ["Status", org?.status || "—"],
            ["Created", org?.created_at ? new Date(org.created_at).toLocaleDateString() : "—"],
          ].map(([l, v]) => (
            <div key={l as string} className="flex justify-between border-b border-ivory/5 py-2.5 text-sm last:border-0">
              <span className="text-ivory/40">{l}</span>
              <span className="text-ivory/75 text-right">{v as string}</span>
            </div>
          ))}
        </Card>
        <Card>
          <p className="mb-4 font-serif text-2xl">Your Admin Profile</p>
          {[
            ["Name", `${admin.first_name} ${admin.last_name}`],
            ["Email", admin.email],
            ["Phone", admin.phone || "-"],
            ["Role", admin.role],
            ["Status", admin.status],
          ].map(([l, v]) => (
            <div key={l as string} className="flex justify-between border-b border-ivory/5 py-2.5 text-sm last:border-0">
              <span className="text-ivory/40">{l}</span>
              <span className="text-ivory/75 text-right">{v as string}</span>
            </div>
          ))}
        </Card>
      </div>
    </>
  );
}
