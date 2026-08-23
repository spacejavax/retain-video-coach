import { GoogleGenAI } from "@google/genai";
import { readFileSync } from "fs";
import { config } from "dotenv";

config({ path: "C:/Users/zhong/OneDrive/Dokument/AI_scan_video_premium/.env.local" });

const apiKey = process.env.GEMINI_API_KEY;
const videoPath = process.argv[2];

const ai = new GoogleGenAI({ apiKey });

const input = { platform: "TikTok", niche: "personal finance tips", audience: "young adults new to budgeting", goal: "engagement" };

const OLD_MODEL = "gemini-2.5-flash";
const NEW_MODEL = "gemini-2.5-pro";

const OLD_PROMPT = `You are a rigorous short-form video editor. Analyse the actual spoken words, visible content, pacing and audio in this uploaded video. Do not give generic creator advice.

Context: platform=${input.platform}; niche=${input.niche}; intended audience=${input.audience}; goal=${input.goal}.

Assess the first frame, spoken hook, on-screen text, clarity without context, curiosity gap, speed to main point, pauses, repetition, visual changes, caption readability, voice clarity, energy, emotional variation, story structure, payoff, audience relevance, CTA and likely attention-loss sections.

Every criticism must say where it occurs, why it may hurt retention, and the exact change to make. Use timestamp strings like 0:07. Never invent analytics, predicted views, watch-time percentages or statistical certainty. Preserve the creator's meaning and personality in the revised script. Provide exactly three improved hooks and exactly three priority actions ordered by expected impact. The disclaimer must state that this is creative/retention guidance and cannot guarantee performance.

Write every free-text field (summary, strongestElement, biggestProblem, hookAnalysis, timelineIssues including category, recommendedCuts, textOverlaySuggestions, strengths, priorityActions, revisedScript, disclaimer) in Swedish. Keep scoreLabel and severity as the exact English enum values the schema requires (e.g. "Strong", "high").`;

const NEW_PROMPT = `You are a rigorous short-form video editor. Analyse the actual spoken words, visible content, pacing and audio in this uploaded video. Do not give generic creator advice.

Context: platform=${input.platform}; niche=${input.niche}; intended audience=${input.audience}; goal=${input.goal}.

Assess the first frame, spoken hook, on-screen text, clarity without context, curiosity gap, speed to main point, pauses, repetition, visual changes, caption readability, voice clarity, energy, emotional variation, story structure, payoff, audience relevance, CTA and likely attention-loss sections.

GROUNDING RULE: for every criticism, first identify the literal spoken words or on-screen content at that exact timestamp (as if transcribing/describing that instant), THEN explain the problem and fix. If you cannot point to a specific moment that produced a criticism, delete that criticism rather than include a vague one. Before finalising your answer, re-read every free-text field and reject any sentence that could be pasted unchanged into feedback for a different video in the same niche — rewrite it to reference something that only happens in THIS footage.

Example of the difference required:
- BAD (generic, reject this style): "The hook could be stronger to grab attention faster."
- GOOD (grounded, required style): "At 0:00 you say 'so today I want to talk about...' before showing anything — the actual subject doesn't appear until 0:04, so viewers have no visual reason to stay for the first 4 seconds."

Every criticism must say where it occurs, why it may hurt retention, and the exact change to make. Use timestamp strings like 0:07. Never invent analytics, predicted views, watch-time percentages or statistical certainty. Preserve the creator's meaning and personality in the revised script. Provide exactly three improved hooks and exactly three priority actions ordered by expected impact. The disclaimer must state that this is creative/retention guidance and cannot guarantee performance.

Write every free-text field (summary, strongestElement, biggestProblem, hookAnalysis, timelineIssues including category, recommendedCuts, textOverlaySuggestions, strengths, priorityActions, revisedScript, disclaimer) in Swedish. Keep scoreLabel and severity as the exact English enum values the schema requires (e.g. "Strong", "high").`;

const OLD_SCHEMA = {
  type: "object",
  properties: {
    overallScore: { type: "integer", minimum: 0, maximum: 100 },
    scoreLabel: { type: "string", enum: ["Needs work", "Promising", "Strong", "Excellent"] },
    summary: { type: "string" },
    strongestElement: { type: "string" },
    biggestProblem: { type: "string" },
    scores: { type: "object", properties: { hook: { type: "integer" }, pacing: { type: "integer" }, clarity: { type: "integer" }, visualEngagement: { type: "integer" }, audioDelivery: { type: "integer" }, payoff: { type: "integer" }, audienceFit: { type: "integer" } }, required: ["hook", "pacing", "clarity", "visualEngagement", "audioDelivery", "payoff", "audienceFit"] },
    hookAnalysis: { type: "object", properties: { currentHook: { type: "string" }, assessment: { type: "string" }, improvedHooks: { type: "array", items: { type: "string" }, minItems: 3, maxItems: 3 } }, required: ["currentHook", "assessment", "improvedHooks"] },
    timelineIssues: { type: "array", items: { type: "object", properties: { startTime: { type: "string" }, endTime: { type: "string" }, severity: { type: "string", enum: ["low", "medium", "high"] }, category: { type: "string" }, issue: { type: "string" }, whyItMatters: { type: "string" }, exactFix: { type: "string" } }, required: ["startTime", "endTime", "severity", "category", "issue", "whyItMatters", "exactFix"] } },
    recommendedCuts: { type: "array", items: { type: "object", properties: { startTime: { type: "string" }, endTime: { type: "string" }, reason: { type: "string" } }, required: ["startTime", "endTime", "reason"] } },
    textOverlaySuggestions: { type: "array", items: { type: "object", properties: { timestamp: { type: "string" }, text: { type: "string" }, purpose: { type: "string" } }, required: ["timestamp", "text", "purpose"] } },
    strengths: { type: "array", items: { type: "string" } },
    priorityActions: { type: "array", items: { type: "string" }, minItems: 3, maxItems: 3 },
    revisedScript: { type: "string" },
    disclaimer: { type: "string" },
  },
  required: ["overallScore", "scoreLabel", "summary", "strongestElement", "biggestProblem", "scores", "hookAnalysis", "timelineIssues", "recommendedCuts", "textOverlaySuggestions", "strengths", "priorityActions", "revisedScript", "disclaimer"],
};

async function run(label, model, prompt, schema, fileUri, mimeType) {
  const response = await ai.models.generateContent({
    model,
    contents: [{ role: "user", parts: [{ fileData: { fileUri, mimeType } }, { text: prompt }] }],
    config: { responseMimeType: "application/json", responseJsonSchema: schema },
  });
  const parsed = JSON.parse(response.text || "{}");
  console.log(`\n========== ${label} (${model}) ==========`);
  console.log(JSON.stringify(parsed, null, 2));
  return parsed;
}

async function main() {
  const bytes = readFileSync(videoPath);
  const mimeType = "video/mp4";
  console.log("Uploading video to Gemini Files API...");
  const uploaded = await ai.files.upload({ file: new Blob([bytes], { type: mimeType }), config: { mimeType } });
  console.log("Uploaded:", uploaded.name, uploaded.uri);

  const deadline = Date.now() + 120000;
  let file = uploaded;
  while (Date.now() < deadline) {
    file = await ai.files.get({ name: uploaded.name });
    if (file.state === "ACTIVE") break;
    if (file.state === "FAILED") throw new Error("File processing failed");
    console.log("Waiting for file to become ACTIVE, current state:", file.state);
    await new Promise((r) => setTimeout(r, 2500));
  }
  console.log("File ready:", file.state);

  const NEW_SCHEMA = JSON.parse(JSON.stringify(OLD_SCHEMA));
  NEW_SCHEMA.properties.overallScore.description = "Holistic retention score for THIS video, derived from the category scores below — not a round or default-looking number.";
  NEW_SCHEMA.properties.summary.description = "One sentence naming the single biggest retention lever in this specific video — must reference something that happens in the footage, not a generic niche observation.";
  NEW_SCHEMA.properties.strongestElement.description = "The single most effective concrete moment or choice in the video (quote or describe it), and why it works for retention.";
  NEW_SCHEMA.properties.biggestProblem.description = "The single highest-impact retention problem, tied to a specific moment in the footage — not a category-level generality like 'pacing could be better'.";
  NEW_SCHEMA.properties.hookAnalysis.properties.currentHook.description = "The exact spoken words and/or on-screen text in the first ~3 seconds, as they actually occur — a direct transcription/description, not a paraphrase.";
  NEW_SCHEMA.properties.hookAnalysis.properties.assessment.description = "Why this exact hook does or doesn't earn the next 3 seconds of attention, referencing its actual wording, pacing, or visual.";
  NEW_SCHEMA.properties.hookAnalysis.properties.improvedHooks.description = "Three alternative hooks that preserve the creator's real subject matter and voice — not generic viral-hook templates.";
  NEW_SCHEMA.properties.timelineIssues.items.properties.issue.description = "State what literally happens on screen/audio at this timestamp first, then the problem with it. Must be specific enough that it could not describe any other video.";
  NEW_SCHEMA.properties.timelineIssues.items.properties.whyItMatters.description = "The retention mechanism at risk (e.g. curiosity gap collapses, cognitive load spikes) — grounded in what happens at this exact moment.";
  NEW_SCHEMA.properties.timelineIssues.items.properties.exactFix.description = "A concrete editing instruction referencing the actual footage (e.g. cut from 0:14 to 0:19, replace this line with X) — never a generic tip like 'make it punchier'.";
  NEW_SCHEMA.properties.recommendedCuts.items.properties.reason.description = "Why this exact span, based on what happens in it, adds no retention value.";
  NEW_SCHEMA.properties.textOverlaySuggestions.items.properties.purpose.description = "Why an overlay is needed at this exact moment given what's being said/shown there.";
  NEW_SCHEMA.properties.strengths.items.description = "A specific technique actually used in the video, not a generic compliment.";
  NEW_SCHEMA.properties.priorityActions.description = "The three highest-impact, most concrete edits, ordered by expected retention impact — each actionable without rereading the rest of the report.";

  await run("OLD (pre-fix)", OLD_MODEL, OLD_PROMPT, OLD_SCHEMA, file.uri, mimeType);
  await run("NEW (post-fix)", NEW_MODEL, NEW_PROMPT, NEW_SCHEMA, file.uri, mimeType);

  await ai.files.delete({ name: file.name });
  console.log("\nCleaned up uploaded file.");
}

main().catch((e) => { console.error(e); process.exit(1); });
