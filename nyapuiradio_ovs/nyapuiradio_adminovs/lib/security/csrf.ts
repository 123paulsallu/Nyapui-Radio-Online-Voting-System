export function isTrustedOrigin(request: Request): boolean {
  const fetchSite = request.headers.get("sec-fetch-site");
  if (fetchSite === "cross-site") return false;

  const origin = request.headers.get("origin");
  if (!origin || origin === "null") return true;

  const publicAppOrigin = process.env.PUBLIC_APP_ORIGIN;
  if (publicAppOrigin) {
    try {
      if (new URL(origin).origin === new URL(publicAppOrigin).origin) return true;
    } catch {
      return false;
    }
  }

  let originHost: string;
  try {
    originHost = new URL(origin).host;
  } catch {
    return false;
  }

  const requestHost = new URL(request.url).host;
  const headerHost = request.headers.get("host");
  return originHost === requestHost || originHost === headerHost;
}
