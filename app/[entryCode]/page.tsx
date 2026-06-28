import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { createSupabaseAdmin } from "@/utils/supabase/admin";
import LandingClient from "@/app/LandingClient";

export default async function EntryCodePage({ params }: { params: Promise<{ entryCode: string }> }) {
  const { entryCode } = await params;
  const normalized = entryCode.trim().toUpperCase();
  const reserved = new Set(["admin", "member", "super", "superadmin", "sign-in", "sign-up", "reports", "unauthorized", "api", "favicon"]);

  if (!normalized || reserved.has(normalized.toLowerCase())) {
    notFound();
  }

  const supabase = createSupabaseAdmin();
  if (supabase) {
    const { data: link } = await supabase
      .from("organization_links")
      .select("active, organizations(name)")
      .eq("unique_code", normalized)
      .maybeSingle();

    if (link && !link.active) {
      const orgName = Array.isArray(link.organizations)
        ? link.organizations[0]?.name
        : (link.organizations as any)?.name;

      return (
        <div className="min-h-screen bg-midnight text-ivory flex items-center justify-center p-6">
          <div className="max-w-md text-center">
            <span className="text-6xl">🔗</span>
            <h1 className="mt-6 font-serif text-4xl font-medium">Link Expired</h1>
            <p className="mt-4 text-sm leading-7 text-white/58">
              {orgName
                ? `The registration link for ${orgName} is no longer active. Please contact your organization administrator for a new link.`
                : "This registration link is no longer active. Please contact your organization administrator for a new link."}
            </p>
            <Link
              href="/"
              className="mt-8 inline-block rounded-full bg-gradient-to-r from-champagne via-gold to-sunrise px-8 py-3.5 text-sm font-semibold text-midnight shadow-[0_8px_30px_rgba(244,181,77,0.35)] transition-transform hover:scale-[1.02]"
            >
              Go Home
            </Link>
          </div>
        </div>
      );
    }
  }

  return <LandingClient />;
}
