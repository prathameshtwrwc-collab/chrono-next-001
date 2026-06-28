import { PageHeader, Card, Stat } from "@/components/PortalLayout";
import { MiniLine, Ring } from "@/components/charts";

export const revalidate = 60;
import { GoldButton } from "@/components/ui";
import { getMemberDashboardData } from "@/lib/data/dashboard";

export default async function MemberDashboard() {
  const data = await getMemberDashboardData();
  const member = data?.member;
  const result = data?.latestResult;
  const chronotype = result?.chronotype || "EAGLE";
  const name = member ? `${member.first_name} ${member.last_name}` : "Member";

  return (
    <>
      <PageHeader
        eyebrow={`Welcome, ${member?.first_name || "Member"}`}
        title="Your rhythm today"
        sub={result ? `Latest chronotype: ${chronotype}. Confidence ${result.confidence_score}%.` : "Take the assessment to unlock your personal chronotype dashboard."}
        action={<GoldButton to="/member/chronotype">View Chronotype</GoldButton>}
      />
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-widest text-ivory/40">Latest assessment</p>
              <p className="mt-2 font-serif text-2xl">{name}</p>
            </div>
            <span className="rounded-full bg-gold/15 px-3 py-1 text-xs text-gold">{chronotype}</span>
          </div>
          <div className="mt-6"><MiniLine data={[40, 55, 78, 82, 70, 60, 75, 68, 50, 35, 28]} h={120} /></div>
        </Card>
        <Card className="flex flex-col items-center justify-center text-center">
          <Ring value={result?.confidence_score || 0} label="Confidence" color="#f4b54d" size={150} />
          <p className="mt-4 text-sm text-ivory/55">Chronotype confidence</p>
        </Card>
      </div>
      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Chronotype" value={chronotype} delta="Latest result" />
        <Stat label="Lark Score" value={String(result?.lark_score || 0)} color="text-champagne" />
        <Stat label="Eagle Score" value={String(result?.eagle_score || 0)} color="text-elegant" />
        <Stat label="Owl Score" value={String(result?.owl_score || 0)} color="text-sunrise" />
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <p className="mb-4 font-serif text-2xl">Reports</p>
          {(data?.reports || []).map((report) => (
            <a key={report.id} href={report.report_url || "#"} className="block border-b border-ivory/5 py-3 text-sm text-ivory/70 last:border-0 hover:text-gold">
              {report.title || "Chronotype report"} - {new Date(report.generated_at).toLocaleDateString()}
            </a>
          ))}
          {!data?.reports?.length && <p className="text-sm text-ivory/45">No reports yet.</p>}
        </Card>
        <Card>
          <p className="mb-4 font-serif text-2xl">Referral</p>
          <p className="font-mono text-2xl text-gold">{member?.referral_code || "Available after assessment"}</p>
          <p className="mt-3 text-sm text-ivory/55">Referral users are mapped under WelcomeCure unless they use an organization code.</p>
        </Card>
      </div>
    </>
  );
}
