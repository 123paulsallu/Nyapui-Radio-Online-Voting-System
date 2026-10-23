export function isTrustedOrigin(request: Request): boolean {
  const fetchSite = request.headers.get("sec-fetch-site");
  if (fetchSite === "cross-site") return false;

  const origin = request.headers.get("origin");
  if (!origin || origin === "null") return true;

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
