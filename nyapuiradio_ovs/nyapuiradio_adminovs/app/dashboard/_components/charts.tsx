"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const axisStyle = { fontSize: 11, fill: "#94a3b8" };

export interface DayVotes {
  day: string;
  votes: number;
}

export interface NameVotes {
  name: string;
  votes: number;
}

export interface RankedVotes extends NameVotes {
  rank: number;
}

function ChartTooltip({
  active,
  payload,
  label,
  suffix = "",
}: {
  active?: boolean;
  payload?: Array<{ name?: string; value?: number | string; color?: string }>;
  label?: string;
  suffix?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-blue-100 bg-white px-3 py-2 text-xs shadow-lg">
      <p className="font-medium text-blue-950">{label}</p>
      {payload.map((entry, index) => (
        <p key={index} className="mt-0.5 text-zinc-600">
          <span
            className="mr-1.5 inline-block h-2 w-2 rounded-full align-middle"
            style={{ backgroundColor: entry.color ?? "#1e3a8a" }}
          />
          {entry.name}: {Number(entry.value).toLocaleString()}
          {suffix}
        </p>
      ))}
    </div>
  );
}

export function VotesOverTimeChart({ data }: { data: DayVotes[] }) {
  if (data.every((point) => point.votes === 0)) {
    return <EmptyChart message="No votes recorded yet." />;
  }
  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
        <defs>
          <linearGradient id="votesGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1d4ed8" stopOpacity={0.35} />
            <stop offset="100%" stopColor="#1d4ed8" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
        <XAxis dataKey="day" tick={axisStyle} tickLine={false} axisLine={false} />
        <YAxis tick={axisStyle} tickLine={false} axisLine={false} width={44} />
        <Tooltip
          content={<ChartTooltip />}
          cursor={{ stroke: "#f59e0b", strokeDasharray: "4 4" }}
        />
        <Area
          type="monotone"
          dataKey="votes"
          name="Votes"
          stroke="#1d4ed8"
          strokeWidth={2.5}
          fill="url(#votesGradient)"
          animationDuration={1200}
          animationEasing="ease-out"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function CategoryVotesChart({ data }: { data: NameVotes[] }) {
  if (data.length === 0) {
    return <EmptyChart message="No categories yet." />;
  }
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
        <XAxis
          dataKey="name"
          tick={{ ...axisStyle, fontSize: 10 }}
          tickLine={false}
          axisLine={false}
          interval={0}
          angle={-18}
          textAnchor="end"
          height={56}
        />
        <YAxis tick={axisStyle} tickLine={false} axisLine={false} width={44} />
        <Tooltip content={<ChartTooltip />} cursor={{ fill: "#eff6ff" }} />
        <Bar
          dataKey="votes"
          name="Votes"
          fill="#1d4ed8"
          radius={[6, 6, 0, 0]}
          animationDuration={1100}
          animationEasing="ease-out"
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

const TURNOUT_COLORS = ["#1e40af", "#f59e0b", "#e2e8f0"];

export function TurnoutDonut({ turnout }: { turnout: number }) {
  const data = [
    { name: "Voted", value: turnout },
    { name: "Remaining", value: Math.max(0, 100 - turnout) },
  ];
  return (
    <div className="relative">
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            innerRadius={62}
            outerRadius={88}
            paddingAngle={4}
            startAngle={90}
            endAngle={-270}
            stroke="none"
            animationDuration={1200}
            animationEasing="ease-out"
          >
            {data.map((_, index) => (
              <Cell key={index} fill={TURNOUT_COLORS[index] ?? "#cbd5e1"} />
            ))}
          </Pie>
          <Tooltip content={<ChartTooltip suffix="%" />} />
        </PieChart>
      </ResponsiveContainer>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-3xl font-semibold text-blue-950">
          {turnout}%
        </span>
        <span className="text-xs text-zinc-500">turnout</span>
      </div>
    </div>
  );
}

const RESULT_COLORS = ["#f59e0b", "#94a3b8", "#b45309"];

export function HorizontalResultsChart({ data }: { data: RankedVotes[] }) {
  if (data.length === 0) {
    return <EmptyChart message="No results to show yet." />;
  }
  return (
    <ResponsiveContainer
      width="100%"
      height={Math.max(180, data.length * 56)}
    >
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 4, right: 16, left: 4, bottom: 4 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
        <XAxis type="number" tick={axisStyle} tickLine={false} axisLine={false} />
        <YAxis
          type="category"
          dataKey="name"
          tick={{ ...axisStyle, fontSize: 11, fill: "#334155" }}
          tickLine={false}
          axisLine={false}
          width={100}
        />
        <Tooltip content={<ChartTooltip />} cursor={{ fill: "#eff6ff" }} />
        <Bar
          dataKey="votes"
          name="Votes"
          radius={[0, 8, 8, 0]}
          animationDuration={1100}
          animationEasing="ease-out"
        >
          {data.map((entry) => (
            <Cell key={entry.name} fill={RESULT_COLORS[entry.rank] ?? "#1d4ed8"} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

function EmptyChart({ message }: { message: string }) {
  return (
    <div className="flex h-[220px] items-center justify-center rounded-xl border border-dashed border-blue-200 bg-blue-50/40">
      <p className="text-sm text-zinc-500">{message}</p>
    </div>
  );
}
