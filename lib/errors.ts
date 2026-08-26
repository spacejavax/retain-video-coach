export type ErrorCode = "UNSUPPORTED_FORMAT" | "FILE_TOO_LARGE" | "VIDEO_TOO_LONG" | "INVALID_INPUT" | "UPLOAD_FAILED" | "AI_FAILED" | "AI_TIMEOUT" | "INVALID_RESPONSE" | "RATE_LIMITED" | "CLEANUP_FAILED" | "UNAUTHENTICATED" | "DB_ERROR";

export class AppError extends Error {
  constructor(public code: ErrorCode, message: string, public status = 500) { super(message); }
}

export function mapError(error: unknown) {
  if (error instanceof AppError) return error;
  const message = error instanceof Error ? error.message.toLowerCase() : "";
  if (message.includes("429") || message.includes("rate")) return new AppError("RATE_LIMITED", "Gemini is receiving lots of requests. Wait a minute and try again.", 429);
  if (message.includes("timeout") || message.includes("abort")) return new AppError("AI_TIMEOUT", "The analysis took too long. Try again with a shorter or smaller video.", 504);
  return new AppError("AI_FAILED", "We couldn't analyse this video. Check your connection and try again.", 502);
}
