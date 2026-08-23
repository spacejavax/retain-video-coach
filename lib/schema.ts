import { z } from "zod";

export const scoreLabelSchema = z.enum(["Needs work", "Promising", "Strong", "Excellent"]);
const score = z.number().int().min(0).max(100);
const time = z.string().min(1).max(12);

export const analysisSchema = z.object({
  overallScore: score.describe("Holistic retention score for THIS video, derived from the category scores below — not a round or default-looking number."),
  scoreLabel: scoreLabelSchema,
  summary: z.string().min(1).describe("One sentence naming the single biggest retention lever in this specific video — must reference something that happens in the footage, not a generic niche observation."),
  strongestElement: z.string().min(1).describe("The single most effective concrete moment or choice in the video (quote or describe it), and why it works for retention."),
  biggestProblem: z.string().min(1).describe("The single highest-impact retention problem, tied to a specific moment in the footage — not a category-level generality like 'pacing could be better'."),
  scores: z.object({
    hook: score, pacing: score, clarity: score, visualEngagement: score,
    audioDelivery: score, payoff: score, audienceFit: score,
  }),
  hookAnalysis: z.object({
    currentHook: z.string().min(1).describe("The exact spoken words and/or on-screen text in the first ~3 seconds, as they actually occur — a direct transcription/description, not a paraphrase."),
    assessment: z.string().min(1).describe("Why this exact hook does or doesn't earn the next 3 seconds of attention, referencing its actual wording, pacing, or visual."),
    improvedHooks: z.array(z.string().min(1)).length(3).describe("Three alternative hooks that preserve the creator's real subject matter and voice — not generic viral-hook templates."),
  }),
  timelineIssues: z.array(z.object({
    startTime: time, endTime: time,
    severity: z.enum(["low", "medium", "high"]),
    category: z.string().min(1),
    issue: z.string().min(1).describe("State what literally happens on screen/audio at this timestamp first, then the problem with it. Must be specific enough that it could not describe any other video."),
    whyItMatters: z.string().min(1).describe("The retention mechanism at risk (e.g. curiosity gap collapses, cognitive load spikes) — grounded in what happens at this exact moment."),
    exactFix: z.string().min(1).describe("A concrete editing instruction referencing the actual footage (e.g. cut from 0:14 to 0:19, replace this line with X) — never a generic tip like 'make it punchier'."),
  })),
  recommendedCuts: z.array(z.object({ startTime: time, endTime: time, reason: z.string().min(1).describe("Why this exact span, based on what happens in it, adds no retention value.") })),
  textOverlaySuggestions: z.array(z.object({ timestamp: time, text: z.string().min(1), purpose: z.string().min(1).describe("Why an overlay is needed at this exact moment given what's being said/shown there.") })),
  strengths: z.array(z.string().min(1).describe("A specific technique actually used in the video, not a generic compliment.")),
  priorityActions: z.array(z.string().min(1)).length(3).describe("The three highest-impact, most concrete edits, ordered by expected retention impact — each actionable without rereading the rest of the report."),
  revisedScript: z.string().min(1),
  disclaimer: z.string().min(1),
});

export const formSchema = z.object({
  sessionToken: z.string().min(1),
  fileUri: z.string().refine((url) => url.startsWith("https://generativelanguage.googleapis.com/") || url.startsWith("local://"), "Invalid upload URL"),
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
