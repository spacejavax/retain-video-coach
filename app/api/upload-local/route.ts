import { NextResponse } from "next/server";
import { MAX_VIDEO_BYTES } from "../../../lib/config";
import { storeVideo } from "../../../lib/video-store";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const mimeType = new URL(request.url).searchParams.get("type") || "video/mp4";
  const buffer = Buffer.from(await request.arrayBuffer());
  if (buffer.byteLength === 0 || buffer.byteLength > MAX_VIDEO_BYTES) {
    return NextResponse.json({ error: { code: "UPLOAD_FAILED", message: "The video could not be uploaded." } }, { status: 400 });
  }
  const id = storeVideo(buffer, mimeType);
  return NextResponse.json({ file: { uri: `local://${id}`, name: `local/${id}` } });
}
