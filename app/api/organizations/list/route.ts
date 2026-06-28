import { auth } from "@clerk/nextjs/server";
import { createSupabaseAdmin } from "@/utils/supabase/admin";
import { NextResponse } from "next/server";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json([], { status: 401 });

  const supabase = createSupabaseAdmin();
  if (!supabase) return NextResponse.json([], { status: 500 });

  const { data } = await supabase
    .from("organizations")
    .select("id, name")
    .neq("unique_code", "__PLATFORM__")
    .order("name", { ascending: true });

  return NextResponse.json(data || []);
}
