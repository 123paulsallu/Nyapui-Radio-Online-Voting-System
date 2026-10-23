"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function PersonIcon() {
  return (
    <svg
      className="pointer-events-none absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-blue-600"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4Zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4Z" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg
      className="pointer-events-none absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-blue-600"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2Zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2ZM9 8V6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9Z" />
    </svg>
  );
}

function Spinner() {
  return (
    <svg
      className="h-4 w-4 animate-spin"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4z"
      />
    </svg>
  );
}

function ModalBackdrop({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-blue-950/50 px-4"
      role="dialog"
      aria-modal="true"
    >
      {children}
    </div>
  );
}

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [successName, setSuccessName] = useState<string | null>(null);
  const [errorModal, setErrorModal] = useState<string | null>(null);

  useEffect(() => {
    if (!successName) return;
    const timer = setTimeout(() => {
      router.push("/dashboard");
      router.refresh();
    }, 1800);
    return () => clearTimeout(timer);
  }, [successName, router]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorModal(null);
    setLoading(true);

    const form = new FormData(event.currentTarget);
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: form.get("username"),
          password: form.get("password"),
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setErrorModal(data?.error ?? "Login failed. Please try again.");
        return;
      }

      const data = await res.json();
      setSuccessName(data?.user?.fullName || data?.user?.username || "Admin");
    } catch {
      setErrorModal("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-1 items-center justify-center bg-white px-4">
      <div className="w-full max-w-sm rounded-2xl border border-blue-200 bg-white p-8 shadow-sm">
        <div className="flex justify-center">
          <Image
            src="/img/logo.png"
            alt="Nyapui Radio logo"
            width={120}
            height={120}
            priority
            className="h-auto w-28"
          />
        </div>

        <h1 className="mt-6 font-display text-2xl font-semibold tracking-tight text-blue-900">
          Sign in
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Enter your credentials to access the admin panel.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="username"
              className="text-sm font-medium text-blue-900"
            >
              Username
            </label>
            <div className="relative">
              <PersonIcon />
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                disabled={loading}
                className="h-10 w-full rounded-lg border border-blue-300 bg-white pr-3 pl-10 text-sm text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 disabled:bg-zinc-50"
                placeholder="Enter your username"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="password"
              className="text-sm font-medium text-blue-900"
            >
              Password
            </label>
            <div className="relative">
              <LockIcon />
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                disabled={loading}
                className="h-10 w-full rounded-lg border border-blue-300 bg-white pr-3 pl-10 text-sm text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 disabled:bg-zinc-50"
                placeholder="Enter your password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 flex h-10 items-center justify-center gap-2 rounded-lg bg-blue-900 text-sm font-medium text-amber-400 transition-colors hover:bg-blue-800 disabled:opacity-70"
          >
            {loading ? (
              <>
                <Spinner />
                Signing in...
              </>
            ) : (
              "Sign in"
            )}
          </button>
        </form>
      </div>

      {successName && (
        <ModalBackdrop>
          <div className="w-full max-w-sm rounded-2xl border border-blue-200 bg-white p-8 text-center shadow-xl">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-900">
              <svg
                className="h-7 w-7 text-amber-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17Z" />
              </svg>
            </div>
            <h2 className="mt-4 font-display text-xl font-semibold text-blue-900">
              Sign in successful
            </h2>
            <p className="mt-2 text-sm text-zinc-600">
              Welcome, <span className="font-semibold">{successName}</span>!
              Taking you to the dashboard...
            </p>
            <div className="mt-5 h-1.5 w-full overflow-hidden rounded-full bg-blue-100">
              <div className="h-full w-full animate-pulse bg-amber-400" />
            </div>
            <button
              onClick={() => {
                router.push("/dashboard");
                router.refresh();
              }}
              className="mt-5 h-10 w-full rounded-lg bg-blue-900 text-sm font-medium text-amber-400 transition-colors hover:bg-blue-800"
            >
              Go to Dashboard
            </button>
          </div>
        </ModalBackdrop>
      )}

      {errorModal && (
        <ModalBackdrop>
          <div className="w-full max-w-sm rounded-2xl border border-red-200 bg-white p-8 text-center shadow-xl">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-600">
              <svg
                className="h-7 w-7 text-white"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41Z" />
              </svg>
            </div>
            <h2 className="mt-4 font-display text-xl font-semibold text-red-600">
              Sign in failed
            </h2>
            <p className="mt-2 text-sm text-zinc-600">{errorModal}</p>
            <button
              onClick={() => setErrorModal(null)}
              className="mt-5 h-10 w-full rounded-lg bg-blue-900 text-sm font-medium text-amber-400 transition-colors hover:bg-blue-800"
            >
              Try Again
            </button>
          </div>
        </ModalBackdrop>
      )}
    </div>
  );
}
