"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { BackgroundBeams } from "../../components/ui/background-beams";
import { copy } from "../../lib/copy";

export default function WaitlistPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setStatus("sending");
    try {
      const response = await fetch("/api/waitlist", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, source: "waitlist_page" }) });
      const data = await response.json() as { ok?: boolean; alreadyJoined?: boolean; error?: { message: string } };
      if (!response.ok) { setStatus("error"); setMessage(data.error?.message ?? "Något gick fel. Försök igen."); return; }
      setStatus("done");
      setMessage(data.alreadyJoined ? "Du står redan på listan." : "Du har fått en plats. Vi hör av oss.");
    } catch {
      setStatus("error");
      setMessage("Något gick fel. Försök igen.");
    }
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-background text-foreground antialiased">
      <header className="absolute left-0 right-0 top-0 z-20 flex h-16 items-center justify-between px-5 md:px-10">
        <Link href="/" className="font-serif text-lg font-semibold tracking-tight text-foreground">
          {copy.brand.name}<sup className="mt-0.5 font-mono text-[7px]">®</sup>
        </Link>
        <span className="hidden font-mono text-[10px] tracking-[.12em] text-muted-foreground sm:inline">FÖRE LANSERING</span>
      </header>

      <div className="relative z-10 mx-auto max-w-2xl px-5 py-24 text-center">
        <p className="flex items-center justify-center gap-2 font-mono text-[10px] tracking-[.14em] text-primary">
          <i className="inline-block h-1.5 w-1.5 rounded-full bg-primary" style={{ boxShadow: "0 0 12px var(--primary)" }} /> KOMMER SNART
        </p>
        <h1 className="display-text mt-6 text-4xl md:text-6xl">Gå med i väntelistan.</h1>
        <p className="body-text mx-auto mt-5">Vi bjuder in nya konton i omgångar för att hålla kvaliteten hög på analyserna. Lämna din e-post så hör vi av oss så fort det är din tur.</p>

        {status === "done" ? (
          <div className="relative z-10 mx-auto mt-8 flex max-w-md items-center justify-center gap-2 rounded-lg border border-border bg-card px-4 py-3 text-sm">
            <Check className="size-4 text-primary" /> {message}
          </div>
        ) : (
          <form onSubmit={submit} className="relative z-10 mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row">
            <label htmlFor="waitlist-email" className="sr-only">E-post</label>
            <input
              id="waitlist-email"
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="du@exempel.se"
              className="h-12 flex-1 rounded-lg border border-border bg-card px-4 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none"
            />
            <button
              type="submit"
              disabled={status === "sending"}
              className="flex h-12 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg bg-primary px-6 font-mono text-[11px] tracking-[.06em] text-primary-foreground disabled:opacity-60"
            >
              {status === "sending" ? "SKICKAR..." : "GÅ MED"} <ArrowRight className="size-3.5" />
            </button>
          </form>
        )}
        {status === "error" && <p className="relative z-10 mt-3 text-xs text-destructive">{message}</p>}
      </div>

      <BackgroundBeams />
    </div>
  );
}
