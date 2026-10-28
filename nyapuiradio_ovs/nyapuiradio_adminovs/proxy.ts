import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  SESSION_COOKIE_NAME,
  verifySessionToken,
} from "@/lib/auth/session-token";

export function proxy(request: NextRequest): NextResponse {
  if (request.nextUrl.pathname.startsWith("/api/")) {
    const origin = request.headers.get("origin");
    const configuredOrigin = process.env.PUBLIC_APP_ORIGIN;
    let allowedOrigin: string | null = null;
    try {
      allowedOrigin = configuredOrigin ? new URL(configuredOrigin).origin : null;
    } catch {
      allowedOrigin = null;
    }

    if (origin && origin === allowedOrigin) {
      const response =
        request.method === "OPTIONS"
          ? new NextResponse(null, { status: 204 })
          : NextResponse.next();
      response.headers.set("Access-Control-Allow-Origin", origin);
      response.headers.set("Access-Control-Allow-Credentials", "true");
      response.headers.set("Vary", "Origin");

      if (request.method === "OPTIONS") {
        response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        response.headers.set("Access-Control-Allow-Headers", "Accept, Content-Type");
        response.headers.set("Access-Control-Max-Age", "600");
      }

      return response;
    }

    if (request.method === "OPTIONS") {
      return new NextResponse(null, { status: 204 });
    }

    return NextResponse.next();
  }

  const userId = verifySessionToken(
    request.cookies.get(SESSION_COOKIE_NAME)?.value,
  );
  if (!userId) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/dashboard", "/api/:path*"],
};
