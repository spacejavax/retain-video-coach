import { NextResponse } from "next/server";
import { z } from "zod";
import { supabase } from "../../../lib/supabase";
import { mapError, AppError } from "../../../lib/errors";
import { track } from "../../../lib/analytics";

export const runtime = "nodejs";

const waitlistSchema = z.object({
  email: z.string().trim().email().max(200),
  source: z.string().max(60).optional(),
});

export async function POST(request: Request) {
  try {
    const input = waitlistSchema.parse(await request.json());
    const { error } = await supabase.from("waitlist").insert({ email: input.email.toLowerCase(), source: input.source ?? null });
    if (error) {
      if (error.code === "23505") { track("waitlist_duplicate"); return NextResponse.json({ ok: true, alreadyJoined: true }); }
      throw new AppError("DB_ERROR", "Kunde inte spara din plats just nu. Försök igen.", 500);
    }
    track("waitlist_joined");
    return NextResponse.json({ ok: true, alreadyJoined: false });
  } catch (error) {
    const mapped = error instanceof z.ZodError || error instanceof SyntaxError ? new AppError("INVALID_INPUT", "Ange en giltig e-postadress.", 400) : mapError(error);
    return NextResponse.json({ error: { code: mapped.code, message: mapped.message } }, { status: mapped.status });
  }
}
