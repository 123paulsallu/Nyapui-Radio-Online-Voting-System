import type { ReactNode } from "react";
import { eq } from "drizzle-orm";
import { getDashboardUser, getNavPermissions } from "@/lib/auth/guard";
import { db } from "@/lib/db";
import { eventSettings } from "@/lib/db/schema";
import DashboardShell from "./_components/shell";

export const instant = false;

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const [user, settingsRow, nav] = await Promise.all([
    getDashboardUser(),
    db
      .select({ votingState: eventSettings.votingState })
      .from(eventSettings)
      .where(eq(eventSettings.id, "main"))
      .limit(1),
    getNavPermissions(),
  ]);

  return (
    <DashboardShell
      user={{
        username: user.username,
        fullName: user.fullName,
        role: user.role,
      }}
      votingState={settingsRow[0]?.votingState ?? "closed"}
      allowedModules={nav.modules}
    >
      {children}
    </DashboardShell>
  );
}
