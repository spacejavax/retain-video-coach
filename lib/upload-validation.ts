import { ALLOWED_VIDEO_TYPES, MAX_VIDEO_BYTES, MAX_VIDEO_SECONDS } from "./config";

export type VideoMetadata = { type: string; size: number; duration?: number };

export function validateVideo(metadata: VideoMetadata) {
  if (!ALLOWED_VIDEO_TYPES.includes(metadata.type as (typeof ALLOWED_VIDEO_TYPES)[number])) {
    return { ok: false as const, code: "UNSUPPORTED_FORMAT", message: "Choose an MP4, MOV or WebM video." };
  }
  if (metadata.size <= 0 || metadata.size > MAX_VIDEO_BYTES) {
    return { ok: false as const, code: "FILE_TOO_LARGE", message: "Choose a video smaller than 50 MB." };
  }
  if (metadata.duration !== undefined && (!Number.isFinite(metadata.duration) || metadata.duration > MAX_VIDEO_SECONDS)) {
    return { ok: false as const, code: "VIDEO_TOO_LONG", message: "Trim your video to 90 seconds or less, then try again." };
  }
  return { ok: true as const };
}
