/**
 * In-memory, per-IP rate limiter (sliding window) for the AI routes.
 *
 * This only protects a single instance: on serverless platforms with
 * multiple concurrent instances, each instance tracks its own counters,
 * so the effective limit is (per-instance limit) x (instance count).
 * Documented in docs/architecture.md (Etapa 7).
 */

const WINDOW_MS = 60_000;
const MAX_REQUESTS = 10;
const MAX_TRACKED_IPS = 5000;

interface Bucket {
  count: number;
  windowStart: number;
}

const buckets = new Map<string, Bucket>();

function evictOldest() {
  const oldestKey = buckets.keys().next().value;

  if (oldestKey !== undefined) buckets.delete(oldestKey);
}

export interface RateLimitResult {
  allowed: boolean;
  retryAfterSeconds: number;
}

export function checkRateLimit(
  key: string,
  now: number = Date.now(),
): RateLimitResult {
  const bucket = buckets.get(key);

  if (!bucket || now - bucket.windowStart >= WINDOW_MS) {
    if (!buckets.has(key) && buckets.size >= MAX_TRACKED_IPS) evictOldest();

    buckets.set(key, { count: 1, windowStart: now });

    return { allowed: true, retryAfterSeconds: 0 };
  }

  if (bucket.count >= MAX_REQUESTS) {
    const retryAfterSeconds = Math.ceil(
      (bucket.windowStart + WINDOW_MS - now) / 1000,
    );

    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, retryAfterSeconds),
    };
  }

  bucket.count += 1;

  return { allowed: true, retryAfterSeconds: 0 };
}

export function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");

  if (forwardedFor) return forwardedFor.split(",")[0].trim();

  return request.headers.get("x-real-ip") ?? "unknown";
}

export function resetRateLimitStore(): void {
  buckets.clear();
}
