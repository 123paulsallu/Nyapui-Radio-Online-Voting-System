import { requireDashboard } from "@/lib/auth/guard";
import { count, desc, eq, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  awardCategories,
  eventSettings,
  nominees,
  votes,
  voters,
} from "@/lib/db/schema";
import type { VoteDTO } from "@/lib/dashboard/types";
import { VotesManager } from "../_components/votes-manager";

export const instant = false;

export default async function VotesPage() {
  await requireDashboard("votes");

  const [voteRows, [totalRow], [ipRow], [deviceRow], settingsRow] =
    await Promise.all([
      db
        .select({
          id: votes.id,
          castAt: votes.castAt,
          ipHash: votes.ipHash,
          deviceHint: votes.deviceHint,
          nomineeName: nominees.name,
          categoryName: awardCategories.name,
          voterName: voters.name,
        })
        .from(votes)
        .innerJoin(nominees, eq(votes.nomineeId, nominees.id))
        .innerJoin(
          awardCategories,
          eq(nominees.categoryId, awardCategories.id),
        )
        .leftJoin(voters, eq(votes.voterId, voters.id))
        .orderBy(desc(votes.castAt))
        .limit(300),
      db.select({ value: count() }).from(votes),
      db
        .select({
          value: sql<number>`count(distinct ${votes.ipHash})::int`,
        })
        .from(votes),
      db
        .select({
          value: sql<number>`count(distinct ${votes.deviceHint})::int`,
        })
        .from(votes),
      db
        .select()
        .from(eventSettings)
        .where(eq(eventSettings.id, "main"))
        .limit(1),
    ]);

  const ipFrequency = new Map<string, number>();
  for (const row of voteRows) {
    if (!row.ipHash) continue;
    ipFrequency.set(row.ipHash, (ipFrequency.get(row.ipHash) ?? 0) + 1);
  }

  const recentByIp = new Map<string, number>();
  const rows: VoteDTO[] = voteRows.map((row) => {
    const indicators: string[] = [];
    if (row.ipHash) {
      const shared = ipFrequency.get(row.ipHash) ?? 0;
      if (shared > 1) {
        indicators.push(`Shared network hash ×${shared}`);
      }
      const lastSeen = recentByIp.get(row.ipHash);
      const time = new Date(row.castAt).getTime();
      if (lastSeen !== undefined && time - lastSeen < 120_000) {
        indicators.push("Rapid successive ballot");
      }
      recentByIp.set(row.ipHash, Math.max(lastSeen ?? 0, time));
    }
    return {
      id: row.id,
      castAt: new Date(row.castAt).toISOString(),
      nomineeName: row.nomineeName,
      categoryName: row.categoryName,
      voterName: row.voterName ?? "Anonymous ballot",
      deviceHint: row.deviceHint ?? "Unknown device",
      ipHash: row.ipHash ?? "",
      indicators,
    };
  });

  const flaggedCount = rows.filter((row) => row.indicators.length > 0).length;

  return (
    <VotesManager
      votes={rows}
      totals={{
        total: totalRow?.value ?? 0,
        uniqueNetworks: ipRow?.value ?? 0,
        uniqueDevices: deviceRow?.value ?? 0,
        flagged: flaggedCount,
      }}
      votingState={settingsRow[0]?.votingState ?? "closed"}
    />
  );
}
