"use client";

import { useMemo, useState } from "react";
import type { VoteDTO } from "@/lib/dashboard/types";
import { Badge, Card, PageHeader, StatCard } from "./ui";
import { inputClass } from "./modal";

function BallotIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
      <path d="M18 12h-1.5V6.5A4.5 4.5 0 0 0 12 2a4.5 4.5 0 0 0-4.5 4.5V12H6a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2Zm-6 7-4-4 1.41-1.41L11 16.17l5.59-5.58L18 12l-6 7Z" />
    </svg>
  );
}

function NetworkIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
      <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm-1 17.93A8 8 0 0 1 4.06 13H7v1a2 2 0 0 0 2 2v3a2 2 0 0 0 2 2ZM17 17v-1h1.07A8 8 0 0 1 13 19.93ZM17 15v-2a2 2 0 0 0-2-2h-1V9h1a4 4 0 0 0-4-4H9V3.93A8 8 0 0 1 20.07 11H19a2 2 0 0 0-2 2Z" />
    </svg>
  );
}

function DeviceIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
      <path d="M4 6h16v10H4V6Zm0 12h16v2H4v-2Z" />
    </svg>
  );
}

function FlagIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
      <path d="M14.4 6 14 4H5v17h2v-7h5.6l.4 2h7V6h-5.6Z" />
    </svg>
  );
}

export function VotesManager({
  votes,
  totals,
  votingState,
}: {
  votes: VoteDTO[];
  totals: {
    total: number;
    uniqueNetworks: number;
    uniqueDevices: number;
    flagged: number;
  };
  votingState: string;
}) {
  const [query, setQuery] = useState("");
  const [onlyFlagged, setOnlyFlagged] = useState(false);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return votes.filter((vote) => {
      if (onlyFlagged && vote.indicators.length === 0) return false;
      if (!needle) return true;
      return (
        vote.nomineeName.toLowerCase().includes(needle) ||
        vote.categoryName.toLowerCase().includes(needle) ||
        vote.voterName.toLowerCase().includes(needle) ||
        vote.deviceHint.toLowerCase().includes(needle)
      );
    });
  }, [votes, query, onlyFlagged]);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Vote Management"
        subtitle="Every ballot cast this season, with device and network signals."
        action={
          <Badge tone={votingState === "open" ? "open" : votingState === "paused" ? "paused" : "closed"}>
            Voting {votingState}
          </Badge>
        }
      />

      <Card
        animate={false}
        className="border-amber-200 bg-amber-50/70"
      >
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
            <FlagIcon />
          </span>
          <div>
            <h2 className="text-sm font-semibold text-amber-800">
              Device signals are indicators, not proof
            </h2>
            <p className="mt-1 text-sm leading-relaxed text-amber-800/90">
              Voting here is anonymous — there is no registration or login, so a
              single person can vote from multiple browsers or networks, and
              people sharing a household, office or mobile network will share
              these signals. Treat shared network hashes, rapid successive
              ballots and device types as <strong>review hints only</strong>;
              never as evidence of fraud or duplicate voting.
            </p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Ballots cast"
          value={totals.total.toLocaleString()}
          hint="Across all categories"
          icon={<BallotIcon />}
          delay={60}
        />
        <StatCard
          label="Unique network hashes"
          value={totals.uniqueNetworks.toLocaleString()}
          hint="Hashed IP signals"
          icon={<NetworkIcon />}
          delay={120}
          tone="gold"
        />
        <StatCard
          label="Unique device types"
          value={totals.uniqueDevices.toLocaleString()}
          hint="Browser/OS combinations"
          icon={<DeviceIcon />}
          delay={180}
        />
        <StatCard
          label="Flagged signals"
          value={totals.flagged.toLocaleString()}
          hint="Ballots worth a manual look"
          icon={<FlagIcon />}
          delay={240}
          tone="gold"
        />
      </div>

      <Card animate={false}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
              className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400"
            >
              <path d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 1 0-.7.7l.27.28v.79l5 4.99L20.49 19l-4.99-5Zm-6 0A4.5 4.5 0 1 1 14 9.5 4.5 4.5 0 0 1 9.5 14Z" />
            </svg>
            <input
              className={`${inputClass} pl-10`}
              placeholder="Search by nominee, category, ballot or device…"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              aria-label="Search votes"
            />
          </div>
          <button
            type="button"
            onClick={() => setOnlyFlagged((prev) => !prev)}
            aria-pressed={onlyFlagged}
            className={`inline-flex h-11 items-center justify-center gap-2 rounded-xl border px-4 text-sm font-medium transition-colors ${
              onlyFlagged
                ? "border-amber-300 bg-amber-50 text-amber-700"
                : "border-blue-200 bg-white text-blue-900 hover:bg-blue-50"
            }`}
          >
            <FlagIcon />
            Flagged only
          </button>
        </div>
      </Card>

      <Card animate={false} className="overflow-x-auto p-0">
        <table className="w-full min-w-[820px] text-left text-sm">
          <thead>
            <tr className="border-b border-blue-100 bg-slate-50/70 text-xs uppercase tracking-wide text-zinc-400">
              <th className="px-4 py-3 font-medium">Cast at</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Nominee</th>
              <th className="px-4 py-3 font-medium">Ballot</th>
              <th className="px-4 py-3 font-medium">Device</th>
              <th className="px-4 py-3 font-medium">Signals</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((vote) => (
              <tr
                key={vote.id}
                className="border-b border-blue-50 transition-colors last:border-0 hover:bg-blue-50/40"
              >
                <td className="whitespace-nowrap px-4 py-3 text-zinc-500">
                  {new Date(vote.castAt).toLocaleString()}
                </td>
                <td className="px-4 py-3 text-zinc-600">
                  {vote.categoryName}
                </td>
                <td className="px-4 py-3 font-medium text-blue-950">
                  {vote.nomineeName}
                </td>
                <td className="px-4 py-3 text-zinc-600">{vote.voterName}</td>
                <td className="px-4 py-3 text-zinc-600">{vote.deviceHint}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1.5">
                    {vote.indicators.length === 0 ? (
                      <span className="text-xs text-zinc-400">—</span>
                    ) : (
                      vote.indicators.map((indicator) => (
                        <Badge key={indicator} tone="warn">
                          {indicator}
                        </Badge>
                      ))
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="py-10 text-center text-sm text-zinc-500">
            {votes.length === 0
              ? "No ballots cast yet."
              : "No ballots match your search."}
          </p>
        )}
      </Card>

      <p className="text-xs text-zinc-400">
        Showing {filtered.length.toLocaleString()} of{" "}
        {totals.total.toLocaleString()} ballots
        {votes.length < totals.total ? " (latest 300 loaded)" : ""}. Network
        hashes are salted SHA-256 values — raw IP addresses are never stored.
      </p>
    </div>
  );
}
