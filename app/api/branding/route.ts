import { NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/utils/supabase/admin";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  if (!code) return NextResponse.json(null);

  const supabase = createSupabaseAdmin();
  if (!supabase) return NextResponse.json(null);

  const { data: org } = await supabase
    .from("organizations")
    .select("name, logo_url, settings_json")
    .eq("unique_code", code.toUpperCase())
    .maybeSingle();

  if (!org) return NextResponse.json(null);

  const brandName = (org.settings_json as any)?.brand_name || org.name;

  return NextResponse.json({
    name: org.name,
    brandName,
    logoUrl: org.logo_url,
  });
}
