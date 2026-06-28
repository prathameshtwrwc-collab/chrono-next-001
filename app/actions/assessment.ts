"use server";

import { clerkClient } from "@clerk/nextjs/server";
import { z } from "zod";
import { assessmentQuestions, createReferralCode, type Chronotype, type ChronotypeResult } from "@/lib/assessment";
import { createSupabaseAdmin } from "@/utils/supabase/admin";

const detailsSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required"),
  lastName: z.string().trim().min(1, "Last name is required"),
  age: z.coerce.number().int().min(10).max(120),
  gender: z.string().trim().min(1, "Gender is required"),
  maritalStatus: z.string().optional(),
  department: z.string().optional(),
  location: z.string().optional(),
  country: z.string().trim().min(1, "Country is required"),
  city: z.string().trim().min(1, "City is required"),
  pincode: z.string().trim().min(3, "Pincode is required"),
  occupation: z.string().trim().min(1, "Occupation is required"),
  email: z.string().trim().email(),
  phone: z.string().trim().min(7, "Phone is required"),
  organizationCode: z.string().trim().optional(),
  referralCode: z.string().trim().optional(),
});

const submitAssessmentSchema = z.object({
  details: detailsSchema,
  answers: z
    .array(z.union([z.string(), z.null(), z.undefined()]))
    .min(assessmentQuestions.length, `Please answer all ${assessmentQuestions.length} questions.`)
    .transform((answers) => answers.slice(0, assessmentQuestions.length))
    .refine((answers) => answers.every((answer) => typeof answer === "string" && answer.length > 0), {
      message: `Please answer all ${assessmentQuestions.length} questions.`,
    }),
});

type DbQuestion = {
  id: string;
  question_order: number;
  question_text: string;
  question_options: Array<{
    id: string;
    option_text: string;
    option_order: number;
    lark_score: number;
    eagle_score: number;
    owl_score: number;
  }>;
};

function fallbackOptionIndex(optionId: string) {
  const match = optionId.match(/^fallback-q(\d+)-o(\d+)$/);
  if (!match) return null;
  return { questionOrder: Number(match[1]), optionOrder: Number(match[2]) };
}

function buildResult(scores: { lark: number; eagle: number; owl: number }): ChronotypeResult {
  const top = Math.max(scores.lark, scores.eagle, scores.owl);
  const chronotype: Chronotype =
    top === scores.lark && top !== scores.owl ? "LARK" : top === scores.owl && top !== scores.lark ? "OWL" : "EAGLE";
  const copy = {
    LARK: {
      title: "Lark",
      tagline: "Sunrise clarity. Early momentum. Natural morning leadership.",
      summary: "Your biology leans early. You tend to do your best thinking when the day is fresh.",
      strengths: ["Fast morning activation", "Strong early-day focus", "Natural consistency"],
      challenges: ["Late meetings drain faster", "Social jet lag can hit hard", "Evening overstimulation affects recovery"],
      suggestions: ["Protect your first deep-work block", "Keep bright light early", "Move demanding decisions away from late night"],
    },
    EAGLE: {
      title: "Eagle",
      tagline: "Balanced rhythm. Adaptable energy. Steady performance windows.",
      summary: "Your rhythm is flexible and centered. You can perform across the day with consistent anchors.",
      strengths: ["Adaptable schedule", "Stable midday performance", "Good recovery potential"],
      challenges: ["Can drift later under stress", "Needs routine to stay sharp", "Energy dips if sleep debt builds"],
      suggestions: ["Anchor wake time within one hour", "Use midday for collaboration", "Create a reliable evening shutdown cue"],
    },
    OWL: {
      title: "Owl",
      tagline: "Evening depth. Creative late focus. Night-biased cognition.",
      summary: "Your biology leans later. You often come alive when the day quiets down.",
      strengths: ["Late-day focus", "Creative problem solving", "Comfort with flexible work blocks"],
      challenges: ["Early starts are costly", "Morning fog can be real", "Fixed schedules can create sleep debt"],
      suggestions: ["Use light strategically after waking", "Avoid critical tasks too early", "Build a consistent pre-sleep runway"],
    },
  }[chronotype];

  const sorted = [scores.lark, scores.eagle, scores.owl].sort((a, b) => b - a);
  const confidenceScore = Math.min(96, Math.max(68, Math.round(72 + ((sorted[0] || 0) - (sorted[1] || 0)) * 2)));

  return {
    chronotype,
    ...copy,
    larkScore: scores.lark,
    eagleScore: scores.eagle,
    owlScore: scores.owl,
    totalScore: top,
    confidenceScore,
  };
}

async function syncClerkMember(details: z.infer<typeof detailsSchema>, sourceType: "ORGANIZATION" | "DIRECT" | "REFERRAL") {
  try {
    const client = await clerkClient();
    const existing = await client.users.getUserList({ emailAddress: [details.email] });
    const user = existing.data[0];

    if (user) {
      await client.users.updateUserMetadata(user.id, {
        publicMetadata: { role: "member" },
        unsafeMetadata: { source: sourceType },
      });
      return user.id;
    }

    const created = await client.users.createUser({
      emailAddress: [details.email],
      firstName: details.firstName,
      lastName: details.lastName,
      skipPasswordRequirement: true,
      skipPasswordChecks: true,
      skipLegalChecks: true,
      publicMetadata: { role: "member" },
      unsafeMetadata: { phone: details.phone, source: sourceType },
    });

    return created.id;
  } catch (error) {
    console.error("Clerk member sync failed", error);
    return null;
  }
}

export async function submitAssessment(input: unknown) {
  const parsed = submitAssessmentSchema.safeParse(input);
  if (!parsed.success) {
    console.error("Assessment validation failed", parsed.error.issues);
    return { ok: false, message: parsed.error.issues[0]?.message || "Please complete all required fields." };
  }

  const supabase = createSupabaseAdmin();
  if (!supabase) {
    return { ok: false, message: "Supabase environment variables are missing." };
  }

  const { details, answers } = parsed.data;
  const cleanOrgCode = details.organizationCode?.trim().toUpperCase();
  const cleanReferralCode = details.referralCode?.trim().toUpperCase();

  let organizationId: string | null = null;
  let sourceType: "ORGANIZATION" | "DIRECT" | "REFERRAL" = "DIRECT";

  if (cleanOrgCode) {
    const { data: organization } = await supabase
      .from("organizations")
      .select("id")
      .eq("unique_code", cleanOrgCode)
      .eq("status", "ACTIVE")
      .maybeSingle();

    const { data: link } = organization
      ? await supabase.from("organization_links").select("active").eq("organization_id", organization.id).eq("unique_code", cleanOrgCode).maybeSingle()
      : { data: null };

    if (organization?.id && link?.active !== false) {
      organizationId = organization.id;
      sourceType = "ORGANIZATION";
    }
  }

  if (!organizationId && cleanReferralCode) {
    sourceType = "REFERRAL";
  }

  const { data: version } = await supabase
    .from("assessment_versions")
    .select("id")
    .eq("status", "ACTIVE")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!version?.id) {
    return { ok: false, message: "No active assessment version found. Please run the question seed SQL." };
  }

  const { data: dbQuestions, error: questionError } = await supabase
    .from("questions")
    .select("id, question_order, question_text, question_options(id, option_text, option_order, lark_score, eagle_score, owl_score)")
    .eq("assessment_version_id", version.id)
    .eq("is_active", true)
    .order("question_order", { ascending: true });

  if (questionError || !dbQuestions?.length) {
    return { ok: false, message: questionError?.message || "Assessment questions are not available in Supabase." };
  }

  const questions = dbQuestions as DbQuestion[];
  const scores = { lark: 0, eagle: 0, owl: 0 };
  let answerRows;
  try {
    answerRows = answers.map((answerId, index) => {
    const selectedAnswerId = String(answerId);
    const fallback = fallbackOptionIndex(selectedAnswerId);
    const questionOrder = fallback?.questionOrder || index + 1;
    const optionOrder = fallback?.optionOrder;
    const question = questions.find((item) => item.question_order === questionOrder) || questions[index];
    const selected =
      question?.question_options.find((option) => option.id === selectedAnswerId) ||
      question?.question_options.find((option) => option.option_order === optionOrder);

    if (!question || !selected) {
      throw new Error(`Missing DB question/option for question ${questionOrder}.`);
    }

    scores.lark += selected.lark_score || 0;
    scores.eagle += selected.eagle_score || 0;
    scores.owl += selected.owl_score || 0;

    return {
      assessment_id: "",
      question_id: question.id,
      selected_option_id: selected.id,
      answer_value: selected.option_text,
    };
    });
  } catch (error) {
    console.error("Assessment answer mapping failed", error, { answers, questions: questions.map((question) => ({ order: question.question_order, optionOrders: question.question_options.map((option) => option.option_order) })) });
    return { ok: false, message: error instanceof Error ? error.message : "Could not map assessment answers to Supabase questions." };
  }

  const result = buildResult(scores);
  const generatedReferralCode = createReferralCode(details.email);
  const clerkUserId = await syncClerkMember(details, sourceType);

  const { data: existingMember } = await supabase.from("members").select("id, referral_code").eq("email", details.email.toLowerCase()).maybeSingle();

  const memberPayload = {
    organization_id: organizationId,
    clerk_user_id: clerkUserId,
    source_type: sourceType,
    first_name: details.firstName,
    last_name: details.lastName,
    age: details.age,
    gender: details.gender,
    marital_status: details.maritalStatus || null,
    department: details.department || null,
    location: details.location || null,
    country: details.country,
    city: details.city,
    pincode: details.pincode,
    occupation: details.occupation,
    email: details.email.toLowerCase(),
    phone: details.phone,
    referral_code: existingMember?.referral_code || generatedReferralCode,
    preferences_json: {},
  };

  const { data: member, error: memberError } = await supabase
    .from("members")
    .upsert(memberPayload, { onConflict: "email" })
    .select("id, referral_code")
    .single();

  if (memberError || !member) {
    return { ok: false, message: memberError?.message || "Could not store member profile in Supabase." };
  }

  const startedAt = new Date();
  const { data: assessment, error: assessmentError } = await supabase
    .from("assessments")
    .insert({
      member_id: member.id,
      organization_id: organizationId,
      assessment_version_id: version.id,
      status: "COMPLETED",
      started_at: startedAt.toISOString(),
      completed_at: new Date().toISOString(),
      time_taken_seconds: 0,
    })
    .select("id")
    .single();

  if (assessmentError || !assessment) {
    return { ok: false, message: assessmentError?.message || "Could not store assessment attempt." };
  }

  const { error: answerError } = await supabase
    .from("assessment_answers")
    .insert(answerRows.map((row) => ({ ...row, assessment_id: assessment.id })));

  if (answerError) {
    return { ok: false, message: answerError.message };
  }

  const { data: chronoResult, error: resultError } = await supabase
    .from("chronotype_results")
    .insert({
      assessment_id: assessment.id,
      member_id: member.id,
      organization_id: organizationId,
      chronotype: result.chronotype,
      total_score: result.totalScore,
      confidence_score: result.confidenceScore,
      lark_score: result.larkScore,
      eagle_score: result.eagleScore,
      owl_score: result.owlScore,
    })
    .select("id")
    .single();

  if (resultError) {
    return { ok: false, message: resultError.message };
  }

  const { data: orgInfo } = organizationId
    ? await supabase.from("organizations").select("name, logo_url").eq("id", organizationId).maybeSingle()
    : { data: null };

  const { data: recommendations } = await supabase
    .from("recommendations")
    .select("title, description, category, icon")
    .eq("chronotype", result.chronotype)
    .eq("is_active", true)
    .order("priority_order", { ascending: true })
    .limit(6);

  await supabase.from("reports").insert({
    member_id: member.id,
    assessment_id: assessment.id,
    report_type: "CHRONOTYPE",
    title: `${result.title} Chronotype Report`,
    report_url: `/reports/${assessment.id}`,
    report_snapshot: {
      result: { ...result },
      firstName: details.firstName,
      lastName: details.lastName,
      email: details.email,
      orgName: (orgInfo as any)?.name || "WelcomeCure",
      logoUrl: (orgInfo as any)?.logo_url || null,
      recommendations: recommendations || [],
    },
  });

  if (cleanReferralCode && sourceType === "REFERRAL") {
    const { data: referrer } = await supabase
      .from("members")
      .select("id, organization_id")
      .eq("referral_code", cleanReferralCode)
      .maybeSingle();

    await supabase.from("referrals").insert({
      referrer_member_id: referrer?.id || null,
      referred_member_id: member.id,
      referrer_organization_id: referrer?.organization_id || null,
      referral_code: `${cleanReferralCode}-${member.id.slice(0, 8)}`,
      status: "COMPLETED",
    });
  }

  await supabase.from("activity_logs").insert({
    user_type: "member",
    user_id: member.id,
    action: "ASSESSMENT_COMPLETED",
    entity_type: "assessment",
    entity_id: assessment.id,
    details_json: { sourceType, organizationId, chronotype: result.chronotype },
  });

  return {
    ok: true,
    persisted: true,
    result,
    referralCode: member.referral_code || generatedReferralCode,
    assessmentId: assessment.id,
    resultId: chronoResult?.id,
    memberId: member.id,
    clerkUserId,
    sourceType,
    organizationId,
  };
}
