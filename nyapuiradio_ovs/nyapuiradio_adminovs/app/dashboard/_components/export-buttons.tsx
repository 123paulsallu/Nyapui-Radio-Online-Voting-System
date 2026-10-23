"use client";

import { useState } from "react";
import { GhostButton } from "./ui";

export function downloadCsv(filename: string, rows: string[][]) {
  const csv = rows
    .map((row) =>
      row
        .map((cell) => `"${cell.replaceAll('"', '""')}"`)
        .join(","),
    )
    .join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function ExportButtons({
  totals,
  leaders,
}: {
  totals: { category: string; status: string; votes: number }[];
  leaders: { category: string; leader: string; leaderVotes: number }[];
}) {
  const [exported, setExported] = useState(false);

  function handleCsv() {
    downloadCsv("nyapui-results-summary.csv", [
      ["Category", "Status", "Votes"],
      ...totals.map((row) => [row.category, row.status, String(row.votes)]),
      [],
      ["Category", "Leading Nominee", "Votes"],
      ...leaders.map((row) => [
        row.category,
        row.leader,
        String(row.leaderVotes),
      ]),
    ]);
    setExported(true);
    setTimeout(() => setExported(false), 2500);
  }

  return (
    <div className="flex flex-wrap gap-2">
      <GhostButton onClick={handleCsv}>{exported ? "Downloaded ✓" : "CSV"}</GhostButton>
    </div>
  );
}
