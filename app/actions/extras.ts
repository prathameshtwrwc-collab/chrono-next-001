"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createSupabaseAdmin } from "@/utils/supabase/admin";

const recommendationSchema = z.object({
  chronotype: z.string().min(1),
  title: z.string().trim().min(2),
  description: z.string().trim().min(2),
  category: z.string().trim().min(1),
  icon: z.string().optional(),
  priority_order: z.coerce.number().int().default(0),
  action_items: z.any().optional(),
});

export async function saveRecommendationAction(input: unknown) {
  const parsed = recommendationSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message || "Invalid input." };

  const supabase = createSupabaseAdmin();
  if (!supabase) return { ok: false, message: "Supabase not configured." };

  const { error } = await supabase.from("recommendations").insert({
    chronotype: parsed.data.chronotype,
    title: parsed.data.title,
    description: parsed.data.description,
    category: parsed.data.category,
    icon: parsed.data.icon || null,
    priority_order: parsed.data.priority_order,
    action_items: parsed.data.action_items || [],
    is_active: true,
  });

  if (error) return { ok: false, message: error.message };
  revalidatePath("/superadmin/recommendations");
  return { ok: true, message: "Recommendation added." };
}

export async function deleteRecommendationAction(id: string) {
  const supabase = createSupabaseAdmin();
  if (!supabase) return { ok: false };
  await supabase.from("recommendations").delete().eq("id", id);
  revalidatePath("/superadmin/recommendations");
  return { ok: true };
}

export async function upsertScoringRuleAction(input: unknown) {
  const parsed = z.object({
    id: z.string().optional(),
    assessment_version_id: z.string().min(1),
    chronotype: z.string().min(1),
    min_score: z.coerce.number().int(),
    max_score: z.coerce.number().int(),
    is_active: z.coerce.boolean().default(true),
  }).safeParse(input);

  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message || "Invalid." };

  const supabase = createSupabaseAdmin();
  if (!supabase) return { ok: false, message: "Supabase not configured." };

  const data = {
    assessment_version_id: parsed.data.assessment_version_id,
    chronotype: parsed.data.chronotype,
    min_score: parsed.data.min_score,
    max_score: parsed.data.max_score,
    rule_logic: {},
    is_active: parsed.data.is_active,
  };

  const { error } = parsed.data.id
    ? await supabase.from("scoring_rules").update(data).eq("id", parsed.data.id)
    : await supabase.from("scoring_rules").insert(data);

  if (error) return { ok: false, message: error.message };
  revalidatePath("/superadmin/assessments");
  return { ok: true, message: "Scoring rule saved." };
}

export async function createMemberGoalAction(input: unknown) {
  const parsed = z.object({
    title: z.string().trim().min(2),
    description: z.string().optional(),
    category: z.string().default("sleep"),
    target_date: z.string().optional(),
  }).safeParse(input);

  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message || "Invalid." };

  const { auth, clerkClient } = await import("@clerk/nextjs/server");
  const { userId } = await auth();
  if (!userId) return { ok: false, message: "Not authenticated." };

  const supabase = createSupabaseAdmin();
  if (!supabase) return { ok: false, message: "Supabase not configured." };

  const { data: member } = await supabase
    .from("members")
    .select("id")
    .eq("clerk_user_id", userId)
    .maybeSingle();

  if (!member) return { ok: false, message: "Member profile not found." };

  const { error } = await supabase.from("member_goals").insert({
    member_id: member.id,
    title: parsed.data.title,
    description: parsed.data.description || null,
    category: parsed.data.category,
    target_date: parsed.data.target_date || null,
    status: "ACTIVE",
  });

  if (error) return { ok: false, message: error.message };
  revalidatePath("/member/goals");
  return { ok: true, message: "Goal created." };
}

export async function updateOrgBrandingAction(input: unknown) {
  const parsed = z.object({
    orgId: z.string().min(1),
    logoUrl: z.string().optional(),
    brandName: z.string().trim().min(1, "Brand name is required"),
  }).safeParse(input);
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message || "Invalid." };

  const supabase = createSupabaseAdmin();
  if (!supabase) return { ok: false, message: "Supabase not configured." };

  const { data: org } = await supabase.from("organizations").select("settings_json").eq("id", parsed.data.orgId).maybeSingle();
  const currentSettings = (org as any)?.settings_json || {};

  const { error } = await supabase
    .from("organizations")
    .update({
      logo_url: parsed.data.logoUrl || null,
      settings_json: { ...currentSettings, brand_name: parsed.data.brandName },
    })
    .eq("id", parsed.data.orgId);

  if (error) return { ok: false, message: error.message };
  revalidatePath("/admin/white-label");
  return { ok: true, message: "Branding updated." };
}
