export type HealthCategory = {
  tag: string;
  icon: string;
  pattern: RegExp;
};

export const HEALTH_CATEGORIES: HealthCategory[] = [
  { tag: "Joint",      icon: "🦴", pattern: /knee|joint|hip|shoulder|ankle/i },
  { tag: "Glucose",    icon: "🩸", pattern: /glucose|sugar|insulin|diabetes/i },
  { tag: "Sleep",      icon: "💤", pattern: /sleep|insomnia|tired|fatigue|rest/i },
  { tag: "Heart",      icon: "❤️", pattern: /blood pressure|bp|heart|cardiac/i },
  { tag: "Pain",       icon: "⚡", pattern: /pain|ache|sore/i },
  { tag: "Mental",     icon: "🧠", pattern: /mood|anxious|stress|depress|mental/i },
  { tag: "Medication", icon: "💊", pattern: /medication|pill|dose|prescription/i },
  { tag: "Energy",     icon: "🔋", pattern: /energy|weak|exhausted/i },
];

export const deriveTags = (transcript: string): string[] =>
  HEALTH_CATEGORIES
    .filter(({ pattern }) => pattern.test(transcript))
    .map(({ tag }) => tag);
