"use server";

import { clerkClient } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createSupabaseAdmin } from "@/utils/supabase/admin";

const createOrganizationSchema = z.object({
  name: z.string().trim().min(2, "Organization name is required"),
  organizationType: z.string().trim().min(2).default("Corporate"),
  contactPerson: z.string().trim().optional(),
  email: z.string().trim().email("Organization email is required"),
  phone: z.string().trim().optional(),
  country: z.string().trim().optional(),
  address: z.string().trim().optional(),
  adminFirstName: z.string().trim().min(1, "Admin first name is required"),
  adminLastName: z.string().trim().min(1, "Admin last name is required"),
  adminEmail: z.string().trim().email("Admin email is required"),
  adminPassword: z.string().min(8, "Admin password must be at least 8 characters"),
  linkActive: z.coerce.boolean().default(true),
});

function makeOrgCode(name: string) {
  const prefix = name.replace(/[^a-z0-9]/gi, "").toUpperCase().slice(0, 5) || "ORG";
  return `ORG-${prefix}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

function makeClerkSlug(code: string) {
  return code.toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
}

export async function createOrganizationAction(input: unknown) {
  const parsed = createOrganizationSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message || "Invalid organization details." };
  }

  const supabase = createSupabaseAdmin();
  if (!supabase) {
    return { ok: false, message: "Supabase is not configured." };
  }

  const values = parsed.data;
  const uniqueCode = makeOrgCode(values.name);
  let clerkOrganizationId: string | null = null;
  let clerkWarning = "";

  const { data: organization, error: organizationError } = await supabase
    .from("organizations")
    .insert({
      name: values.name,
      organization_type: values.organizationType,
      unique_code: uniqueCode,
      status: "ACTIVE",
      contact_person: values.contactPerson || `${values.adminFirstName} ${values.adminLastName}`,
      email: values.email.toLowerCase(),
      phone: values.phone || null,
      country: values.country || null,
      address: values.address || null,
      settings_json: {},
    })
    .select("id, unique_code")
    .single();

  if (organizationError || !organization) {
    return { ok: false, message: organizationError?.message || "Could not create organization." };
  }

  let clerkUserId: string | null = null;
  try {
    const client = await clerkClient();
    try {
      const clerkOrganization = await client.organizations.createOrganization({
        name: values.name,
        slug: makeClerkSlug(organization.unique_code),
        publicMetadata: {
          supabaseOrganizationId: organization.id,
          uniqueCode: organization.unique_code,
          status: "ACTIVE",
        },
        privateMetadata: {
          organizationType: values.organizationType,
          contactEmail: values.email.toLowerCase(),
        },
      });
      clerkOrganizationId = clerkOrganization.id;
    } catch (error) {
      clerkWarning = " Supabase organization was created, but Clerk organization creation failed. Check Clerk Organizations settings.";
      console.error("Clerk organization creation failed", error);
    }

    const existing = await client.users.getUserList({ emailAddress: [values.adminEmail] });
    const user = existing.data[0];

    if (user) {
      clerkUserId = user.id;
      await client.users.updateUserMetadata(user.id, {
        publicMetadata: { role: "admin" },
        unsafeMetadata: { organizationId: organization.id, organizationCode: organization.unique_code, clerkOrganizationId },
      });
    } else {
      const created = await client.users.createUser({
        emailAddress: [values.adminEmail],
        password: values.adminPassword,
        firstName: values.adminFirstName,
        lastName: values.adminLastName,
        skipPasswordChecks: true,
        skipLegalChecks: true,
        publicMetadata: { role: "admin" },
        unsafeMetadata: { organizationId: organization.id, organizationCode: organization.unique_code, clerkOrganizationId },
      });
      clerkUserId = created.id;
    }

    if (clerkOrganizationId && clerkUserId) {
      try {
        await client.organizations.createOrganizationMembership({
          organizationId: clerkOrganizationId,
          userId: clerkUserId,
          role: "org:admin",
        });
      } catch (error) {
        console.error("Clerk organization membership creation failed", error);
      }
    }
  } catch (error) {
    clerkWarning = " Supabase organization was created, but Clerk admin user creation failed. Check Clerk password/auth settings.";
    console.error("Clerk admin creation failed", error);
  }

  if (clerkOrganizationId) {
    await supabase
      .from("organizations")
      .update({ settings_json: { clerkOrganizationId } })
      .eq("id", organization.id);
  }

  const { error: adminError } = await supabase.from("organization_admins").insert({
    organization_id: organization.id,
    clerk_user_id: clerkUserId,
    first_name: values.adminFirstName,
    last_name: values.adminLastName,
    email: values.adminEmail.toLowerCase(),
    role: "admin",
    status: "ACTIVE",
  });

  if (adminError) {
    return { ok: false, message: adminError.message };
  }

  await supabase.from("organization_links").insert({
    organization_id: organization.id,
    unique_code: organization.unique_code,
    active: values.linkActive,
  });

  await supabase.from("activity_logs").insert({
    user_type: "superadmin",
    action: "ORGANIZATION_CREATED",
    entity_type: "organization",
    entity_id: organization.id,
    details_json: { uniqueCode: organization.unique_code, adminEmail: values.adminEmail, clerkOrganizationId, clerkUserId },
  });

  revalidatePath("/superadmin");
  revalidatePath("/superadmin/organizations");

  return { ok: true, uniqueCode: organization.unique_code, message: `Organization created. Code: ${organization.unique_code}.${clerkWarning}` };
}

export async function setOrganizationLinkActiveAction(organizationId: string, active: boolean) {
  const supabase = createSupabaseAdmin();
  if (!supabase) return { ok: false, message: "Supabase is not configured." };

  const { error } = await supabase
    .from("organization_links")
    .update({ active })
    .eq("organization_id", organizationId);

  if (error) return { ok: false, message: error.message };

  await supabase.from("activity_logs").insert({
    user_type: "superadmin",
    action: active ? "ORG_LINK_ACTIVATED" : "ORG_LINK_DEACTIVATED",
    entity_type: "organization",
    entity_id: organizationId,
    details_json: { active },
  });

  revalidatePath("/superadmin/organizations");
  return { ok: true };
}

export async function addAdminToOrganizationAction(formData: FormData) {
  const supabase = createSupabaseAdmin();
  if (!supabase) return { ok: false, message: "Supabase is not configured." };

  const orgId = formData.get("organizationId") as string;
  const firstName = (formData.get("firstName") as string)?.trim();
  const lastName = (formData.get("lastName") as string)?.trim();
  const email = (formData.get("email") as string)?.trim().toLowerCase();
  const password = formData.get("password") as string;

  if (!orgId || !firstName || !lastName || !email || !password) {
    return { ok: false, message: "All fields are required." };
  }
  if (password.length < 8) {
    return { ok: false, message: "Password must be at least 8 characters." };
  }

  let clerkUserId: string | null = null;
  try {
    const client = await clerkClient();
    const existing = await client.users.getUserList({ emailAddress: [email] });
    if (existing.data[0]) {
      clerkUserId = existing.data[0].id;
      await client.users.updateUserMetadata(clerkUserId, { publicMetadata: { role: "admin" } });
    } else {
      const created = await client.users.createUser({
        emailAddress: [email],
        password,
        firstName,
        lastName,
        skipPasswordChecks: true,
        skipLegalChecks: true,
        publicMetadata: { role: "admin" },
      });
      clerkUserId = created.id;
    }
  } catch (error) {
    return { ok: false, message: `Clerk user creation failed: ${error}` };
  }

  const { error: adminError } = await supabase.from("organization_admins").insert({
    organization_id: orgId,
    clerk_user_id: clerkUserId,
    first_name: firstName,
    last_name: lastName,
    email,
    role: "admin",
    status: "ACTIVE",
  });

  if (adminError) return { ok: false, message: adminError.message };

  await supabase.from("activity_logs").insert({
    user_type: "superadmin",
    action: "ADMIN_ADDED",
    entity_type: "organization",
    entity_id: orgId,
    details_json: { adminEmail: email, clerkUserId },
  });

  revalidatePath("/superadmin/users");
  return { ok: true, message: `Admin ${firstName} ${lastName} added.` };
}

export async function updateAdminAction(formData: FormData) {
  const supabase = createSupabaseAdmin();
  if (!supabase) return { ok: false, message: "Supabase is not configured." };

  const id = formData.get("id") as string;
  const firstName = (formData.get("firstName") as string)?.trim();
  const lastName = (formData.get("lastName") as string)?.trim();
  const email = (formData.get("email") as string)?.trim().toLowerCase();
  const phone = (formData.get("phone") as string)?.trim();
  const role = (formData.get("role") as string)?.trim();

  if (!id || !firstName || !lastName || !email) {
    return { ok: false, message: "Required fields missing." };
  }

  const { error } = await supabase
    .from("organization_admins")
    .update({ first_name: firstName, last_name: lastName, email, phone, role, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) return { ok: false, message: error.message };
  revalidatePath("/superadmin/users");
  return { ok: true, message: "Admin updated." };
}

export async function toggleAdminStatusAction(formData: FormData) {
  const supabase = createSupabaseAdmin();
  if (!supabase) return { ok: false, message: "Supabase is not configured." };

  const id = formData.get("id") as string;
  const newStatus = formData.get("status") as string;

  if (!id || !newStatus) return { ok: false, message: "Missing params." };

  const { error } = await supabase
    .from("organization_admins")
    .update({ status: newStatus, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) return { ok: false, message: error.message };
  revalidatePath("/superadmin/users");
  return { ok: true, message: `Admin ${newStatus === "ACTIVE" ? "activated" : "deactivated"}.` };
}
