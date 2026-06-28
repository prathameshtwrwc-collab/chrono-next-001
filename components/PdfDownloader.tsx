"use client";

import { useState } from "react";

export function usePdfDownload() {
  const [busy, setBusy] = useState(false);

  const downloadPdf = async (payload: any) => {
    setBusy(true);
    try {
      const resp = await fetch("/api/reports/html", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!resp.ok) throw new Error("HTML fetch failed");
      const html = await resp.text();

      const iframe = document.createElement("iframe");
      iframe.style.position = "fixed";
      iframe.style.top = "-9999px";
      iframe.style.left = "-9999px";
      iframe.style.width = "210mm";
      iframe.style.height = "297mm";
      document.body.appendChild(iframe);

      const doc = iframe.contentDocument!;
      doc.open();
      doc.write(html);
      doc.close();

      await new Promise((r) => setTimeout(r, 2000));

      iframe.contentWindow!.focus();
      iframe.contentWindow!.print();

      setTimeout(() => document.body.removeChild(iframe), 1000);
    } catch (e) {
      console.error("PDF error:", e);
    }
    setBusy(false);
  };

  return { downloadPdf, busy };
}
