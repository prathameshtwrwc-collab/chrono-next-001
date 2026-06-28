"use client";

import { useState, useEffect } from "react";
import { PageHeader, Card, Stat } from "@/components/PortalLayout";
import { getMemberDashboardData } from "@/lib/data/dashboard";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import { Link2, ExternalLink, MessageCircle, Send, Gamepad2, Mail } from "lucide-react";

export default function ProgressPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState<string | null>(null);
  const [shareModal, setShareModal] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/member-data")
      .then((r) => r.json())
      .then((d) => setData(d))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const downloadReport = async (report: any) => {
    setDownloading(report.id);
    try {
      const snap = report.report_snapshot || {};
      const firstName = snap.firstName || snap.details?.firstName || "";
      const lastName = snap.lastName || snap.details?.lastName || "";
      const payload = {
        firstName,
        lastName,
        chronotype: snap.result?.chronotype || "EAGLE",
        totalScore: snap.result?.totalScore ?? 0,
        larkScore: snap.result?.larkScore ?? 0,
        eagleScore: snap.result?.eagleScore ?? 0,
        owlScore: snap.result?.owlScore ?? 0,
        summary: snap.result?.summary || "",
        recommendations: snap.recommendations || [],
        orgName: snap.orgName || "WelcomeCure",
        logoUrl: snap.logoUrl || null,
      };
      const resp = await fetch("/api/reports/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!resp.ok) throw new Error("fail");
      const blob = await resp.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `chronotype-report-${report.snapshot?.firstName || "member"}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {}
    setDownloading(null);
  };

  const printReport = async (report: any) => {
    setDownloading(report.id);
    try {
      const snap = report.report_snapshot || {};
      const payload = {
        firstName: snap.firstName || snap.details?.firstName || "",
        lastName: snap.lastName || snap.details?.lastName || "",
        chronotype: snap.result?.chronotype || "EAGLE",
        totalScore: snap.result?.totalScore ?? 0,
        larkScore: snap.result?.larkScore ?? 0,
        eagleScore: snap.result?.eagleScore ?? 0,
        owlScore: snap.result?.owlScore ?? 0,
        summary: snap.result?.summary || "",
        recommendations: snap.recommendations || [],
        orgName: snap.orgName || "WelcomeCure",
        logoUrl: snap.logoUrl || null,
      };
      const resp = await fetch("/api/reports/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!resp.ok) throw new Error("fail");
      const blob = await resp.blob();
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch {}
    setDownloading(null);
  };

  if (loading) return <div className="p-8 text-center text-ivory/50">Loading...</div>;
  const result = data?.latestResult;
  const reports = data?.reports || [];

  return (
    <>
      <PageHeader eyebrow="Progress Tracking" title="Your journey so far" />
      <div className="grid gap-6 sm:grid-cols-3">
        <Stat label="Chronotype" value={result?.chronotype || "-"} delta="Latest result" />
        <Stat label="Total Score" value={String(result?.total_score || 0)} color="text-champagne" />
        <Stat label="Confidence" value={`${result?.confidence_score || 0}%`} color="text-sunrise" />
      </div>
      <Card className="mt-6">
        <p className="mb-4 font-serif text-2xl">Your Reports</p>
        {reports.length ? (
          <div className="space-y-3">
            {reports.map((r: any) => (
              <div key={r.id} className="flex items-center justify-between border-b border-ivory/5 py-3 last:border-0">
                <div>
                  <p className="text-sm text-ivory/75">{r.title || "Chronotype Report"}</p>
                  <p className="text-xs text-ivory/40">{new Date(r.generated_at).toLocaleDateString()}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => downloadReport(r)} disabled={downloading === r.id}
                    className="rounded-full border border-gold/30 px-4 py-1.5 text-xs text-gold hover:bg-gold/10 disabled:opacity-50">
                    {downloading === r.id ? "..." : "Download PDF"}
                  </button>
                  <button onClick={() => printReport(r)} disabled={downloading === r.id}
                    className="rounded-full border border-ivory/20 px-4 py-1.5 text-xs text-ivory/60 hover:bg-ivory/10 disabled:opacity-50">
                    Print
                  </button>
                  <button onClick={() => setShareModal(r)}
                    className="rounded-full border border-ivory/20 px-4 py-1.5 text-xs text-ivory/60 hover:bg-ivory/10">
                    Share
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-ivory/45">No reports yet. Complete an assessment to generate your first report.</p>
        )}
      </Card>

      {shareModal && typeof window === "object" && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-midnight/80 backdrop-blur-xl" onClick={() => setShareModal(null)}>
          <div className="max-w-md mx-4 rounded-2xl border border-white/10 bg-indigo-deep p-6 text-ivory shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <p className="font-serif text-2xl mb-1">Share Your Result</p>
            <p className="text-sm text-ivory/50 mb-6">Share your chronotype assessment with friends and colleagues.</p>
            <div className="space-y-3">

              <button onClick={() => { const url = shareModal.assessment_id ? `${window.location.origin}/reports/${shareModal.assessment_id}` : window.location.origin + "/member"; navigator.clipboard.writeText(url); setShareModal(null); }}
                className="w-full rounded-full border border-white/15 px-6 py-3 text-sm text-ivory/80 hover:bg-white/10 transition-colors flex items-center gap-3">
                <Link2 size={18} />
                Copy Link
              </button>

              <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareModal.assessment_id ? `${window.location.origin}/reports/${shareModal.assessment_id}` : window.location.origin + "/member")}`}
                target="_blank" rel="noopener noreferrer"
                className="w-full rounded-full border border-white/15 px-6 py-3 text-sm text-ivory/80 hover:bg-white/10 transition-colors flex items-center gap-3 no-underline">
                <ExternalLink size={18} />
                LinkedIn
              </a>

              <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent("I discovered my chronotype! View my result:")}&url=${encodeURIComponent(shareModal.assessment_id ? `${window.location.origin}/reports/${shareModal.assessment_id}` : window.location.origin + "/member")}`}
                target="_blank" rel="noopener noreferrer"
                className="w-full rounded-full border border-white/15 px-6 py-3 text-sm text-ivory/80 hover:bg-white/10 transition-colors flex items-center gap-3 no-underline">
                <ExternalLink size={18} />
                X / Twitter
              </a>

              <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareModal.assessment_id ? `${window.location.origin}/reports/${shareModal.assessment_id}` : window.location.origin + "/member")}`}
                target="_blank" rel="noopener noreferrer"
                className="w-full rounded-full border border-white/15 px-6 py-3 text-sm text-ivory/80 hover:bg-white/10 transition-colors flex items-center gap-3 no-underline">
                <ExternalLink size={18} />
                Facebook
              </a>

              <a href={`https://wa.me/?text=${encodeURIComponent("Check out my chronotype assessment result! " + (shareModal.assessment_id ? `${window.location.origin}/reports/${shareModal.assessment_id}` : window.location.origin + "/member"))}`}
                target="_blank" rel="noopener noreferrer"
                className="w-full rounded-full border border-white/15 px-6 py-3 text-sm text-ivory/80 hover:bg-white/10 transition-colors flex items-center gap-3 no-underline">
                <MessageCircle size={18} />
                WhatsApp
              </a>

              <a href={`https://t.me/share/url?url=${encodeURIComponent(shareModal.assessment_id ? `${window.location.origin}/reports/${shareModal.assessment_id}` : window.location.origin + "/member")}&text=${encodeURIComponent("Check out my chronotype assessment result!")}`}
                target="_blank" rel="noopener noreferrer"
                className="w-full rounded-full border border-white/15 px-6 py-3 text-sm text-ivory/80 hover:bg-white/10 transition-colors flex items-center gap-3 no-underline">
                <Send size={18} />
                Telegram
              </a>

              <a href={`https://discord.com/share?url=${encodeURIComponent(shareModal.assessment_id ? `${window.location.origin}/reports/${shareModal.assessment_id}` : window.location.origin + "/member")}`}
                target="_blank" rel="noopener noreferrer"
                className="w-full rounded-full border border-white/15 px-6 py-3 text-sm text-ivory/80 hover:bg-white/10 transition-colors flex items-center gap-3 no-underline">
                <Gamepad2 size={18} />
                Discord
              </a>

              <a href={`mailto:?subject=${encodeURIComponent("Chronotype Assessment Result")}&body=${encodeURIComponent(`Check out my chronotype assessment result: ${shareModal.assessment_id ? `${window.location.origin}/reports/${shareModal.assessment_id}` : window.location.origin + "/member"}`)}`}
                className="w-full rounded-full border border-white/15 px-6 py-3 text-sm text-ivory/80 hover:bg-white/10 transition-colors flex items-center gap-3 no-underline">
                <Mail size={18} />
                Email
              </a>
            </div>
            <button onClick={() => setShareModal(null)}
              className="w-full mt-4 rounded-full border border-white/15 px-6 py-3 text-sm text-white/60">
              Close
            </button>
          </div>
        </div>, document.body
      )}
    </>
  );
}
