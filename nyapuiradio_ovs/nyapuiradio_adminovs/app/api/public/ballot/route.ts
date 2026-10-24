import { eq } from "drizzle-orm";
import { connection } from "next/server";
import { db } from "@/lib/db";
import { nominees, votes, voters } from "@/lib/db/schema";
import { isUuid } from "@/lib/validation/resource";

const NO_STORE = { "Cache-Control": "no-store" };
const BALLOT_COOKIE = "ovs_ballot";
const ANONYMOUS_EMAIL_SUFFIX = "@ballot.nyapui.vote";

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

export async function GET(request: Request): Promise<Response> {
  await connection();

  const ballotId = readBallotId(request);
  if (!ballotId) {
    return Response.json({ votedCategoryIds: [] }, { headers: NO_STORE });
  }

  const [ballotVoter] = await db
    .select({ id: voters.id })
    .from(voters)
    .where(eq(voters.email, `ballot:${ballotId}${ANONYMOUS_EMAIL_SUFFIX}`))
    .limit(1);
  if (!ballotVoter) {
    return Response.json({ votedCategoryIds: [] }, { headers: NO_STORE });
  }

  const rows = await db
    .select({ categoryId: nominees.categoryId })
    .from(votes)
    .innerJoin(nominees, eq(votes.nomineeId, nominees.id))
    .where(eq(votes.voterId, ballotVoter.id));

  return Response.json(
    { votedCategoryIds: [...new Set(rows.map((row) => row.categoryId))] },
    { headers: NO_STORE },
  );
}
