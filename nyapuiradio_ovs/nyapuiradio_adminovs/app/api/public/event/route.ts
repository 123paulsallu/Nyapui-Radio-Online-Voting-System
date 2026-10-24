import { count, eq, ne, sql } from "drizzle-orm";
import { connection } from "next/server";
import { db } from "@/lib/db";
import { awardCategories, eventSettings, nominees } from "@/lib/db/schema";

const NO_STORE = { "Cache-Control": "no-store" };

export async function GET(): Promise<Response> {
  await connection();

  const [settings] = await db
    .select()
    .from(eventSettings)
    .where(eq(eventSettings.id, "main"))
    .limit(1);
  if (!settings) {
    return Response.json(
      { error: "Event not configured." },
      { status: 404, headers: NO_STORE },
    );
  }

  const now = new Date();
  const resultsVisible =
    settings.resultsPolicy === "live"
      ? true
      : settings.resultsPolicy === "close"
        ? settings.resultsReleased || settings.votingState === "closed"
        : settings.resultsReleased;

  const votingActive =
    settings.votingState === "open" &&
    (!settings.opensAt || now >= settings.opensAt) &&
    (!settings.closesAt || now <= settings.closesAt);

  const [categoryRow, nomineeRow] = await Promise.all([
    db
      .select({ value: count() })
      .from(awardCategories)
      .where(ne(awardCategories.status, "draft")),
    db
      .select({ value: count() })
      .from(nominees)
      .innerJoin(awardCategories, eq(nominees.categoryId, awardCategories.id))
      .where(
        sql`${awardCategories.status} != 'draft' AND ${nominees.status} = 'active'`,
      ),
  ]);

  return Response.json(
    {
      eventName: settings.eventName,
      tagline: settings.tagline,
      description: settings.description,
      contactEmail: settings.contactEmail,
      logoUrl: settings.logoUrl,
      bannerUrl: settings.bannerUrl,
      primaryColor: settings.primaryColor,
      accentColor: settings.accentColor,
      categoryLayout: settings.categoryLayout,
      votingState: settings.votingState,
      opensAt: settings.opensAt?.toISOString() ?? null,
      closesAt: settings.closesAt?.toISOString() ?? null,
      votingActive,
      resultsVisible,
      oneVotePerCategory: settings.oneVotePerCategory,
      anonymous: settings.anonymous,
      stats: {
        categories: categoryRow[0]?.value ?? 0,
        nominees: nomineeRow[0]?.value ?? 0,
      },
    },
    { headers: NO_STORE },
  );
}
