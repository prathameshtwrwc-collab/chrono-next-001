export async function downloadPdf(payload: any, filename = "chronotype-report.pdf") {
  const resp = await fetch("/api/reports/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (resp.ok) {
    const blob = await resp.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    return true;
  }
  return false;
}

export async function previewPdf(payload: any) {
  const resp = await fetch("/api/reports/preview", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!resp.ok) throw new Error("Preview unavailable");
  const html = await resp.text();
  const win = window.open("", "_blank");
  if (!win) throw new Error("Popup blocked");
  win.document.write(html);
  win.document.close();
}

export async function downloadOrPreview(payload: any) {
  const puppeteerOk = await downloadPdf(payload);
  if (!puppeteerOk) {
    await previewPdf(payload);
  }
}
