import { asc, count, eq, ne, sql } from "drizzle-orm";
import { connection } from "next/server";
import { db } from "@/lib/db";
import {
  awardCategories,
  eventSettings,
  nominees,
  voters,
  votes,
} from "@/lib/db/schema";

const NO_STORE = { "Cache-Control": "no-store" };

export async function GET(): Promise<Response> {
  await connection();

  const [settings] = await db
    .select()
    .from(eventSettings)
    .where(eq(eventSettings.id, "main"))
    .limit(1);

  const resultsVisible = settings
    ? settings.resultsPolicy === "live"
      ? true
      : settings.resultsPolicy === "close"
        ? settings.resultsReleased || settings.votingState === "closed"
        : settings.resultsReleased
    : false;
  const countsIncluded = resultsVisible;

  const categoryRows = await db
    .select()
    .from(awardCategories)
    .where(ne(awardCategories.status, "draft"))
    .orderBy(asc(awardCategories.sortOrder), asc(awardCategories.name));

  const nomineeRows = await db
    .select({
      id: nominees.id,
      name: nominees.name,
      department: nominees.department,
      photoUrl: nominees.photoUrl,
      biography: nominees.biography,
      categoryId: nominees.categoryId,
    })
    .from(nominees)
    .innerJoin(awardCategories, eq(nominees.categoryId, awardCategories.id))
    .where(
      sql`${awardCategories.status} != 'draft' AND ${nominees.status} = 'active'`,
    )
    .orderBy(asc(nominees.name));

  let voteCounts = new Map<string, number>();
  let summary: {
    totalVotes: number;
    verifiedVoters: number;
    turnout: number;
  } | null = null;

  if (countsIncluded) {
    const countRows = await db
      .select({ nomineeId: votes.nomineeId, value: count() })
      .from(votes)
      .groupBy(votes.nomineeId);
    voteCounts = new Map(countRows.map((row) => [row.nomineeId, row.value]));

    const [totalRow, verifiedRow, votedRows] = await Promise.all([
      db.select({ value: count() }).from(votes),
      db
        .select({ value: count() })
        .from(voters)
        .where(eq(voters.status, "verified")),
      db.selectDistinct({ voterId: votes.voterId }).from(votes),
    ]);
    const verified = verifiedRow[0]?.value ?? 0;
    summary = {
      totalVotes: totalRow[0]?.value ?? 0,
      verifiedVoters: verified,
      turnout:
        verified > 0
          ? Math.round((votedRows.length / verified) * 100)
          : 0,
    };
  }

  const categories = categoryRows.map((category) => {
    const list = nomineeRows.filter(
      (nominee) => nominee.categoryId === category.id,
    );
    const withCounts = list.map((nominee) => ({
      id: nominee.id,
      name: nominee.name,
      department: nominee.department,
      photoUrl: nominee.photoUrl,
      biography: nominee.biography,
      votes: countsIncluded ? voteCounts.get(nominee.id) ?? 0 : null,
    }));
    return {
      id: category.id,
      name: category.name,
      description: category.description,
      status: category.status,
      nominees: withCounts,
      totalVotes: countsIncluded
        ? withCounts.reduce((sum, nominee) => sum + (nominee.votes ?? 0), 0)
        : null,
    };
  });

  return Response.json(
    { resultsVisible, countsIncluded, categories, summary },
    { headers: NO_STORE },
  );
}
