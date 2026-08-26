export type AnalyticsEvent =
  | "upload_session_requested"
  | "upload_session_created"
  | "upload_validation_failed"
  | "analyze_requested"
  | "analyze_succeeded"
  | "analyze_failed"
  | "rate_limited"
  | "demo_mode_blocked"
  | "waitlist_joined"
  | "waitlist_duplicate";

/**
 * Server-side, aggregate-only funnel logging. No cookies, no client script,
 * no third party, no per-user identifiers (see /privacy) — just structured
 * lines on the existing server logs so conversion through the funnel is
 * visible (e.g. via `wrangler tail`), not stored anywhere by Retain.
 */
export function track(event: AnalyticsEvent, meta: Record<string, string | number | boolean | undefined> = {}) {
  console.log(JSON.stringify({ event, ts: new Date().toISOString(), ...meta }));
}
