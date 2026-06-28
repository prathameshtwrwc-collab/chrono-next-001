import { PageHeader, Card } from "@/components/PortalLayout";
import { getAdminScope } from "@/lib/data/dashboard";

export default async function ShareLinkPage() {
  const scope = await getAdminScope();
  const link = scope.uniqueCode ? `http://localhost:3000/${scope.uniqueCode}` : "No link assigned";

  return (
    <>
      <PageHeader eyebrow="Share Link" title="Organization assessment link" sub="Members who enter through this code are permanently mapped to your organization while the link is active." />
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <p className="text-xs uppercase tracking-widest text-ivory/40">Shareable URL</p>
          <p className="mt-4 break-all font-mono text-2xl text-gold">{link}</p>
          <p className="mt-4 text-sm text-ivory/55">Status: {scope.linkActive ? "Active - members can be mapped" : "Paused - mapping is disabled"}</p>
        </Card>
        <Card>
          <p className="font-serif text-2xl">QR / campaign ready</p>
          <p className="mt-3 text-sm leading-6 text-ivory/55">Use this link in WhatsApp, email, HR portals, internal communication, or QR campaigns.</p>
        </Card>
      </div>
    </>
  );
}
