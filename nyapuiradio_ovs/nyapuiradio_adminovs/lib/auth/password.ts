import {
  randomBytes,
  scrypt as scryptCallback,
  timingSafeEqual,
} from "node:crypto";
import { promisify } from "node:util";

const scrypt = promisify(scryptCallback) as (
  password: string | Buffer,
  salt: Buffer,
  keylen: number,
  options: { N: number; r: number; p: number; maxmem: number },
) => Promise<Buffer>;

const SCRYPT_N = 16384;
const SCRYPT_R = 8;
const SCRYPT_P = 1;
const SCRYPT_KEY_LENGTH = 64;
const SCRYPT_SALT_LENGTH = 16;
const SCRYPT_MAXMEM = 64 * 1024 * 1024;
const SCRYPT_PREFIX = "scrypt$";

const PBKDF2_PREFIX = "pbkdf2$";
const PBKDF2_ITERATIONS = 100_000;
const PBKDF2_SALT_LENGTH = 16;
const PBKDF2_KEY_LENGTH = 256;

async function scryptDerive(
  password: string,
  salt: Buffer,
  params: { N: number; r: number; p: number },
): Promise<Buffer> {
  return scrypt(password.normalize("NFKC"), salt, SCRYPT_KEY_LENGTH, {
    N: params.N,
    r: params.r,
    p: params.p,
    maxmem: SCRYPT_MAXMEM,
  });
}

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(SCRYPT_SALT_LENGTH);
  const derived = await scryptDerive(password, salt, {
    N: SCRYPT_N,
    r: SCRYPT_R,
    p: SCRYPT_P,
  });
  return [
    "scrypt",
    SCRYPT_N,
    SCRYPT_R,
    SCRYPT_P,
    salt.toString("base64"),
    derived.toString("base64"),
  ].join("$");
}

async function verifyScrypt(password: string, stored: string): Promise<boolean> {
  const parts = stored.slice(SCRYPT_PREFIX.length).split("$");
  if (parts.length !== 5) return false;

  const N = Number(parts[0]);
  const r = Number(parts[1]);
  const p = Number(parts[2]);
  if (!Number.isInteger(N) || !Number.isInteger(r) || !Number.isInteger(p)) {
    return false;
  }
  if (N < 1024 || N > 1_048_576 || r < 1 || r > 32 || p < 1 || p > 16) {
    return false;
  }

  const salt = Buffer.from(parts[3], "base64");
  const expected = Buffer.from(parts[4], "base64");
  if (salt.length === 0 || expected.length === 0) return false;

  const actual = await scryptDerive(password, salt, { N, r, p });
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

async function pbkdf2Derive(
  password: string,
  salt: Uint8Array<ArrayBuffer>,
): Promise<ArrayBuffer> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );
  return crypto.subtle.deriveBits(
    { name: "PBKDF2", hash: "SHA-256", salt, iterations: PBKDF2_ITERATIONS },
    key,
    PBKDF2_KEY_LENGTH,
  );
}

async function verifyLegacyPbkdf2(
  password: string,
  stored: string,
): Promise<boolean> {
  const raw = Buffer.from(stored.slice(PBKDF2_PREFIX.length), "base64");
  if (raw.length <= PBKDF2_SALT_LENGTH) return false;

  const salt = new Uint8Array(raw.slice(0, PBKDF2_SALT_LENGTH));
  const expected = new Uint8Array(raw.slice(PBKDF2_SALT_LENGTH));
  const actual = new Uint8Array(await pbkdf2Derive(password, salt));
  if (expected.length !== actual.length) return false;

  let diff = 0;
  for (let i = 0; i < expected.length; i++) {
    diff |= expected[i] ^ actual[i];
  }
  return diff === 0;
}

export async function verifyPassword(
  password: string,
  stored: string,
): Promise<boolean> {
  if (stored.startsWith(SCRYPT_PREFIX)) {
    return verifyScrypt(password, stored);
  }
  if (stored.startsWith(PBKDF2_PREFIX)) {
    return verifyLegacyPbkdf2(password, stored);
  }
  return false;
}

export function needsRehash(stored: string): boolean {
  return !stored.startsWith(SCRYPT_PREFIX);
}

let dummyHashPromise: Promise<string> | null = null;

export function verifyPasswordDummy(password: string): Promise<boolean> {
  dummyHashPromise ??= hashPassword(randomBytes(32).toString("hex"));
  return dummyHashPromise.then((hash) => verifyPassword(password, hash));
}
