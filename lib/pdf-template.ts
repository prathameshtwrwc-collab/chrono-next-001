import crypto from "crypto";

import crypto from "crypto";

export function stableId(...parts: (string | number | null | undefined)[]): string {
  const hash = crypto.createHash("sha256").update(parts.filter(Boolean).join("|")).digest("hex");
  return "RPT-" + hash.slice(0, 8).toUpperCase();
}

export const defaultRecs: Record<string, { category: string; title: string; description: string }[]> = {
  LARK: [
    { category: "morning_routine", title: "Protect Your Morning Advantage", description: "Start important work early when your focus is strongest." },
    { category: "deep_work", title: "Schedule Deep Work Early", description: "Plan demanding tasks between 7 AM and 11 AM." },
    { category: "wind_down", title: "Slow Down Earlier", description: "Begin reducing stimulation at least 90 minutes before bed." },
    { category: "sleep_consistency", title: "Keep a Stable Bedtime", description: "Your rhythm benefits from predictable sleep timing." },
    { category: "movement", title: "Use Early Activity", description: "Light exercise in the morning can support energy and mood." },
    { category: "recovery", title: "Avoid Late Overload", description: "Keep heavy work and late-night screen time limited." },
  ],
  EAGLE: [
    { category: "sleep_consistency", title: "Anchor Your Sleep Window", description: "Aim for a consistent 7.5\u20138 hour window." },
    { category: "energy", title: "Use Your Midday Performance Zone", description: "Schedule complex work between 10 AM and 2 PM." },
    { category: "nutrition", title: "Balance Your Energy Intake", description: "Eat a protein-rich breakfast, moderate lunch, and lighter dinner." },
    { category: "movement", title: "Use Afternoon Movement", description: "Plan exercise or active tasks around 3\u20135 PM." },
    { category: "deep_work", title: "Split Your Deep Work", description: "Use one focused block in the morning and one in the afternoon." },
    { category: "light", title: "Strengthen Your Circadian Anchor", description: "Get morning sunlight within an hour of waking." },
  ],
  OWL: [
    { category: "work_timing", title: "Avoid Forcing Early Peak Work", description: "Place creative or analytical work later in the day where possible." },
    { category: "light", title: "Use Morning Light Deliberately", description: "Bright outdoor light soon after waking can stabilize your rhythm." },
    { category: "sleep_consistency", title: "Protect a Stable Schedule", description: "Try to keep your sleep and wake times consistent across the week." },
    { category: "energy_management", title: "Use Evenings Strategically", description: "Reserve focused, high-output work for your late-day energy window." },
    { category: "wind_down", title: "Reduce Late Stimulation", description: "Dim lights and lower screen exposure before bed to support sleep onset." },
    { category: "deep_work", title: "Plan Evening Focus Blocks", description: "Use your natural evening alertness for creative or analytical tasks." },
  ],
};

export const categoryLabels: Record<string, string> = {
  sleep: "Sleep", energy: "Energy", nutrition: "Nutrition", movement: "Movement",
  light: "Light Exposure", recovery: "Recovery", deep_work: "Deep Work",
  wind_down: "Wind Down", mindfulness: "Mindfulness",
  work_timing: "Work Timing", sleep_consistency: "Sleep Consistency",
  energy_management: "Energy Management", morning_routine: "Morning Routine",
};

export function formatCat(cat: string): string {
  const lower = cat.toLowerCase().trim();
  return categoryLabels[lower] || lower.replace(/_/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase());
}

export const riskIndicators = [
  "Irregular sleep timing may increase cardiovascular strain over time.",
  "Chronic sleep debt above 2 hours shows measurable decline in cognitive performance.",
  "Inconsistent wake times disrupt circadian alignment and metabolic health.",
  "Late light exposure (after 10 PM) suppresses melatonin and delays sleep onset.",
];

export function htmlTemplate(data: any) {
  const ct = (data.chronotype || "EAGLE") as string;
  const participantName = data.firstName || data.lastName ? [data.firstName, data.lastName].filter(Boolean).join(" ") : data.email || "Participant";
  const orgName = data.orgName || "WelcomeCure";
  const totalScore = data.totalScore ?? 0;
  const larkScore = data.larkScore ?? 0;
  const eagleScore = data.eagleScore ?? 0;
  const owlScore = data.owlScore ?? 0;
  const userRecs = data.recommendations?.length > 0 ? data.recommendations : defaultRecs[ct] || [];
  const maxScore = Math.max(larkScore, eagleScore, owlScore, 1);

  const now = new Date();
  const day = now.getDate();
  const month = now.toLocaleDateString("en-US", { month: "long" });
  const year = now.getFullYear();
  const date = `${month} ${day}, ${year}`;
  const reportId = stableId(data.firstName || "", data.lastName || "", data.email || "", ct, String(totalScore));

  const sleepWindowStart = ct === "LARK" ? "9:00 PM" : ct === "OWL" ? "12:00 AM" : "10:30 PM";
  const sleepWindowEnd = ct === "LARK" ? "5:00 AM" : ct === "OWL" ? "8:00 AM" : "6:30 AM";
  const sleepWindowFull = `${sleepWindowStart} \u2013 ${sleepWindowEnd}`;
  const peakEnergyStart = ct === "LARK" ? "6:00 AM" : ct === "OWL" ? "6:00 PM" : "10:00 AM";
  const peakEnergyEnd = ct === "LARK" ? "10:00 AM" : ct === "OWL" ? "10:00 PM" : "2:00 PM";
  const peakEnergyFull = `${peakEnergyStart} \u2013 ${peakEnergyEnd}`;
  const morningAnchor = ct === "LARK" ? "5:00 AM" : ct === "OWL" ? "8:00 AM" : "6:30 AM";
  const windDownTime = ct === "LARK" ? "8:30 PM" : ct === "OWL" ? "11:00 PM" : "9:30 PM";

  const chronotypeColorCss = ct === "LARK" ? "#d88921" : ct === "OWL" ? "#7c3aed" : "#2469d8";
  const chronotypePillBg = ct === "LARK" ? "rgba(216,137,33,0.10)" : ct === "OWL" ? "rgba(124,58,237,0.10)" : "rgba(36,105,216,0.10)";
  const ctLower = ct.toLowerCase();

  const strengths: Record<string, string> = { LARK: "Morning Optimizer", EAGLE: "Balanced Performer", OWL: "Evening Innovator" };
  const rhythmTypes: Record<string, string> = { LARK: "Early Chronotype", EAGLE: "Intermediate Chronotype", OWL: "Late Chronotype" };

  const pctLark = larkScore > 0 ? Math.round((larkScore / maxScore) * 100) : 0;
  const pctEagle = eagleScore > 0 ? Math.round((eagleScore / maxScore) * 100) : 0;
  const pctOwl = owlScore > 0 ? Math.round((owlScore / maxScore) * 100) : 0;

  const catAlias: Record<string, string> = {
    light: "light_exposure", morning_light: "light_exposure",
    sleep: "sleep_consistency", deep_work: "deep_work",
    wind_down: "wind_down", energy: "energy_management",
    movement: "movement", nutrition: "nutrition", recovery: "recovery",
    work_timing: "work_timing", mindfulness: "mindfulness",
    morning_routine: "morning_routine", sleep_consistency: "sleep_consistency",
    energy_management: "energy_management",
  };
  const norm = (s: string) => catAlias[s.toLowerCase().trim().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "")] || s.toLowerCase().trim().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "");

  const recs: any[] = [];
  const seen = new Set<string>();
  for (const r of userRecs) {
    if (recs.length >= 6) break;
    const cat = norm(r.category || "");
    if (cat && !seen.has(cat)) {
      seen.add(cat);
      recs.push({ ...r, number: recs.length + 1 });
    }
  }
  const fallbackPool = defaultRecs[ct] || [];
  for (const fb of fallbackPool) {
    if (recs.length >= 6) break;
    const cat = norm(fb.category || "");
    if (cat && !seen.has(cat)) {
      seen.add(cat);
      recs.push({ ...fb, number: recs.length + 1 });
    }
  }
  while (recs.length < 6) {
    recs.push({ category: "sleep_consistency", title: "Protect Your Rhythm", description: "Consistent sleep and wake times help regulate your internal clock and improve overall well-being.", number: recs.length + 1 });
  }

  const whatThisMeans = ct === "LARK"
    ? "Your internal clock runs early. You naturally peak in the first half of the day, making mornings your most productive and focused window. Your energy declines earlier in the evening, signaling a natural early wind-down."
    : ct === "OWL"
      ? "Your internal clock runs late. Your energy and focus build through the afternoon and peak in the evening, making you naturally suited for night-time creativity and deep work. Morning starts can feel sluggish without a gradual transition."
      : "Your rhythm sits between early and late. You have a flexible internal clock that adapts well to different schedules. Your energy is most stable midday, giving you a balanced productivity window that works across morning and afternoon.";

  const recIcons: Record<string, string> = {
    sleep: "\u260F", energy: "\u26A1", nutrition: "\uD83C\uDF4E", movement: "\uD83C\uDFC3",
    light: "\u2600\uFE0F", recovery: "\uD83D\uDE0C", deep_work: "\uD83C\uDFAF",
    wind_down: "\uD83C\uDF19", mindfulness: "\uD83E\uDDD8",     general: "\u2726",
    work_timing: "\u23F0", sleep_consistency: "\uD83D\uDCCB", energy_management: "\u26A1",
    morning_routine: "\uD83C\uDF05",
  };

  return `<!DOCTYPE html>
<html><head><meta charset="utf-8" />
<style>
  @page { margin: 0; size: A4; }
  * { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  body { margin: 0; padding: 0; background: #fafaf7; font-family: 'Segoe UI',-apple-system,Roboto,Helvetica,Arial,sans-serif; color: #202638; }
  .page { width: 210mm; height: 297mm; padding: 32px; position: relative; page-break-after: always; overflow: hidden; }
  .page:last-child { page-break-after: auto; }
  .hero { border-radius: 0 0 28px 28px; margin: -32px -32px 24px -32px; padding: 32px 40px 24px; background: radial-gradient(circle at 85% 35%, rgba(255,255,255,0.65) 0 2px, transparent 3px),radial-gradient(circle at 78% 22%, rgba(255,255,255,0.55) 0 1px, transparent 2px),linear-gradient(135deg, #fff4d8 0%, #eaf4ff 45%, #eee8ff 100%); position: relative; }
  .hero::after { content: ""; position: absolute; right: 80px; bottom: 45px; width: 34px; height: 34px; border-radius: 50%; box-shadow: -9px 4px 0 #ffffff; opacity: 0.75; }
  .hero-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; }
  .brand { font-size: 16px; letter-spacing: 0.08em; color: #202638; font-weight: 500; }
  .date { font-size: 11px; color: #667085; }
  .chronotype-pill { display: inline-block; padding: 5px 14px; border-radius: 999px; font-size: 10px; font-weight: 800; letter-spacing: 0.08em; margin-bottom: 14px; text-transform: uppercase; }
  .hero-title { font-family: Georgia,"Times New Roman",serif; font-size: 54px; line-height: 1; letter-spacing: 0.08em; margin: 0 0 10px 0; color: #202638; font-weight: 700; text-transform: uppercase; }
  .hero-subtitle { font-size: 13px; color: #355c7d; margin-bottom: 18px; }
  .participant-name { font-size: 24px; font-weight: 800; margin-bottom: 4px; text-transform: capitalize; }
  .report-type { font-size: 11px; color: #667085; }
  .grid-4 { display: grid; grid-template-columns: repeat(4,1fr); gap: 10px; margin-bottom: 16px; }
  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 16px; }
  .card { background: #ffffff; border: 1px solid rgba(32,38,56,0.10); border-radius: 14px; box-shadow: 0 8px 24px rgba(32,38,56,0.06); }
  .insight-card { min-height: 58px; padding: 14px; display: flex; align-items: center; gap: 10px; }
  .icon-circle { width: 34px; height: 34px; min-width: 34px; border-radius: 50%; background: #f3f6fb; display: flex; align-items: center; justify-content: center; color: #355c7d; font-size: 16px; }
  .icon-gold { background: rgba(214,168,79,0.14); color: #b8872e; }
  .icon-purple { background: rgba(126,87,194,0.10); color: #6d45d7; }
  .label { font-size: 8.5px; letter-spacing: 0.10em; text-transform: uppercase; color: #667085; font-weight: 800; margin-bottom: 4px; }
  .value { font-size: 12px; line-height: 1.25; color: #202638; font-weight: 800; }
  .section-title { font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; color: #355c7d; font-weight: 900; margin-bottom: 14px; }
  .section-title-gold { color: #b8872e; font-size: 12px; letter-spacing: 0.10em; text-transform: uppercase; font-weight: 900; margin-bottom: 14px; }
  .score-layout { display: grid; grid-template-columns: 1.9fr 0.9fr; gap: 14px; margin-bottom: 16px; }
  .score-card { padding: 18px; min-height: 142px; }
  .score-row { display: grid; grid-template-columns: 60px 28px 1fr; gap: 10px; align-items: center; margin: 13px 0; }
  .score-name { font-size: 11px; font-weight: 700; color: #202638; }
  .score-number { font-size: 11px; font-weight: 800; color: #355c7d; text-align: right; }
  .bar-bg { height: 12px; background: #edf0f5; border-radius: 999px; overflow: hidden; }
  .bar-fill { height: 100%; border-radius: 999px; }
  .bar-lark { background: linear-gradient(90deg,#d6a84f,#d88921); }
  .bar-eagle { background: linear-gradient(90deg,#6fa8ff,#2469d8); }
  .bar-owl { background: linear-gradient(90deg,#a084ff,#7c3aed); }
  .total-score-card { padding: 18px; text-align: center; position: relative; overflow: hidden; min-height: 142px; }
  .total-score-card::before { content: "‹"; position: absolute; left: 46px; top: 42px; font-size: 76px; color: rgba(214,168,79,0.13); transform: rotate(-25deg); }
  .total-score-card::after { content: "›"; position: absolute; right: 46px; top: 42px; font-size: 76px; color: rgba(214,168,79,0.13); transform: rotate(25deg); }
  .total-score { font-family: Georgia,"Times New Roman",serif; font-size: 58px; line-height: 1; color: #b8872e; margin-top: 20px; font-weight: 500; }
  .meaning-card { padding: 18px; margin-bottom: 16px; display: grid; grid-template-columns: 42px 1fr; gap: 14px; align-items: flex-start; }
  .meaning-text { font-size: 12px; line-height: 1.65; color: #384152; }
  .info-card { padding: 18px; display: grid; grid-template-columns: 42px 1fr; gap: 14px; align-items: center; min-height: 88px; }
  .big-value { font-size: 18px; font-weight: 900; color: #202638; margin-bottom: 4px; }
  .caption { font-size: 10px; color: #667085; }
  .timeline-card { padding: 18px 22px 20px; margin-bottom: 16px; }
  .timeline { position: relative; display: grid; grid-template-columns: repeat(4,1fr); align-items: start; margin-top: 22px; padding: 0 8px; }
  .timeline::before { content: ""; position: absolute; top: 19px; left: 10%; right: 10%; height: 3px; background: linear-gradient(90deg,#7c3aed,#6fa8ff,#d6a84f,#7c3aed); border-radius: 999px; opacity: 0.55; }
  .timeline-item { position: relative; text-align: center; z-index: 1; }
  .timeline-node { width: 40px; height: 40px; border-radius: 50%; margin: 0 auto 8px auto; display: flex; align-items: center; justify-content: center; background: #ffffff; border: 1px solid rgba(32,38,56,0.10); box-shadow: 0 6px 16px rgba(32,38,56,0.08); font-size: 16px; }
  .timeline-time { font-size: 13px; font-weight: 900; color: #202638; margin-bottom: 3px; }
  .timeline-label { font-size: 10px; color: #667085; }
  .footer { position: absolute; left: 32px; right: 32px; bottom: 22px; display: flex; justify-content: space-between; align-items: center; border-top: 1px solid rgba(32,38,56,0.08); padding-top: 12px; color: #667085; font-size: 8.5px; }
  .footer-item { white-space: nowrap; }
  .page-2-header { display: flex; justify-content: space-between; align-items: center; flex-wrap: nowrap; gap: 12px; padding-bottom: 16px; border-bottom: 1px solid rgba(32,38,56,0.08); margin-bottom: 34px; color: #667085; font-size: 10px; white-space: nowrap; }
  .page-2-brand { font-size: 16px; letter-spacing: 0.08em; color: #202638; font-weight: 500; }
  .page-2-title { font-family: Georgia,"Times New Roman",serif; font-size: 31px; color: #202638; margin: 0 0 8px 0; font-weight: 500; }
  .gold-line { width: 44px; height: 2px; background: #d6a84f; margin-bottom: 22px; }
  .recommendations { margin-bottom: 20px; }
  .rec-card { display: grid; grid-template-columns: 52px 1fr 30px; gap: 16px; align-items: center; padding: 14px 16px; min-height: 76px; border-radius: 14px; background: #ffffff; border: 1px solid rgba(32,38,56,0.10); box-shadow: 0 6px 18px rgba(32,38,56,0.04); }
  .rec-card + .rec-card { margin-top: -1px; }
  .rec-icon { width: 42px; height: 42px; border-radius: 50%; background: rgba(214,168,79,0.12); color: #b8872e; display: flex; align-items: center; justify-content: center; font-size: 17px; font-weight: 900; }
  .rec-label { font-size: 8.5px; letter-spacing: 0.16em; color: #b8872e; font-weight: 900; text-transform: uppercase; margin-bottom: 4px; }
  .rec-title { font-size: 13px; font-weight: 900; color: #202638; margin-bottom: 3px; }
  .rec-text { font-size: 10.5px; color: #384152; line-height: 1.4; }
  .rec-number { width: 24px; height: 24px; border-radius: 50%; background: rgba(214,168,79,0.14); color: #8a651e; font-size: 10px; font-weight: 900; display: flex; align-items: center; justify-content: center; }
  .bottom-grid { display: grid; grid-template-columns: 1fr 0.95fr; gap: 14px; margin-top: 18px; }
  .risk-card, .disclaimer-card { padding: 18px; min-height: 170px; }
  .risk-title, .disclaimer-title { display: flex; gap: 8px; align-items: center; font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; font-weight: 900; margin-bottom: 14px; }
  .risk-title { color: #b8872e; }
  .disclaimer-title { color: #355c7d; }
  .risk-list { margin: 0; padding-left: 16px; color: #384152; font-size: 10.5px; line-height: 1.65; }
  .risk-list li { margin-bottom: 6px; }
  .disclaimer-text { font-size: 10.5px; line-height: 1.6; color: #384152; }
</style></head><body>

<div class="page">
  <div class="hero">
    <div class="hero-top">
      <div class="brand">${orgName}</div>
      <div class="date">${date}</div>
    </div>
    <div class="chronotype-pill" style="background:${chronotypePillBg};color:${chronotypeColorCss};">${ct}</div>
    <h1 class="hero-title">${ct}</h1>
    <div class="hero-subtitle">Chronotype Assessment Result</div>
    <div class="participant-name">${participantName}</div>
    <div class="report-type">Assessment Report</div>
  </div>

  <div class="grid-4">
    <div class="card insight-card">
      <div class="icon-circle icon-gold">\u2726</div>
      <div><div class="label">Chronotype Strength</div><div class="value">${strengths[ct] || "Adaptable"}</div></div>
    </div>
    <div class="card insight-card">
      <div class="icon-circle">\u26A1</div>
      <div><div class="label">Energy Peak</div><div class="value">${peakEnergyFull}</div></div>
    </div>
    <div class="card insight-card">
      <div class="icon-circle icon-purple">\u263E</div>
      <div><div class="label">Sleep Window</div><div class="value">${sleepWindowFull}</div></div>
    </div>
    <div class="card insight-card">
      <div class="icon-circle icon-gold">\u25F7</div>
      <div><div class="label">Rhythm Type</div><div class="value">${rhythmTypes[ct] || "Flexible"}</div></div>
    </div>
  </div>

  <div class="score-layout">
    <div class="card score-card">
      <div class="section-title">Score Breakdown</div>
      <div class="score-row"><div class="score-name">Lark</div><div class="score-number">${larkScore}</div><div class="bar-bg"><div class="bar-fill bar-lark" style="width:${pctLark}%;"></div></div></div>
      <div class="score-row"><div class="score-name">Eagle</div><div class="score-number">${eagleScore}</div><div class="bar-bg"><div class="bar-fill bar-eagle" style="width:${pctEagle}%;"></div></div></div>
      <div class="score-row"><div class="score-name">Owl</div><div class="score-number">${owlScore}</div><div class="bar-bg"><div class="bar-fill bar-owl" style="width:${pctOwl}%;"></div></div></div>
    </div>
    <div class="card total-score-card">
      <div class="section-title">Total Score</div>
      <div class="total-score">${totalScore}</div>
      <div class="caption" style="margin-top:4px;">Highest matching chronotype score</div>
    </div>
  </div>

  <div class="card meaning-card">
    <div class="icon-circle">\u25CB</div>
    <div>
      <div class="section-title">What This Means</div>
      <div class="meaning-text">${whatThisMeans}</div>
    </div>
  </div>

  <div class="grid-2">
    <div class="card info-card">
      <div class="icon-circle icon-purple">\u263E</div>
      <div><div class="label">Optimal Sleep Window</div><div class="big-value">${sleepWindowFull}</div><div class="caption">Recommended sleep period</div></div>
    </div>
    <div class="card info-card">
      <div class="icon-circle">\u26A1</div>
      <div><div class="label">Peak Energy Time</div><div class="big-value">${peakEnergyFull}</div><div class="caption">Your cognitive peak window</div></div>
    </div>
  </div>

  <div class="card timeline-card">
    <div class="section-title">Your Daily Rhythm At A Glance</div>
    <div class="timeline">
      <div class="timeline-item"><div class="timeline-node">\u263E</div><div class="timeline-time">${sleepWindowStart}</div><div class="timeline-label">Sleep Window</div></div>
      <div class="timeline-item"><div class="timeline-node">\u263C</div><div class="timeline-time">${morningAnchor}</div><div class="timeline-label">Morning Anchor</div></div>
      <div class="timeline-item"><div class="timeline-node">\u26A1</div><div class="timeline-time">${peakEnergyStart}</div><div class="timeline-label">Peak Energy</div></div>
      <div class="timeline-item"><div class="timeline-node">\u263E</div><div class="timeline-time">${windDownTime}</div><div class="timeline-label">Wind Down</div></div>
    </div>
  </div>

  <div class="footer">
    <div class="footer-item">\u2726 Generated by ${orgName} Sleep Chronotype Platform</div>
    <div class="footer-item">\u25A3 ${date}</div>
    <div class="footer-item">\u25A4 ${reportId}</div>
    <div class="footer-item">\u25A8 Confidential wellness report</div>
    <div style="font-weight:700;white-space:nowrap;">Page 1 of 2</div>
  </div>
</div>

<div class="page">
  <div class="page-2-header">
    <div class="page-2-brand">${orgName}</div>
    <div>${participantName}</div>
    <div>${reportId}</div>
    <div>${date}</div>
  </div>

  <h2 class="page-2-title">Personalized Guidance</h2>
  <div class="gold-line"></div>

  <div class="section-title-gold">Personalized Recommendations</div>
  <div class="recommendations">
    ${recs.map((r: any) => {
      const icon = recIcons[r.category] || recIcons.general;
      return `
    <div class="rec-card">
      <div class="rec-icon">${icon}</div>
      <div>
        <div class="rec-label">${formatCat(r.category)}</div>
        <div class="rec-title">${r.title}</div>
        <div class="rec-text">${r.description}</div>
      </div>
      <div class="rec-number">${r.number}</div>
    </div>`;
    }).join("")}
  </div>

  <div class="bottom-grid">
    <div class="card risk-card">
      <div class="risk-title">\u26A0 Risk & Warning Indicators</div>
      <ul class="risk-list">
        ${riskIndicators.map((ri: string) => `<li>${ri}</li>`).join("")}
      </ul>
    </div>
    <div class="card disclaimer-card">
      <div class="disclaimer-title">\uD83D\uDEE1 Medical Disclaimer</div>
      <div class="disclaimer-text">This report is for informational and educational purposes only. It does not constitute medical advice, diagnosis, or treatment. Always consult a qualified healthcare professional for sleep or health concerns. The chronotype assessment is based on self-reported data and may not reflect clinical sleep disorders. ${orgName} and its affiliates assume no liability for any decisions made based on this report.</div>
    </div>
  </div>

  <div class="footer">
    <div class="footer-item">\u2726 Generated by ${orgName} Sleep Chronotype Platform</div>
    <div class="footer-item">\u25A3 ${date}</div>
    <div class="footer-item">\u25A4 ${reportId}</div>
    <div class="footer-item">\u25A8 Confidential wellness report</div>
    <div style="font-weight:700;white-space:nowrap;">Page 2 of 2</div>
  </div>
</div>

</body></html>`;
}
