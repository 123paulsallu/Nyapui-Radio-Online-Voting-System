import { requireDashboard } from "@/lib/auth/guard";
import { count, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  awardCategories,
  eventSettings,
  nominees,
  votes,
  voters,
} from "@/lib/db/schema";
import {
  Badge,
  Card,
  PageHeader,
  StatCard,
} from "../_components/ui";
import { HorizontalResultsChart, TurnoutDonut } from "../_components/charts";
import { ExportButtons } from "../_components/export-buttons";
import { ResultsReleaseToggle } from "../_components/results-release-toggle";
import { StandingsTable } from "../_components/standings-table";

export const instant = false;

function TrophyIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
      <path d="M19 4h-2V2H7v2H5a2 2 0 0 0-2 2v2a4 4 0 0 0 3.2 3.9A6 6 0 0 0 11 14.9V18H7v2h10v-2h-4v-3.1a6 6 0 0 0 4.8-3A4 4 0 0 0 21 8V6a2 2 0 0 0-2-2ZM5 8V6h2v3.8A2 2 0 0 1 5 8Zm14 0a2 2 0 0 1-2 2V6h2v2Z" />
    </svg>
  );
}

function BallotIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
      <path d="M18 12h-1.5V6.5A4.5 4.5 0 0 0 12 2a4.5 4.5 0 0 0-4.5 4.5V12H6a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2Zm-6 7-4-4 1.41-1.41L11 16.17l5.59-5.58L18 12l-6 7Z" />
    </svg>
  );
}

function PeopleIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
      <path d="M12 6c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2Zm0 10c2.67 0 8 1.34 8 4v2H4v-2c0-2.66 5.33-4 8-4Zm-7-4V8a5 5 0 0 1 10 0v4H5Z" />
    </svg>
  );
}

const medalBadge = [
  "bg-amber-400 text-blue-950",
  "bg-zinc-300 text-zinc-800",
  "bg-amber-700 text-white",
];

export default async function ResultsPage() {
  await requireDashboard("results");
  const [
    categoryRows,
    nomineeRows,
    [totalVotesRow],
    [verifiedRow],
    [totalVotersRow],
    votedVoterRows,
    settingsRow,
  ] = await Promise.all([
    db.select().from(awardCategories).orderBy(awardCategories.name),
    db
      .select({
        id: nominees.id,
        name: nominees.name,
        department: nominees.department,
        status: nominees.status,
        categoryId: nominees.categoryId,
        categoryName: awardCategories.name,
        categoryStatus: awardCategories.status,
      })
      .from(nominees)
      .innerJoin(
        awardCategories,
        eq(nominees.categoryId, awardCategories.id),
      ),
    db.select({ value: count() }).from(votes),
    db
      .select({ value: count() })
      .from(voters)
      .where(eq(voters.status, "verified")),
    db.select({ value: count() }).from(voters),
    db.selectDistinct({ voterId: votes.voterId }).from(votes),
    db.select().from(eventSettings).where(eq(eventSettings.id, "main")).limit(1),
  ]);

  const totalVotes = totalVotesRow?.value ?? 0;
  const verifiedVoters = verifiedRow?.value ?? 0;
  const turnout =
    verifiedVoters > 0
      ? Math.round((votedVoterRows.length / verifiedVoters) * 100)
      : 0;

  const nomineeIds = nomineeRows.map((row) => row.id);
  const voteCounts =
    nomineeIds.length > 0
      ? await db
          .select({ nomineeId: votes.nomineeId, value: count() })
          .from(votes)
          .groupBy(votes.nomineeId)
      : [];
  const voteMap = new Map(
    voteCounts.map((row) => [row.nomineeId, row.value]),
  );

  const withVotes = nomineeRows.map((row) => ({
    ...row,
    votes: voteMap.get(row.id) ?? 0,
  }));

  const overallTop = [...withVotes]
    .sort((a, b) => b.votes - a.votes)
    .slice(0, 6);

  const byCategory = new Map<string, typeof withVotes>();
  for (const nominee of withVotes) {
    const list = byCategory.get(nominee.categoryId) ?? [];
    list.push(nominee);
    byCategory.set(nominee.categoryId, list);
  }

  const leadersByCategory = categoryRows.map((category) => {
    const list = [...(byCategory.get(category.id) ?? [])].sort(
      (a, b) => b.votes - a.votes,
    );
    return { category, leader: list[0], runnerUp: list[1] };
  });

  const categoryTotals = categoryRows.map((category) => ({
    id: category.id,
    name: category.name,
    status: category.status,
    votes: (byCategory.get(category.id) ?? []).reduce(
      (sum, n) => sum + n.votes,
      0,
    ),
  }));

  const settings = settingsRow[0];
  const resultsReleased = settings?.resultsReleased ?? false;
  const resultsVisible =
    settings?.resultsPolicy === "manual"
      ? resultsReleased
      : settings?.resultsPolicy === "close"
        ? resultsReleased || settings?.votingState === "closed"
        : true;

  const standings = withVotes.map((row) => ({
    id: row.id,
    name: row.name,
    department: row.department,
    categoryId: row.categoryId,
    categoryName: row.categoryName,
    categoryStatus: row.categoryStatus,
    status: row.status,
    votes: row.votes,
  }));

  const brand = {
    eventName: settings?.eventName ?? "Nyapui Radio Awards",
    tagline: settings?.tagline ?? null,
    primaryColor: settings?.primaryColor ?? null,
    accentColor: settings?.accentColor ?? null,
    logoUrl: settings?.logoUrl ?? null,
  };

  const summary = {
    totalVotes,
    totalCategories: categoryRows.length,
    turnout,
    visibility: resultsVisible ? "Visible to public" : "Hidden from public",
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Results & Reports"
        subtitle="Live standings, category winners and exportable reports."
        action={
          <div className="flex flex-col items-end gap-2 sm:items-end">
            <ExportButtons
              totals={categoryTotals.map((c) => ({
                category: c.name,
                status: c.status,
                votes: c.votes,
              }))}
              leaders={leadersByCategory.map((entry) => ({
                category: entry.category.name,
                leader: entry.leader?.name ?? "—",
                leaderVotes: entry.leader?.votes ?? 0,
              }))}
            />
            <div className="flex items-center gap-2">
              <Badge tone={resultsVisible ? "live" : "closed"}>
                {resultsVisible ? "Visible to public" : "Hidden from public"}
              </Badge>
              <ResultsReleaseToggle released={resultsReleased} />
            </div>
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Votes" value={totalVotes.toLocaleString()} hint="All categories" icon={<BallotIcon />} delay={60} />
        <StatCard label="Categories" value={String(categoryRows.length)} hint={`${categoryRows.filter((c) => c.status === "open").length} still open`} icon={<TrophyIcon />} delay={120} tone="gold" />
        <StatCard label="Leading Nominee" value={overallTop[0]?.name ?? "—"} hint={`${overallTop[0]?.votes.toLocaleString() ?? 0} votes`} icon={<PeopleIcon />} delay={180} />
        <StatCard label="Turnout" value={`${turnout}%`} hint={`${totalVotersRow?.value ?? 0} registered voters`} icon={<BallotIcon />} delay={240} tone="gold" />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2" delay={300}>
          <div className="mb-4">
            <h2 className="font-display text-base font-semibold text-blue-950">
              Top nominees overall
            </h2>
            <p className="text-xs text-zinc-500">Gold, silver and bronze lead the pack</p>
          </div>
          <HorizontalResultsChart
            data={overallTop.map((n, index) => ({
              name: n.name,
              votes: n.votes,
              rank: index,
            }))}
          />
        </Card>

        <Card delay={380}>
          <div className="mb-2">
            <h2 className="font-display text-base font-semibold text-blue-950">
              Voter turnout
            </h2>
            <p className="text-xs text-zinc-500">Participation so far</p>
          </div>
          <TurnoutDonut turnout={turnout} />
        </Card>
      </div>

      <StandingsTable
        rows={standings}
        categories={categoryRows.map((category) => ({
          id: category.id,
          name: category.name,
        }))}
        brand={brand}
        summary={summary}
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {leadersByCategory.map(({ category, leader, runnerUp }, index) => {
          const total = (byCategory.get(category.id) ?? []).reduce(
            (sum, n) => sum + n.votes,
            0,
          );
          const leaderShare =
            leader && total > 0 ? Math.round((leader.votes / total) * 100) : 0;
          const runnerShare =
            runnerUp && total > 0
              ? Math.round((runnerUp.votes / total) * 100)
              : 0;
          return (
            <Card key={category.id} delay={420 + index * 70}>
              <div className="flex items-center justify-between gap-2">
                <h2 className="truncate font-display text-base font-semibold text-blue-950">
                  {category.name}
                </h2>
                <Badge tone={category.status}>{category.status}</Badge>
              </div>

              {leader ? (
                <>
                  <div className="mt-4 flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50/70 p-3 transition-transform duration-200 hover:scale-[1.01]">
                    <span className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold ${medalBadge[0]}`}>
                      1
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-blue-950">
                        {leader.name}
                      </p>
                      <p className="text-xs text-zinc-500">
                        {leader.votes.toLocaleString()} votes
                      </p>
                    </div>
                    <span className="font-display text-lg font-semibold text-amber-600">
                      {leaderShare}%
                    </span>
                  </div>
                  {runnerUp && (
                    <div className="mt-2 flex items-center gap-3 rounded-xl bg-slate-50 p-3">
                      <span className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold ${medalBadge[1]}`}>
                        2
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-blue-950">
                          {runnerUp.name}
                        </p>
                        <p className="text-xs text-zinc-500">
                          {runnerUp.votes.toLocaleString()} votes
                        </p>
                      </div>
                      <span className="text-sm font-medium text-zinc-500">
                        {runnerShare}%
                      </span>
                    </div>
                  )}
                </>
              ) : (
                <p className="mt-4 text-sm text-zinc-500">No nominees yet.</p>
              )}
            </Card>
          );
        })}
      </div>

      {categoryRows.length === 0 && (
        <Card animate={false} className="py-12 text-center">
          <p className="text-sm text-zinc-500">
            No categories created yet. Results will appear here once voting begins.
          </p>
        </Card>
      )}
    </div>
  );
}
