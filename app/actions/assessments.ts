"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createSupabaseAdmin } from "@/utils/supabase/admin";

const assessmentVersionSchema = z.object({
  name: z.string().trim().min(2, "Name is required"),
  description: z.string().trim().optional(),
  questions: z
    .array(
      z.object({
        question_text: z.string().trim().min(1, "Question text is required"),
        question_order: z.number().int().min(1),
        question_type: z.string().default("single_choice"),
        category: z.string().optional(),
        options: z
          .array(
            z.object({
              option_text: z.string().trim().min(1, "Option text is required"),
              option_value: z.string().trim().min(1, "Option value is required"),
              option_order: z.number().int().min(1),
              lark_score: z.number().int().default(0),
              eagle_score: z.number().int().default(0),
              owl_score: z.number().int().default(0),
            })
          )
          .min(2, "At least 2 options per question"),
      })
    )
    .min(1, "At least 1 question is required"),
});

export async function createAssessmentAction(input: unknown) {
  const parsed = assessmentVersionSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message || "Invalid input." };
  }

  const supabase = createSupabaseAdmin();
  if (!supabase) return { ok: false, message: "Supabase is not configured." };

  const values = parsed.data;

  const { data: existing } = await supabase
    .from("assessment_versions")
    .select("version")
    .order("version", { ascending: false })
    .limit(1)
    .maybeSingle();

  const nextVersion = (existing?.version || 0) + 1;

  const { data: version, error: versionError } = await supabase
    .from("assessment_versions")
    .insert({
      name: values.name,
      version: nextVersion,
      description: values.description || null,
      status: "DRAFT",
    })
    .select("id")
    .single();

  if (versionError || !version) {
    return { ok: false, message: versionError?.message || "Could not create version." };
  }

  for (const q of values.questions) {
    const { data: question, error: qError } = await supabase
      .from("questions")
      .insert({
        assessment_version_id: version.id,
        question_text: q.question_text,
        question_order: q.question_order,
        question_type: q.question_type,
        category: q.category || null,
        is_active: true,
      })
      .select("id")
      .single();

    if (qError || !question) continue;

    for (const o of q.options) {
      await supabase.from("question_options").insert({
        question_id: question.id,
        option_text: o.option_text,
        option_value: o.option_value,
        option_order: o.option_order,
        lark_score: o.lark_score,
        eagle_score: o.eagle_score,
        owl_score: o.owl_score,
      });
    }
  }

  await supabase.from("activity_logs").insert({
    user_type: "superadmin",
    action: "ASSESSMENT_VERSION_CREATED",
    entity_type: "assessment_version",
    entity_id: version.id,
    details_json: { name: values.name, version: nextVersion },
  });

  revalidatePath("/superadmin/assessments");
  return { ok: true, message: `Assessment v${nextVersion} created.` };
}

export async function activateAssessmentVersionAction(versionId: string) {
  const supabase = createSupabaseAdmin();
  if (!supabase) return { ok: false, message: "Supabase is not configured." };

  await supabase.from("assessment_versions").update({ status: "INACTIVE" }).neq("id", versionId);
  const { error } = await supabase.from("assessment_versions").update({ status: "ACTIVE" }).eq("id", versionId);

  if (error) return { ok: false, message: error.message };

  await supabase.from("activity_logs").insert({
    user_type: "superadmin",
    action: "ASSESSMENT_VERSION_ACTIVATED",
    entity_type: "assessment_version",
    entity_id: versionId,
  });

  revalidatePath("/superadmin/assessments");
  return { ok: true, message: "Assessment version activated." };
}
