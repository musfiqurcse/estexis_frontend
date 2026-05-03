import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export function StatsCard({ label, value, change, icon: Icon }) {
  const isPositive = change > 0;
  const isNeutral = change === 0;

  return (
    <article className="rounded-xl border border-gray-100 bg-white p-5">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
          {label}
        </p>
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-50">
          <Icon className="h-4 w-4 text-gray-400" />
        </div>
      </div>
      <p className="text-2xl font-semibold text-gray-900">{value}</p>
      <div className="mt-1.5 flex items-center gap-1">
        {isNeutral ? (
          <Minus className="h-3 w-3 text-gray-400" />
        ) : isPositive ? (
          <TrendingUp className="h-3 w-3 text-emerald-600" />
        ) : (
          <TrendingDown className="h-3 w-3 text-red-500" />
        )}
        <p
          className={`text-xs font-medium ${
            isNeutral
              ? "text-gray-400"
              : isPositive
              ? "text-emerald-600"
              : "text-red-500"
          }`}
        >
          {isNeutral
            ? "No change"
            : `${isPositive ? "+" : ""}${change}% vs last month`}
        </p>
      </div>
    </article>
  );
}
