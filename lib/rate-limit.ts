/**
 * In-memory, per-instance rate limiting. This is best-effort, not a real
 * defence: a serverless function's memory resets on cold start and is not
 * shared across instances, so a determined attacker distributed across
 * enough requests (or hitting a fresh instance) is not actually throttled.
 * It catches a naive script and nothing more — the honeypot and timing
 * check in app/actions/contact.ts are the real defence. See BUILD-PLAN §1.16.
 *
 * Swapping in a durable store (Upstash Redis, Vercel KV) later means
 * reimplementing checkRateLimit — the Server Action's call site does not
 * change.
 */

const WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_REQUESTS = 5;

const hits = new Map<string, number[]>();

export function checkRateLimit(key: string): { allowed: boolean } {
  const now = Date.now();
  const timestamps = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);

  if (timestamps.length >= MAX_REQUESTS) {
    hits.set(key, timestamps);
    return { allowed: false };
  }

  timestamps.push(now);
  hits.set(key, timestamps);
  return { allowed: true };
}
