import { db } from "@/lib/db";
import { adminAuditLog, type User } from "@/lib/db/schema";

export async function recordAdminAction(
  admin: Pick<User, "id" | "fullName" | "username"> | null,
  action: string,
  entityType: string,
  entityId: string | null,
  detail: string,
): Promise<void> {
  try {
    await db.insert(adminAuditLog).values({
      adminId: admin?.id ?? null,
      adminName: admin
        ? (admin.fullName ?? admin.username)
        : "Unknown admin",
      action,
      entityType,
      entityId,
      detail: detail.slice(0, 500),
    });
  } catch (error) {
    console.error("Failed to record admin audit entry", error);
  }
}
