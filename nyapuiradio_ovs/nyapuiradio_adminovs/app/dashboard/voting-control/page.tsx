import { requireDashboard } from "@/lib/auth/guard";
import { asc, count, eq, inArray } from "drizzle-orm";
import { db } from "@/lib/db";
import { awardCategories, eventSettings, nominees, votes } from "@/lib/db/schema";
import type {
  ControlCategoryDTO,
  VotingControlDTO,
} from "@/lib/dashboard/types";
import { VotingControlManager } from "../_components/voting-control-manager";

export const instant = false;

const DEFAULT_CONTROL: VotingControlDTO = {
  votingState: "closed",
  anonymous: true,
  oneVotePerCategory: true,
  resultsLive: false,
  opensAt: null,
  closesAt: null,
};

export default async function VotingControlPage() {
  await requireDashboard("voting-control");
  const [settingsRow, categoryRows] = await Promise.all([
    db.select().from(eventSettings).where(eq(eventSettings.id, "main")).limit(1),
    db
      .select({
        id: awardCategories.id,
        name: awardCategories.name,
        status: awardCategories.status,
      })
      .from(awardCategories)
      .orderBy(asc(awardCategories.sortOrder), asc(awardCategories.name)),
  ]);

  const categoryIds = categoryRows.map((row) => row.id);

  const voteCounts =
    categoryIds.length > 0
      ? await db
          .select({ categoryId: nominees.categoryId, value: count() })
          .from(votes)
          .innerJoin(nominees, eq(votes.nomineeId, nominees.id))
          .where(inArray(nominees.categoryId, categoryIds))
          .groupBy(nominees.categoryId)
      : [];
  const voteMap = new Map(voteCounts.map((row) => [row.categoryId, row.value]));

  const settings = settingsRow[0];

  const control: VotingControlDTO = settings
    ? {
        votingState: settings.votingState,
        anonymous: settings.anonymous,
        oneVotePerCategory: settings.oneVotePerCategory,
        resultsLive: settings.resultsLive,
        opensAt: settings.opensAt
          ? new Date(settings.opensAt).toISOString()
          : null,
        closesAt: settings.closesAt
          ? new Date(settings.closesAt).toISOString()
          : null,
      }
    : DEFAULT_CONTROL;

  const categories: ControlCategoryDTO[] = categoryRows.map((row) => ({
    ...row,
    voteCount: voteMap.get(row.id) ?? 0,
  }));

  return <VotingControlManager control={control} categories={categories} />;
}
