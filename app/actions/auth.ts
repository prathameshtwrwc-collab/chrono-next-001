"use server";

import { auth, clerkClient, currentUser } from "@clerk/nextjs/server";
import { createSupabaseAdmin } from "@/utils/supabase/admin";

export async function syncCurrentUserProfile() {
  if (!process.env.CLERK_SECRET_KEY) {
    return { ok: false, message: "Clerk secret key is not configured." };
  }

  const { userId } = await auth();
  if (!userId) {
    return { ok: false, message: "No active Clerk session found." };
  }

  const user = await currentUser();
  const email = user?.primaryEmailAddress?.emailAddress?.toLowerCase();

  if (!email) {
    return { ok: false, message: "Signed-in user does not have a primary email." };
  }

  const client = await clerkClient();
  const existingRole = user?.publicMetadata?.role as string | undefined;
  const role = existingRole || "member";

  if (!existingRole) {
    await client.users.updateUserMetadata(userId, {
      publicMetadata: { role },
    });
  }

  const supabase = createSupabaseAdmin();
  if (!supabase) {
    return { ok: false, message: "Supabase is not configured." };
  }

  const { error } = await supabase
    .from("members")
    .update({ clerk_user_id: userId })
    .eq("email", email);

  if (error) {
    return { ok: false, message: error.message, role };
  }

  return { ok: true, role };
}

export async function ensureSuperadminEmailVerified(email: string) {
  if (!process.env.CLERK_SECRET_KEY) {
    return { ok: false, message: "Clerk secret key is not configured." };
  }

  const client = await clerkClient();
  const { data: users } = await client.users.getUserList({ emailAddress: [email.toLowerCase()] });
  const user = users?.[0];

  if (!user) {
    return { ok: false, message: "User not found in Clerk." };
  }

  const primaryEmail = user.emailAddresses.find((e) => e.id === user.primaryEmailAddressId);
  if (primaryEmail?.verification?.status === "verified") {
    return { ok: true };
  }

  const targetEmail = user.emailAddresses.find((e) => e.emailAddress === email.toLowerCase());
  if (!targetEmail) {
    return { ok: false, message: "Email address not found on user." };
  }

  try {
    const response = await fetch(`https://api.clerk.com/v1/email_addresses/${targetEmail.id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ verified: true }),
    });

    if (!response.ok) {
      return { ok: false, message: "Clerk API could not verify email." };
    }

    return { ok: true };
  } catch {
    return { ok: false, message: "Failed to reach Clerk API." };
  }
}

export async function getClerkUserDebug(email: string) {
  if (!process.env.CLERK_SECRET_KEY) {
    return { ok: false, message: "Clerk secret key is not configured." };
  }

  const client = await clerkClient();
  const { data: users } = await client.users.getUserList({ emailAddress: [email.toLowerCase()] });
  const user = users?.[0];

  if (!user) {
    return { ok: false, message: "User not found in Clerk." };
  }

  return {
    ok: true,
    userId: user.id,
    email: user.emailAddresses.map((e) => ({ email: e.emailAddress, verified: e.verification?.status, id: e.id })),
    hasPassword: user.passwordEnabled,
    oauthAccounts: user.externalAccounts?.map((a: any) => a.provider) || [],
    publicMetadata: user.publicMetadata,
    privateMetadata: user.privateMetadata,
    createdAt: user.createdAt,
  };
}

export async function resetSuperadminPassword(email: string, newPassword: string) {
  if (!process.env.CLERK_SECRET_KEY) {
    return { ok: false, message: "Clerk secret key is not configured." };
  }

  const client = await clerkClient();
  const { data: users } = await client.users.getUserList({ emailAddress: [email.toLowerCase()] });
  const user = users?.[0];

  if (!user) {
    return { ok: false, message: "User not found in Clerk." };
  }

  try {
    const response = await fetch(`https://api.clerk.com/v1/users/${user.id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password: newPassword }),
    });

    if (!response.ok) {
      const error = await response.text();
      return { ok: false, message: `Clerk API error: ${error}` };
    }

    return { ok: true, message: "Password reset successfully." };
  } catch (error) {
    return { ok: false, message: `Failed: ${error}` };
  }
}

export async function createClerkSession(email: string) {
  if (!process.env.CLERK_SECRET_KEY) {
    return { ok: false, message: "Clerk secret key is not configured." };
  }

  try {
    const client = await clerkClient();
    const { data: users } = await client.users.getUserList({ emailAddress: [email.toLowerCase()] });
    const user = users?.[0];
    if (!user) return { ok: false, message: "User not found." };

    const response = await fetch(`https://api.clerk.com/v1/sessions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: user.id,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      return { ok: false, message: `Clerk session error: ${err}` };
    }

    const session = await response.json();

    const activateResp = await fetch(`https://api.clerk.com/v1/sessions/${session.id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: "active" }),
    });
    if (!activateResp.ok) {
      const err = await activateResp.text();
      console.error("[createClerkSession] Activation failed:", err);
    }

    const cookiesResp = await fetch(`https://api.clerk.com/v1/sessions/${session.id}/tokens`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    });

    if (!cookiesResp.ok) {
      return { ok: false, message: "Could not create session token." };
    }

    const tokenData = await cookiesResp.json();

    const supabase = createSupabaseAdmin();
    if (supabase) {
      const role = user.publicMetadata?.role as string | undefined;
      const memberLookup = role !== "superadmin" && role !== "admin"
        ? await supabase.from("members").select("id, organization_id").eq("clerk_user_id", user.id).maybeSingle()
        : null;
      const adminLookup = role === "admin"
        ? await supabase.from("organization_admins").select("id, organization_id").eq("clerk_user_id", user.id).maybeSingle()
        : null;
      await supabase.from("login_audit").insert({
        user_type: role || "member",
        user_id: memberLookup?.data?.id || adminLookup?.data?.id || null,
        organization_id: memberLookup?.data?.organization_id || adminLookup?.data?.organization_id || null,
        clerk_session_id: session.id,
      });
    }

    return { ok: true, sessionId: session.id, jwt: tokenData.jwt };
  } catch (error) {
    return { ok: false, message: `Failed: ${error}` };
  }
}

export async function checkEmailStatus(email: string) {
  if (!process.env.CLERK_SECRET_KEY) {
    return { status: "error", message: "Clerk secret key is not configured." } as const;
  }

  const emailLower = email.toLowerCase().trim();

  const client = await clerkClient();
  const { data: users } = await client.users.getUserList({ emailAddress: [emailLower] });
  const user = users?.[0];

  if (user) {
    const role = user.publicMetadata?.role as string | undefined;
    if (role === "superadmin") return { status: "superadmin" as const, clerkUserId: user.id };
    if (role === "admin") return { status: "admin" as const, clerkUserId: user.id };
  }

  const supabase = createSupabaseAdmin();
  if (supabase) {
    const { data: member } = await supabase
      .from("members")
      .select("id, clerk_user_id")
      .ilike("email", emailLower)
      .maybeSingle();

    if (member) {
      return { status: "member" as const, memberId: member.id, clerkUserId: member.clerk_user_id };
    }
  }

  if (user) {
    return { status: "member" as const, memberId: null, clerkUserId: user.id };
  }

  return { status: "unknown" as const };
}

export async function signInAsMember(email: string) {
  if (!process.env.CLERK_SECRET_KEY) {
    return { ok: false, message: "Clerk secret key is not configured." } as const;
  }

  const emailLower = email.toLowerCase().trim();

  const client = await clerkClient();
  const { data: users } = await client.users.getUserList({ emailAddress: [emailLower] });
  let clerkUserId = users?.[0]?.id;

  if (!clerkUserId) {
    try {
      const newUser = await client.users.createUser({
        emailAddress: [emailLower],
        skipPasswordChecks: true,
        skipLegalChecks: true,
        publicMetadata: { role: "member" },
      });
      clerkUserId = newUser.id;

      const supabase = createSupabaseAdmin();
      if (supabase) {
        await supabase.from("members").update({ clerk_user_id: clerkUserId }).eq("email", emailLower);
      }
    } catch {
      return { ok: false, message: "Could not create account." } as const;
    }
  }

  return createClerkSession(email);
}
