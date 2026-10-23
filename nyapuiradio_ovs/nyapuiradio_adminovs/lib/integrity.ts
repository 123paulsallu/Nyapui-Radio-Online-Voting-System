import { and, count, eq, gt, isNull, like, lt, sql } from "drizzle-orm";
import { db } from "./db/index";
import {
  awardCategories,
  eventSettings,
  nominees,
  votes,
  voters,
} from "./db/schema";
import type {
  IntegrityCheck,
  IntegrityReport,
  IntegrityStatus,
} from "./dashboard/types";

const SETTINGS_ID = "main";

const EXPECTED_CHECK_CONSTRAINTS = [
  "award_categories_sort_order_check",
  "award_categories_status_check",
  "event_settings_accent_color_check",
  "event_settings_category_layout_check",
  "event_settings_primary_color_check",
  "event_settings_results_policy_check",
  "event_settings_schedule_check",
  "event_settings_voting_state_check",
  "nominees_status_check",
  "voters_status_check",
];

interface CheckOutcome {
  status: IntegrityStatus;
  detail: string;
  suggestion?: string;
}

async function guard(
  id: string,
  label: string,
  fn: () => Promise<CheckOutcome>,
): Promise<IntegrityCheck> {
  try {
    const outcome = await fn();
    return { id, label, ...outcome };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : String(error).slice(0, 200);
    return {
      id,
      label,
      status: "error",
      detail: `Check failed to run: ${message.slice(0, 200)}`,
      suggestion: "Check database connectivity and try again.",
    };
  }
}

function verdict(
  affected: number,
  zeroDetail: string,
  problemDetail: (n: number) => string,
  suggestion: string,
  failStatus: IntegrityStatus = "error",
): CheckOutcome {
  if (affected === 0) return { status: "ok", detail: zeroDetail };
  return { status: failStatus, detail: problemDetail(affected), suggestion };
}

export async function runIntegrityChecks(): Promise<IntegrityReport> {
  const [settingsRow] = await db
    .select()
    .from(eventSettings)
    .where(eq(eventSettings.id, SETTINGS_ID))
    .limit(1);
  const settings = settingsRow ?? null;

  const checks = await Promise.all([
    guard("settings-exists", "Event settings row exists", async () =>
      settings
        ? { status: "ok", detail: 'Settings row "main" is present.' }
        : {
            status: "error",
            detail: 'Settings row "main" is missing.',
            suggestion: "Run npm run db:seed to restore settings.",
          },
    ),

    guard("db-constraints", "Database CHECK constraints enabled", async () => {
      const result: unknown = await db.execute(
        sql`select conname from pg_constraint where contype = 'c'`,
      );
      const rows = Array.isArray(result)
        ? (result as { conname?: string }[])
        : ((result as { rows?: { conname?: string }[] }).rows ?? []);
      const present = new Set(
        rows.map((row) => row.conname).filter((name): name is string => !!name),
      );
      const missing = EXPECTED_CHECK_CONSTRAINTS.filter(
        (name) => !present.has(name),
      );
      return missing.length === 0
        ? {
            status: "ok",
            detail: `All ${EXPECTED_CHECK_CONSTRAINTS.length} CHECK constraints are active.`,
          }
        : {
            status: "error",
            detail: `Missing constraints: ${missing.join(", ")}.`,
            suggestion: "Run npm run db:push to apply schema constraints.",
          };
    }),

    guard("settings-schedule", "Voting schedule is coherent", async () => {
      if (!settings || !settings.opensAt || !settings.closesAt) {
        return {
          status: "ok",
          detail: "Schedule is open-ended or fully configured.",
        };
      }
      return new Date(settings.opensAt) < new Date(settings.closesAt)
        ? { status: "ok", detail: "Voting opens before it closes." }
        : {
            status: "error",
            detail: "opensAt is not before closesAt.",
            suggestion: "Fix the schedule in Event Settings.",
          };
    }),

    guard("orphan-votes-nominee", "Votes reference existing nominees", async () => {
      const [row] = await db
        .select({ n: count() })
        .from(votes)
        .leftJoin(nominees, eq(votes.nomineeId, nominees.id))
        .where(isNull(nominees.id));
      return verdict(
        row?.n ?? 0,
        "No votes point at deleted nominees.",
        (n) => `${n} vote(s) reference a missing nominee.`,
        "Restore the missing nominees or delete the orphaned votes.",
      );
    }),

    guard("orphan-votes-voter", "Votes reference existing ballots", async () => {
      const [row] = await db
        .select({ n: count() })
        .from(votes)
        .leftJoin(voters, eq(votes.voterId, voters.id))
        .where(isNull(voters.id));
      return verdict(
        row?.n ?? 0,
        "No votes point at deleted ballots.",
        (n) => `${n} vote(s) reference a missing ballot/voter.`,
        "Restore the missing ballots or delete the orphaned votes.",
      );
    }),

    guard("orphan-nominees", "Nominees belong to a category", async () => {
      const [row] = await db
        .select({ n: count() })
        .from(nominees)
        .leftJoin(awardCategories, eq(nominees.categoryId, awardCategories.id))
        .where(isNull(awardCategories.id));
      return verdict(
        row?.n ?? 0,
        "Every nominee belongs to an existing category.",
        (n) => `${n} nominee(s) reference a missing category.`,
        "Restore the missing categories or reassign the nominees.",
      );
    }),

    guard("duplicate-ballots", "One vote per category per ballot", async () => {
      const rows = await db
        .select({ voterId: votes.voterId, categoryId: nominees.categoryId, n: count() })
        .from(votes)
        .innerJoin(nominees, eq(votes.nomineeId, nominees.id))
        .groupBy(votes.voterId, nominees.categoryId)
        .having(sql`count(*) > 1`);
      if (rows.length === 0) {
        return {
          status: "ok",
          detail: "No ballot voted twice in the same category.",
        };
      }
      const enforced = settings?.oneVotePerCategory ?? true;
      return {
        status: enforced ? "error" : "warn",
        detail: `${rows.length} ballot/category pair(s) hold multiple votes while the one-vote rule is ${enforced ? "on" : "off"}.`,
        suggestion: enforced
          ? "Remove the duplicate votes or turn off the one-vote-per-category rule."
          : "Expected while the one-vote-per-category rule is off.",
      };
    }),

    guard("votes-draft-category", "No votes in draft categories", async () => {
      const [row] = await db
        .select({ n: count() })
        .from(votes)
        .innerJoin(nominees, eq(votes.nomineeId, nominees.id))
        .innerJoin(
          awardCategories,
          eq(nominees.categoryId, awardCategories.id),
        )
        .where(eq(awardCategories.status, "draft"));
      return verdict(
        row?.n ?? 0,
        "Draft categories hold no votes.",
        (n) => `${n} vote(s) sit in a category that is still a draft.`,
        "Open the category or move its votes.",
      );
    }),

    guard("votes-blocked-voter", "Blocked voters have no votes", async () => {
      const [row] = await db
        .select({ n: count() })
        .from(votes)
        .innerJoin(voters, eq(votes.voterId, voters.id))
        .where(
          and(eq(voters.status, "blocked"), sql`${voters.email} not like 'ballot:%'`),
        );
      return verdict(
        row?.n ?? 0,
        "No registered blocked voter has cast a vote.",
        (n) => `${n} vote(s) come from a blocked registered voter.`,
        "Review and remove those votes if they were cast after the block.",
      );
    }),

    guard("votes-pending-voter", "Pending voters have no votes", async () => {
      const [row] = await db
        .select({ n: count() })
        .from(votes)
        .innerJoin(voters, eq(votes.voterId, voters.id))
        .where(
          and(eq(voters.status, "pending"), sql`${voters.email} not like 'ballot:%'`),
        );
      return verdict(
        row?.n ?? 0,
        "No unverified registered voter has cast a vote.",
        (n) => `${n} vote(s) come from a pending registered voter.`,
        "Verify or block those voters, then review their votes.",
        "warn",
      );
    }),

    guard("votes-withdrawn-nominee", "Withdrawn nominees keep vote history", async () => {
      const [row] = await db
        .select({ n: count() })
        .from(votes)
        .innerJoin(nominees, eq(votes.nomineeId, nominees.id))
        .where(eq(nominees.status, "withdrawn"));
      return verdict(
        row?.n ?? 0,
        "No votes are attached to withdrawn nominees.",
        (n) => `${n} historical vote(s) belong to withdrawn nominee(s) — kept on purpose.`,
        "No action needed; withdrawing keeps existing votes for the audit trail.",
        "ok",
      );
    }),

    guard("votes-outside-schedule", "Votes fall inside the voting window", async () => {
      if (!settings || (!settings.opensAt && !settings.closesAt)) {
        return {
          status: "ok",
          detail: "No voting window configured to check against.",
        };
      }
      let outside = 0;
      if (settings.opensAt) {
        const [row] = await db
          .select({ n: count() })
          .from(votes)
          .where(lt(votes.castAt, settings.opensAt));
        outside += row?.n ?? 0;
      }
      if (settings.closesAt) {
        const [row] = await db
          .select({ n: count() })
          .from(votes)
          .where(gt(votes.castAt, settings.closesAt));
        outside += row?.n ?? 0;
      }
      return verdict(
        outside,
        "Every vote is inside the configured schedule.",
        (n) => `${n} vote(s) were cast outside opensAt/closesAt.`,
        "Confirm whether the schedule or the vote timestamps are wrong.",
        "warn",
      );
    }),

    guard(
      "open-category-nominees",
      "Open categories have active nominees",
      async () => {
        const [row] = await db
          .select({ n: count() })
          .from(awardCategories)
          .where(
            and(
              eq(awardCategories.status, "open"),
              sql`not exists (select 1 from nominees n where n.category_id = ${awardCategories.id} and n.status = 'active')`,
            ),
          );
        return verdict(
          row?.n ?? 0,
          "Every open category has at least one active nominee.",
          (n) => `${n} open category/categories have no active nominee to vote for.`,
          "Add nominees or close those categories.",
          "warn",
        );
      },
    ),

    guard("open-while-closed", "Category states match the voting state", async () => {
      if (!settings || settings.votingState !== "closed") {
        return {
          status: "ok",
          detail: "Voting state and category states are aligned.",
        };
      }
      const [row] = await db
        .select({ n: count() })
        .from(awardCategories)
        .where(eq(awardCategories.status, "open"));
      return verdict(
        row?.n ?? 0,
        "No category is left open while voting is closed.",
        (n) => `${n} categor(y/ies) are still "open" while voting is closed.`,
        "Close them or reopen voting from Voting Control.",
        "warn",
      );
    }),

    guard("duplicate-sort-order", "Category sort order is unique", async () => {
      const rows = await db
        .select({ sortOrder: awardCategories.sortOrder, n: count() })
        .from(awardCategories)
        .groupBy(awardCategories.sortOrder)
        .having(sql`count(*) > 1`);
      return verdict(
        rows.length,
        "Every category has a distinct sort order.",
        (n) => `${n} sort-order value(s) are shared by multiple categories.`,
        "Reorder categories once to normalize sort_order.",
        "warn",
      );
    }),

    guard("duplicate-nominee-names", "Nominee names are unique per category", async () => {
      const rows = await db
        .select({ name: nominees.name, n: count() })
        .from(nominees)
        .groupBy(nominees.categoryId, nominees.name)
        .having(sql`count(*) > 1`);
      return verdict(
        rows.length,
        "No duplicate nominee names inside a category.",
        (n) => `${n} name(s) appear more than once in the same category.`,
        "Rename or merge the duplicates.",
        "warn",
      );
    }),

    guard("empty-ballots", "Ballots without votes are cleaned up", async () => {
      const [row] = await db
        .select({ n: count() })
        .from(voters)
        .leftJoin(votes, eq(votes.voterId, voters.id))
        .where(and(like(voters.email, "ballot:%"), isNull(votes.id)));
      return verdict(
        row?.n ?? 0,
        "No abandoned ballots remain.",
        (n) => `${n} ballot voter(s) exist without any vote (abandoned sessions).`,
        "Safe to delete; new visitors will get fresh ballots.",
        "warn",
      );
    }),
  ]);

  const counts = { ok: 0, warn: 0, error: 0 };
  for (const check of checks) counts[check.status] += 1;

  return {
    checkedAt: new Date().toISOString(),
    checks,
    counts,
  };
}
