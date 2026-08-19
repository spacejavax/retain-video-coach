import { NextResponse } from "next/server";
import { z } from "zod";
import { IS_DEMO_MODE } from "../../../lib/config";
import { validateVideo } from "../../../lib/upload-validation";

const requestSchema = z.object({ name: z.string().min(1).max(180), type: z.string(), size: z.number().int().positive() });

export async function POST(request: Request) {
  if (IS_DEMO_MODE) return NextResponse.json({ error: { code: "DEMO_MODE", message: "Add a Gemini API key to analyse real videos." } }, { status: 503 });
  try {
    const body = requestSchema.parse(await request.json());
    const validation = validateVideo(body);
    if (!validation.ok) return NextResponse.json({ error: validation }, { status: 400 });
    const init = await fetch("https://generativelanguage.googleapis.com/upload/v1beta/files", {
      method: "POST",
      headers: { "x-goog-api-key": process.env.GEMINI_API_KEY!, "X-Goog-Upload-Protocol": "resumable", "X-Goog-Upload-Command": "start", "X-Goog-Upload-Header-Content-Length": String(body.size), "X-Goog-Upload-Header-Content-Type": body.type, "Content-Type": "application/json" },
      body: JSON.stringify({ file: { display_name: body.name } }),
    });
    const uploadUrl = init.headers.get("x-goog-upload-url");
    if (!init.ok || !uploadUrl) throw new Error("Upload session failed");
    return NextResponse.json({ uploadUrl });
  } catch { return NextResponse.json({ error: { code: "UPLOAD_FAILED", message: "We couldn't prepare the upload. Check the file and try again." } }, { status: 502 }); }
}
