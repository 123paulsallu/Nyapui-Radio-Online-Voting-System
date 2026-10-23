"use server";

import { count, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import {
  DASHBOARD_MODULES,
  userPermissions,
  users,
  type User,
} from "@/lib/db/schema";
import { readSessionUserId } from "@/lib/auth/session";
import {
  matrixToRows,
  presetMatrix,
  type PermissionMatrix,
} from "@/lib/auth/permissions";
import { hashPassword } from "@/lib/auth/password";
import {
  isUuid,
  parseUserCreateInput,
  parseUserUpdateInput,
} from "@/lib/validation/resource";
import { recordAdminAction } from "./audit";
import type { ActionResult } from "./types";

const UNAUTHORIZED: ActionResult = {
  ok: false,
  error: "Your session has expired. Please sign in again.",
};
const FORBIDDEN: ActionResult = {
  ok: false,
  error: "Only Super Admins can manage users.",
};
const INVALID: ActionResult = { ok: false, error: "Invalid input provided." };
const NOT_FOUND: ActionResult = { ok: false, error: "User not found." };

async function requireSuper(): Promise<User | null> {
  const userId = await readSessionUserId();
  if (!userId) return null;
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);
  if (!user) return null;
  return user.role === "super" ? user : null;
}

function resolveMatrix(
  role: User["role"],
  permissions: PermissionMatrix | null,
): PermissionMatrix {
  let matrix: PermissionMatrix;
  if (role === "super") {
    matrix = {} as PermissionMatrix;
    for (const mod of DASHBOARD_MODULES) {
      matrix[mod] = { view: true, create: true, update: true, delete: true };
    }
  } else if (role === "custom" && permissions) {
    matrix = permissions;
  } else {
    matrix = presetMatrix(role as Exclude<User["role"], "super" | "custom">);
  }
  matrix.overview.view = true;
  return matrix;
}

async function supersCount(): Promise<number> {
  const [row] = await db
    .select({ value: count() })
    .from(users)
    .where(eq(users.role, "super"));
  return row?.value ?? 0;
}

function mapUserDbError(error: unknown): ActionResult {
  const code =
    typeof error === "object" && error !== null
      ? "code" in error && error.code
        ? String(error.code)
        : typeof (error as { cause?: unknown }).cause === "object" &&
            (error as { cause?: unknown }).cause !== null &&
            "code" in (error as { cause: object }).cause
          ? String((error as { cause: { code?: unknown } }).cause.code)
          : null
      : null;
  if (code === "23505") {
    return { ok: false, error: "That username is already taken." };
  }
  return { ok: false, error: "Database error. Please try again." };
}

export async function createUser(body: unknown): Promise<ActionResult> {
  const admin = await requireSuper();
  if (!admin) {
    const userId = await readSessionUserId();
    return userId ? FORBIDDEN : UNAUTHORIZED;
  }

  const input = parseUserCreateInput(body);
  if (!input) return INVALID;

  const matrix = resolveMatrix(
    input.role,
    input.role === "custom" ? input.permissions : null,
  );

  try {
    const passwordHash = await hashPassword(input.password);
    const [created] = await db
      .insert(users)
      .values({
        username: input.username,
        passwordHash,
        fullName: input.fullName,
        role: input.role,
      })
      .returning({ id: users.id, username: users.username });

    if (input.role !== "super") {
      await db.insert(userPermissions).values(matrixToRows(created.id, matrix));
    }
    await recordAdminAction(
      admin,
      "user.create",
      "user",
      created.id,
      `Created user "${created.username}" with role ${input.role}.`,
    );
  } catch (error) {
    return mapUserDbError(error);
  }

  revalidatePath("/dashboard/users");
  revalidatePath("/dashboard");
  return { ok: true };
}

export async function updateUser(
  id: string,
  body: unknown,
): Promise<ActionResult> {
  const admin = await requireSuper();
  if (!admin) {
    const userId = await readSessionUserId();
    return userId ? FORBIDDEN : UNAUTHORIZED;
  }
  if (!isUuid(id)) return INVALID;

  const input = parseUserUpdateInput(body);
  if (!input) return INVALID;

  const [target] = await db.select().from(users).where(eq(users.id, id)).limit(1);
  if (!target) return NOT_FOUND;

  const isSelf = target.id === admin.id;
  if (isSelf && (input.role !== undefined || input.permissions !== undefined)) {
    return { ok: false, error: "You cannot change your own role or permissions." };
  }

  if (input.role !== undefined && input.role !== target.role) {
    if (target.role === "super") {
      const supers = await supersCount();
      if (supers <= 1) {
        return {
          ok: false,
          error: "The last Super Admin cannot be demoted.",
        };
      }
    }
    if (target.role !== "super" && input.role === "super") {
      await db.delete(userPermissions).where(eq(userPermissions.userId, id));
    }
  }

  try {
    const patch: Partial<typeof users.$inferInsert> = {};
    if (input.fullName !== undefined) patch.fullName = input.fullName;
    if (input.role !== undefined) patch.role = input.role;
    if (input.password !== undefined) {
      patch.passwordHash = await hashPassword(input.password);
    }
    if (Object.keys(patch).length > 0) {
      await db.update(users).set(patch).where(eq(users.id, id));
    }

    const nextRole = input.role ?? target.role;
    if (input.role !== undefined || input.permissions !== undefined) {
      const matrix =
        nextRole === "super"
          ? null
          : resolveMatrix(nextRole, input.permissions ?? null);
      await db.delete(userPermissions).where(eq(userPermissions.userId, id));
      if (matrix) {
        await db.insert(userPermissions).values(matrixToRows(id, matrix));
      }
    }

    await recordAdminAction(
      admin,
      "user.update",
      "user",
      id,
      `Updated user "${target.username}"${
        input.role !== undefined && input.role !== target.role
          ? ` (role ${target.role} → ${input.role})`
          : ""
      }.`,
    );
  } catch (error) {
    return mapUserDbError(error);
  }

  revalidatePath("/dashboard/users");
  return { ok: true };
}

export async function deleteUser(id: string): Promise<ActionResult> {
  const admin = await requireSuper();
  if (!admin) {
    const userId = await readSessionUserId();
    return userId ? FORBIDDEN : UNAUTHORIZED;
  }
  if (!isUuid(id)) return INVALID;

  if (id === admin.id) {
    return { ok: false, error: "You cannot delete your own account." };
  }

  const [target] = await db.select().from(users).where(eq(users.id, id)).limit(1);
  if (!target) return NOT_FOUND;

  if (target.role === "super") {
    const supers = await supersCount();
    if (supers <= 1) {
      return { ok: false, error: "The last Super Admin cannot be deleted." };
    }
  }

  try {
    await db.delete(users).where(eq(users.id, id));
    await recordAdminAction(
      admin,
      "user.delete",
      "user",
      id,
      `Deleted user "${target.username}" (role ${target.role}).`,
    );
  } catch (error) {
    return mapUserDbError(error);
  }

  revalidatePath("/dashboard/users");
  revalidatePath("/dashboard");
  return { ok: true };
}
