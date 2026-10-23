import {
  ACCESS_ACTIONS,
  CATEGORY_LAYOUTS,
  CATEGORY_STATUSES,
  DASHBOARD_MODULES,
  NOMINEE_STATUSES,
  RESULTS_POLICIES,
  USER_ROLES,
  VOTER_STATUSES,
  VOTING_STATES,
  type CategoryLayout,
  type CategoryStatus,
  type NomineeStatus,
  type ResultsPolicy,
  type UserRole,
  type VoterStatus,
  type VotingState,
} from "@/lib/db/schema";
import type { PermissionMatrix } from "@/lib/dashboard/types";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const COLOR_PATTERN = /^#[0-9a-fA-F]{6}$/;

export function isUuid(value: unknown): value is string {
  return typeof value === "string" && UUID_PATTERN.test(value);
}

function asString(value: unknown): string | null {
  return typeof value === "string" ? value.trim() : null;
}

function asNullableString(value: unknown, maxLength: number): string | null {
  const raw = asString(value);
  if (!raw) return null;
  return raw.length <= maxLength ? raw : null;
}

function asImageRef(value: unknown): string | null {
  const raw = asString(value);
  if (!raw) return null;
  if (raw.length > 500) return null;
  if (raw.startsWith("/") || raw.startsWith("#")) return raw;
  if (/^https?:\/\//i.test(raw)) return raw;
  return null;
}

export function isDateOnlyOrEmpty(value: unknown): boolean {
  if (value === null || value === undefined || value === "") return true;
  if (typeof value === "string") return !Number.isNaN(Date.parse(value));
  return value instanceof Date && !Number.isNaN(value.getTime());
}

function parseDate(value: unknown): Date | null {
  if (typeof value === "string" && value !== "") {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return null;
    return date;
  }
  return null;
}

export interface CategoryInput {
  name: string;
  description: string | null;
  status: CategoryStatus;
}

export function parseCategoryInput(body: unknown): CategoryInput | null {
  if (typeof body !== "object" || body === null) return null;
  const raw = body as Record<string, unknown>;

  const name = asString(raw.name);
  if (!name || name.length > 80) return null;

  const description = asNullableString(raw.description, 200);

  const status = asString(raw.status);
  if (!status || !CATEGORY_STATUSES.includes(status as CategoryStatus)) {
    return null;
  }

  return { name, description, status: status as CategoryStatus };
}

export interface NomineeInput {
  categoryId: string;
  name: string;
  description: string | null;
  photoUrl: string | null;
  department: string | null;
  biography: string | null;
  status: NomineeStatus;
}

export function parseNomineeInput(body: unknown): NomineeInput | null {
  if (typeof body !== "object" || body === null) return null;
  const raw = body as Record<string, unknown>;

  if (!isUuid(raw.categoryId)) return null;

  const name = asString(raw.name);
  if (!name || name.length > 80) return null;

  const statusRaw = asString(raw.status) ?? "active";
  if (!NOMINEE_STATUSES.includes(statusRaw as NomineeStatus)) return null;

  const biography = asNullableString(raw.biography, 1000);
  if (raw.biography && biography === null && asString(raw.biography)) {
    return null;
  }

  return {
    categoryId: raw.categoryId,
    name,
    description: asNullableString(raw.description, 200),
    photoUrl: asImageRef(raw.photoUrl),
    department: asNullableString(raw.department, 100),
    biography,
    status: statusRaw as NomineeStatus,
  };
}

export interface VoterInput {
  name: string;
  email: string;
  status: VoterStatus;
}

export function parseVoterInput(body: unknown): VoterInput | null {
  if (typeof body !== "object" || body === null) return null;
  const raw = body as Record<string, unknown>;

  const name = asString(raw.name);
  if (!name || name.length > 100) return null;

  const email = asString(raw.email)?.toLowerCase();
  if (!email || email.length > 120 || !EMAIL_PATTERN.test(email)) return null;

  const status = asString(raw.status);
  if (!status || !VOTER_STATUSES.includes(status as VoterStatus)) {
    return null;
  }

  return { name, email, status: status as VoterStatus };
}

export interface EventSettingsInput {
  eventName: string;
  tagline: string | null;
  description: string | null;
  contactEmail: string | null;
  logoUrl: string | null;
  bannerUrl: string | null;
  primaryColor: string;
  accentColor: string;
  categoryLayout: CategoryLayout;
  resultsPolicy: ResultsPolicy;
  opensAt: Date | null;
  closesAt: Date | null;
}

export function parseEventSettingsInput(
  body: unknown,
): EventSettingsInput | null {
  if (typeof body !== "object" || body === null) return null;
  const raw = body as Record<string, unknown>;

  const eventName = asString(raw.eventName);
  if (!eventName || eventName.length > 80) return null;

  const tagline = asNullableString(raw.tagline, 120);

  const description = asNullableString(raw.description, 500);
  if (raw.description && description === null && asString(raw.description)) {
    return null;
  }

  const contactEmail = asString(raw.contactEmail)?.toLowerCase() ?? null;
  if (contactEmail && !EMAIL_PATTERN.test(contactEmail)) return null;

  const logoUrl = asImageRef(raw.logoUrl);
  if (raw.logoUrl && logoUrl === null && asString(raw.logoUrl)) return null;
  const bannerUrl = asImageRef(raw.bannerUrl);
  if (raw.bannerUrl && bannerUrl === null && asString(raw.bannerUrl)) {
    return null;
  }

  const primaryColor = asString(raw.primaryColor) ?? "#1e3a8a";
  if (!COLOR_PATTERN.test(primaryColor)) return null;
  const accentColor = asString(raw.accentColor) ?? "#f59e0b";
  if (!COLOR_PATTERN.test(accentColor)) return null;

  const categoryLayout = asString(raw.categoryLayout) ?? "grid";
  if (
    !CATEGORY_LAYOUTS.includes(categoryLayout as CategoryLayout)
  ) {
    return null;
  }

  const resultsPolicy = asString(raw.resultsPolicy);
  if (
    !resultsPolicy ||
    !RESULTS_POLICIES.includes(resultsPolicy as ResultsPolicy)
  ) {
    return null;
  }

  const opensAt = parseDate(raw.opensAt);
  if (raw.opensAt && opensAt === null && asString(raw.opensAt)) return null;
  const closesAt = parseDate(raw.closesAt);
  if (raw.closesAt && closesAt === null && asString(raw.closesAt)) return null;

  return {
    eventName,
    tagline,
    description,
    contactEmail,
    logoUrl,
    bannerUrl,
    primaryColor,
    accentColor,
    categoryLayout: categoryLayout as CategoryLayout,
    resultsPolicy: resultsPolicy as ResultsPolicy,
    opensAt,
    closesAt,
  };
}

export function parseVotingState(value: unknown): VotingState | null {
  if (typeof value !== "string") return null;
  return VOTING_STATES.includes(value as VotingState)
    ? (value as VotingState)
    : null;
}

export function parseBoolean(value: unknown): boolean | null {
  return typeof value === "boolean" ? value : null;
}

export function parseNomineeStatus(value: unknown): NomineeStatus | null {
  if (typeof value !== "string") return null;
  return NOMINEE_STATUSES.includes(value as NomineeStatus)
    ? (value as NomineeStatus)
    : null;
}

export function parseCategoryStatus(value: unknown): CategoryStatus | null {
  if (typeof value !== "string") return null;
  return CATEGORY_STATUSES.includes(value as CategoryStatus)
    ? (value as CategoryStatus)
    : null;
}

export function parsePermissionMatrix(
  value: unknown,
): PermissionMatrix | null {
  if (typeof value !== "object" || value === null) return null;
  const source = value as Record<string, unknown>;
  const matrix = {} as PermissionMatrix;
  for (const mod of DASHBOARD_MODULES) {
    const rawModule = source[mod];
    const access = { view: false, create: false, update: false, delete: false };
    if (rawModule !== undefined) {
      if (typeof rawModule !== "object" || rawModule === null) return null;
      const rawAccess = rawModule as Record<string, unknown>;
      for (const action of ACCESS_ACTIONS) {
        const raw = rawAccess[action];
        if (raw === undefined) continue;
        if (typeof raw !== "boolean") return null;
        access[action] = raw;
      }
    }
    matrix[mod] = access;
  }
  return matrix;
}

export interface UserCreateInput {
  username: string;
  password: string;
  fullName: string | null;
  role: UserRole;
  permissions: PermissionMatrix | null;
}

export interface UserUpdateInput {
  fullName?: string | null;
  role?: UserRole;
  password?: string;
  permissions?: PermissionMatrix;
}

const USERNAME_PATTERN = /^[a-z0-9_.-]{3,32}$/;

export function parseUserCreateInput(body: unknown): UserCreateInput | null {
  if (typeof body !== "object" || body === null) return null;
  const raw = body as Record<string, unknown>;

  const username =
    typeof raw.username === "string" ? raw.username.trim().toLowerCase() : "";
  if (!USERNAME_PATTERN.test(username)) return null;

  const password = typeof raw.password === "string" ? raw.password : "";
  if (password.length < 8 || password.length > 128) return null;

  const fullName =
    "fullName" in raw ? asNullableString(raw.fullName, 100) : null;

  const role = typeof raw.role === "string" && USER_ROLES.includes(raw.role as UserRole)
    ? (raw.role as UserRole)
    : null;
  if (!role) return null;

  const permissions = parsePermissionMatrix(raw.permissions);
  if (role === "custom" && !permissions) return null;

  return { username, password, fullName, role, permissions };
}

export function parseUserUpdateInput(body: unknown): UserUpdateInput | null {
  if (typeof body !== "object" || body === null) return null;
  const raw = body as Record<string, unknown>;
  const input: UserUpdateInput = {};

  if ("fullName" in raw) {
    input.fullName = asNullableString(raw.fullName, 100);
  }
  if (raw.role !== undefined) {
    if (
      typeof raw.role !== "string" ||
      !USER_ROLES.includes(raw.role as UserRole)
    ) {
      return null;
    }
    input.role = raw.role as UserRole;
  }
  if (raw.password !== undefined && raw.password !== "") {
    if (typeof raw.password !== "string") return null;
    if (raw.password.length < 8 || raw.password.length > 128) return null;
    input.password = raw.password;
  }
  if (raw.permissions !== undefined) {
    const permissions = parsePermissionMatrix(raw.permissions);
    if (!permissions) return null;
    input.permissions = permissions;
  }
  if (
    input.role === "custom" &&
    input.permissions === undefined
  ) {
    return null;
  }
  return input;
}
