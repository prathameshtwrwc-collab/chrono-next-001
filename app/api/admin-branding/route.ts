import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/utils/supabase/admin";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json(null, { status: 401 });

  const supabase = createSupabaseAdmin();
  if (!supabase) return NextResponse.json(null, { status: 500 });

  const { data: admin } = await supabase
    .from("organization_admins")
    .select("organization_id, organizations(name, logo_url, settings_json)")
    .eq("clerk_user_id", userId)
    .maybeSingle();

  if (!admin) return NextResponse.json(null);

  const org = Array.isArray(admin.organizations) ? admin.organizations[0] : (admin.organizations as any);
  const settings = (org?.settings_json || {}) as any;

  return NextResponse.json({
    orgId: admin.organization_id,
    orgName: org?.name || "",
    brandName: settings?.brand_name || org?.name || "",
    logoUrl: org?.logo_url || "",
  });
}
