import { requireDashboard } from "@/lib/auth/guard";
import { db } from "@/lib/db";
import { voters, votes } from "@/lib/db/schema";
import type { VoterDTO } from "@/lib/dashboard/types";
import { VotersManager } from "../_components/voters-manager";

export const instant = false;

export default async function VotersPage() {
  await requireDashboard("voters");
  const [voterRows, voteRows] = await Promise.all([
    db.select().from(voters).orderBy(voters.joinedAt),
    db.selectDistinct({ voterId: votes.voterId }).from(votes),
  ]);

  const votedSet = new Set(voteRows.map((row) => row.voterId));

  const data: VoterDTO[] = voterRows.map((row) => ({
    id: row.id,
    name: row.name,
    email: row.email,
    status: row.status,
    joinedAt: new Date(row.joinedAt).toLocaleDateString(),
    hasVoted: votedSet.has(row.id),
  }));

  return <VotersManager voters={data} />;
}
