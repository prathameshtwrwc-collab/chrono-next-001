"use client";

import { useState } from "react";
import { deleteRecommendationAction } from "@/app/actions/extras";

export function DeleteButton({ id }: { id: string }) {
  const [busy, setBusy] = useState(false);
  return (
    <button disabled={busy} onClick={async () => { setBusy(true); await deleteRecommendationAction(id); setBusy(false); }}
      className="rounded-full border border-red-400/30 px-3 py-1 text-xs text-red-400 hover:bg-red-400/10 disabled:opacity-50">
      {busy ? "..." : "Delete"}
    </button>
  );
}
