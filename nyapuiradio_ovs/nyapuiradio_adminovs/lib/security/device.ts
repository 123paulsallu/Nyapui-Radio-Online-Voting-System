import { createHash } from "node:crypto";

export function hashIp(ip: string): string {
  const secret = process.env.SESSION_SECRET ?? "dev-insecure-session-secret";
  return createHash("sha256").update(`${secret}:${ip}`).digest("hex");
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  return request.headers.get("x-real-ip") || "unknown";
}

export function parseDeviceHint(userAgent: string | null): string {
  if (!userAgent) return "Unknown device";
  const ua = userAgent.slice(0, 400);
  if (/bot|crawl|spider|slurp|preview/i.test(ua)) return "Bot or crawler";

  const os = /iPhone|iPad|iPod/.test(ua)
    ? "iOS"
    : /Android/.test(ua)
      ? "Android"
      : /Windows/.test(ua)
        ? "Windows"
        : /Mac OS X|Macintosh/.test(ua)
          ? "macOS"
          : /Linux/.test(ua)
            ? "Linux"
            : null;

  const browser = /Edg\//.test(ua)
    ? "Edge"
    : /OPR\/|Opera/.test(ua)
      ? "Opera"
      : /Firefox\//.test(ua)
        ? "Firefox"
        : /Chrome\//.test(ua)
          ? "Chrome"
          : /Safari\//.test(ua)
            ? "Safari"
            : null;

  const parts = [browser, os].filter(Boolean);
  return parts.length > 0 ? parts.join(" · ") : "Unknown device";
}
