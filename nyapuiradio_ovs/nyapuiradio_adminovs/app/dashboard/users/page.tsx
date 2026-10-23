import { redirect } from "next/navigation";
import { asc } from "drizzle-orm";
import { getDashboardUser, requireDashboard } from "@/lib/auth/guard";
import { db } from "@/lib/db";
import { userPermissions, users } from "@/lib/db/schema";
import { rowsToMatrix, superMatrix } from "@/lib/auth/permissions";
import type { UserDTO } from "@/lib/dashboard/types";
import { UsersManager } from "../_components/users-manager";

export const instant = false;

export default async function UsersPage() {
  await requireDashboard("users");
  const current = await getDashboardUser();
  if (current.role !== "super") redirect("/dashboard");

  const [userRows, permRows] = await Promise.all([
    db.select().from(users).orderBy(asc(users.createdAt)),
    db.select().from(userPermissions),
  ]);

  const permsByUser = new Map<string, typeof permRows>();
  for (const row of permRows) {
    const list = permsByUser.get(row.userId) ?? [];
    list.push(row);
    permsByUser.set(row.userId, list);
  }

  const userList: UserDTO[] = userRows.map((row) => ({
    id: row.id,
    username: row.username,
    fullName: row.fullName,
    role: row.role,
    createdAt: row.createdAt.toISOString(),
    permissions:
      row.role === "super"
        ? superMatrix()
        : rowsToMatrix(permsByUser.get(row.id) ?? []),
  }));

  return (
    <UsersManager users={userList} currentUserId={current.id} />
  );
}
