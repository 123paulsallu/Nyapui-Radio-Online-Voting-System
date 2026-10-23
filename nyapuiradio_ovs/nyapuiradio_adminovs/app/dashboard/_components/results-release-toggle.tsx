"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { setResultsReleased } from "@/lib/dashboard/actions";
import { Spinner } from "./modal";

export function ResultsReleaseToggle({ released }: { released: boolean }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function toggle() {
    setError(null);
    startTransition(async () => {
      const result = await setResultsReleased(!released);
      if (!result.ok) {
        setError(result.error ?? "Could not update results visibility.");
        return;
      }
      router.refresh();
    });
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        disabled={isPending}
        onClick={toggle}
        aria-pressed={released}
        className={`inline-flex h-10 items-center gap-2 rounded-xl border px-4 text-sm font-medium transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 ${
          released
            ? "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
            : "border-blue-950 bg-blue-950 text-amber-400 hover:bg-blue-900"
        }`}
      >
        {isPending && <Spinner />}
        {released ? "Hide results" : "Release results"}
      </button>
      <p className="text-[11px] text-zinc-400">
        {released
          ? "Public can view results now"
          : "Results are hidden from the public"}
        {error ? ` · ${error}` : ""}
      </p>
    </div>
  );
}
