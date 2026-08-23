import { randomUUID } from "crypto";

const TTL_MS = 15 * 60 * 1000;
const store = new Map<string, { buffer: Buffer; mimeType: string; expiresAt: number }>();

function evictExpired(now: number) {
  for (const [id, entry] of store) if (entry.expiresAt <= now) store.delete(id);
}

export function storeVideo(buffer: Buffer, mimeType: string, now = Date.now()) {
  evictExpired(now);
  const id = randomUUID();
  store.set(id, { buffer, mimeType, expiresAt: now + TTL_MS });
  return id;
}

export function getVideo(id: string) {
  return store.get(id);
}

export function deleteVideo(id: string) {
  store.delete(id);
}
