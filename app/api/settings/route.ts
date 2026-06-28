import { auth } from "@clerk/nextjs/server";
import { createSupabaseAdmin } from "@/utils/supabase/admin";
import { NextResponse } from "next/server";

const SETTINGS_ORG_ID = "00000000-0000-0000-0000-000000000001";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({}, { status: 401 });

  const supabase = createSupabaseAdmin();
  if (!supabase) return NextResponse.json({}, { status: 500 });

  const { data } = await supabase
    .from("organizations")
    .select("settings_json")
    .eq("id", SETTINGS_ORG_ID)
    .maybeSingle();

  return NextResponse.json(data?.settings_json || {});
}

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = createSupabaseAdmin();
  if (!supabase) return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });

  const body = await request.json();

  const { error } = await supabase.from("organizations").upsert(
    {
      id: SETTINGS_ORG_ID,
      name: "__PLATFORM__",
      organization_type: "Internal",
      unique_code: "__PLATFORM__",
      status: "ACTIVE",
      settings_json: body,
    },
    { onConflict: "id" }
  );

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
