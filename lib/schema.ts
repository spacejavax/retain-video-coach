import { z } from "zod";

export const scoreLabelSchema = z.enum(["Needs work", "Promising", "Strong", "Excellent"]);
const score = z.number().int().min(0).max(100);
const time = z.string().min(1).max(12);

export const analysisSchema = z.object({
  overallScore: score,
  scoreLabel: scoreLabelSchema,
  summary: z.string().min(1),
  strongestElement: z.string().min(1),
  biggestProblem: z.string().min(1),
  scores: z.object({
    hook: score, pacing: score, clarity: score, visualEngagement: score,
    audioDelivery: score, payoff: score, audienceFit: score,
  }),
  hookAnalysis: z.object({
    currentHook: z.string().min(1),
    assessment: z.string().min(1),
    improvedHooks: z.array(z.string().min(1)).length(3),
  }),
  timelineIssues: z.array(z.object({
    startTime: time, endTime: time,
    severity: z.enum(["low", "medium", "high"]),
    category: z.string().min(1), issue: z.string().min(1),
    whyItMatters: z.string().min(1), exactFix: z.string().min(1),
  })),
  recommendedCuts: z.array(z.object({ startTime: time, endTime: time, reason: z.string().min(1) })),
  textOverlaySuggestions: z.array(z.object({ timestamp: time, text: z.string().min(1), purpose: z.string().min(1) })),
  strengths: z.array(z.string().min(1)),
  priorityActions: z.array(z.string().min(1)).length(3),
  revisedScript: z.string().min(1),
  disclaimer: z.string().min(1),
});

export const formSchema = z.object({
  fileUri: z.string().url().refine((url) => url.startsWith("https://generativelanguage.googleapis.com/"), "Invalid upload URL"),
  fileName: z.string().min(1).max(180),
  mimeType: z.enum(["video/mp4", "video/quicktime", "video/webm"]),
  platform: z.enum(["TikTok", "Instagram Reels", "YouTube Shorts"]),
  niche: z.string().trim().min(2).max(100),
  audience: z.string().trim().min(2).max(200),
  goal: z.enum(["views", "engagement", "followers", "conversions"]),
});

export type Analysis = z.infer<typeof analysisSchema>;
export type AnalysisInput = z.infer<typeof formSchema>;

export function expectedScoreLabel(scoreValue: number): z.infer<typeof scoreLabelSchema> {
  if (scoreValue < 40) return "Needs work";
  if (scoreValue < 65) return "Promising";
  if (scoreValue < 85) return "Strong";
  return "Excellent";
}

export function validateAnalysis(data: unknown) {
  const parsed = analysisSchema.parse(data);
  return { ...parsed, scoreLabel: expectedScoreLabel(parsed.overallScore) };
}
