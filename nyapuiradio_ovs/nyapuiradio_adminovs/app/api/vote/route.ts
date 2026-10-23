import { randomUUID } from "node:crypto";
import { and, eq, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { awardCategories, eventSettings, nominees, voters, votes } from "@/lib/db/schema";
import { isTrustedOrigin } from "@/lib/security/csrf";
import { getClientIp, hashIp, parseDeviceHint } from "@/lib/security/device";
import { isUuid } from "@/lib/validation/resource";

const MAX_BODY_BYTES = 1024;
const BALLOT_COOKIE = "ovs_ballot";
const BALLOT_MAX_AGE_SECONDS = 60 * 60 * 24 * 180;
const ANONYMOUS_EMAIL_SUFFIX = "@ballot.nyapui.vote";

function jsonError(
  status: number,
  message: string,
  headers?: Record<string, string>,
): Response {
  return Response.json(
    { error: message },
    { status, headers: { "Cache-Control": "no-store", ...headers } },
  );
}

function readBallotId(request: Request): string | null {
  const cookie = request.headers.get("cookie");
  if (!cookie) return null;
  for (const part of cookie.split(";")) {
    const [name, ...rest] = part.trim().split("=");
    if (name === BALLOT_COOKIE) {
      const value = rest.join("=");
      return isUuid(value) ? value : null;
    }
  }
  return null;
}

function ballotCookieHeader(ballotId: string): string {
  return `${BALLOT_COOKIE}=${ballotId}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${BALLOT_MAX_AGE_SECONDS}`;
}

async function votedCategoryIds(ballotVoterId: string): Promise<string[]> {
  const rows = await db
    .select({ categoryId: nominees.categoryId })
    .from(votes)
    .innerJoin(nominees, eq(votes.nomineeId, nominees.id))
    .where(eq(votes.voterId, ballotVoterId));
  return [...new Set(rows.map((row) => row.categoryId))];
}

export async function POST(request: Request): Promise<Response> {
  if (!isTrustedOrigin(request)) {
    return jsonError(403, "Forbidden");
  }

  const contentLength = Number(request.headers.get("content-length"));
  if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) {
    return jsonError(413, "Payload too large");
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError(400, "Invalid request body");
  }

  if (typeof body !== "object" || body === null) {
    return jsonError(400, "Invalid request body");
  }
  const { categoryId, nomineeId } = body as Record<string, unknown>;
  if (!isUuid(categoryId) || !isUuid(nomineeId)) {
    return jsonError(400, "Invalid category or nominee");
  }

  const [settings] = await db
    .select()
    .from(eventSettings)
    .where(eq(eventSettings.id, "main"))
    .limit(1);
  if (!settings || settings.votingState !== "open") {
    return jsonError(
      409,
      settings?.votingState === "paused"
        ? "Voting is temporarily paused."
        : "Voting is closed.",
    );
  }

  const now = new Date();
  if (settings.opensAt && now < settings.opensAt) {
    return jsonError(409, "Voting has not opened yet.");
  }
  if (settings.closesAt && now > settings.closesAt) {
    return jsonError(409, "Voting has closed.");
  }

  const [category] = await db
    .select()
    .from(awardCategories)
    .where(eq(awardCategories.id, categoryId))
    .limit(1);
  if (!category) return jsonError(404, "Category not found.");
  if (category.status !== "open") {
    return jsonError(409, "This category is not open for voting.");
  }

  const [nominee] = await db
    .select()
    .from(nominees)
    .where(and(eq(nominees.id, nomineeId), eq(nominees.categoryId, categoryId)))
    .limit(1);
  if (!nominee) return jsonError(404, "Nominee not found in this category.");
  if (nominee.status !== "active") {
    return jsonError(409, "This nominee has been withdrawn.");
  }

  let ballotId = readBallotId(request);
  let freshBallot = false;
  if (!ballotId) {
    ballotId = randomUUID();
    freshBallot = true;
  }

  const ballotEmail = `ballot:${ballotId}${ANONYMOUS_EMAIL_SUFFIX}`;
  let [ballotVoter] = await db
    .select({ id: voters.id })
    .from(voters)
    .where(eq(voters.email, ballotEmail))
    .limit(1);
  if (!ballotVoter) {
    try {
      const [created] = await db
        .insert(voters)
        .values({ name: "Anonymous ballot", email: ballotEmail, status: "verified" })
        .returning({ id: voters.id });
      ballotVoter = created;
    } catch {
      const [raced] = await db
        .select({ id: voters.id })
        .from(voters)
        .where(eq(voters.email, ballotEmail))
        .limit(1);
      if (!raced) return jsonError(500, "Could not prepare ballot.");
      ballotVoter = raced;
    }
  }

  const alreadyVotedInCategory = await db
    .select({ id: votes.id })
    .from(votes)
    .innerJoin(nominees, eq(votes.nomineeId, nominees.id))
    .where(
      and(
        eq(votes.voterId, ballotVoter.id),
        eq(nominees.categoryId, categoryId),
      ),
    )
    .limit(1);
  if (alreadyVotedInCategory.length > 0) {
    if (settings.oneVotePerCategory) {
      return jsonError(409, "This ballot has already voted in this category.");
    }
    const [dup] = await db
      .select({ id: votes.id })
      .from(votes)
      .where(
        and(eq(votes.voterId, ballotVoter.id), eq(votes.nomineeId, nomineeId)),
      )
      .limit(1);
    if (dup) {
      return jsonError(409, "This ballot has already voted for this nominee.");
    }
  }

  const ip = getClientIp(request);
  const userAgent = request.headers.get("user-agent");
  try {
    await db.insert(votes).values({
      voterId: ballotVoter.id,
      nomineeId,
      ipHash: hashIp(ip),
      userAgent: userAgent?.slice(0, 400) ?? null,
      deviceHint: parseDeviceHint(userAgent),
    });
  } catch (error) {
    const raw =
      typeof error === "object" && error !== null && "cause" in error
        ? (error as { cause?: unknown }).cause
        : error;
    const code =
      typeof raw === "object" && raw !== null && "code" in raw
        ? String((raw as { code?: unknown }).code)
        : null;
    if (code === "23505") {
      return jsonError(409, "This ballot has already voted here.");
    }
    console.error("Failed to record vote", error);
    return jsonError(500, "Could not record vote.");
  }

  const [countRow] = await db
    .select({ total: sql<number>`count(*)::int` })
    .from(votes)
    .where(eq(votes.voterId, ballotVoter.id));

  const response = Response.json(
    {
      ok: true,
      votedCategoryIds: await votedCategoryIds(ballotVoter.id),
      totalVotes: countRow?.total ?? 0,
    },
    { headers: { "Cache-Control": "no-store" } },
  );
  if (freshBallot) {
    response.headers.append("Set-Cookie", ballotCookieHeader(ballotId));
  }
  return response;
}
