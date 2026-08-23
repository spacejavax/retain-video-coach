import { randomUUID } from "crypto";

const TOKEN_TTL_MS = 30 * 60 * 1000;
const tokens = new Map<string, { ip: string; expiresAt: number }>();

function evictExpired(now: number) {
  for (const [token, entry] of tokens) if (entry.expiresAt <= now) tokens.delete(token);
}

export function issueSessionToken(ip: string, now = Date.now()) {
  evictExpired(now);
  const token = randomUUID();
  tokens.set(token, { ip, expiresAt: now + TOKEN_TTL_MS });
  return token;
}

export function consumeSessionToken(token: string, ip: string, now = Date.now()) {
  const entry = tokens.get(token);
  tokens.delete(token);
  if (!entry || entry.expiresAt <= now || entry.ip !== ip) return false;
  return true;
}
