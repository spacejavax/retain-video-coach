import { NextResponse } from "next/server";
import { GeminiProvider, HackClubProvider } from "../../../lib/ai-provider";
import { mapError, AppError } from "../../../lib/errors";
import { AI_PROVIDER, IS_DEMO_MODE } from "../../../lib/config";
import { checkRateLimit } from "../../../lib/rate-limit";
import { formSchema } from "../../../lib/schema";
import { track } from "../../../lib/analytics";
import { consumeSessionToken } from "../../../lib/session-tokens";
import { getRequestIp } from "../../../lib/request-ip";

export const runtime = "nodejs";
export async function POST(request: Request) {
  if (IS_DEMO_MODE) { track("demo_mode_blocked", { route: "analyze" }); return NextResponse.json({ error: { code: "DEMO_MODE", message: "Load the sample report, or add GEMINI_API_KEY for real analysis." } }, { status: 503 }); }
  const ip = getRequestIp(request);
  if (!checkRateLimit(ip)) { track("rate_limited", { route: "analyze" }); return NextResponse.json({ error: { code: "RATE_LIMITED", message: "You've reached five analyses this hour. Try again a little later." } }, { status: 429 }); }
  track("analyze_requested");
  let fileName = "";
  const provider = AI_PROVIDER === "hackclub" ? new HackClubProvider(process.env.HACKCLUB_API_KEY!) : new GeminiProvider(process.env.GEMINI_API_KEY!);
  try {
    const input = formSchema.parse(await request.json());
    if (!consumeSessionToken(input.sessionToken, ip)) { track("analyze_failed", { code: "INVALID_SESSION", status: 401 }); return NextResponse.json({ error: { code: "INVALID_SESSION", message: "Your upload session expired. Choose the video again and retry." } }, { status: 401 }); }
    fileName = input.fileName;
    const result = await provider.analyse(input);
    track("analyze_succeeded", { score: result.overallScore });
    return NextResponse.json({ result });
  } catch (error) {
    const mapped = error instanceof SyntaxError ? new AppError("INVALID_INPUT", "Some details are missing or invalid. Review the form and try again.", 400) : mapError(error);
    track("analyze_failed", { code: mapped.code, status: mapped.status });
    return NextResponse.json({ error: { code: mapped.code, message: mapped.message } }, { status: mapped.status });
  } finally {
    if (fileName) { try { await provider.cleanup(fileName); } catch (error) { console.error("Temporary Gemini file cleanup failed", error instanceof Error ? error.message : "unknown"); } }
  }
}
