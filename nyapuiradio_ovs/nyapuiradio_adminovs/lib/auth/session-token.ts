import { createHmac, timingSafeEqual } from "node:crypto";

export const SESSION_COOKIE_NAME = "ovs_session";
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function getSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("SESSION_SECRET is not set");
    }
    return "dev-insecure-session-secret";
  }
  return secret;
}

function sign(payload: string): string {
  return createHmac("sha256", getSecret()).update(payload).digest("base64url");
}

export function createSessionToken(userId: string): string {
  if (!UUID_PATTERN.test(userId)) {
    throw new Error("Invalid user id for session");
  }
  const expiresAt = Date.now() + SESSION_MAX_AGE_SECONDS * 1000;
  const payload = `${userId}.${expiresAt}`;
  return `${payload}.${sign(payload)}`;
}

export function verifySessionToken(
  value: string | null | undefined,
): string | null {
  if (!value) return null;

  const parts = value.split(".");
  if (parts.length !== 3) return null;
  const [userId, expiresAt, signature] = parts;
  if (!userId || !expiresAt || !signature) return null;
  if (!UUID_PATTERN.test(userId)) return null;
  if (!/^\d+$/.test(expiresAt)) return null;

  const expected = sign(`${userId}.${expiresAt}`);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;

  if (Number(expiresAt) < Date.now()) return null;
  return userId;
}
