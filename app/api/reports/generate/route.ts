import { NextResponse } from "next/server";
import puppeteer from "puppeteer";

const defaultRecs: Record<string, { category: string; title: string; description: string }[]> = {
  LARK: [
    { category: "sleep", title: "Protect Your Early Window", description: "Your natural sleep onset is early. Avoid bright light after 8 PM to maintain melatonin production." },
    { category: "energy", title: "Morning Power Block", description: "Schedule your hardest cognitive work between 6–10 AM when your alertness peaks." },
    { category: "nutrition", title: "Align Meals to Your Clock", description: "Eat your largest meal at breakfast and lunch. Keep dinner light and at least 3 hours before bed." },
    { category: "recovery", title: "Evening Wind-Down Ritual", description: "Begin your pre-sleep routine by 8:30 PM. Dim lights, avoid screens, and use a consistent cue." },
    { category: "deep_work", title: "Guard Your Morning Focus", description: "Resist early meetings. Your prefrontal cortex is at its sharpest before noon." },
    { category: "wind_down", title: "Consistent Wake Time", description: "Even on weekends, waking within 30 minutes of your weekday time strengthens your circadian rhythm." },
  ],
  EAGLE: [
    { category: "sleep", title: "Anchor Your Sleep Window", description: "Aim for a consistent 7.5–8 hour window. Your adaptable rhythm benefits from predictability." },
    { category: "energy", title: "Midday Performance Zone", description: "Your peak cognitive performance spans 10 AM–2 PM. Schedule complex work here." },
    { category: "nutrition", title: "Balanced Energy Intake", description: "Eat a protein-rich breakfast, moderate lunch, and lighter dinner to sustain stable energy." },
    { category: "movement", title: "Afternoon Movement Window", description: "Your physical coordination peaks around 3–5 PM. Ideal for exercise or active tasks." },
    { category: "deep_work", title: "Split Your Deep Work", description: "Divide focused work into a morning block (10–12) and an afternoon block (2–4) for best output." },
    { category: "wind_down", title: "Light Management", description: "Get 10–15 minutes of morning sunlight within an hour of waking to strengthen your circadian anchor." },
  ],
  OWL: [
    { category: "sleep", title: "Gradual Sleep Shift", description: "If you need an earlier schedule, shift your bedtime by 15 minutes every 2–3 days for sustainable change." },
    { category: "energy", title: "Evening Creative Surge", description: "Your creative problem-solving peaks between 6–10 PM. Reserve this window for brainstorming and innovation." },
    { category: "light", title: "Morning Light Therapy", description: "Use bright light exposure within 30 minutes of waking to help shift your internal clock earlier." },
    { category: "nutrition", title: "Late-Nutrition Strategy", description: "Avoid heavy meals after 9 PM. A small protein-rich snack before bed can stabilize overnight blood sugar." },
    { category: "recovery", title: "Pre-Bed Buffer Zone", description: "Dim lights and reduce stimulation 60–90 minutes before your target bedtime. Use blue-light blocking glasses." },
    { category: "deep_work", title: "Strategic Morning Tasks", description: "Schedule routine or low-cognitive tasks before noon. Save analytical work for your evening peak." },
  ],
};

function htmlTemplate(data: any) {
  const ct = (data.chronotype || "EAGLE") as string;
  const participantName = data.firstName || data.lastName ? [data.firstName, data.lastName].filter(Boolean).join(" ") : data.email || "Participant";
  const orgName = data.orgName || "WelcomeCure";
  const logoHtml = data.logoUrl
    ? `<img src="${data.logoUrl}" alt="logo" style="height:30px;max-width:160px;object-fit:contain;" />`
    : `<span style="font-family:Georgia,serif;font-size:20px;font-weight:700;color:#b8860b;">${orgName}</span>`;
  const totalScore = data.totalScore ?? 0;
  const larkScore = data.larkScore ?? 0;
  const eagleScore = data.eagleScore ?? 0;
  const owlScore = data.owlScore ?? 0;
  const summary = data.summary || "Your chronotype assessment reveals your natural sleep-wake preference.";
  const userRecs = data.recommendations?.length > 0 ? data.recommendations : defaultRecs[ct] || [];

  const date = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  const sleepWindow = ct === "LARK" ? "9:00 PM – 5:00 AM" : ct === "OWL" ? "12:00 AM – 8:00 AM" : "10:30 PM – 6:30 AM";
  const peakEnergy = ct === "LARK" ? "6:00 – 10:00 AM" : ct === "OWL" ? "6:00 – 10:00 PM" : "10:00 AM – 2:00 PM";
  const badgeClass = `badge-${ct.toLowerCase()}`;

  return `<!DOCTYPE html>
<html><head><meta charset="utf-8" />
<style>
  @page { margin: 0; size: A4; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Segoe UI', -apple-system, Roboto, Helvetica, Arial, sans-serif; color: #1a1a2e; background: #f0efe9; font-size: 9.5px; line-height: 1.5; }
  .page { width: 210mm; padding: 28px 30px; }
  .top-bar { display: flex; justify-content: space-between; align-items: center; padding-bottom: 12px; border-bottom: 2px solid #d4c9a8; margin-bottom: 18px; }
  .badge { display: inline-block; padding: 2px 10px; border-radius: 20px; font-size: 8px; font-weight: 700; letter-spacing: 0.6px; text-transform: uppercase; }
  .badge-lark { background: #fef3c7; color: #92400e; }
  .badge-eagle { background: #dbeafe; color: #1e40af; }
  .badge-owl { background: #ede9fe; color: #5b21b6; }
  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  .grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; }
  .card { background: #ffffff; border: 1px solid #e2ddd0; border-radius: 10px; padding: 12px 14px; margin-bottom: 10px; box-shadow: 0 1px 4px rgba(0,0,0,0.05); }
  .card-title { font-size: 8px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; color: #99927a; margin-bottom: 4px; }
  .big-number { font-size: 32px; font-weight: 800; line-height: 1.1; }
  .score-row { display: flex; gap: 16px; justify-content: center; margin: 6px 0; }
  .score-item { text-align: center; }
  .score-val { font-size: 20px; font-weight: 700; }
  .score-label { font-size: 7.5px; text-transform: uppercase; letter-spacing: 0.6px; color: #99927a; }
  .rec-card { background: #f8f7f2; border-left: 3px solid #b8860b; border-radius: 0 8px 8px 0; padding: 8px 12px; margin-bottom: 6px; }
  .rec-cat { font-size: 7px; text-transform: uppercase; letter-spacing: 0.5px; color: #b8860b; font-weight: 600; }
  .rec-title { font-size: 10px; font-weight: 600; margin: 1px 0; }
  .rec-desc { font-size: 8.5px; color: #666; }
  .hr { border: 0; border-top: 1px solid #ddd8c8; margin: 8px 0; }
  .disclaimer { font-size: 7px; color: #aaa49a; line-height: 1.6; margin-top: 12px; padding-top: 8px; border-top: 1px solid #ddd8c8; }
  .section-title { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; color: #b8860b; margin-bottom: 6px; }
  .participant-name { font-size: 20px; font-weight: 700; color: #1a1a2e; }
  .participant-sub { font-size: 9px; color: #88827a; margin-top: 1px; }
  .warning-list { padding-left: 14px; font-size: 8.5px; color: #666; margin-bottom: 6px; }
  .warning-list li { margin-bottom: 2px; }
  .cover-section { background: #1a1a2e; color: #f0efe9; margin: -28px -30px 18px -30px; padding: 36px 34px 28px; border-radius: 0 0 20px 20px; }
  .cover-section .badge { border: 1px solid rgba(255,255,255,0.25); }
  .ct-large { font-size: 42px; font-weight: 800; letter-spacing: 0.3px; margin: 6px 0; }
  .ct-sub { font-size: 10px; color: rgba(255,255,255,0.6); }
  .details-row { display: flex; gap: 16px; font-size: 8.5px; color: rgba(255,255,255,0.7); }
  .details-row span { display: flex; align-items: center; gap: 4px; }
</style></head><body>

<div class="page">
  <div class="cover-section">
    <div class="details-row" style="margin-bottom:10px;">
      <span>${orgName}</span>
      <span>${date}</span>
    </div>
    <span class="badge ${badgeClass}">${ct}</span>
    <div class="ct-large">${ct}</div>
    <div class="ct-sub">Chronotype Assessment Result</div>
    <div class="participant-name" style="color:#f0efe9;margin-top:10px;">${participantName}</div>
    <div class="participant-sub" style="color:rgba(255,255,255,0.5);">Assessment Report</div>
  </div>

  <div class="grid-2">
    <div class="card">
      <div class="card-title">Total Score</div>
      <div class="big-number" style="color:#b8860b;">${totalScore}</div>
    </div>
    <div class="card">
      <div class="card-title">Optimal Sleep Window</div>
      <div style="font-size:13px;font-weight:600;margin-top:2px;">${sleepWindow}</div>
      <div style="font-size:7.5px;color:#99927a;">Recommended sleep period</div>
    </div>
  </div>

  <div class="card">
    <div class="card-title">Score Breakdown</div>
    <div class="score-row">
      <div class="score-item"><div class="score-val" style="color:#d97706;">${larkScore}</div><div class="score-label">Lark</div></div>
      <div class="score-item"><div class="score-val" style="color:#2563eb;">${eagleScore}</div><div class="score-label">Eagle</div></div>
      <div class="score-item"><div class="score-val" style="color:#7c3aed;">${owlScore}</div><div class="score-label">Owl</div></div>
    </div>
  </div>

  <div class="grid-2">
    <div class="card">
      <div class="card-title">Peak Energy Time</div>
      <div style="font-size:13px;font-weight:600;margin-top:2px;">${peakEnergy}</div>
      <div style="font-size:7.5px;color:#99927a;">Your cognitive peak window</div>
    </div>
    <div class="card">
      <div class="card-title">Summary</div>
      <p style="font-size:9px;line-height:1.6;margin-top:2px;color:#444;">${summary}</p>
    </div>
  </div>

  <div class="section-title" style="margin-top:12px;">Personalized Recommendations</div>
  ${userRecs.slice(0, 6).map((r: any) => `
    <div class="rec-card">
      <div class="rec-cat">${r.category}</div>
      <div class="rec-title">${r.title}</div>
      <div class="rec-desc">${r.description}</div>
    </div>
  `).join("")}

  <hr class="hr" style="margin-top:12px;" />
  <div class="section-title">Risk &amp; Warning Indicators</div>
  <ul class="warning-list">
    <li>Irregular sleep timing may increase cardiovascular strain over time.</li>
    <li>Chronic sleep debt above 2 hours shows measurable decline in cognitive performance.</li>
    <li>Inconsistent wake times disrupt circadian alignment and metabolic health.</li>
    <li>Late light exposure (after 10 PM) suppresses melatonin and delays sleep onset.</li>
  </ul>

  <div class="disclaimer">
    <strong>Disclaimer:</strong> This report is for informational and educational purposes only. It does not constitute medical advice, diagnosis, or treatment. Always consult a qualified healthcare professional for sleep or health concerns. The chronotype assessment is based on self-reported data and may not reflect clinical sleep disorders. ${orgName} and its affiliates assume no liability for any decisions made based on this report.
  </div>
</div>

</body></html>`;
}

export async function POST(request: Request) {
  try {
    const data = await request.json();

    const browser = await puppeteer.launch({ headless: true, args: ["--no-sandbox", "--disable-setuid-sandbox"] });
    const page = await browser.newPage();
    await page.setContent(htmlTemplate(data), { waitUntil: "load" });

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "0", right: "0", bottom: "0", left: "0" },
      displayHeaderFooter: false,
    });

    await browser.close();

    return new NextResponse(Buffer.from(pdf), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="chronotype-report-${data.firstName || "member"}.pdf"`,
      },
    });
  } catch (error) {
    console.error("PDF generation error:", error);
    return NextResponse.json({ error: "PDF generation failed" }, { status: 500 });
  }
}
