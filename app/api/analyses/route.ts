import { NextResponse } from "next/server";
import { z } from "zod";
import { supabaseForToken } from "../../../lib/supabase";
import { analysisSchema } from "../../../lib/schema";
import { mapError, AppError } from "../../../lib/errors";

export const runtime = "nodejs";

const saveSchema = z.object({
  platform: z.string().min(1).max(40),
  niche: z.string().min(1).max(100),
  audience: z.string().min(1).max(200),
  goal: z.string().min(1).max(40),
  videoFilename: z.string().max(180).optional(),
  result: analysisSchema,
});

function tokenFrom(request: Request) {
  const header = request.headers.get("authorization") || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (!token) throw new AppError("UNAUTHENTICATED", "Logga in för att spara rapporter.", 401);
  return token;
}

export async function GET(request: Request) {
  try {
    const client = supabaseForToken(tokenFrom(request));
    const { data, error } = await client
      .from("analyses")
      .select("id, created_at, platform, niche, audience, goal, video_filename, overall_score, score_label, result")
      .order("created_at", { ascending: false });
    if (error) throw new AppError("DB_ERROR", error.message, 500);
    return NextResponse.json({ analyses: data });
  } catch (error) {
    const mapped = mapError(error);
    return NextResponse.json({ error: { code: mapped.code, message: mapped.message } }, { status: mapped.status });
  }
}

export async function DELETE(request: Request) {
  try {
    const token = tokenFrom(request);
    const client = supabaseForToken(token);
    const id = new URL(request.url).searchParams.get("id") || "";
    if (!z.string().uuid().safeParse(id).success) throw new AppError("INVALID_INPUT", "Ogiltigt rapport-id.", 400);
    const { error } = await client.from("analyses").delete().eq("id", id);
    if (error) throw new AppError("DB_ERROR", error.message, 500);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const mapped = mapError(error);
    return NextResponse.json({ error: { code: mapped.code, message: mapped.message } }, { status: mapped.status });
  }
}

export async function POST(request: Request) {
  try {
    const token = tokenFrom(request);
    const client = supabaseForToken(token);
    const { data: userData, error: userError } = await client.auth.getUser(token);
    if (userError || !userData.user) throw new AppError("UNAUTHENTICATED", "Din session har gått ut. Logga in igen.", 401);

    const input = saveSchema.parse(await request.json());
    const { data, error } = await client
      .from("analyses")
      .insert({
        user_id: userData.user.id,
        platform: input.platform,
        niche: input.niche,
        audience: input.audience,
        goal: input.goal,
        video_filename: input.videoFilename ?? null,
        overall_score: input.result.overallScore,
        score_label: input.result.scoreLabel,
        result: input.result,
      })
      .select("id")
      .single();
    if (error) throw new AppError("DB_ERROR", error.message, 500);
    return NextResponse.json({ id: data.id });
  } catch (error) {
    const mapped = error instanceof SyntaxError ? new AppError("INVALID_INPUT", "Ogiltig data.", 400) : mapError(error);
    return NextResponse.json({ error: { code: mapped.code, message: mapped.message } }, { status: mapped.status });
  }
}
