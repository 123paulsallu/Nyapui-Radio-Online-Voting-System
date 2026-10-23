import { cache } from "react";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  ACCESS_ACTIONS,
  DASHBOARD_MODULES,
  userPermissions,
  type AccessAction,
  type DashboardModule,
  type User,
} from "@/lib/db/schema";
import type { PermissionMatrix } from "@/lib/dashboard/types";

export type { PermissionMatrix };

export type RolePreset = "admin" | "editor" | "viewer" | "custom";

export const ROLE_PRESETS: RolePreset[] = ["admin", "editor", "viewer", "custom"];

export const MODULE_LABELS: Record<DashboardModule, string> = {
  overview: "Overview",
  categories: "Award Categories",
  nominees: "Nominees",
  voters: "Voter Management",
  votes: "Vote Management",
  "voting-control": "Voting Control",
  results: "Results & Reports",
  integrity: "Data Integrity",
  settings: "Event Settings",
  users: "User Management",
};

function allFalse(): PermissionMatrix {
  const matrix = {} as PermissionMatrix;
  for (const mod of DASHBOARD_MODULES) {
    matrix[mod] = { view: false, create: false, update: false, delete: false };
  }
  return matrix;
}

function allTrue(): PermissionMatrix {
  const matrix = {} as PermissionMatrix;
  for (const mod of DASHBOARD_MODULES) {
    matrix[mod] = { view: true, create: true, update: true, delete: true };
  }
  return matrix;
}

function grant(
  matrix: PermissionMatrix,
  mod: DashboardModule,
  actions: AccessAction[],
) {
  for (const action of actions) matrix[mod][action] = true;
}

export function presetMatrix(preset: RolePreset): PermissionMatrix {
  const matrix = allFalse();
  if (preset === "admin") {
    grant(matrix, "overview", ["view"]);
    for (const mod of [
      "categories",
      "nominees",
      "voters",
    ] as DashboardModule[]) {
      grant(matrix, mod, ["view", "create", "update", "delete"]);
    }
    grant(matrix, "votes", ["view"]);
    grant(matrix, "voting-control", ["view", "update"]);
    grant(matrix, "results", ["view", "update"]);
    grant(matrix, "integrity", ["view"]);
    grant(matrix, "settings", ["view", "update"]);
  } else if (preset === "editor") {
    grant(matrix, "overview", ["view"]);
    for (const mod of [
      "categories",
      "nominees",
      "voters",
    ] as DashboardModule[]) {
      grant(matrix, mod, ["view", "create", "update", "delete"]);
    }
    grant(matrix, "votes", ["view"]);
    grant(matrix, "results", ["view"]);
    grant(matrix, "integrity", ["view"]);
  } else if (preset === "viewer") {
    grant(matrix, "overview", ["view"]);
    for (const mod of [
      "categories",
      "nominees",
      "voters",
      "votes",
      "results",
      "integrity",
    ] as DashboardModule[]) {
      grant(matrix, mod, ["view"]);
    }
  }
  return matrix;
}

export function emptyMatrix(): PermissionMatrix {
  return allFalse();
}

export function superMatrix(): PermissionMatrix {
  return allTrue();
}

export function rowsToMatrix(
  rows: {
    module: DashboardModule;
    canView: boolean;
    canCreate: boolean;
    canUpdate: boolean;
    canDelete: boolean;
  }[],
): PermissionMatrix {
  const matrix = allFalse();
  for (const row of rows) {
    if (!(row.module in matrix)) continue;
    matrix[row.module] = {
      view: row.canView,
      create: row.canCreate,
      update: row.canUpdate,
      delete: row.canDelete,
    };
  }
  return matrix;
}

export function matrixToRows(
  userId: string,
  matrix: PermissionMatrix,
): (typeof userPermissions.$inferInsert)[] {
  const rows: (typeof userPermissions.$inferInsert)[] = [];
  for (const mod of DASHBOARD_MODULES) {
    if (mod === "users") continue;
    const access = matrix[mod];
    rows.push({
      userId,
      module: mod,
      canView: access.view,
      canCreate: access.create,
      canUpdate: access.update,
      canDelete: access.delete,
    });
  }
  return rows;
}

export function can(
  matrix: PermissionMatrix,
  mod: DashboardModule,
  action: AccessAction,
): boolean {
  return matrix[mod]?.[action] ?? false;
}

export function visibleModules(matrix: PermissionMatrix): DashboardModule[] {
  return DASHBOARD_MODULES.filter((mod) => matrix[mod].view);
}

export const getEffectivePermissions = cache(
  async (user: User): Promise<PermissionMatrix> => {
    let matrix: PermissionMatrix;
    if (user.role === "super") {
      matrix = superMatrix();
    } else {
      const rows = await db
        .select()
        .from(userPermissions)
        .where(eq(userPermissions.userId, user.id));

      if (rows.length > 0) matrix = rowsToMatrix(rows);
      else if (user.role === "admin") matrix = presetMatrix("admin");
      else matrix = allFalse();
    }
    matrix.overview.view = true;
    return matrix;
  },
);

export function isSuper(user: User): boolean {
  return user.role === "super";
}

export { ACCESS_ACTIONS, DASHBOARD_MODULES };
