"use client";

import { useState } from "react";
import { useAuth } from "../../lib/auth-context";

export function AuthWidget() {
  const { user, session, loading, sendMagicLink, signInWithGoogle, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [message, setMessage] = useState("");
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [googleError, setGoogleError] = useState("");

  if (loading) return null;

  if (user) {
    async function deleteAccount() {
      if (!session) return;
      setDeleting(true);
      const response = await fetch("/api/account", { method: "DELETE", headers: { Authorization: `Bearer ${session.access_token}` } });
      if (response.ok) { await signOut(); window.location.href = "/"; return; }
      setDeleting(false);
      setConfirmingDelete(false);
    }

    return (
      <div className="flex items-center gap-3">
        <span className="hidden font-mono text-[10px] text-muted-foreground sm:inline">{user.email}</span>
        {confirmingDelete ? (
          <span className="flex items-center gap-2">
            <span className="font-mono text-[9px] text-destructive">SÄKER?</span>
            <button disabled={deleting} className="border-0 border-b border-destructive bg-transparent pb-0.5 font-mono text-[10px] tracking-[.08em] text-destructive disabled:opacity-60" onClick={() => void deleteAccount()}>{deleting ? "RADERAR..." : "JA, RADERA ALLT"}</button>
            <button disabled={deleting} className="border-0 border-b border-foreground bg-transparent pb-0.5 font-mono text-[10px] tracking-[.08em] text-foreground disabled:opacity-60" onClick={() => setConfirmingDelete(false)}>AVBRYT</button>
          </span>
        ) : (
          <button className="border-0 border-b border-muted-foreground bg-transparent pb-0.5 font-mono text-[10px] tracking-[.08em] text-muted-foreground hover:text-destructive" onClick={() => setConfirmingDelete(true)}>RADERA KONTO</button>
        )}
        <button className="border-0 border-b border-foreground bg-transparent pb-0.5 font-mono text-[10px] tracking-[.08em] text-foreground" onClick={() => void signOut()}>LOGGA UT</button>
      </div>
    );
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setStatus("sending");
    const { error } = await sendMagicLink(email.trim());
    if (error) { setStatus("error"); setMessage(error); return; }
    setStatus("sent");
    setMessage("Kolla din inkorg för inloggningslänken.");
  }

  async function google() {
    setGoogleError("");
    const { error } = await signInWithGoogle();
    if (error) setGoogleError(error);
  }

  return (
    <div className="relative">
      <button className="border-0 border-b border-primary bg-transparent pb-0.5 font-mono text-[10px] tracking-[.08em] text-primary" onClick={() => setOpen(v => !v)}>LOGGA IN</button>
      {open && (
        <div className="absolute right-0 top-8 z-20 w-72 rounded-lg border border-border bg-card p-4 shadow-lg">
          {status === "sent" ? (
            <p className="text-xs text-muted-foreground">{message}</p>
          ) : (
            <div className="flex flex-col gap-3">
              <button type="button" onClick={() => void google()} className="flex items-center justify-center gap-2 rounded border border-border bg-background px-3 py-2 text-sm hover:bg-secondary">
                <svg width="16" height="16" viewBox="0 0 48 48" aria-hidden="true"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.5 6 29.5 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z" /><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 15.9 18.9 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.5 6 29.5 4 24 4 16.3 4 9.6 8.3 6.3 14.7z" /><path fill="#4CAF50" d="M24 44c5.4 0 10.3-1.8 14.1-5l-6.5-5.5C29.5 35.4 26.9 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5c3.3 6.4 10 10.9 17.8 10.9z" /><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.2 4.3-4.1 5.6l6.5 5.5C41.5 35.9 44 30.5 44 24c0-1.3-.1-2.7-.4-3.5z" /></svg>
                Fortsätt med Google
              </button>
              {googleError && <p className="text-xs text-destructive">{googleError}</p>}
              <div className="flex items-center gap-2 text-[9px] text-muted-foreground"><span className="h-px flex-1 bg-border" />ELLER<span className="h-px flex-1 bg-border" /></div>
              <form onSubmit={submit} className="flex flex-col gap-2">
                <label htmlFor="auth-email" className="font-mono text-[8px] tracking-[.08em] text-muted-foreground">E-POST</label>
                <input id="auth-email" type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="du@exempel.se" className="rounded border border-border bg-background px-3 py-2 text-sm" />
                {status === "error" && <p className="text-xs text-destructive">{message}</p>}
                <button type="submit" disabled={status === "sending"} className="mt-1 rounded bg-primary px-3 py-2 font-mono text-[10px] text-primary-foreground disabled:opacity-60">{status === "sending" ? "SKICKAR..." : "SKICKA INLOGGNINGSLÄNK"}</button>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
