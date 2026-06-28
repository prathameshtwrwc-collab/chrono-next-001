export const superadminNavItems = [
  { label: "Command Center", href: "/superadmin", icon: "◈" },
  { label: "Organizations", href: "/superadmin/organizations", icon: "⬡" },
  { label: "Assessments", href: "/superadmin/assessments", icon: "✦" },
  { label: "Members", href: "/superadmin/members", icon: "☷" },
  { label: "Users", href: "/superadmin/users", icon: "⚙" },
  { label: "Reports", href: "/superadmin/reports", icon: "▤" },
  { label: "Recommendations", href: "/superadmin/recommendations", icon: "✸" },
  { label: "Activity", href: "/superadmin/activity", icon: "∿" },
  { label: "Settings", href: "/superadmin/settings", icon: "◇" },
];

export const superadminUser = { name: "Kai Mercer", role: "Platform Owner", initials: "KM" };

export const superadminStats = [
  { label: "Organizations", value: "312", delta: "↑ 18 this quarter" },
  { label: "Active Members", value: "487K", delta: "↑ 6.2% MoM", color: "text-champagne" },
  { label: "Countries", value: "108", delta: "Global reach", color: "text-elegant" },
  { label: "Uptime", value: "99.98%", delta: "30-day rolling", color: "text-sunrise" },
];

export const superadminGlobalData = [290, 305, 320, 340, 355, 380, 395, 410, 430, 450, 470, 487];

export const superadminRegions = [
  ["Europe", 38, "#f4b54d"],
  ["Americas", 31, "#354a82"],
  ["Asia", 22, "#e7a95b"],
  ["Other", 9, "#e9e2f5"],
];

export const superadminOrgs = [
  ["Helios Group", "Enterprise", "2,418", "Healthy", "EU"],
  ["Northwind Labs", "Growth", "642", "Healthy", "US"],
  ["Atlas Health", "Enterprise", "5,109", "Watch", "UK"],
  ["Meridian Co", "Starter", "188", "Healthy", "SG"],
  ["Vesta Partners", "Growth", "977", "Healthy", "CA"],
  ["Lumen Works", "Enterprise", "3,304", "Healthy", "AU"],
];

export const superadminAdmins = [
  ["Dr. Lena Soto", "Helios Group", "Wellbeing Admin", "Active"],
  ["Ravi Menon", "Atlas Health", "Org Admin", "Active"],
  ["Clara Fox", "Northwind Labs", "Org Admin", "Invited"],
  ["Yuki Tanaka", "Lumen Works", "Wellbeing Admin", "Active"],
];

export const superadminMetrics = [
  { label: "API latency", value: "84ms", delta: "p95 global" },
  { label: "Requests / day", value: "42.7M", delta: "↑ 3.1%", color: "text-champagne" },
  { label: "Error rate", value: "0.02%", delta: "Well within SLO", color: "text-elegant" },
  { label: "Data processed", value: "9.4 TB", delta: "Last 24h", color: "text-sunrise" },
];

export const superadminRequestData = [20, 18, 15, 22, 38, 52, 60, 58, 64, 70, 55, 40];

export const superadminSettings = [
  ["Platform name", "CHRONOTYPE Intelligence"],
  ["Primary region", "EU-West"],
  ["Default plan", "Growth"],
  ["Support email", "ops@somna.io"],
  ["Brand accent", "Warm Gold"],
  ["Time format", "24-hour"],
];

export const superadminGovernanceReviews = [
  ["Circadian Light Science", "Scientific review", "amber"],
  ["Owl Productivity Study", "Pending approval", "amber"],
  ["Caffeine & REM", "Approved", "emerald"],
];

export const superadminCompliance = [
  ["GDPR", "Compliant"],
  ["HIPAA-aligned", "Compliant"],
  ["Data residency", "EU + US"],
  ["Anonymization", "Enforced"],
];

export const superadminToggles = [
  ["Maintenance mode", false],
  ["New org onboarding", true],
  ["AI insights engine", true],
  ["Public API", true],
  ["Beta features", false],
];

export const superadminAnalyticsData = [
  { title: "Global avg sleep score", data: [71, 72, 73, 74, 75, 76, 77], color: "#f4b54d" },
  { title: "Assessments completed (M)", data: [1.2, 1.5, 1.9, 2.3, 2.8, 3.4, 4.1], color: "#e7a95b" },
  { title: "Score by region", data: [77, 74, 79, 72, 80], color: "#354a82", type: "bars" },
  { title: "Chronotype distribution (global)", data: [31, 47, 22], color: "#f2a640", type: "bars" },
];
