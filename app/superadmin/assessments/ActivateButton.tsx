"use client";

import { useState } from "react";
import { activateAssessmentVersionAction } from "@/app/actions/assessments";

export function ActivateButton({ versionId }: { versionId: string }) {
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  const activate = async () => {
    setBusy(true);
    const res = await activateAssessmentVersionAction(versionId);
    setMsg(res.message);
    setBusy(false);
    if (res.ok) setTimeout(() => setMsg(""), 2000);
  };

  return (
    <span className="inline-flex items-center gap-2">
      <button onClick={activate} disabled={busy} className="rounded-full border border-emerald-400/30 px-3 py-1 text-xs text-emerald-400 hover:bg-emerald-400/10 disabled:opacity-50">
        {busy ? "..." : "Activate"}
      </button>
      {msg && <span className="text-xs text-emerald-400">{msg}</span>}
    </span>
  );
}
