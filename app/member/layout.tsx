import { auth, clerkClient } from "@clerk/nextjs/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { MemberLayoutContent } from "./layout-content";

export default async function MemberLayout({ children }: { children: React.ReactNode }) {
  let displayUser: { name: string; role: string; initials: string } | undefined;

  try {
    const { userId } = await auth();
    let id = userId;
    if (!id) {
      const c = (await cookies()).get("__session")?.value;
      if (c) try { id = JSON.parse(atob(c.split(".")[1])).sub; } catch {}
    }
    if (id) {
      const client = await clerkClient();
      const u = await client.users.getUser(id);
      const role = (u.publicMetadata?.role as string) || "Member";
      if (role === "superadmin") { redirect("/superadmin"); }
      if (role === "admin") { redirect("/admin"); }
      const name = u.fullName || u.primaryEmailAddress?.emailAddress || "User";
      const initials = ((u.firstName?.[0] || "") + (u.lastName?.[0] || "")).toUpperCase() || name[0].toUpperCase();
      displayUser = { name, role, initials };
    }
  } catch {}

  return <MemberLayoutContent user={displayUser}>{children}</MemberLayoutContent>;
}
