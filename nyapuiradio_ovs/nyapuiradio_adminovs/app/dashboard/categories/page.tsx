import { requireDashboard } from "@/lib/auth/guard";
import { asc, count, eq, inArray } from "drizzle-orm";
import { db } from "@/lib/db";
import { awardCategories, nominees, votes } from "@/lib/db/schema";
import type { CategoryDTO } from "@/lib/dashboard/types";
import { CategoriesManager } from "../_components/categories-manager";

export const instant = false;

export default async function CategoriesPage() {
  await requireDashboard("categories");
  const rows = await db
    .select()
    .from(awardCategories)
    .orderBy(asc(awardCategories.sortOrder), asc(awardCategories.name));

  const categoryIds = rows.map((row) => row.id);

  const [nomineeCounts, voteCounts] =
    categoryIds.length > 0
      ? await Promise.all([
          db
            .select({ categoryId: nominees.categoryId, value: count() })
            .from(nominees)
            .where(inArray(nominees.categoryId, categoryIds))
            .groupBy(nominees.categoryId),
          db
            .select({ categoryId: nominees.categoryId, value: count() })
            .from(votes)
            .innerJoin(nominees, eq(votes.nomineeId, nominees.id))
            .where(inArray(nominees.categoryId, categoryIds))
            .groupBy(nominees.categoryId),
        ])
      : [[], []];

  const nomineeMap = new Map(
    nomineeCounts.map((row) => [row.categoryId, row.value]),
  );
  const voteMap = new Map(voteCounts.map((row) => [row.categoryId, row.value]));

  const categories: CategoryDTO[] = rows.map((row) => ({
    id: row.id,
    name: row.name,
    description: row.description,
    status: row.status,
    sortOrder: row.sortOrder,
    nomineeCount: nomineeMap.get(row.id) ?? 0,
    voteCount: voteMap.get(row.id) ?? 0,
  }));

  return <CategoriesManager categories={categories} />;
}
