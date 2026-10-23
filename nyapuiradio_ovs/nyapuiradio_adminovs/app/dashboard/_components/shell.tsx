"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import type { DashboardModule } from "@/lib/db/schema";
import LogoutButton from "../logout-button";

interface ShellUser {
  username: string;
  fullName: string | null;
  role: string;
}

interface NavItem {
  href: string;
  label: string;
  module: DashboardModule;
  icon: ReactNode;
}

function OverviewIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
      <path d="M3 13h8V3H3v10Zm0 8h8v-6H3v6Zm10 0h8V11h-8v10Zm0-18v6h8V3h-8Z" />
    </svg>
  );
}

function CategoriesIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
      <path d="M12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2Z" />
    </svg>
  );
}

function NomineesIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
      <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3Zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3Zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5C15 14.17 10.33 13 8 13Zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5Z" />
    </svg>
  );
}

function VotersIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
      <path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4Zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6Zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4Z" />
    </svg>
  );
}

function ControlIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
      <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm4.2 14.2L11 13V7h1.5v5.2l4.5 2.7-.8 1.3Z" />
    </svg>
  );
}

function VotesIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
      <path d="M18 12h-1.5V6.5A4.5 4.5 0 0 0 12 2a4.5 4.5 0 0 0-4.5 4.5V12H6a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2Zm-6 7-4-4 1.41-1.41L11 16.17l5.59-5.58L18 12l-6 7Z" />
    </svg>
  );
}

function ResultsIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
      <path d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2Zm-7 14H7v-2h5v2Zm5-4H7v-2h10v2Zm0-4H7V7h10v2Z" />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
      <path d="m19.14 12.94.04-.94-.04-.94 2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.49.49 0 0 0-.59-.22l-2.39.96a7.05 7.05 0 0 0-1.62-.94l-.36-2.54a.48.48 0 0 0-.48-.41h-3.84a.48.48 0 0 0-.48.41l-.36 2.54c-.59.24-1.13.56-1.62.94l-2.39-.96a.49.49 0 0 0-.59.22L2.74 8.87a.48.48 0 0 0 .12.61l2.03 1.58-.04.94.04.94-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.38.3.59.22l2.39-.96c.49.38 1.03.7 1.62.94l.36 2.54c.04.24.24.41.48.41h3.84c.24 0 .44-.17.48-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32a.49.49 0 0 0-.12-.61l-2.03-1.58ZM12 15.6A3.6 3.6 0 1 1 15.6 12 3.6 3.6 0 0 1 12 15.6Z" />
    </svg>
  );
}

function IntegrityIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
      <path d="M12 1 3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4Zm-1.5 15-4-4 1.41-1.41L10.5 13.17l5.59-5.59L17.5 9l-7 7Z" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
      <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3Zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3Zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5C15 14.17 10.33 13 8 13Zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5Z" />
    </svg>
  );
}

const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "Overview", module: "overview", icon: <OverviewIcon /> },
  { href: "/dashboard/categories", label: "Award Categories", module: "categories", icon: <CategoriesIcon /> },
  { href: "/dashboard/nominees", label: "Nominees", module: "nominees", icon: <NomineesIcon /> },
  { href: "/dashboard/voters", label: "Voter Management", module: "voters", icon: <VotersIcon /> },
  { href: "/dashboard/votes", label: "Vote Management", module: "votes", icon: <VotesIcon /> },
  { href: "/dashboard/voting-control", label: "Voting Control", module: "voting-control", icon: <ControlIcon /> },
  { href: "/dashboard/results", label: "Results & Reports", module: "results", icon: <ResultsIcon /> },
  { href: "/dashboard/integrity", label: "Data Integrity", module: "integrity", icon: <IntegrityIcon /> },
  { href: "/dashboard/settings", label: "Event Settings", module: "settings", icon: <SettingsIcon /> },
  { href: "/dashboard/users", label: "User Management", module: "users", icon: <UsersIcon /> },
];

function VotingStateBadge({ state }: { state: string }) {
  if (state === "open") {
    return (
      <span className="hidden items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 sm:inline-flex">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
        </span>
        Voting open
      </span>
    );
  }
  return (
    <span
      className={`hidden items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium sm:inline-flex ${
        state === "paused"
          ? "border-amber-200 bg-amber-50 text-amber-700"
          : "border-zinc-200 bg-zinc-100 text-zinc-600"
      }`}
    >
      <span
        className={`h-2 w-2 rounded-full ${
          state === "paused" ? "bg-amber-500" : "bg-zinc-400"
        }`}
      />
      {state === "paused" ? "Voting paused" : "Voting closed"}
    </span>
  );
}

function NavLinks({
  allowedModules,
  onNavigate,
}: {
  allowedModules: DashboardModule[];
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1 px-3">
      {NAV_ITEMS.filter((item) => allowedModules.includes(item.module)).map(
        (item) => {
          const active =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                active
                  ? "bg-white/10 text-amber-400"
                  : "text-blue-100/70 hover:bg-white/5 hover:text-white"
              }`}
            >
              <span
                className={`absolute -left-3 h-6 w-1 rounded-r-full bg-amber-400 transition-all duration-300 ${
                  active ? "opacity-100" : "opacity-0 group-hover:opacity-40"
                }`}
              />
              <span
                className={
                  active
                    ? "text-amber-400"
                    : "text-blue-200/60 group-hover:text-white"
                }
              >
                {item.icon}
              </span>
              <span className="truncate">{item.label}</span>
            </Link>
          );
        },
      )}
    </nav>
  );
}

function SidebarContent({
  user,
  allowedModules,
  onNavigate,
}: {
  user: ShellUser;
  allowedModules: DashboardModule[];
  onNavigate?: () => void;
}) {
  const roleLabel =
    user.role === "super"
      ? "Super Admin"
      : user.role.charAt(0).toUpperCase() + user.role.slice(1);

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 px-5 py-5">
        <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-white p-1">
          <Image src="/img/logo.png" alt="Nyapui Radio" width={32} height={32} className="h-full w-full object-contain" />
        </div>
        <div className="min-w-0">
          <p className="font-display text-sm font-semibold text-white">Nyapui Radio</p>
          <p className="truncate text-xs text-amber-400">Online Voting System · Admin</p>
        </div>
      </div>

      <p className="px-6 pb-2 pt-3 text-[11px] font-semibold tracking-widest text-blue-300/50 uppercase">
        Modules
      </p>

      <div className="flex-1 overflow-y-auto">
        <NavLinks allowedModules={allowedModules} onNavigate={onNavigate} />
      </div>

      <div className="m-3 rounded-xl border border-white/10 bg-white/5 p-3">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-400 text-xs font-bold text-blue-950">
            {(user.fullName ?? user.username).charAt(0).toUpperCase()}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold text-white">
              {user.fullName ?? user.username}
            </p>
            <p className="truncate text-[11px] text-amber-400/90">{roleLabel}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DashboardShell({
  user,
  votingState,
  allowedModules,
  children,
}: {
  user: ShellUser;
  votingState: string;
  allowedModules: DashboardModule[];
  children: ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const visibleItems = NAV_ITEMS.filter((item) =>
    allowedModules.includes(item.module),
  );
  const activeLabel =
    visibleItems.find((item) =>
      item.href === "/dashboard"
        ? pathname === "/dashboard"
        : pathname.startsWith(item.href),
    )?.label ?? "Overview";

  return (
    <div className="min-h-screen bg-slate-50">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 bg-blue-950 lg:block">
        <SidebarContent user={user} allowedModules={allowedModules} />
      </aside>

      <div
        className={`fixed inset-0 z-50 bg-blue-950/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setMobileOpen(false)}
        aria-hidden={!mobileOpen}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] bg-blue-950 shadow-2xl transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] lg:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-hidden={!mobileOpen}
      >
        <button
          type="button"
          onClick={() => setMobileOpen(false)}
          aria-label="Close menu"
          className="absolute top-4 right-3 flex h-9 w-9 items-center justify-center rounded-lg text-blue-200 transition-colors hover:bg-white/10 hover:text-white"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
            <path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41Z" />
          </svg>
        </button>
        <SidebarContent
          user={user}
          allowedModules={allowedModules}
          onNavigate={() => setMobileOpen(false)}
        />
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 border-b border-blue-100 bg-white/80 backdrop-blur-md">
          <div className="flex h-16 items-center justify-between gap-3 px-4 sm:px-6">
            <div className="flex min-w-0 items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                aria-label="Open menu"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-blue-200 text-blue-900 transition-colors hover:bg-blue-50 lg:hidden"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                  <path d="M3 6h18v2H3V6Zm0 5h18v2H3v-2Zm0 5h18v2H3v-2Z" />
                </svg>
              </button>
              <div className="min-w-0">
                <p className="truncate font-display text-base font-semibold text-blue-950 sm:text-lg">
                  {activeLabel}
                </p>
                <p className="hidden text-xs text-zinc-500 sm:block">
                  Nyapui Radio Online Voting System
                </p>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-3">
              <VotingStateBadge state={votingState} />
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-950 text-sm font-bold text-amber-400">
                {(user.fullName ?? user.username).charAt(0).toUpperCase()}
              </span>
              <LogoutButton />
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
