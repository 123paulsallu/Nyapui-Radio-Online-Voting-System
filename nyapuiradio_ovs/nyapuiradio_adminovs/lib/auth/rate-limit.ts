interface Bucket {
  failures: number;
  resetAt: number;
}

const WINDOW_MS = 10 * 60 * 1000;
const MAX_FAILURES = 5;
const MAX_BUCKETS = 10_000;

const buckets = new Map<string, Bucket>();

function prune(now: number): void {
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
  if (buckets.size > MAX_BUCKETS) buckets.clear();
}

export function getRetryAfterSeconds(key: string): number | null {
  const now = Date.now();
  if (buckets.size > MAX_BUCKETS / 2) prune(now);

  const bucket = buckets.get(key);
  if (!bucket) return null;
  if (bucket.resetAt <= now) {
    buckets.delete(key);
    return null;
  }
  if (bucket.failures >= MAX_FAILURES) {
    return Math.max(1, Math.ceil((bucket.resetAt - now) / 1000));
  }
  return null;
}

export function recordFailure(key: string): void {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { failures: 1, resetAt: now + WINDOW_MS });
    return;
  }
  bucket.failures += 1;
}

export function clearFailures(key: string): void {
  buckets.delete(key);
}
