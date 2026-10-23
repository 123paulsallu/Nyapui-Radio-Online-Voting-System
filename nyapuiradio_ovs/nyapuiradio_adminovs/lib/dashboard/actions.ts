"use server";

import { asc, eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import {
  awardCategories,
  eventSettings,
  nominees,
  users,
  voters,
  CATEGORY_STATUSES,
  NOMINEE_STATUSES,
  type AccessAction,
  type CategoryStatus,
  type DashboardModule,
  type NomineeStatus,
  type User,
  type VotingState,
} from "@/lib/db/schema";
import { readSessionUserId } from "@/lib/auth/session";
import {
  can,
  getEffectivePermissions,
} from "@/lib/auth/permissions";
import {
  isUuid,
  parseBoolean,
  parseCategoryInput,
  parseEventSettingsInput,
  parseNomineeInput,
  parseVoterInput,
} from "@/lib/validation/resource";
import { recordAdminAction } from "./audit";
import type { ActionResult } from "./types";

const SETTINGS_ID = "main";

const UNAUTHORIZED: ActionResult = {
  ok: false,
  error: "Your session has expired. Please sign in again.",
};
const FORBIDDEN: ActionResult = {
  ok: false,
  error: "You don't have permission to perform this action.",
};
const INVALID: ActionResult = { ok: false, error: "Invalid input provided." };
const NOT_FOUND: ActionResult = { ok: false, error: "Record not found." };

async function requireAdmin() {
  const userId = await readSessionUserId();
  if (!userId) return null;
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);
  return user ?? null;
}

type AuthResult =
  | { ok: true; admin: User }
  | { ok: false; error: ActionResult };

async function authorize(
  module: DashboardModule,
  action: AccessAction,
): Promise<AuthResult> {
  const admin = await requireAdmin();
  if (!admin) return { ok: false, error: UNAUTHORIZED };
  const matrix = await getEffectivePermissions(admin);
  if (!can(matrix, module, action)) return { ok: false, error: FORBIDDEN };
  return { ok: true, admin };
}

function mapDbError(error: unknown): ActionResult {
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
    return { ok: false, error: "A record with that value already exists." };
  }
  if (code === "23503") {
    return { ok: false, error: "Related record no longer exists." };
  }
  return { ok: false, error: "Database error. Please try again." };
}

function revalidateDashboard(...paths: string[]) {
  for (const path of paths) revalidatePath(path);
}

async function getSettingsRow() {
  const [row] = await db
    .select()
    .from(eventSettings)
    .where(eq(eventSettings.id, SETTINGS_ID))
    .limit(1);
  return row ?? null;
}

async function upsertSettings(patch: Record<string, unknown>) {
  await db
    .insert(eventSettings)
    .values({ id: SETTINGS_ID, eventName: "Nyapui Radio Awards", ...patch })
    .onConflictDoUpdate({
      target: eventSettings.id,
      set: { ...patch, updatedAt: new Date() },
    });
}

export async function createCategory(body: unknown): Promise<ActionResult> {
  const auth = await authorize("categories", "create");
  if (!auth.ok) return auth.error;
  const admin = auth.admin;
  const input = parseCategoryInput(body);
  if (!input) return INVALID;
  try {
    const [maxRow] = await db
      .select({ max: sql<number>`coalesce(max(${awardCategories.sortOrder}), 0)` })
      .from(awardCategories);
    const [created] = await db
      .insert(awardCategories)
      .values({ ...input, sortOrder: (maxRow?.max ?? 0) + 1 })
      .returning({ id: awardCategories.id, name: awardCategories.name });
    await recordAdminAction(
      admin,
      "category.create",
      "category",
      created.id,
      `Created category "${created.name}" (${input.status})`,
    );
  } catch (error) {
    return mapDbError(error);
  }
  revalidateDashboard("/dashboard", "/dashboard/categories");
  return { ok: true };
}

export async function updateCategory(
  id: string,
  body: unknown,
): Promise<ActionResult> {
  const auth = await authorize("categories", "update");
  if (!auth.ok) return auth.error;
  const admin = auth.admin;
  if (!isUuid(id)) return NOT_FOUND;
  const input = parseCategoryInput(body);
  if (!input) return INVALID;
  try {
    const updated = await db
      .update(awardCategories)
      .set(input)
      .where(eq(awardCategories.id, id))
      .returning({ id: awardCategories.id, name: awardCategories.name });
    if (updated.length === 0) return NOT_FOUND;
    await recordAdminAction(
      admin,
      "category.update",
      "category",
      id,
      `Updated category "${updated[0].name}"`,
    );
  } catch (error) {
    return mapDbError(error);
  }
  revalidateDashboard("/dashboard", "/dashboard/categories", "/dashboard/nominees");
  return { ok: true };
}

export async function setCategoryStatus(
  id: string,
  status: CategoryStatus,
): Promise<ActionResult> {
  const auth = await authorize("categories", "update");
  if (!auth.ok) return auth.error;
  const admin = auth.admin;
  if (!isUuid(id)) return NOT_FOUND;
  if (!CATEGORY_STATUSES.includes(status)) return INVALID;
  try {
    const updated = await db
      .update(awardCategories)
      .set({ status })
      .where(eq(awardCategories.id, id))
      .returning({ id: awardCategories.id, name: awardCategories.name });
    if (updated.length === 0) return NOT_FOUND;
    await recordAdminAction(
      admin,
      "category.status",
      "category",
      id,
      `Category "${updated[0].name}" set to ${status}`,
    );
  } catch (error) {
    return mapDbError(error);
  }
  revalidateDashboard(
    "/dashboard",
    "/dashboard/categories",
    "/dashboard/voting-control",
  );
  return { ok: true };
}

export async function moveCategory(
  id: string,
  direction: "up" | "down",
): Promise<ActionResult> {
  const auth = await authorize("categories", "update");
  if (!auth.ok) return auth.error;
  const admin = auth.admin;
  if (!isUuid(id)) return INVALID;
  if (direction !== "up" && direction !== "down") return INVALID;
  try {
    const rows = await db
      .select({
        id: awardCategories.id,
        name: awardCategories.name,
        sortOrder: awardCategories.sortOrder,
      })
      .from(awardCategories)
      .orderBy(asc(awardCategories.sortOrder), asc(awardCategories.createdAt));

    const index = rows.findIndex((row) => row.id === id);
    if (index === -1) return NOT_FOUND;
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= rows.length) return { ok: true };

    const current = rows[index];
    const neighbor = rows[swapIndex];
    await db
      .update(awardCategories)
      .set({ sortOrder: neighbor.sortOrder })
      .where(eq(awardCategories.id, current.id));
    await db
      .update(awardCategories)
      .set({ sortOrder: current.sortOrder })
      .where(eq(awardCategories.id, neighbor.id));
    await recordAdminAction(
      admin,
      "category.reorder",
      "category",
      id,
      `Moved "${current.name}" ${direction} past "${neighbor.name}"`,
    );
  } catch (error) {
    return mapDbError(error);
  }
  revalidateDashboard("/dashboard/categories");
  return { ok: true };
}

export async function deleteCategory(id: string): Promise<ActionResult> {
  const auth = await authorize("categories", "delete");
  if (!auth.ok) return auth.error;
  const admin = auth.admin;
  if (!isUuid(id)) return NOT_FOUND;
  try {
    const deleted = await db
      .delete(awardCategories)
      .where(eq(awardCategories.id, id))
      .returning({ id: awardCategories.id, name: awardCategories.name });
    if (deleted.length === 0) return NOT_FOUND;
    await recordAdminAction(
      admin,
      "category.delete",
      "category",
      id,
      `Deleted category "${deleted[0].name}" (nominees and votes cascaded)`,
    );
  } catch (error) {
    return mapDbError(error);
  }
  revalidateDashboard(
    "/dashboard",
    "/dashboard/categories",
    "/dashboard/nominees",
    "/dashboard/voting-control",
    "/dashboard/results",
    "/dashboard/votes",
  );
  return { ok: true };
}

export async function createNominee(body: unknown): Promise<ActionResult> {
  const auth = await authorize("nominees", "create");
  if (!auth.ok) return auth.error;
  const admin = auth.admin;
  const input = parseNomineeInput(body);
  if (!input) return INVALID;
  try {
    const [category] = await db
      .select({ id: awardCategories.id, name: awardCategories.name })
      .from(awardCategories)
      .where(eq(awardCategories.id, input.categoryId))
      .limit(1);
    if (!category) return NOT_FOUND;
    const [created] = await db
      .insert(nominees)
      .values(input)
      .returning({ id: nominees.id });
    await recordAdminAction(
      admin,
      "nominee.create",
      "nominee",
      created.id,
      `Added nominee "${input.name}" to "${category.name}"`,
    );
  } catch (error) {
    return mapDbError(error);
  }
  revalidateDashboard("/dashboard", "/dashboard/nominees", "/dashboard/results");
  return { ok: true };
}

export async function updateNominee(
  id: string,
  body: unknown,
): Promise<ActionResult> {
  const auth = await authorize("nominees", "update");
  if (!auth.ok) return auth.error;
  const admin = auth.admin;
  if (!isUuid(id)) return NOT_FOUND;
  const input = parseNomineeInput(body);
  if (!input) return INVALID;
  try {
    const updated = await db
      .update(nominees)
      .set(input)
      .where(eq(nominees.id, id))
      .returning({ id: nominees.id, name: nominees.name });
    if (updated.length === 0) return NOT_FOUND;
    await recordAdminAction(
      admin,
      "nominee.update",
      "nominee",
      id,
      `Updated nominee "${updated[0].name}"`,
    );
  } catch (error) {
    return mapDbError(error);
  }
  revalidateDashboard("/dashboard", "/dashboard/nominees", "/dashboard/results");
  return { ok: true };
}

export async function setNomineeStatus(
  id: string,
  status: NomineeStatus,
): Promise<ActionResult> {
  const auth = await authorize("nominees", "update");
  if (!auth.ok) return auth.error;
  const admin = auth.admin;
  if (!isUuid(id)) return NOT_FOUND;
  if (!NOMINEE_STATUSES.includes(status)) return INVALID;
  try {
    const updated = await db
      .update(nominees)
      .set({ status })
      .where(eq(nominees.id, id))
      .returning({ id: nominees.id, name: nominees.name });
    if (updated.length === 0) return NOT_FOUND;
    await recordAdminAction(
      admin,
      status === "withdrawn" ? "nominee.withdraw" : "nominee.restore",
      "nominee",
      id,
      `Nominee "${updated[0].name}" ${status}`,
    );
  } catch (error) {
    return mapDbError(error);
  }
  revalidateDashboard("/dashboard", "/dashboard/nominees", "/dashboard/results");
  return { ok: true };
}

export async function deleteNominee(id: string): Promise<ActionResult> {
  const auth = await authorize("nominees", "delete");
  if (!auth.ok) return auth.error;
  const admin = auth.admin;
  if (!isUuid(id)) return NOT_FOUND;
  try {
    const deleted = await db
      .delete(nominees)
      .where(eq(nominees.id, id))
      .returning({ id: nominees.id, name: nominees.name });
    if (deleted.length === 0) return NOT_FOUND;
    await recordAdminAction(
      admin,
      "nominee.delete",
      "nominee",
      id,
      `Deleted nominee "${deleted[0].name}" (votes cascaded)`,
    );
  } catch (error) {
    return mapDbError(error);
  }
  revalidateDashboard(
    "/dashboard",
    "/dashboard/nominees",
    "/dashboard/results",
    "/dashboard/votes",
  );
  return { ok: true };
}

export async function createVoter(body: unknown): Promise<ActionResult> {
  const auth = await authorize("voters", "create");
  if (!auth.ok) return auth.error;
  const admin = auth.admin;
  const input = parseVoterInput(body);
  if (!input) return INVALID;
  try {
    const [created] = await db
      .insert(voters)
      .values(input)
      .returning({ id: voters.id });
    await recordAdminAction(
      admin,
      "voter.create",
      "voter",
      created.id,
      `Registered voter "${input.name}" (${input.status})`,
    );
  } catch (error) {
    return mapDbError(error);
  }
  revalidateDashboard("/dashboard", "/dashboard/voters", "/dashboard");
  return { ok: true };
}

export async function updateVoter(
  id: string,
  body: unknown,
): Promise<ActionResult> {
  const auth = await authorize("voters", "update");
  if (!auth.ok) return auth.error;
  const admin = auth.admin;
  if (!isUuid(id)) return NOT_FOUND;
  const input = parseVoterInput(body);
  if (!input) return INVALID;
  try {
    const updated = await db
      .update(voters)
      .set(input)
      .where(eq(voters.id, id))
      .returning({ id: voters.id, name: voters.name });
    if (updated.length === 0) return NOT_FOUND;
    await recordAdminAction(
      admin,
      "voter.update",
      "voter",
      id,
      `Updated voter "${updated[0].name}" (${input.status})`,
    );
  } catch (error) {
    return mapDbError(error);
  }
  revalidateDashboard("/dashboard", "/dashboard/voters", "/dashboard");
  return { ok: true };
}

export async function deleteVoter(id: string): Promise<ActionResult> {
  const auth = await authorize("voters", "delete");
  if (!auth.ok) return auth.error;
  const admin = auth.admin;
  if (!isUuid(id)) return NOT_FOUND;
  try {
    const deleted = await db
      .delete(voters)
      .where(eq(voters.id, id))
      .returning({ id: voters.id, name: voters.name });
    if (deleted.length === 0) return NOT_FOUND;
    await recordAdminAction(
      admin,
      "voter.delete",
      "voter",
      id,
      `Removed voter "${deleted[0].name}" (votes cascaded)`,
    );
  } catch (error) {
    return mapDbError(error);
  }
  revalidateDashboard("/dashboard", "/dashboard/voters", "/dashboard");
  return { ok: true };
}

export async function setVotingState(
  state: VotingState,
): Promise<ActionResult> {
  const auth = await authorize("voting-control", "update");
  if (!auth.ok) return auth.error;
  const admin = auth.admin;
  if (state !== "open" && state !== "paused" && state !== "closed") {
    return INVALID;
  }
  const current = await getSettingsRow();
  if (!current) return NOT_FOUND;
  if (current.votingState === state) return { ok: true };
  try {
    await upsertSettings({ votingState: state });
    if (state === "closed") {
      await db
        .update(awardCategories)
        .set({ status: "closed" })
        .where(eq(awardCategories.status, "open"));
    }
    const labels: Record<VotingState, string> = {
      open: "Voting opened — visitors can cast votes",
      paused: "Voting paused — ballots temporarily suspended",
      closed: "Voting closed — no new ballots accepted; open categories locked",
    };
    await recordAdminAction(
      admin,
      `voting.${state}`,
      "event",
      SETTINGS_ID,
      labels[state],
    );
  } catch (error) {
    return mapDbError(error);
  }
  revalidateDashboard(
    "/dashboard",
    "/dashboard/voting-control",
    "/dashboard/votes",
    "/dashboard/categories",
    "/dashboard/settings",
    "/dashboard/results",
  );
  return { ok: true };
}

export async function updateVotingControl(body: unknown): Promise<ActionResult> {
  const auth = await authorize("voting-control", "update");
  if (!auth.ok) return auth.error;
  const admin = auth.admin;
  if (typeof body !== "object" || body === null) return INVALID;
  const raw = body as Record<string, unknown>;

  const patch: {
    anonymous?: boolean;
    oneVotePerCategory?: boolean;
    resultsLive?: boolean;
  } = {};
  const flags = ["anonymous", "oneVotePerCategory", "resultsLive"] as const;
  let hasChange = false;
  const changedLabels: string[] = [];
  for (const flag of flags) {
    if (flag in raw) {
      const value = parseBoolean(raw[flag]);
      if (value === null) return INVALID;
      patch[flag] = value;
      hasChange = true;
      changedLabels.push(`${flag}=${value}`);
    }
  }
  if (!hasChange) return INVALID;

  try {
    await upsertSettings(patch);
    await recordAdminAction(
      admin,
      "voting.rules",
      "event",
      SETTINGS_ID,
      `Voting rules updated: ${changedLabels.join(", ")}`,
    );
  } catch (error) {
    return mapDbError(error);
  }
  revalidateDashboard("/dashboard", "/dashboard/voting-control", "/dashboard/settings");
  return { ok: true };
}

export async function setResultsReleased(
  released: boolean,
): Promise<ActionResult> {
  const auth = await authorize("results", "update");
  if (!auth.ok) return auth.error;
  const admin = auth.admin;
  if (typeof released !== "boolean") return INVALID;
  try {
    await upsertSettings({ resultsReleased: released });
    await recordAdminAction(
      admin,
      released ? "results.release" : "results.hide",
      "event",
      SETTINGS_ID,
      released
        ? "Results released for public viewing"
        : "Results hidden from the public",
    );
  } catch (error) {
    return mapDbError(error);
  }
  revalidateDashboard("/dashboard", "/dashboard/results", "/dashboard/settings");
  return { ok: true };
}

export async function updateEventSettings(
  body: unknown,
): Promise<ActionResult> {
  const auth = await authorize("settings", "update");
  if (!auth.ok) return auth.error;
  const admin = auth.admin;
  const input = parseEventSettingsInput(body);
  if (!input) return INVALID;
  try {
    await upsertSettings({ ...input });
    await recordAdminAction(
      admin,
      "settings.update",
      "event",
      SETTINGS_ID,
      `Event settings updated: "${input.eventName}", layout ${input.categoryLayout}, policy ${input.resultsPolicy}`,
    );
  } catch (error) {
    return mapDbError(error);
  }
  revalidateDashboard(
    "/dashboard",
    "/dashboard/settings",
    "/dashboard/voting-control",
    "/dashboard/results",
  );
  return { ok: true };
}
