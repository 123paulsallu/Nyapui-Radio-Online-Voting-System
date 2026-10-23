"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
  setCategoryStatus,
  setVotingState,
  updateVotingControl,
} from "@/lib/dashboard/actions";
import type {
  ControlCategoryDTO,
  VotingControlDTO,
} from "@/lib/dashboard/types";
import type { VotingState } from "@/lib/db/schema";
import { Badge, Card, PageHeader, PrimaryButton } from "./ui";
import { FormError, Modal, Spinner } from "./modal";

function Toggle({
  checked,
  onChange,
  label,
  disabled,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`relative h-7 w-12 shrink-0 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
        checked ? "bg-emerald-500" : "bg-zinc-300"
      }`}
    >
      <span
        className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-md transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}

const STATE_META: Record<
  VotingState,
  { label: string; blurb: string; tone: "open" | "paused" | "closed" }
> = {
  open: {
    label: "Open",
    blurb: "Ballots are being accepted across every open category.",
    tone: "open",
  },
  paused: {
    label: "Paused",
    blurb: "Ballots are temporarily suspended. Resume at any time.",
    tone: "paused",
  },
  closed: {
    label: "Closed",
    blurb: "No new ballots are accepted and all open categories are locked.",
    tone: "closed",
  },
};

const CONFIRM_COPY: Partial<
  Record<VotingState, { title: string; body: string; cta: string }>
> = {
  paused: {
    title: "Pause voting?",
    body: "Ballots will stop being accepted immediately. Nothing is lost — you can reopen voting at any time.",
    cta: "Pause voting",
  },
  closed: {
    title: "Close voting?",
    body: "No new ballots will be accepted and every open category will be locked. You can reopen later, but votes already cast stay recorded.",
    cta: "Close voting",
  },
};

export function VotingControlManager({
  control,
  categories,
}: {
  control: VotingControlDTO;
  categories: ControlCategoryDTO[];
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [confirmState, setConfirmState] = useState<VotingState | null>(null);

  const openCount = categories.filter((c) => c.status === "open").length;
  const meta = STATE_META[control.votingState];

  function run(
    action: () => Promise<{ ok: boolean; error?: string }>,
    message: string,
  ) {
    setError(null);
    setNotice(null);
    startTransition(async () => {
      const result = await action();
      if (!result.ok) {
        setError(result.error ?? "Something went wrong.");
        return;
      }
      setNotice(message);
      router.refresh();
    });
  }

  function requestState(next: VotingState) {
    if (next === control.votingState) return;
    if (next === "open") {
      run(() => setVotingState("open"), "Voting is open.");
      return;
    }
    setConfirmState(next);
  }

  function confirmStateChange() {
    const next = confirmState;
    if (!next) return;
    setConfirmState(null);
    run(
      () => setVotingState(next),
      next === "paused"
        ? "Voting paused. No ballots are being accepted."
        : "Voting closed and all open categories locked.",
    );
  }

  const rules = [
    {
      key: "anon" as const,
      label: "Anonymous voting",
      description: "Ballots are never tied back to a named voter in results.",
      value: control.anonymous,
      patch: { anonymous: !control.anonymous },
    },
    {
      key: "one" as const,
      label: "One vote per category",
      description: "A ballot can only cast a single vote per category.",
      value: control.oneVotePerCategory,
      patch: { oneVotePerCategory: !control.oneVotePerCategory },
    },
    {
      key: "live" as const,
      label: "Live public results",
      description: "Publish running results while voting is open.",
      value: control.resultsLive,
      patch: { resultsLive: !control.resultsLive },
    },
  ];

  const confirmCopy = confirmState ? CONFIRM_COPY[confirmState] : undefined;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Voting Control"
        subtitle="Open, pause or close voting and configure the rules for this event."
      />

      <FormError message={error} />
      {notice && !error && (
        <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          {notice}
        </p>
      )}

      <Card delay={60}>
        <div className="flex flex-col gap-5">
          <div className="flex items-start gap-4">
            <span
              className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${
                control.votingState === "open"
                  ? "animate-float-glow bg-emerald-100 text-emerald-600"
                  : control.votingState === "paused"
                    ? "bg-amber-100 text-amber-600"
                    : "bg-zinc-100 text-zinc-500"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-7 w-7"
              >
                <path d="M18 12h-1.5V6.5A4.5 4.5 0 0 0 12 2a4.5 4.5 0 0 0-4.5 4.5V12H6a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2Zm-6 7-4-4 1.41-1.41L11 16.17l5.59-5.58L18 12l-6 7Z" />
              </svg>
            </span>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-display text-lg font-semibold text-blue-950">
                  Voting is {meta.label.toLowerCase()}
                </h2>
                <Badge tone={meta.tone}>{meta.label}</Badge>
                {control.opensAt && (
                  <span className="text-xs text-zinc-400">
                    Opens {new Date(control.opensAt).toLocaleString()}
                  </span>
                )}
                {control.closesAt && (
                  <span className="text-xs text-zinc-400">
                    Closes {new Date(control.closesAt).toLocaleString()}
                  </span>
                )}
              </div>
              <p className="mt-0.5 text-sm text-zinc-500">{meta.blurb}</p>
            </div>
          </div>

          <div
            className="flex flex-col gap-2 rounded-2xl border border-blue-50 bg-slate-50/60 p-2 sm:flex-row"
            role="group"
            aria-label="Voting state"
          >
            {(["open", "paused", "closed"] as const).map((state) => {
              const active = control.votingState === state;
              return (
                <button
                  key={state}
                  type="button"
                  disabled={isPending || active}
                  onClick={() => requestState(state)}
                  className={`inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-xl px-4 text-sm font-medium transition-all active:scale-[0.98] disabled:cursor-default ${
                    active
                      ? "bg-blue-950 text-amber-400 shadow-sm"
                      : "border border-transparent text-zinc-600 hover:border-blue-200 hover:bg-white"
                  }`}
                >
                  {STATE_META[state].label}
                </button>
              );
            })}
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card delay={140}>
          <h2 className="font-display text-base font-semibold text-blue-950">
            Voting rules
          </h2>
          <p className="text-xs text-zinc-500">Applies to every category</p>
          <ul className="mt-4 flex flex-col gap-4">
            {rules.map((rule) => (
              <li
                key={rule.key}
                className="flex items-center justify-between gap-4 rounded-xl border border-blue-50 bg-slate-50/60 p-3 transition-colors hover:border-blue-100 hover:bg-blue-50/50"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-blue-950">
                    {rule.label}
                  </p>
                  <p className="text-xs text-zinc-500">{rule.description}</p>
                </div>
                <Toggle
                  checked={rule.value}
                  disabled={isPending}
                  onChange={() =>
                    run(
                      () => updateVotingControl(rule.patch),
                      "Voting rules updated.",
                    )
                  }
                  label={rule.label}
                />
              </li>
            ))}
          </ul>
        </Card>

        <Card delay={220}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-base font-semibold text-blue-950">
                Categories
              </h2>
              <p className="text-xs text-zinc-500">
                {openCount} of {categories.length} accepting ballots
              </p>
            </div>
            <Badge
              tone={
                openCount === categories.length && categories.length > 0
                  ? "open"
                  : "draft"
              }
            >
              {openCount}/{categories.length} open
            </Badge>
          </div>
          <ul className="mt-4 flex flex-col gap-2">
            {categories.map((category, index) => (
              <li
                key={category.id}
                className="animate-fade-in-up flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-blue-50/60"
                style={{ animationDelay: `${240 + index * 50}ms` }}
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-blue-950">
                    {category.name}
                  </p>
                  <p className="text-xs text-zinc-400">
                    {category.voteCount.toLocaleString()} votes ·{" "}
                    {category.status}
                  </p>
                </div>
                <Toggle
                  checked={category.status === "open"}
                  disabled={isPending}
                  onChange={(next) =>
                    run(
                      () =>
                        setCategoryStatus(
                          category.id,
                          next ? "open" : "closed",
                        ),
                      next
                        ? `"${category.name}" is now open.`
                        : `"${category.name}" is now closed.`,
                    )
                  }
                  label={`Toggle ${category.name}`}
                />
              </li>
            ))}
          </ul>
          {categories.length === 0 && (
            <p className="py-6 text-center text-sm text-zinc-500">
              No categories created yet.
            </p>
          )}
        </Card>
      </div>

      <Modal
        open={confirmState !== null}
        onClose={() => setConfirmState(null)}
        title={confirmCopy?.title ?? "Confirm"}
        description={confirmCopy?.body}
      >
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => setConfirmState(null)}
            className="inline-flex h-10 items-center justify-center rounded-xl border border-blue-200 bg-white px-4 text-sm font-medium text-blue-900 transition-all hover:bg-blue-50"
          >
            Cancel
          </button>
          <PrimaryButton
            disabled={isPending}
            onClick={() => startTransition(confirmStateChange)}
          >
            {isPending && <Spinner />}
            {confirmCopy?.cta ?? "Confirm"}
          </PrimaryButton>
        </div>
      </Modal>
    </div>
  );
}
