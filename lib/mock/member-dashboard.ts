export const memberNavItems = [
  { label: "Dashboard", href: "/member", icon: "◈" },
  { label: "Sleep Score", href: "/member/score", icon: "◐" },
  { label: "Chronotype", href: "/member/chronotype", icon: "✦" },
  { label: "Energy Timeline", href: "/member/energy", icon: "∿" },
  { label: "Sleep Blueprint", href: "/member/blueprint", icon: "◇" },
  { label: "Recommendations", href: "/member/recommendations", icon: "✸" },
  { label: "Progress", href: "/member/progress", icon: "↗" },
  { label: "Goals", href: "/member/goals", icon: "◎" },
  { label: "Profile", href: "/member/profile", icon: "☺" },
];

export const memberUser = { name: "Amara Veil", role: "Eagle Chronotype", initials: "AV" };

export const memberWeeklySleep = [7.2, 6.8, 7.5, 8.0, 6.5, 7.8, 8.2];
export const memberWeekDays = ["M", "T", "W", "T", "F", "S", "S"];

export const memberProtocol = [
  ["06:30", "10 min morning light", true],
  ["10:00", "Deep work block", true],
  ["14:00", "Avoid late caffeine", false],
  ["21:30", "Dim lights, wind down", false],
];

export const memberEnergyCurve = [30, 45, 65, 80, 88, 85, 78, 70, 72, 60, 42, 28];
export const memberEnergyLabels = ["6a", "8a", "10a", "12p", "2p", "4p", "6p", "8p", "10p", "12a", "2a", "4a"];

export const memberEnergyCards = [
  { label: "Focus Peak", time: "10:00 AM", color: "#f4b54d" },
  { label: "Afternoon Dip", time: "2:30 PM", color: "#354a82" },
  { label: "Creative Surge", time: "6:00 PM", color: "#e7a95b" },
  { label: "Sleep Prep", time: "9:30 PM", color: "#e9e2f5" },
];

export const memberBlueprintCards = [
  { label: "Chronotype", value: "Eagle", desc: "Balanced, adaptable energy across the day." },
  { label: "Optimal Sleep Window", value: "10:45 PM – 6:30 AM", desc: "Consistency improves your score by ~9%." },
  { label: "Sleep Need", value: "7h 45m", desc: "Your personal restorative requirement." },
  { label: "Cycle Length", value: "~96 min", desc: "Aim to wake at the end of a cycle." },
];

export const memberRecommendations = [
  { category: "Light", title: "Morning sunlight ritual", desc: "10 minutes of outdoor light before 8am to anchor your clock.", icon: "☀" },
  { category: "Nutrition", title: "Caffeine cutoff at 1pm", desc: "Protect your afternoon recovery and evening sleep onset.", icon: "☕" },
  { category: "Movement", title: "Train at 4–6pm", desc: "Your physical peak — strength and endurance are highest here.", icon: "⚡" },
  { category: "Recovery", title: "Dim lights after 9pm", desc: "Lower lux signals melatonin release and a smoother descent.", icon: "◐" },
  { category: "Deep Work", title: "Block 9–11am", desc: "Reserve your sharpest cognition for your hardest work.", icon: "◇" },
  { category: "Wind Down", title: "Screen-free 30 min", desc: "A consistent pre-sleep routine improves depth and timing.", icon: "✦" },
];

export const memberMilestones = [
  "First full blueprint",
  "7-day consistency streak",
  "Reached 'Excellent' tier",
  "30 nights logged",
];

export const memberGoals = [
  { title: "Sleep before 11pm", progress: 82, detail: "6 of 7 nights this week" },
  { title: "Reach 8h average", progress: 64, detail: "Currently 7h 38m" },
  { title: "Morning light daily", progress: 90, detail: "Nearly a perfect streak" },
  { title: "No caffeine after 1pm", progress: 71, detail: "Improving steadily" },
];

export const memberProfileDetails = [
  ["Email", "amara@somna.io"],
  ["Timezone", "GMT+1 · Lisbon"],
  ["Wake target", "6:30 AM"],
  ["Sleep target", "10:45 PM"],
  ["Notifications", "Enabled"],
  ["Data sharing", "Anonymous only"],
];

export const memberScoreBreakdown = [
  ["Duration", 90, "#f4b54d"],
  ["Depth", 78, "#354a82"],
  ["Timing", 92, "#e7a95b"],
  ["Recovery", 84, "#f5d18c"],
];

export const memberTrendData = [72, 75, 70, 78, 80, 76, 82, 79, 84, 81, 85, 83, 86, 84, 88, 86];
