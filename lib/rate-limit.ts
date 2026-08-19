const hits = new Map<string, number[]>();
export function checkRateLimit(key: string, now = Date.now()) {
  const windowStart = now - 60 * 60 * 1000;
  const recent = (hits.get(key) || []).filter((stamp) => stamp > windowStart);
  if (recent.length >= 5) return false;
  recent.push(now); hits.set(key, recent); return true;
}
