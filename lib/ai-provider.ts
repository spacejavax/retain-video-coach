import { GoogleGenAI } from "@google/genai";
import { z } from "zod";
import { AppError } from "./errors";
import { GEMINI_MODEL, HACKCLUB_MODEL } from "./config";
import { buildPrompt } from "./prompt";
import { analysisSchema, type Analysis, type AnalysisInput, validateAnalysis } from "./schema";
import { getVideo, deleteVideo } from "./video-store";

export interface AnalysisProvider { analyse(input: AnalysisInput): Promise<Analysis>; cleanup(fileName: string): Promise<void>; }

export class GeminiProvider implements AnalysisProvider {
  private ai: GoogleGenAI;
  constructor(apiKey: string) { this.ai = new GoogleGenAI({ apiKey }); }

  async analyse(input: AnalysisInput): Promise<Analysis> {
    await this.waitUntilReady(input.fileName);
    for (let attempt = 0; attempt < 2; attempt++) {
      const response = await this.ai.models.generateContent({
        model: GEMINI_MODEL,
        contents: [{ role: "user", parts: [{ fileData: { fileUri: input.fileUri, mimeType: input.mimeType } }, { text: buildPrompt(input, attempt === 1) }] }],
        config: { responseMimeType: "application/json", responseJsonSchema: z.toJSONSchema(analysisSchema) },
      });
      try { return validateAnalysis(JSON.parse(response.text || "")); } catch { if (attempt === 1) throw new AppError("INVALID_RESPONSE", "Gemini returned incomplete feedback. Please try the analysis again.", 502); }
    }
    throw new AppError("INVALID_RESPONSE", "Gemini returned incomplete feedback.", 502);
  }

  private async waitUntilReady(name: string) {
    const deadline = Date.now() + 120_000;
    while (Date.now() < deadline) {
      const file = await this.ai.files.get({ name });
      if (file.state === "ACTIVE") return;
      if (file.state === "FAILED") throw new AppError("UPLOAD_FAILED", "Gemini could not process this video. Try exporting it as MP4.", 422);
      await new Promise((resolve) => setTimeout(resolve, 2500));
    }
    throw new AppError("AI_TIMEOUT", "Video processing took too long. Try a shorter or smaller video.", 504);
  }

  async cleanup(fileName: string) { await this.ai.files.delete({ name: fileName }); }
}

/** Temporary provider for testing without a Google API key, via Hack Club's free AI proxy. */
export class HackClubProvider implements AnalysisProvider {
  constructor(private apiKey: string) {}

  async analyse(input: AnalysisInput): Promise<Analysis> {
    const id = input.fileUri.replace("local://", "");
    const video = getVideo(id);
    if (!video) throw new AppError("UPLOAD_FAILED", "Your upload expired. Choose the video again and retry.", 422);
    const dataUrl = `data:${video.mimeType};base64,${video.buffer.toString("base64")}`;
    const schemaText = `Return ONLY a single JSON object matching exactly this JSON Schema (no markdown, no commentary, no extra keys):\n${JSON.stringify(z.toJSONSchema(analysisSchema))}`;

    for (let attempt = 0; attempt < 2; attempt++) {
      const response = await fetch("https://ai.hackclub.com/proxy/v1/chat/completions", {
        method: "POST",
        headers: { Authorization: `Bearer ${this.apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: HACKCLUB_MODEL,
          response_format: { type: "json_object" },
          messages: [{ role: "user", content: [{ type: "text", text: `${buildPrompt(input, attempt === 1)}\n\n${schemaText}` }, { type: "video_url", video_url: { url: dataUrl } }] }],
        }),
      });
      if (!response.ok) throw new AppError("AI_FAILED", `Hack Club AI request failed (${response.status}).`, 502);
      const payload = await response.json() as { choices?: { message?: { content?: string } }[] };
      const text = payload.choices?.[0]?.message?.content || "";
      try { return validateAnalysis(JSON.parse(text)); } catch { if (attempt === 1) throw new AppError("INVALID_RESPONSE", "The AI returned incomplete feedback. Please try the analysis again.", 502); }
    }
    throw new AppError("INVALID_RESPONSE", "The AI returned incomplete feedback.", 502);
  }

  async cleanup(fileName: string) { deleteVideo(fileName.replace("local/", "")); }
}
