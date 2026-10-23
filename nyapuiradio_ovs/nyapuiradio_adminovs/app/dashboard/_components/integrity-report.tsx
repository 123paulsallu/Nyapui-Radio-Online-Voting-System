"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type {
  IntegrityCheck,
  IntegrityReport,
  IntegrityStatus,
} from "@/lib/dashboard/types";
import { Badge, Card, GhostButton, PageHeader, StatCard } from "./ui";
import { Spinner } from "./modal";

const ORDER: Record<IntegrityStatus, number> = { error: 0, warn: 1, ok: 2 };

const STATUS_META: Record<
  IntegrityStatus,
  { tone: "withdrawn" | "warn" | "open"; label: string; ring: string }
> = {
  error: { tone: "withdrawn", label: "error", ring: "border-red-200 bg-red-50/70" },
  warn: { tone: "warn", label: "warning", ring: "border-amber-200 bg-amber-50/70" },
  ok: { tone: "open", label: "passed", ring: "border-blue-50 bg-slate-50/50" },
};

function ShieldIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
      <path d="M12 1 3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4Zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8Z" />
    </svg>
  );
}

function ErrorIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
      <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm1 15h-2v-2h2Zm0-4h-2V7h2Z" />
    </svg>
  );
}

function WarnIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
      <path d="M1 21h22L12 2 1 21Zm12-3h-2v-2h2Zm0-4h-2v-4h2Z" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
      <path d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41Z" />
    </svg>
  );
}

function StatusIcon({ status }: { status: IntegrityStatus }) {
  if (status === "error") return <ErrorIcon />;
  if (status === "warn") return <WarnIcon />;
  return <CheckIcon />;
}

export function IntegrityReportView({ report }: { report: IntegrityReport }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const sorted = [...report.checks].sort(
    (a, b) => ORDER[a.status] - ORDER[b.status],
  );
  const { ok, warn, error: errors } = report.counts;
  const clean = warn === 0 && errors === 0;

  function rerun() {
    setError(null);
    startTransition(() => {
      try {
        router.refresh();
      } catch {
        setError("Refresh failed. Try again.");
      }
    });
  }

  const problem: IntegrityCheck | undefined = report.checks.find(
    (check) => check.status === "error",
  );

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Data Integrity"
        subtitle="Read-only checks across categories, nominees, ballots, votes and settings."
        action={
          <GhostButton onClick={rerun}>
            {isPending && <Spinner />}
            {isPending ? "Checking…" : "Run check again"}
          </GhostButton>
        }
      />

      {error && (
        <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
          {error}
        </p>
      )}

      <Card
        animate={false}
        className={
          clean
            ? "border-emerald-200 bg-emerald-50/70"
            : errors > 0
              ? "border-red-200 bg-red-50/70"
              : "border-amber-200 bg-amber-50/70"
        }
      >
        <div className="flex items-start gap-3">
          <span
            className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
              clean
                ? "bg-emerald-100 text-emerald-600"
                : errors > 0
                  ? "bg-red-100 text-red-600"
                  : "bg-amber-100 text-amber-600"
            }`}
          >
            <ShieldIcon />
          </span>
          <div>
            <h2
              className={`text-sm font-semibold ${
                clean
                  ? "text-emerald-800"
                  : errors > 0
                    ? "text-red-800"
                    : "text-amber-800"
              }`}
            >
              {clean
                ? "All integrity checks passed"
                : errors > 0
                  ? `${errors} integrity error(s) found`
                  : `${warn} integrity warning(s) found`}
            </h2>
            <p
              className={`mt-1 text-sm leading-relaxed ${
                clean
                  ? "text-emerald-800/90"
                  : errors > 0
                    ? "text-red-800/90"
                    : "text-amber-800/90"
              }`}
            >
              {clean
                ? "Database constraints and every runtime check agree: the data is consistent."
                : (problem?.detail ??
                  "Some checks need attention — review the list below.")}
              {" "}Checked {new Date(report.checkedAt).toLocaleString()}.
            </p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Checks passed"
          value={String(ok)}
          hint={`of ${report.checks.length} checks`}
          icon={<CheckIcon />}
          delay={60}
        />
        <StatCard
          label="Warnings"
          value={String(warn)}
          hint="Data worth reviewing"
          icon={<WarnIcon />}
          delay={120}
          tone="gold"
        />
        <StatCard
          label="Errors"
          value={String(errors)}
          hint="Integrity violations"
          icon={<ErrorIcon />}
          delay={180}
        />
        <StatCard
          label="DB constraints"
          value="10"
          hint="CHECK rules enforced on write"
          icon={<ShieldIcon />}
          delay={240}
          tone="gold"
        />
      </div>

      <ul className="flex flex-col gap-3">
        {sorted.map((check, index) => {
          const meta = STATUS_META[check.status];
          return (
            <li
              key={check.id}
              className={`animate-fade-in-up rounded-2xl border p-4 ${meta.ring}`}
              style={{ animationDelay: `${Math.min(index, 12) * 40}ms` }}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex min-w-0 items-center gap-2.5">
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${
                      check.status === "error"
                        ? "bg-red-100 text-red-600"
                        : check.status === "warn"
                          ? "bg-amber-100 text-amber-600"
                          : "bg-emerald-100 text-emerald-600"
                    }`}
                  >
                    <StatusIcon status={check.status} />
                  </span>
                  <p className="text-sm font-medium text-blue-950">
                    {check.label}
                  </p>
                </div>
                <Badge tone={meta.tone}>{meta.label}</Badge>
              </div>
              <p className="mt-2 pl-9.5 text-sm text-zinc-600">
                {check.detail}
              </p>
              {check.suggestion && check.status !== "ok" && (
                <p className="mt-1 pl-9.5 text-xs text-zinc-400">
                  Fix: {check.suggestion}
                </p>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
