import { NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/utils/supabase/admin";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const versionId = url.searchParams.get("id");
  if (!versionId) return NextResponse.json(null);

  const supabase = createSupabaseAdmin();
  if (!supabase) return NextResponse.json(null);

  const { data: version } = await supabase
    .from("assessment_versions")
    .select("id, name, version, description, status, created_at")
    .eq("id", versionId)
    .single();

  if (!version) return NextResponse.json(null);

  const { data: questions } = await supabase
    .from("questions")
    .select("id, question_text, question_order, question_type, category, is_active")
    .eq("assessment_version_id", versionId)
    .order("question_order", { ascending: true });

  const questionIds = (questions || []).map((q: any) => q.id);
  const { data: options } = questionIds.length
    ? await supabase
        .from("question_options")
        .select("id, question_id, option_text, option_value, option_order, lark_score, eagle_score, owl_score")
        .in("question_id", questionIds)
        .order("option_order", { ascending: true })
    : { data: [] };

  return NextResponse.json({
    ...version,
    questions: (questions || []).map((q: any) => ({
      ...q,
      options: (options || []).filter((o: any) => o.question_id === q.id),
    })),
  });
}
