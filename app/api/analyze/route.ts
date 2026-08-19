import { NextResponse } from "next/server";
import { GeminiProvider } from "../../../lib/ai-provider";
import { mapError, AppError } from "../../../lib/errors";
import { IS_DEMO_MODE } from "../../../lib/config";
import { checkRateLimit } from "../../../lib/rate-limit";
import { formSchema } from "../../../lib/schema";

export const runtime = "nodejs";
export async function POST(request: Request) {
  if (IS_DEMO_MODE) return NextResponse.json({ error: { code: "DEMO_MODE", message: "Load the sample report, or add GEMINI_API_KEY for real analysis." } }, { status: 503 });
  const ip = request.headers.get("cf-connecting-ip") || request.headers.get("x-forwarded-for")?.split(",")[0] || "local";
  if (!checkRateLimit(ip)) return NextResponse.json({ error: { code: "RATE_LIMITED", message: "You've reached five analyses this hour. Try again a little later." } }, { status: 429 });
  let fileName = "";
  const provider = new GeminiProvider(process.env.GEMINI_API_KEY!);
  try {
    const input = formSchema.parse(await request.json()); fileName = input.fileName;
    const result = await provider.analyse(input);
    return NextResponse.json({ result });
  } catch (error) {
    const mapped = error instanceof SyntaxError ? new AppError("INVALID_INPUT", "Some details are missing or invalid. Review the form and try again.", 400) : mapError(error);
    return NextResponse.json({ error: { code: mapped.code, message: mapped.message } }, { status: mapped.status });
  } finally {
    if (fileName) { try { await provider.cleanup(fileName); } catch (error) { console.error("Temporary Gemini file cleanup failed", error instanceof Error ? error.message : "unknown"); } }
  }
}
