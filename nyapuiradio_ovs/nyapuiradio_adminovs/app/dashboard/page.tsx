import { requireDashboard } from "@/lib/auth/guard";
import { count, desc, eq, gte, inArray } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  adminAuditLog,
  awardCategories,
  eventSettings,
  nominees,
  users,
  votes,
  voters,
} from "@/lib/db/schema";
import { Badge, Card, PageHeader, ProgressBar, StatCard } from "./_components/ui";
import {
  CategoryVotesChart,
  TurnoutDonut,
  VotesOverTimeChart,
} from "./_components/charts";

export const instant = false;

function VotersIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
      <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3Zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3Zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5C15 14.17 10.33 13 8 13Zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5Z" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
      <path d="m12 2 2.4 4.86 5.36.78-3.88 3.78.92 5.34L12 14.24l-4.8 2.52.92-5.34-3.88-3.78 5.36-.78L12 2Z" />
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

function sameLocalDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export default async function OverviewPage() {
  await requireDashboard("overview");
  const [
    [adminCount],
    [totalVotesRow],
    [verifiedRow],
    [totalVotersRow],
    [nomineeCountRow],
    categoryRows,
    settingsRow,
  ] = await Promise.all([
    db.select({ value: count() }).from(users),
    db.select({ value: count() }).from(votes),
    db
      .select({ value: count() })
      .from(voters)
      .where(eq(voters.status, "verified")),
    db.select({ value: count() }).from(voters),
    db.select({ value: count() }).from(nominees),
    db
      .select({
        id: awardCategories.id,
        name: awardCategories.name,
        status: awardCategories.status,
      })
      .from(awardCategories)
      .orderBy(awardCategories.name),
    db
      .select({ votingState: eventSettings.votingState })
      .from(eventSettings)
      .where(eq(eventSettings.id, "main"))
      .limit(1),
  ]);

  const totalVotes = totalVotesRow?.value ?? 0;
  const verifiedVoters = verifiedRow?.value ?? 0;
  const categoryIds = categoryRows.map((c) => c.id);

  const categoryVoteRows =
    categoryIds.length > 0
      ? await db
          .select({
            categoryId: nominees.categoryId,
            votes: count(),
          })
          .from(votes)
          .innerJoin(nominees, eq(votes.nomineeId, nominees.id))
          .where(inArray(nominees.categoryId, categoryIds))
          .groupBy(nominees.categoryId)
      : [];
  const votesByCategory = new Map<string, number>(
    categoryVoteRows.map((row) => [row.categoryId, row.votes]),
  );

  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 6);
  weekAgo.setHours(0, 0, 0, 0);
  const recentVoteTimes =
    totalVotes > 0
      ? await db
          .select({ castAt: votes.castAt })
          .from(votes)
          .where(gte(votes.castAt, weekAgo))
      : [];

  const days: { day: string; votes: number }[] = [];
  const today = new Date();
  for (let i = 6; i >= 0; i -= 1) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const label = date.toLocaleDateString("en", {
      month: "short",
      day: "numeric",
    });
    const dayVotes = recentVoteTimes.filter((row) =>
      sameLocalDay(new Date(row.castAt), date),
    ).length;
    days.push({ day: label, votes: dayVotes });
  }

  const todayVotes = days[days.length - 1]?.votes ?? 0;
  const yesterdayVotes = days[days.length - 2]?.votes ?? 0;
  const change =
    yesterdayVotes > 0
      ? Math.round(((todayVotes - yesterdayVotes) / yesterdayVotes) * 100)
      : todayVotes > 0
        ? 100
        : 0;

  const votedVoterIds =
    totalVotes > 0
      ? await db.selectDistinct({ voterId: votes.voterId }).from(votes)
      : [];
  const turnout =
    verifiedVoters > 0
      ? Math.round((votedVoterIds.length / verifiedVoters) * 100)
      : 0;

  const recentActivity =
    totalVotes > 0
      ? await db
          .select({
            castAt: votes.castAt,
            nominee: nominees.name,
            category: awardCategories.name,
          })
          .from(votes)
          .innerJoin(nominees, eq(votes.nomineeId, nominees.id))
          .innerJoin(
            awardCategories,
            eq(nominees.categoryId, awardCategories.id),
          )
          .orderBy(desc(votes.castAt))
          .limit(6)
      : [];

  const recentAdminActions = await db
    .select({
      id: adminAuditLog.id,
      adminName: adminAuditLog.adminName,
      action: adminAuditLog.action,
      detail: adminAuditLog.detail,
      createdAt: adminAuditLog.createdAt,
    })
    .from(adminAuditLog)
    .orderBy(desc(adminAuditLog.createdAt))
    .limit(6);

  const categories = categoryRows.map((category) => ({
    id: category.id,
    name: category.name,
    status: category.status,
    votes: votesByCategory.get(category.id) ?? 0,
  }));

  const topCategories = [...categories]
    .sort((a, b) => b.votes - a.votes)
    .slice(0, 5);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Overview"
        subtitle="Live snapshot of the Nyapui Radio awards voting season."
        action={
          settingsRow[0]?.votingState === "open" ? (
            <Badge tone="live">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-red-500" />
              </span>
              Voting open
            </Badge>
          ) : settingsRow[0]?.votingState === "paused" ? (
            <Badge tone="warn">Voting paused</Badge>
          ) : (
            <Badge tone="closed">Voting closed</Badge>
          )
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Votes Cast"
          value={totalVotes.toLocaleString()}
          hint={`+${change}% since yesterday`}
          icon={<BallotIcon />}
          delay={60}
        />
        <StatCard
          label="Verified Voters"
          value={verifiedVoters.toLocaleString()}
          hint={`${adminCount?.value ?? 0} admin accounts`}
          icon={<VotersIcon />}
          delay={120}
          tone="gold"
        />
        <StatCard
          label="Award Categories"
          value={String(categories.length)}
          hint={`${categories.filter((c) => c.status === "open").length} accepting votes`}
          icon={<StarIcon />}
          delay={180}
        />
        <StatCard
          label="Nominees"
          value={String(nomineeCountRow?.value ?? 0)}
          hint={`Of ${totalVotersRow?.value ?? 0} registered voters`}
          icon={<PeopleIcon />}
          delay={240}
          tone="gold"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2" delay={300}>
          <div className="mb-4 flex items-center justify-between gap-2">
            <div>
              <h2 className="font-display text-base font-semibold text-blue-950">
                Votes over time
              </h2>
              <p className="text-xs text-zinc-500">Last 7 days</p>
            </div>
            <Badge tone="blue">+{todayVotes.toLocaleString()} today</Badge>
          </div>
          <VotesOverTimeChart data={days} />
        </Card>

        <Card delay={380}>
          <div className="mb-2">
            <h2 className="font-display text-base font-semibold text-blue-950">
              Voter turnout
            </h2>
            <p className="text-xs text-zinc-500">Verified voters who cast a vote</p>
          </div>
          <TurnoutDonut turnout={turnout} />
          <div className="mt-2 flex items-center justify-center gap-4 text-xs text-zinc-500">
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-blue-900" /> Voted
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-zinc-200" /> Remaining
            </span>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2" delay={440}>
          <div className="mb-4">
            <h2 className="font-display text-base font-semibold text-blue-950">
              Votes by category
            </h2>
            <p className="text-xs text-zinc-500">Totals across the season</p>
          </div>
          <CategoryVotesChart
            data={categories.map((c) => ({ name: c.name, votes: c.votes }))}
          />
        </Card>

        <Card delay={500}>
          <div className="mb-4">
            <h2 className="font-display text-base font-semibold text-blue-950">
              Recent activity
            </h2>
            <p className="text-xs text-zinc-500">Latest ballots cast</p>
          </div>
          {recentActivity.length === 0 ? (
            <p className="py-8 text-center text-sm text-zinc-500">
              No ballots cast yet.
            </p>
          ) : (
            <ul className="flex flex-col gap-4">
              {recentActivity.map((item, index) => (
                <li
                  key={`${item.castAt.getTime()}-${index}`}
                  className="animate-fade-in-up flex items-start gap-3"
                  style={{ animationDelay: `${520 + index * 70}ms` }}
                >
                  <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-amber-400 shadow-[0_0_0_3px_rgba(251,191,36,0.25)]" />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-blue-950">
                      {item.nominee} — {item.category}
                    </p>
                    <p className="text-xs text-zinc-400">
                      {new Date(item.castAt).toLocaleString()}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <Card delay={540}>
        <div className="mb-4">
          <h2 className="font-display text-base font-semibold text-blue-950">
            Admin activity
          </h2>
          <p className="text-xs text-zinc-500">
            Every settings, category, nominee, voter and voting-state change is
            logged
          </p>
        </div>
        {recentAdminActions.length === 0 ? (
          <p className="py-6 text-center text-sm text-zinc-500">
            No admin actions recorded yet.
          </p>
        ) : (
          <ul className="flex flex-col gap-3">
            {recentAdminActions.map((entry, index) => (
              <li
                key={entry.id}
                className="animate-fade-in-up flex items-start justify-between gap-3 rounded-xl border border-blue-50 bg-slate-50/60 px-3 py-2.5"
                style={{ animationDelay: `${560 + index * 60}ms` }}
              >
                <div className="min-w-0">
                  <p className="truncate text-sm text-blue-950">
                    {entry.detail ?? entry.action}
                  </p>
                  <p className="text-xs text-zinc-400">
                    {entry.adminName ?? "Unknown admin"} ·{" "}
                    <code className="rounded bg-blue-50 px-1 text-[11px] text-blue-700">
                      {entry.action}
                    </code>
                  </p>
                </div>
                <span className="shrink-0 text-xs text-zinc-400">
                  {new Date(entry.createdAt).toLocaleDateString()}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Card delay={560}>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="font-display text-base font-semibold text-blue-950">
              Category progress
            </h2>
            <p className="text-xs text-zinc-500">Vote share of the busiest categories</p>
          </div>
        </div>
        {topCategories.length === 0 ? (
          <p className="py-6 text-center text-sm text-zinc-500">
            No categories created yet.
          </p>
        ) : (
          <ul className="flex flex-col gap-4">
            {topCategories.map((category, index) => {
              const max = topCategories[0]?.votes || 1;
              const share = Math.round((category.votes / max) * 100);
              return (
                <li
                  key={category.id}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${580 + index * 70}ms` }}
                >
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <span className="font-medium text-blue-950">{category.name}</span>
                    <span className="flex items-center gap-2 text-zinc-500">
                      <span className="hidden sm:inline">
                        {category.votes.toLocaleString()} votes
                      </span>
                      <Badge tone={category.status}>{category.status}</Badge>
                    </span>
                  </div>
                  <ProgressBar
                    value={share}
                    tone={index % 2 === 0 ? "blue" : "gold"}
                  />
                </li>
              );
            })}
          </ul>
        )}
      </Card>
    </div>
  );
}
