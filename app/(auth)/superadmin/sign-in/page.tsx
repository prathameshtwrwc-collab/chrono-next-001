import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { AuthForm } from "@/components/AuthForm";

export default async function SuperadminSignInPage() {
  const { userId } = await auth();
  if (userId) {
    const user = await currentUser();
    const role = user?.publicMetadata?.role as string | undefined;
    if (role === "superadmin") redirect("/superadmin");
    if (role === "admin") redirect("/admin");
    redirect("/member");
  }

  return <AuthForm audience="superadmin" />;
}
