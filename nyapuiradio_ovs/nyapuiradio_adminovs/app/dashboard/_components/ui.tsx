import type { ReactNode } from "react";

export function Card({
  children,
  className = "",
  animate = true,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  animate?: boolean;
  delay?: number;
}) {
  return (
    <div
      className={`rounded-2xl border border-blue-100 bg-white p-5 shadow-sm ${animate ? "animate-fade-in-up card-hover" : ""} ${className}`}
      style={animate ? { animationDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="animate-fade-in-up flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight text-blue-950 sm:text-3xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-1 text-sm text-zinc-500 sm:text-base">{subtitle}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

const badgeTones = {
  open: "bg-emerald-50 text-emerald-700 border-emerald-200",
  closed: "bg-zinc-100 text-zinc-600 border-zinc-200",
  draft: "bg-amber-50 text-amber-700 border-amber-200",
  paused: "bg-amber-50 text-amber-700 border-amber-200",
  warn: "bg-amber-50 text-amber-700 border-amber-200",
  active: "bg-emerald-50 text-emerald-700 border-emerald-200",
  withdrawn: "bg-red-50 text-red-700 border-red-200",
  verified: "bg-emerald-50 text-emerald-700 border-emerald-200",
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  blocked: "bg-red-50 text-red-700 border-red-200",
  live: "bg-red-50 text-red-700 border-red-200",
  gold: "bg-amber-50 text-amber-700 border-amber-200",
  blue: "bg-blue-50 text-blue-700 border-blue-200",
} as const;

export type BadgeTone = keyof typeof badgeTones;

export function Badge({
  tone,
  children,
}: {
  tone: BadgeTone;
  children: ReactNode;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ${badgeTones[tone]}`}
    >
      {children}
    </span>
  );
}

export function ProgressBar({
  value,
  tone = "blue",
}: {
  value: number;
  tone?: "blue" | "gold";
}) {
  const clamped = Math.min(100, Math.max(0, value));
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-blue-50">
      <div
        className={`progress-fill h-full rounded-full ${tone === "gold" ? "bg-gradient-to-r from-amber-400 to-amber-500" : "bg-gradient-to-r from-blue-700 to-blue-500"}`}
        style={{ "--p": `${clamped}%` } as React.CSSProperties}
      />
    </div>
  );
}

export function StatCard({
  label,
  value,
  hint,
  icon,
  delay = 0,
  tone = "blue",
}: {
  label: string;
  value: string;
  hint?: string;
  icon: ReactNode;
  delay?: number;
  tone?: "blue" | "gold";
}) {
  return (
    <div
      className="animate-fade-in-up card-hover rounded-2xl border border-blue-100 bg-white p-5 shadow-sm"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between">
        <p className="text-sm font-medium text-zinc-500">{label}</p>
        <span
          className={`flex h-9 w-9 items-center justify-center rounded-xl ${tone === "gold" ? "bg-amber-50 text-amber-600" : "bg-blue-50 text-blue-700"}`}
        >
          {icon}
        </span>
      </div>
      <p className="mt-2 font-display text-3xl font-semibold text-blue-950">
        {value}
      </p>
      {hint && <p className="mt-1 text-xs text-zinc-400">{hint}</p>}
    </div>
  );
}

export function PrimaryButton({
  children,
  onClick,
  disabled,
  type = "button",
}: {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit";
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-blue-950 px-4 text-sm font-medium text-amber-400 transition-all hover:bg-blue-900 hover:shadow-lg hover:shadow-blue-900/20 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
    >
      {children}
    </button>
  );
}

export function GhostButton({
  children,
  onClick,
  disabled,
}: {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-blue-200 bg-white px-4 text-sm font-medium text-blue-900 transition-all hover:border-blue-300 hover:bg-blue-50 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
    >
      {children}
    </button>
  );
}
