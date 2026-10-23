"use client";

import { useState } from "react";

export default function LogoutButton() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleConfirmLogout() {
    setOpen(false);
    setLoading(true);
    try {
      await fetch("/api/logout", { method: "POST" });
    } finally {
      setLoading(false);
      window.location.replace("/");
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="rounded-lg border border-amber-400/60 px-4 py-1.5 text-sm font-medium text-amber-400 transition-colors hover:bg-amber-400/10"
      >
        Logout
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-blue-950/50 px-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="logout-modal-title"
        >
          <div className="w-full max-w-sm rounded-2xl border border-blue-200 bg-white p-8 text-center shadow-xl">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-900">
              <svg
                className="h-7 w-7 text-amber-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M17 7v10H7v2h10c1.1 0 2-.9 2-2V7h-2ZM5 17V5c0-1.1.9-2 2-2h8v2H7v12h2v2H7c-1.1 0-2-.9-2-2Z" />
              </svg>
            </div>
            <h2
              id="logout-modal-title"
              className="mt-4 font-display text-xl font-semibold text-blue-900"
            >
              Confirm Logout
            </h2>
            <p className="mt-2 text-sm text-zinc-600">
              Are you sure you want to logout?
            </p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setOpen(false)}
                disabled={loading}
                className="h-10 flex-1 rounded-lg border border-blue-300 bg-white text-sm font-medium text-blue-900 transition-colors hover:bg-blue-50 disabled:opacity-60"
              >
                No, Stay
              </button>
              <button
                onClick={handleConfirmLogout}
                disabled={loading}
                className="h-10 flex-1 rounded-lg bg-blue-900 text-sm font-medium text-amber-400 transition-colors hover:bg-blue-800 disabled:opacity-60"
              >
                {loading ? "Logging out..." : "Yes, Logout"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
