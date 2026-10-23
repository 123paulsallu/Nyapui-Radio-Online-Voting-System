const USERNAME_PATTERN = /^[a-zA-Z0-9_.-]{3,50}$/;
const MIN_PASSWORD_LENGTH = 8;
const MAX_PASSWORD_LENGTH = 128;

export interface Credentials {
  username: string;
  password: string;
}

export function parseCredentials(body: unknown): Credentials | null {
  if (typeof body !== "object" || body === null) return null;

  const { username, password } = body as Record<string, unknown>;
  if (typeof username !== "string" || !USERNAME_PATTERN.test(username)) {
    return null;
  }
  if (
    typeof password !== "string" ||
    password.length < MIN_PASSWORD_LENGTH ||
    password.length > MAX_PASSWORD_LENGTH
  ) {
    return null;
  }
  return { username, password };
}
