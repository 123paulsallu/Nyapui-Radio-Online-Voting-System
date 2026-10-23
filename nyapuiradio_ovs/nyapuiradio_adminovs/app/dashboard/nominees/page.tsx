import { requireDashboard } from "@/lib/auth/guard";
import { count, eq, inArray } from "drizzle-orm";
import { db } from "@/lib/db";
import { awardCategories, nominees, votes } from "@/lib/db/schema";
import type { NomineeDTO } from "@/lib/dashboard/types";
import { NomineesManager } from "../_components/nominees-manager";

export const instant = false;

export default async function NomineesPage() {
  await requireDashboard("nominees");
  const [categoryRows, nomineeRows] = await Promise.all([
    db
      .select({ id: awardCategories.id, name: awardCategories.name })
      .from(awardCategories)
      .orderBy(awardCategories.name),
    db
      .select({
        id: nominees.id,
        name: nominees.name,
        description: nominees.description,
        photoUrl: nominees.photoUrl,
        department: nominees.department,
        biography: nominees.biography,
        status: nominees.status,
        categoryId: nominees.categoryId,
        categoryName: awardCategories.name,
      })
      .from(nominees)
      .innerJoin(
        awardCategories,
        eq(nominees.categoryId, awardCategories.id),
      )
      .orderBy(awardCategories.name, nominees.name),
  ]);

  const nomineeIds = nomineeRows.map((row) => row.id);

  const voteCounts =
    nomineeIds.length > 0
      ? await db
          .select({ id: votes.nomineeId, value: count() })
          .from(votes)
          .where(inArray(votes.nomineeId, nomineeIds))
          .groupBy(votes.nomineeId)
      : [];
  const voteMap = new Map(voteCounts.map((row) => [row.id, row.value]));

  const data: NomineeDTO[] = nomineeRows.map((row) => ({
    ...row,
    voteCount: voteMap.get(row.id) ?? 0,
  }));

  return <NomineesManager nominees={data} categories={categoryRows} />;
}
