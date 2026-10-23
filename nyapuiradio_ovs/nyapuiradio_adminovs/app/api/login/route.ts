import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import {
  hashPassword,
  needsRehash,
  verifyPassword,
  verifyPasswordDummy,
} from "@/lib/auth/password";
import { createSession } from "@/lib/auth/session";
import {
  clearFailures,
  getRetryAfterSeconds,
  recordFailure,
} from "@/lib/auth/rate-limit";
import { isTrustedOrigin } from "@/lib/security/csrf";
import { parseCredentials } from "@/lib/validation/credentials";

const MAX_BODY_BYTES = 4096;

function jsonError(
  status: number,
  message: string,
  headers?: Record<string, string>,
): Response {
  return Response.json(
    { error: message },
    { status, headers: { "Cache-Control": "no-store", ...headers } },
  );
}

function rateLimitKey(request: Request, username: string): string {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "local";
  return `${ip}|${username.toLowerCase()}`;
}

export async function POST(request: Request): Promise<Response> {
  if (!isTrustedOrigin(request)) {
    return jsonError(403, "Forbidden");
  }

  const contentLength = Number(request.headers.get("content-length"));
  if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) {
    return jsonError(413, "Payload too large");
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError(400, "Invalid request body");
  }

  const credentials = parseCredentials(body);
  if (!credentials) {
    return jsonError(400, "Invalid username or password format");
  }

  const key = rateLimitKey(request, credentials.username);
  const retryAfter = getRetryAfterSeconds(key);
  if (retryAfter !== null) {
    return jsonError(429, "Too many attempts. Please try again later.", {
      "Retry-After": String(retryAfter),
    });
  }

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.username, credentials.username))
    .limit(1);

  const passwordValid = user
    ? await verifyPassword(credentials.password, user.passwordHash)
    : await verifyPasswordDummy(credentials.password);

  if (!user || !passwordValid) {
    recordFailure(key);
    return jsonError(401, "Invalid username or password");
  }

  clearFailures(key);

  if (needsRehash(user.passwordHash)) {
    const passwordHash = await hashPassword(credentials.password);
    await db
      .update(users)
      .set({ passwordHash })
      .where(eq(users.id, user.id));
  }

  await createSession(user.id);

  return Response.json(
    {
      ok: true,
      user: {
        id: user.id,
        username: user.username,
        fullName: user.fullName,
        role: user.role,
      },
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
