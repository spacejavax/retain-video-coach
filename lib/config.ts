export const APP_NAME = "Retain";
export const MAX_VIDEO_BYTES = 50 * 1024 * 1024;
export const MAX_VIDEO_MB = 50;
export const MAX_VIDEO_SECONDS = 90;
export const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/quicktime", "video/webm"] as const;
export const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-pro";
export const HACKCLUB_MODEL = process.env.HACKCLUB_MODEL || "google/gemini-2.5-flash";
export const AI_PROVIDER: "gemini" | "hackclub" | "demo" = process.env.HACKCLUB_API_KEY
  ? "hackclub"
  : process.env.GEMINI_API_KEY
  ? "gemini"
  : "demo";
export const IS_DEMO_MODE = AI_PROVIDER === "demo";
