import { cache } from "react";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { users, type DashboardModule, type User } from "@/lib/db/schema";
import { getSessionUserId } from "./session";
import {
  can,
  getEffectivePermissions,
  visibleModules,
  type PermissionMatrix,
} from "./permissions";

export const getDashboardUser = cache(async (): Promise<User> => {
  const userId = await getSessionUserId();
  if (!userId) redirect("/");

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);
  if (!user) redirect("/");
  return user;
});

export async function requireDashboard(
  module?: DashboardModule,
): Promise<void> {
  const user = await getDashboardUser();
  if (!module) return;
  const matrix = await getEffectivePermissions(user);
  if (!can(matrix, module, "view")) redirect("/dashboard");
}

export const getNavPermissions = cache(
  async (): Promise<{ matrix: PermissionMatrix; modules: DashboardModule[] }> => {
    const user = await getDashboardUser();
    const matrix = await getEffectivePermissions(user);
    return { matrix, modules: visibleModules(matrix) };
  },
);
