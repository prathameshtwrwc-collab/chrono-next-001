export type Chronotype = "LARK" | "EAGLE" | "OWL";

export type AssessmentOption = {
  id: string;
  label: string;
  score: number | null;
};

export type AssessmentQuestion = {
  id: string;
  prompt: string;
  context?: string;
  options: AssessmentOption[];
};

export type ChronotypeResult = {
  chronotype: Chronotype;
  title: string;
  tagline: string;
  summary: string;
  strengths: string[];
  challenges: string[];
  suggestions: string[];
  larkScore: number;
  eagleScore: number;
  owlScore: number;
  totalScore: number;
  confidenceScore: number;
};

const option = (question: number, index: number, label: string, score: number | null): AssessmentOption => ({
  id: `fallback-q${question}-o${index}`,
  label,
  score,
});

export const assessmentQuestions: AssessmentQuestion[] = [
  {
    id: "wake-natural",
    prompt: "If you had no alarm or fixed schedule, what time would you naturally wake up on most days?",
    options: [
      option(1, 1, "5-6 a.m.", 1),
      option(1, 2, "6-7 a.m.", 2),
      option(1, 3, "7-8 a.m.", 3),
      option(1, 4, "8-9 a.m.", 4),
      option(1, 5, "9 a.m. or later", 5),
    ],
  },
  {
    id: "sleep-ready",
    prompt: "If you had no fixed commitments, what time would you usually feel ready to go to sleep?",
    options: [
      option(2, 1, "9-10 p.m.", 1),
      option(2, 2, "10-11 p.m.", 2),
      option(2, 3, "11 p.m.-12 a.m.", 3),
      option(2, 4, "12-1 a.m.", 4),
      option(2, 5, "1 a.m. or later", 5),
    ],
  },
  {
    id: "sleep-midpoint",
    prompt: "On free days, where does your sleep midpoint fall?",
    context: "Example: sleep 12-8 a.m. means midpoint = 4 a.m.",
    options: [
      option(3, 1, "12 a.m.-3 a.m.", 1),
      option(3, 2, "3-4 a.m.", 2),
      option(3, 3, "4-5 a.m.", 3),
      option(3, 4, "5-6 a.m.", 4),
      option(3, 5, "6 a.m. or later", 5),
    ],
  },
  {
    id: "mental-peak",
    prompt: "When do you feel most mentally sharp and productive?",
    options: [
      option(4, 1, "Morning (6-10 a.m.)", 1),
      option(4, 2, "Late morning-early afternoon (10 a.m.-2 p.m.)", 2),
      option(4, 3, "Afternoon (2-6 p.m.)", 3),
      option(4, 4, "Evening (6-10 p.m.)", 4),
      option(4, 5, "Late evening or night (10 p.m.-1-2 a.m.)", 5),
    ],
  },
  {
    id: "early-morning-difficulty",
    prompt: "How hard are mornings for you when you must wake up early, for example before 7 a.m.?",
    options: [
      option(5, 1, "Easy, I adapt quickly", 1),
      option(5, 2, "A bit hard but manageable", 2),
      option(5, 3, "Moderately hard", 3),
      option(5, 4, "Very hard", 4),
      option(5, 5, "Extremely hard, I feel brain-dead", 5),
    ],
  },
  {
    id: "late-evening-difficulty",
    prompt: "How hard are evenings for you when you must stay awake late, for example after 10-11 p.m.?",
    options: [
      option(6, 1, "Very hard, I feel sleepy", 1),
      option(6, 2, "Hard", 2),
      option(6, 3, "Neutral", 3),
      option(6, 4, "Pretty easy", 4),
      option(6, 5, "Very easy, I feel alert", 5),
    ],
  },
  {
    id: "ideal-workday",
    prompt: "If you could choose your ideal workday, which would you pick?",
    options: [
      option(7, 1, "Start early (6-8 a.m.), end earlier (2-5 p.m.)", 1),
      option(7, 2, "8-10 a.m. start, 4-6 p.m. end", 2),
      option(7, 3, "9-11 a.m. start, 5-7 p.m. end", 3),
      option(7, 4, "2-4 p.m. start, 10 p.m.-12 a.m. end", 4),
      option(7, 5, "4 p.m. or later start, work into the night", 5),
    ],
  },
  {
    id: "wake-feeling",
    prompt: "How do you feel right after waking up in the first 30-60 minutes?",
    options: [
      option(8, 1, "Clear-headed and ready to go", 1),
      option(8, 2, "Slightly groggy", 2),
      option(8, 3, "Quite groggy", 3),
      option(8, 4, "Very groggy", 4),
      option(8, 5, "Almost zombie mode", 5),
    ],
  },
  {
    id: "before-bed-feeling",
    prompt: "How do you feel in the hour before you usually go to bed?",
    options: [
      option(9, 1, "Very sleepy", 1),
      option(9, 2, "Fairly sleepy", 2),
      option(9, 3, "Neutral", 3),
      option(9, 4, "Fairly alert", 4),
      option(9, 5, "Very alert and energetic", 5),
    ],
  },
  {
    id: "weekday-sleep-context",
    prompt: "When do you usually go to sleep on weekdays?",
    context: "Pick the closest block. This is mainly for context, not a scoring point.",
    options: [
      option(10, 1, "9-10 p.m.", null),
      option(10, 2, "10-11 p.m.", null),
      option(10, 3, "11 p.m.-12 a.m.", null),
      option(10, 4, "12-1 a.m.", null),
      option(10, 5, "1 a.m. or later", null),
    ],
  },
];

const resultCopy: Record<Chronotype, Omit<ChronotypeResult, "chronotype" | "larkScore" | "eagleScore" | "owlScore" | "totalScore" | "confidenceScore">> = {
  LARK: {
    title: "Lark",
    tagline: "Sunrise clarity. Early momentum. Natural morning leadership.",
    summary:
      "Your biology leans early. You tend to do your best thinking when the day is fresh, and your energy rewards a clean evening wind-down.",
    strengths: ["Fast morning activation", "Strong early-day focus", "Natural consistency"],
    challenges: ["Late meetings drain faster", "Social jet lag can hit hard", "Evening overstimulation affects recovery"],
    suggestions: ["Protect your first deep-work block", "Keep bright light early", "Move demanding decisions away from late night"],
  },
  EAGLE: {
    title: "Eagle",
    tagline: "Balanced rhythm. Adaptable energy. Steady performance windows.",
    summary:
      "Your rhythm is flexible and centered. You can perform across the day when your sleep timing, light exposure, and workload are kept consistent.",
    strengths: ["Adaptable schedule", "Stable midday performance", "Good recovery potential"],
    challenges: ["Can drift later under stress", "Needs routine to stay sharp", "Energy dips if sleep debt builds"],
    suggestions: ["Anchor wake time within one hour", "Use midday for complex collaboration", "Create a reliable evening shutdown cue"],
  },
  OWL: {
    title: "Owl",
    tagline: "Evening depth. Creative late focus. Night-biased cognition.",
    summary:
      "Your biology leans later. You often come alive when the day quiets down, with deeper focus and creative energy building toward evening.",
    strengths: ["Late-day focus", "Creative problem solving", "Comfort with flexible work blocks"],
    challenges: ["Early starts are costly", "Morning fog can be real", "Fixed schedules can create sleep debt"],
    suggestions: ["Use light strategically after waking", "Avoid scheduling critical tasks too early", "Build a consistent pre-sleep runway"],
  },
};

export function scoreAssessment(answerOptionIds: string[]): ChronotypeResult {
  const scores = assessmentQuestions
    .map((question, index) => question.options.find((option) => option.id === answerOptionIds[index])?.score ?? null)
    .filter((score): score is number => typeof score === "number");

  const totalScore = scores.reduce((sum, score) => sum + score, 0);
  const larkScore = scores.reduce((sum, score) => sum + Math.max(0, 6 - score), 0);
  const owlScore = scores.reduce((sum, score) => sum + score, 0);
  const eagleScore = scores.reduce((sum, score) => sum + (6 - Math.abs(3 - score) * 2), 0);

  let chronotype: Chronotype = "EAGLE";
  if (totalScore <= 20) chronotype = "LARK";
  if (totalScore >= 33) chronotype = "OWL";

  const winningScore = Math.max(larkScore, eagleScore, owlScore);
  const runnerUp = [larkScore, eagleScore, owlScore].sort((a, b) => b - a)[1] ?? 0;
  const confidenceScore = Math.min(96, Math.max(68, Math.round(72 + (winningScore - runnerUp) * 2.5)));

  return {
    chronotype,
    ...resultCopy[chronotype],
    larkScore,
    eagleScore,
    owlScore,
    totalScore,
    confidenceScore,
  };
}

export function createReferralCode(email: string) {
  const seed = email.split("@")[0]?.replace(/[^a-z0-9]/gi, "").toUpperCase().slice(0, 5) || "SLEEP";
  return `REF-${seed}-${Math.floor(1000 + Math.random() * 9000)}`;
}
