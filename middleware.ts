import { clerkMiddleware, createRouteMatcher, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isSuperadminRoute = createRouteMatcher(["/superadmin(.*)", "/super(.*)"]);
const isAdminRoute = createRouteMatcher(["/admin(.*)"]);
const isMemberRoute = createRouteMatcher(["/member(.*)"]);
const isPublicAuthRoute = createRouteMatcher(["/sign-in(.*)", "/sign-up(.*)", "/sso-callback(.*)", "/superadmin/sign-in(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || !process.env.CLERK_SECRET_KEY) {
    return NextResponse.next();
  }

  const { userId: authUserId, sessionClaims } = await auth();
  let userId = authUserId;

  if (!userId) {
    const sessionCookie = req.cookies.get("__session")?.value;
    if (sessionCookie) {
      try {
        const payload = JSON.parse(atob(sessionCookie.split(".")[1]));
        if (payload.sub) {
          userId = payload.sub;
        }
      } catch {}
    }
  }

  if ((isSuperadminRoute(req) || isAdminRoute(req) || isMemberRoute(req)) && !isPublicAuthRoute(req) && !userId) {
    if (isSuperadminRoute(req)) {
      return NextResponse.redirect(new URL("/superadmin/sign-in", req.url));
    }
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  if (!userId) {
    return NextResponse.next();
  }

  let role = ((sessionClaims as Record<string, unknown>)?.publicMetadata as Record<string, unknown> | undefined)?.role as string | undefined
    || ((sessionClaims as Record<string, unknown>)?.metadata as Record<string, unknown> | undefined)?.role as string | undefined;

  if (!role) {
    try {
      const client = await clerkClient();
      const clerkUser = await client.users.getUser(userId);
      role = clerkUser.publicMetadata?.role as string | undefined;
    } catch (error) {
      console.error("Clerk API fetch failed in middleware", error);
    }
  }

  if (isSuperadminRoute(req) && !isPublicAuthRoute(req) && role !== "superadmin") {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  if (isAdminRoute(req) && !isPublicAuthRoute(req) && role !== "admin" && role !== "superadmin") {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  if (isMemberRoute(req) && !isPublicAuthRoute(req) && !["member", "admin", "superadmin"].includes(role || "")) {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)", "/__clerk/:path*"],
};
