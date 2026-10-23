"use client";

import { useMemo, useState } from "react";
import type {
  ResultsBrand,
  ResultsSummary,
  StandingsRow,
} from "@/lib/dashboard/types";
import { downloadResultsPdf } from "@/lib/report/pdf";
import { Badge, Card, GhostButton, PrimaryButton } from "./ui";
import { downloadCsv } from "./export-buttons";
import { inputClass, Spinner } from "./modal";

type SortKey = "name" | "category" | "votes" | "share" | "status";
type SortDir = "asc" | "desc";

const STATUS_FILTERS = ["all", "active", "withdrawn"] as const;

function loadLogo(logoUrl: string | null): Promise<string | null> {
  const url = logoUrl || "/img/logo.png";
  return fetch(url)
    .then((response) => (response.ok ? response.blob() : Promise.reject()))
    .then(
      (blob) =>
        new Promise<string | null>((resolve) => {
          const reader = new FileReader();
          reader.onload = () =>
            resolve(typeof reader.result === "string" ? reader.result : null);
          reader.onerror = () => resolve(null);
          reader.readAsDataURL(blob);
        }),
    )
    .catch(() => null);
}

function SortHeader({
  label,
  column,
  sortKey,
  sortDir,
  onSort,
  align = "left",
}: {
  label: string;
  column: SortKey;
  sortKey: SortKey;
  sortDir: SortDir;
  onSort: (key: SortKey) => void;
  align?: "left" | "right";
}) {
  const active = sortKey === column;
  return (
    <button
      type="button"
      onClick={() => onSort(column)}
      className={`inline-flex items-center gap-1 text-xs font-medium uppercase tracking-wider transition-colors hover:text-blue-700 ${
        active ? "text-blue-800" : "text-zinc-400"
      } ${align === "right" ? "ml-auto" : ""}`}
    >
      {label}
      <span className="text-[10px]">
        {active ? (sortDir === "asc" ? "▲" : "▼") : "↕"}
      </span>
    </button>
  );
}

export function StandingsTable({
  rows,
  categories,
  brand,
  summary,
}: {
  rows: StandingsRow[];
  categories: { id: string; name: string }[];
  brand: ResultsBrand;
  summary: ResultsSummary;
}) {
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] =
    useState<(typeof STATUS_FILTERS)[number]>("all");
  const [sortKey, setSortKey] = useState<SortKey>("votes");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [busy, setBusy] = useState(false);

  const totalVotes = summary.totalVotes;

  const view = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const filtered = rows.filter((row) => {
      if (categoryFilter !== "all" && row.categoryId !== categoryFilter) {
        return false;
      }
      if (statusFilter !== "all" && row.status !== statusFilter) return false;
      if (!needle) return true;
      return (
        row.name.toLowerCase().includes(needle) ||
        (row.department ?? "").toLowerCase().includes(needle) ||
        row.categoryName.toLowerCase().includes(needle)
      );
    });

    const factor = sortDir === "asc" ? 1 : -1;
    return [...filtered].sort((a, b) => {
      switch (sortKey) {
        case "name":
          return factor * a.name.localeCompare(b.name);
        case "category":
          return (
            factor * (a.categoryName.localeCompare(b.categoryName) ||
              b.votes - a.votes)
          );
        case "status":
          return factor * a.status.localeCompare(b.status);
        case "share":
          return factor * (a.votes - b.votes);
        case "votes":
        default:
          return factor * (a.votes - b.votes) ||
            factor * a.name.localeCompare(b.name);
      }
    });
  }, [rows, query, categoryFilter, statusFilter, sortKey, sortDir]);

  const viewVotes = view.reduce((sum, row) => sum + row.votes, 0);

  const scope = [
    categoryFilter === "all"
      ? "All categories"
      : `Category: ${categories.find((c) => c.id === categoryFilter)?.name ?? ""}`,
    statusFilter === "all" ? "All nominees" : `Status: ${statusFilter}`,
    query.trim() ? `Search: “${query.trim()}”` : null,
    `Sorted by ${sortKey} (${sortDir === "asc" ? "ascending" : "descending"})`,
  ]
    .filter(Boolean)
    .join(" · ");

  function onSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((dir) => (dir === "asc" ? "desc" : "asc"));
      return;
    }
    setSortKey(key);
    setSortDir(key === "name" || key === "category" || key === "status" ? "asc" : "desc");
  }

  function handleCsv() {
    downloadCsv(
      `nyapui-standings-${new Date().toISOString().slice(0, 10)}.csv`,
      [
        ["#", "Nominee", "Department", "Category", "Category Status", "Status", "Votes", "Share %"],
        ...view.map((row, index) => [
          String(index + 1),
          row.name,
          row.department ?? "",
          row.categoryName,
          row.categoryStatus,
          row.status,
          String(row.votes),
          totalVotes > 0
            ? ((row.votes / totalVotes) * 100).toFixed(1)
            : "0.0",
        ]),
      ],
    );
  }

  async function handlePdf() {
    setBusy(true);
    try {
      const logoDataUrl = await loadLogo(brand.logoUrl);
      downloadResultsPdf({ brand, summary, rows: view, scope, logoDataUrl });
    } finally {
      setBusy(false);
    }
  }

  const sortProps = { sortKey, sortDir, onSort } as const;

  return (
    <Card animate={false}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="font-display text-base font-semibold text-blue-950">
              Standings
            </h2>
            <p className="text-xs text-zinc-500">
              Search, filter and sort the full leaderboard — exports follow the
              current view.
            </p>
          </div>
          <div className="flex shrink-0 gap-2">
            <GhostButton onClick={handleCsv}>CSV</GhostButton>
            <PrimaryButton onClick={handlePdf} disabled={busy}>
              {busy ? <Spinner /> : "PDF Report"}
            </PrimaryButton>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-zinc-400"
            >
              <path d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 1 0-.7.7l.27.28v.79l5 4.99L20.49 19l-4.99-5Zm-6 0A4.5 4.5 0 1 1 14 9.5 4.5 4.5 0 0 1 9.5 14Z" />
            </svg>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search nominees, departments or categories…"
              className={`${inputClass} pl-10`}
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(event) => setCategoryFilter(event.target.value)}
            className={`${inputClass} sm:w-56`}
          >
            <option value="all">All categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(
                event.target.value as (typeof STATUS_FILTERS)[number],
              )
            }
            className={`${inputClass} sm:w-44`}
          >
            {STATUS_FILTERS.map((status) => (
              <option key={status} value={status}>
                {status === "all"
                  ? "All statuses"
                  : status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-blue-100 text-zinc-400">
              <th className="px-3 py-3 text-xs font-medium uppercase tracking-wider">
                #
              </th>
              <th className="px-3 py-3">
                <SortHeader label="Nominee" column="name" {...sortProps} />
              </th>
              <th className="px-3 py-3 text-xs font-medium uppercase tracking-wider">
                Department
              </th>
              <th className="px-3 py-3">
                <SortHeader label="Category" column="category" {...sortProps} />
              </th>
              <th className="px-3 py-3">
                <SortHeader label="Status" column="status" {...sortProps} />
              </th>
              <th className="px-3 py-3 text-right">
                <SortHeader
                  label="Votes"
                  column="votes"
                  {...sortProps}
                  align="right"
                />
              </th>
              <th className="px-3 py-3 text-right">
                <SortHeader
                  label="Share"
                  column="share"
                  {...sortProps}
                  align="right"
                />
              </th>
            </tr>
          </thead>
          <tbody>
            {view.map((row, index) => {
              const share =
                totalVotes > 0
                  ? ((row.votes / totalVotes) * 100).toFixed(1)
                  : "0.0";
              return (
                <tr
                  key={row.id}
                  className="border-b border-blue-50 transition-colors last:border-0 hover:bg-blue-50/40"
                >
                  <td className="px-3 py-2.5 text-xs text-zinc-400">
                    {index + 1}
                  </td>
                  <td className="px-3 py-2.5 font-medium text-blue-950">
                    {row.name}
                  </td>
                  <td className="px-3 py-2.5 text-zinc-500">
                    {row.department ?? "—"}
                  </td>
                  <td className="px-3 py-2.5">
                    <div className="flex flex-col gap-1">
                      <span className="text-zinc-700">{row.categoryName}</span>
                      <Badge tone={row.categoryStatus}>
                        {row.categoryStatus}
                      </Badge>
                    </div>
                  </td>
                  <td className="px-3 py-2.5">
                    <Badge tone={row.status}>{row.status}</Badge>
                  </td>
                  <td className="px-3 py-2.5 text-right font-semibold text-blue-950">
                    {row.votes.toLocaleString()}
                  </td>
                  <td className="px-3 py-2.5 text-right text-zinc-600">
                    {share}%
                  </td>
                </tr>
              );
            })}
            {view.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="px-3 py-10 text-center text-sm text-zinc-400"
                >
                  No nominees match the current filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="mt-3 text-xs text-zinc-400">
        Showing {view.length} of {rows.length} nominees ·{" "}
        {viewVotes.toLocaleString()} votes in view ·{" "}
        {summary.totalVotes.toLocaleString()} votes overall
      </p>
    </Card>
  );
}
