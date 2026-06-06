export type Severity = "moderate" | "mild" | "good";

export type HealthEntry = {
  id: string;
  timestamp: string;
  transcript: string;
  analysis: string;
  tags: string[];
  severity: Severity | null;
  embedding?: number[];
};

export type HealthPattern = {
  id: string;
  entryId: string;
  patternName: string;
  severity: "moderate" | "mild";
  description: string;
  recommendation: string;
  createdAt: string;
};

export type RagInsight = {
  text: string;
  highlights: string[];
};

export type PipelineStep = {
  id: string;
  label: string;
  status: "pending" | "running" | "done";
  icon: string;
};

export type InsightStat = {
  label: string;
  value: string;
  unit: string;
  trend: "up" | "down" | "neutral";
  trendColor: "red" | "green" | "yellow";
};
