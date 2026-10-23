import { destroySession } from "@/lib/auth/session";
import { isTrustedOrigin } from "@/lib/security/csrf";

export async function POST(request: Request): Promise<Response> {
  if (!isTrustedOrigin(request)) {
    return Response.json(
      { error: "Forbidden" },
      { status: 403, headers: { "Cache-Control": "no-store" } },
    );
  }

  await destroySession();
  return Response.json(
    { ok: true },
    { headers: { "Cache-Control": "no-store" } },
  );
}
