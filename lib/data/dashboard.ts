import { auth } from "@clerk/nextjs/server";
import { cookies } from "next/headers";
import { cache } from "react";
import { createSupabaseAdmin } from "@/utils/supabase/admin";

export type OrgScope = {
  organizationId: string | null;
  organizationName: string;
  uniqueCode: string | null;
  linkActive: boolean;
};

const emptyMix = [
  ["Larks", 0, "#f4b54d"],
  ["Eagles", 0, "#354a82"],
  ["Owls", 0, "#e9e2f5"],
] as [string, number, string][];

function pct(part: number, total: number) {
  if (!total) return 0;
  return Math.round((part / total) * 100);
}

export const getRoleContext = cache(async () => {
  const { userId: authUserId, sessionClaims } = await auth();
  let userId = authUserId;
  let role = (sessionClaims?.publicMetadata as { role?: string } | undefined)?.role;

  if (!userId) {
    const cookieStore = await cookies();
    const c = cookieStore.get("__session")?.value;
    if (c) {
      try {
        const payload = JSON.parse(atob(c.split(".")[1]));
        userId = payload.sub || null;
      } catch {}
    }
  }

  return {
    userId,
    email: null,
    role: role || "member",
    name: "User",
  };
});

export async function getAdminScope(): Promise<OrgScope> {
  const supabase = createSupabaseAdmin();
  const context = await getRoleContext();

  if (!supabase || (!context.userId && !context.email)) {
    return { organizationId: null, organizationName: "Organization", uniqueCode: null, linkActive: false };
  }

  const query = supabase
    .from("organization_admins")
    .select("organization_id, organizations(id, name, unique_code), email")
    .limit(1);

  const { data } = context.userId
    ? await query.eq("clerk_user_id", context.userId).maybeSingle()
    : await query.eq("email", context.email).maybeSingle();

  const org = Array.isArray(data?.organizations) ? data?.organizations[0] : data?.organizations;

  if (!data?.organization_id || !org) {
    return { organizationId: null, organizationName: "Organization", uniqueCode: null, linkActive: false };
  }

  const { data: link } = await supabase
    .from("organization_links")
    .select("active, unique_code")
    .eq("organization_id", data.organization_id)
    .maybeSingle();

  return {
    organizationId: data.organization_id,
    organizationName: org.name || "Organization",
    uniqueCode: link?.unique_code || org.unique_code || null,
    linkActive: link?.active !== false,
  };
}

export const getPlatformDashboardData = cache(async () => {
  const supabase = createSupabaseAdmin();
  if (!supabase) {
    return {
      stats: [
        { label: "Organizations", value: "0", delta: "Supabase not configured" },
        { label: "Members", value: "0", delta: "No data loaded", color: "text-champagne" },
        { label: "Assessments", value: "0", delta: "No data loaded", color: "text-elegant" },
        { label: "Reports", value: "0", delta: "No data loaded", color: "text-sunrise" },
      ],
      mix: emptyMix,
      organizations: [],
    };
  }

  const [
    { count: orgCount },
    { count: memberCount },
    { count: assessmentCount },
    { count: reportCount },
    { data: resultRows },
    { data: organizations },
  ] = await Promise.all([
    supabase.from("organizations").select("id", { count: "exact", head: true }).neq("unique_code", "__PLATFORM__"),
    supabase.from("members").select("id", { count: "exact", head: true }),
    supabase.from("assessments").select("id", { count: "exact", head: true }),
    supabase.from("reports").select("id", { count: "exact", head: true }),
    supabase.from("chronotype_results").select("chronotype"),
    supabase
      .from("organizations")
      .select("id, name, organization_type, unique_code, status, country, created_at, organization_links(active), members(id)")
      .neq("unique_code", "__PLATFORM__")
      .order("created_at", { ascending: false })
      .limit(25),
  ]);

  const totalResults = resultRows?.length || 0;
  const larks = resultRows?.filter((row) => row.chronotype === "LARK").length || 0;
  const eagles = resultRows?.filter((row) => row.chronotype === "EAGLE").length || 0;
  const owls = resultRows?.filter((row) => row.chronotype === "OWL").length || 0;

  return {
    stats: [
      { label: "Organizations", value: String(orgCount || 0), delta: "Created by Super Admin" },
      { label: "Members", value: String(memberCount || 0), delta: "Direct, referral, and org users", color: "text-champagne" },
      { label: "Assessments", value: String(assessmentCount || 0), delta: "Completed and in progress", color: "text-elegant" },
      { label: "Reports", value: String(reportCount || 0), delta: "Generated chronotype reports", color: "text-sunrise" },
    ],
    mix: [
      ["Larks", pct(larks, totalResults), "#f4b54d"],
      ["Eagles", pct(eagles, totalResults), "#354a82"],
      ["Owls", pct(owls, totalResults), "#e9e2f5"],
    ] as [string, number, string][],
    organizations:
      organizations?.map((org) => {
        const links = Array.isArray(org.organization_links) ? org.organization_links : [];
        const members = Array.isArray(org.members) ? org.members : [];
        return {
          id: org.id,
          name: org.name,
          type: org.organization_type,
          uniqueCode: org.unique_code,
          status: org.status,
          country: org.country || "Global",
          members: members.length,
          linkActive: links[0]?.active !== false,
        };
      }) || [],
  };
});

export const getOrganizationDashboardData = cache(async () => {
  const supabase = createSupabaseAdmin();
  const scope = await getAdminScope();

  if (!supabase || !scope.organizationId) {
    return {
      scope,
      stats: [
        { label: "Members", value: "0", delta: "No organization mapped" },
        { label: "Assessments", value: "0", delta: "No organization mapped", color: "text-champagne" },
        { label: "Avg Confidence", value: "0%", delta: "No result data", color: "text-elegant" },
        { label: "Link", value: "Off", delta: "No share link", color: "text-sunrise" },
      ],
      mix: emptyMix,
      members: [],
      submissions: [],
    };
  }

  const [
    { data: members },
    { data: results },
    { count: assessments },
  ] = await Promise.all([
    supabase.from("members").select("id, first_name, last_name, email, source_type, created_at").eq("organization_id", scope.organizationId).order("created_at", { ascending: false }).limit(50),
    supabase.from("chronotype_results").select("chronotype, confidence_score, generated_at, members(first_name, last_name, email)").eq("organization_id", scope.organizationId).order("generated_at", { ascending: false }).limit(50),
    supabase.from("assessments").select("id", { count: "exact", head: true }).eq("organization_id", scope.organizationId),
  ]);

  const totalResults = results?.length || 0;
  const larks = results?.filter((row) => row.chronotype === "LARK").length || 0;
  const eagles = results?.filter((row) => row.chronotype === "EAGLE").length || 0;
  const owls = results?.filter((row) => row.chronotype === "OWL").length || 0;
  const avgConfidence = totalResults
    ? Math.round((results || []).reduce((sum, row) => sum + (row.confidence_score || 0), 0) / totalResults)
    : 0;

  return {
    scope,
    stats: [
      { label: "Members", value: String(members?.length || 0), delta: "Mapped by organization code" },
      { label: "Assessments", value: String(assessments || 0), delta: "Organization submissions", color: "text-champagne" },
      { label: "Avg Confidence", value: `${avgConfidence}%`, delta: "Across completed results", color: "text-elegant" },
      { label: "Link", value: scope.linkActive ? "Active" : "Paused", delta: scope.uniqueCode || "No code", color: "text-sunrise" },
    ],
    mix: [
      ["Larks", pct(larks, totalResults), "#f4b54d"],
      ["Eagles", pct(eagles, totalResults), "#354a82"],
      ["Owls", pct(owls, totalResults), "#e9e2f5"],
    ] as [string, number, string][],
    members:
      members?.map((member) => ({
        id: member.id,
        name: `${member.first_name} ${member.last_name}`,
        email: member.email,
        source: member.source_type,
        joined: member.created_at,
      })) || [],
    submissions:
      results?.map((row) => {
        const member = Array.isArray(row.members) ? row.members[0] : row.members;
        return {
          member: member ? `${member.first_name} ${member.last_name}` : "Member",
          email: member?.email || "",
          chronotype: row.chronotype,
          confidence: row.confidence_score,
          date: row.generated_at,
        };
      }) || [],
  };
});

export const getMemberDashboardData = cache(async () => {
  const supabase = createSupabaseAdmin();
  const context = await getRoleContext();

  if (!supabase || (!context.userId && !context.email)) {
    return null;
  }

  const query = supabase
    .from("members")
    .select("id, first_name, last_name, email, referral_code, source_type, organization_id")
    .limit(1);

  const { data: member } = context.userId
    ? await query.eq("clerk_user_id", context.userId).maybeSingle()
    : await query.eq("email", context.email).maybeSingle();

  if (!member) return null;

  const { data: latestResult } = await supabase
    .from("chronotype_results")
    .select("chronotype, total_score, confidence_score, lark_score, eagle_score, owl_score, generated_at")
    .eq("member_id", member.id)
    .order("generated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const [{ data: reports }, { data: recommendations }] = await Promise.all([
    supabase.from("reports").select("id, assessment_id, title, report_url, generated_at, report_snapshot").eq("member_id", member.id).order("generated_at", { ascending: false }).limit(5),
    supabase.from("recommendations").select("title, description, category, icon").eq("chronotype", latestResult?.chronotype || "EAGLE").eq("is_active", true).order("priority_order", { ascending: true }).limit(6),
  ]);

  return { member, latestResult, reports: reports || [], recommendations: recommendations || [] };
});

export const getOrganizationDetail = cache(async (code: string) => {
  const supabase = createSupabaseAdmin();
  if (!supabase) return null;

  const { data: org } = await supabase
    .from("organizations")
    .select("id, name, organization_type, unique_code, status, contact_person, email, phone, country, address, created_at, settings_json")
    .eq("unique_code", code)
    .single();

  if (!org) return null;

  const { data: members } = await supabase
    .from("members")
    .select("id, first_name, last_name, email, phone, gender, age, source_type, created_at, referral_code")
    .eq("organization_id", org.id)
    .order("created_at", { ascending: false });

  const { data: admins } = await supabase
    .from("organization_admins")
    .select("id, first_name, last_name, email, phone, role, status, created_at")
    .eq("organization_id", org.id)
    .order("created_at", { ascending: false });

  const memberIds = (members || []).map((m: any) => m.id);
  const { data: results } = memberIds.length
    ? await supabase.from("chronotype_results").select("chronotype, member_id").in("member_id", memberIds)
    : { data: [] };

  const resultMap: Record<string, string> = {};
  for (const r of results || []) {
    if ((r as any).member_id) resultMap[(r as any).member_id] = (r as any).chronotype;
  }

  const membersWithChronotype = (members || []).map((m: any) => ({
    ...m,
    name: `${m.first_name} ${m.last_name}`,
    chronotype: resultMap[m.id] || null,
  }));

  const larks = membersWithChronotype.filter((m: any) => m.chronotype === "LARK");
  const eagles = membersWithChronotype.filter((m: any) => m.chronotype === "EAGLE");
  const owls = membersWithChronotype.filter((m: any) => m.chronotype === "OWL");
  const unassessed = membersWithChronotype.filter((m: any) => !m.chronotype);

  return {
    org: org as any,
    members: membersWithChronotype,
    admins: (admins || []).map((a: any) => ({ ...a, name: `${a.first_name} ${a.last_name}` })),
    stats: {
      totalMembers: members?.length || 0,
      totalAdmins: admins?.length || 0,
      larks: larks.length,
      eagles: eagles.length,
      owls: owls.length,
      unassessed: unassessed.length,
    },
    larks,
    eagles,
    owls,
    unassessed,
  };
});

export const getActivityLogs = cache(async () => {
  const supabase = createSupabaseAdmin();
  if (!supabase) return [];
  const { data } = await supabase
    .from("activity_logs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);
  return (data || []).map((r: any) => ({
    id: r.id,
    action: r.action,
    userType: r.user_type,
    entityType: r.entity_type,
    details: r.details_json,
    createdAt: r.created_at,
  }));
});

export const getAllReferrals = cache(async () => {
  const supabase = createSupabaseAdmin();
  if (!supabase) return [];
  const { data } = await supabase
    .from("referrals")
    .select("id, referral_code, status, created_at, referrer_member_id, referred_member_id, referrer_organization_id")
    .order("created_at", { ascending: false })
    .limit(100);
  return (data || []).map((r: any) => ({
    id: r.id,
    code: r.referral_code,
    status: r.status,
    referrerMemberId: r.referrer_member_id,
    referredMemberId: r.referred_member_id,
    referrerOrgId: r.referrer_organization_id,
    createdAt: r.created_at,
  }));
});

export const getScoringRules = cache(async () => {
  const supabase = createSupabaseAdmin();
  if (!supabase) return [];
  const { data } = await supabase
    .from("scoring_rules")
    .select("id, assessment_version_id, chronotype, min_score, max_score, rule_logic, is_active")
    .order("chronotype", { ascending: true });
  return (data || []).map((r: any) => ({
    id: r.id,
    assessmentVersionId: r.assessment_version_id,
    chronotype: r.chronotype,
    minScore: r.min_score,
    maxScore: r.max_score,
    ruleLogic: r.rule_logic,
    isActive: r.is_active,
  }));
});

export const getOrganizationAdmins = cache(async () => {
  const supabase = createSupabaseAdmin();
  if (!supabase) return [];
  const { data } = await supabase
    .from("organization_admins")
    .select("id, first_name, last_name, email, phone, role, status, created_at, updated_at, organizations(name)")
    .order("created_at", { ascending: false })
    .limit(100);
  return (data || []).map((a: any) => ({
    id: a.id,
    firstName: a.first_name,
    lastName: a.last_name,
    name: `${a.first_name} ${a.last_name}`,
    organization: Array.isArray(a.organizations) ? a.organizations[0]?.name : (a.organizations as any)?.name || "-",
    role: a.role,
    status: a.status.replace(/_/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase()),
    email: a.email,
    phone: a.phone || "-",
    createdAt: a.created_at,
    updatedAt: a.updated_at,
  }));
});

export const getAssessmentVersions = cache(async () => {
  const supabase = createSupabaseAdmin();
  if (!supabase) return [];
  const { data } = await supabase
    .from("assessment_versions")
    .select("id, name, version, description, status, created_at")
    .order("version", { ascending: false });
  return data || [];
});

export const getAssessmentVersionDetail = cache(async (versionId: string) => {
  const supabase = createSupabaseAdmin();
  if (!supabase) return null;
  const { data: version } = await supabase
    .from("assessment_versions")
    .select("id, name, version, description, status, created_at")
    .eq("id", versionId)
    .single();
  if (!version) return null;
  const { data: questions } = await supabase
    .from("questions")
    .select("id, question_text, question_order, question_type, category, is_active")
    .eq("assessment_version_id", versionId)
    .order("question_order", { ascending: true });
  const questionIds = (questions || []).map((q) => q.id);
  const { data: options } = questionIds.length
    ? await supabase
        .from("question_options")
        .select("id, question_id, option_text, option_value, option_order, lark_score, eagle_score, owl_score")
        .in("question_id", questionIds)
        .order("option_order", { ascending: true })
    : { data: [] };
  return {
    ...version,
    questions: (questions || []).map((q) => ({
      ...q,
      options: (options || []).filter((o) => o.question_id === q.id),
    })),
  };
});

export const getAllMembers = cache(async () => {
  const supabase = createSupabaseAdmin();
  if (!supabase) return [];
  const { data } = await supabase
    .from("members")
    .select("id, first_name, last_name, email, phone, source_type, created_at, organization_id, organizations(name)")
    .order("created_at", { ascending: false })
    .limit(100);
  return (data || []).map((m) => ({
    id: m.id,
    name: `${m.first_name} ${m.last_name}`,
    email: m.email,
    phone: m.phone,
    source: m.source_type,
    organization: Array.isArray(m.organizations) ? m.organizations[0]?.name : (m.organizations as any)?.name || "WelcomeCure",
    created_at: m.created_at,
  }));
});

export const getMemberGoalsData = cache(async () => {
  const context = await getRoleContext();
  if (!context.userId) return [];
  const supabase = createSupabaseAdmin();
  if (!supabase) return [];
  const { data: member } = await supabase
    .from("members")
    .select("id")
    .eq("clerk_user_id", context.userId)
    .maybeSingle();
  if (!member) return [];
  const { data } = await supabase
    .from("member_goals")
    .select("title, description, category, status, target_date")
    .eq("member_id", member.id)
    .order("created_at", { ascending: false })
    .limit(50);
  return (data || []).map((g) => ({
    title: g.title,
    description: g.description || "",
    category: g.category,
    status: g.status,
    targetDate: g.target_date,
  }));
});
