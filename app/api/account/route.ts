import { NextResponse } from "next/server";
import { supabaseForToken } from "../../../lib/supabase";
import { supabaseAdmin } from "../../../lib/supabase-admin";
import { mapError, AppError } from "../../../lib/errors";

export const runtime = "nodejs";

export async function DELETE(request: Request) {
  try {
    const header = request.headers.get("authorization") || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : "";
    if (!token) throw new AppError("UNAUTHENTICATED", "Logga in för att ta bort ditt konto.", 401);

    const { data: userData, error: userError } = await supabaseForToken(token).auth.getUser(token);
    if (userError || !userData.user) throw new AppError("UNAUTHENTICATED", "Din session har gått ut. Logga in igen.", 401);

    const { error } = await supabaseAdmin().auth.admin.deleteUser(userData.user.id);
    if (error) throw new AppError("DB_ERROR", error.message, 500);

    return NextResponse.json({ ok: true });
  } catch (error) {
    const mapped = mapError(error);
    return NextResponse.json({ error: { code: mapped.code, message: mapped.message } }, { status: mapped.status });
  }
}
